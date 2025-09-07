import { useEffect, useRef, useState } from "react";
import { Grid, Box, Card, Skeleton, Typography } from "@mui/material";
import VideoCard from "./VideoCard";
import FullScreenVideoPlayer from "./FullScreenVideoPlayer";
import axiosInstance from "../../axios/axios";

const removeDuplicateVideos = (videos) => {
  const uniqueVideosMap = new Map();
  videos.forEach(video => {
    if (!uniqueVideosMap.has(video.id)) {
      uniqueVideosMap.set(video.id, video);
    }
  });
  return Array.from(uniqueVideosMap.values());
};

const VideoCardSkeleton = () => ( 
  <Card 
    variant="outlined" 
    sx={{ 
      height: "100%", 
      width: "100%", 
      aspectRatio: "1/1", 
      position: "relative", 
      overflow: "hidden", 
      borderRadius: 3, 
    }}
  > 
    <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 3 }} /> 
    <Box sx={{ position: 'absolute', bottom: 8, left: 8, right: 8 }}>
      <Skeleton variant="circular" width={24} height={24} sx={{ display: 'inline-block', mr: 1 }} />
      <Skeleton variant="text" width="60%" height={16} sx={{ display: 'inline-block' }} />
    </Box>
  </Card>
);

const VideosLoadingSkeleton = ({ count = 12 }) => (
  <Grid container spacing={{ xs: 0.5 }}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid size={{ xs: 4, sm: 3 }} key={`initial-skeleton-${index}`}>
        <VideoCardSkeleton />
      </Grid>
    ))}
  </Grid>
);

export default function VideoGrid({ videos, loading, onLikeToggle, actionLoading }) {
  const [displayVideos, setDisplayVideos] = useState([]);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [likeCounts, setLikeCounts] = useState({});
  const [scores, setScores] = useState({});
  const [likedVideos, setLikedVideos] = useState(new Set());
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (videos && videos.length > 0) {
      const uniqueVideos = removeDuplicateVideos(videos);
      setDisplayVideos(uniqueVideos);
      setLoadCount(0);
      setHasMore(true);
      
      uniqueVideos.forEach(video => {
        fetchLikeCount(video.id);
        fetchScore(video.id);
      });
    } else {
      setDisplayVideos([]);
    }
  }, [videos]);

  // FIXED: Hash-based video selection
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('video=') && displayVideos.length > 0) {
      const encodedId = hash.split('video=')[1];
      try {
        const decodedId = atob(encodedId.replace(/[-_]/g, (match) => {
          return { '-': '+', '_': '/' }[match];
        }));
        
        // FIXED: Find exact video match including load suffixes
        const videoIndex = displayVideos.findIndex(v => {
          const baseId = v.id.toString().split('-load-')[0]; // Remove load suffix
          return baseId === decodedId;
        });
        
        if (videoIndex !== -1) {
          setSelectedVideoIndex(videoIndex);
        }
      } catch (error) {
        console.error('Error decoding video ID from hash:', error);
      }
    }
  }, [displayVideos]);

  const fetchLikeCount = async (videoId) => {
    try {
      const response = await axiosInstance.get(`/api/videos/${videoId}/like-count`);
      setLikeCounts(prev => ({ ...prev, [videoId]: response.data }));
    } catch (error) {
      console.error('Error fetching like count:', error);
      setLikeCounts(prev => ({ ...prev, [videoId]: 0 }));
    }
  };

  const fetchScore = async (videoId) => {
    try {
      const response = await axiosInstance.get(`/api/totalscore/${videoId}`);
      setScores(prev => ({ ...prev, [videoId]: response.data }));
    } catch (error) {
      console.error('Error fetching score:', error);
      setScores(prev => ({ ...prev, [videoId]: null }));
    }
  };

  const handleLike = async (video) => {
    const currentlyLiked = likedVideos.has(video.id);
    
    if (currentlyLiked) {
      setLikedVideos(prev => {
        const newSet = new Set(prev);
        newSet.delete(video.id);
        return newSet;
      });
      setLikeCounts(prev => ({ ...prev, [video.id]: Math.max(0, (prev[video.id] || 0) - 1) }));
    } else {
      setLikedVideos(prev => new Set([...prev, video.id]));
      setLikeCounts(prev => ({ ...prev, [video.id]: (prev[video.id] || 0) + 1 }));
    }

    await onLikeToggle(video.id, video.userId, video.firstname, currentlyLiked);
    setTimeout(() => fetchLikeCount(video.id), 1000);
  };

  const loadMore = () => {
    if (infiniteLoading || !hasMore || !videos || videos.length === 0) return;
    
    setInfiniteLoading(true);
    
    setTimeout(() => {
      const more = videos.slice(0, Math.min(8, videos.length)).map((v, i) => ({
        ...v,
        id: `${v.id}-load-${loadCount + 1}-${i}`,
      }));
      
      const newDisplayVideos = removeDuplicateVideos([...displayVideos, ...more]);
      setDisplayVideos(newDisplayVideos);
      setLoadCount((prev) => prev + 1);
      setInfiniteLoading(false);

      if (loadCount > 3) {
        setHasMore(false);
      }

      more.forEach(video => {
        fetchLikeCount(video.id);
        fetchScore(video.id);
      });
    }, 800);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !infiniteLoading && !loading) {
          loadMore();
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [loadCount, videos, hasMore, infiniteLoading, loading]);

  // FIXED: Proper video click handling
  const handleVideoClick = (clickedIndex) => {
    console.log('Video clicked at index:', clickedIndex);
    console.log('Video details:', displayVideos[clickedIndex]);
    
    // Get the base video ID (without load suffix)
    const baseVideoId = displayVideos[clickedIndex].id.toString().split('-load-')[0];
    const encodedId = btoa(baseVideoId).replace(/[+/=]/g, (match) => {
      return { '+': '-', '/': '_', '=': '' }[match];
    });
    
    window.location.hash = `video=${encodedId}`;
    setSelectedVideoIndex(clickedIndex); // This should be the exact clicked index
  };

  const handleVideoChange = (newIndex) => {
    console.log('Video changed to index:', newIndex);
    if (displayVideos[newIndex]) {
      const baseVideoId = displayVideos[newIndex].id.toString().split('-load-')[0];
      const encodedId = btoa(baseVideoId).replace(/[+/=]/g, (match) => {
        return { '+': '-', '/': '_', '=': '' }[match];
      });
      window.location.hash = `video=${encodedId}`;
    }
  };

  const handleBack = () => {
    window.location.hash = '';
    setSelectedVideoIndex(null);
  };

  if (selectedVideoIndex !== null) {
    console.log('Rendering FullScreenVideoPlayer with index:', selectedVideoIndex);
    console.log('Selected video:', displayVideos[selectedVideoIndex]);
    
    return (
      <FullScreenVideoPlayer
        videos={displayVideos}
        initialIndex={selectedVideoIndex} // This should be the correct clicked index
        scores={scores}
        likeCounts={likeCounts}
        onLikeToggle={onLikeToggle}
        onLoadMore={loadMore}
        onBack={handleBack}
        onVideoChange={handleVideoChange}
      />
    );
  }

  if (loading) {
    return <VideosLoadingSkeleton count={12} />;
  }

  if (!loading && (!displayVideos || displayVideos.length === 0)) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No videos found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your filters or check back later
        </Typography>
      </Box>
    );
  }

  return (
    <Box width="100%" minHeight="100vh" pb={10}>
      <Grid container spacing={{ xs: 0.5 }}>
        {displayVideos.map((video, index) => (
          <Grid size={{ xs: 4, sm: 3 }} key={video.id}>
            <VideoCard 
              video={video} 
              likes={likeCounts[video.id] || 0}
              score={scores[video.id]}
              isLiked={likedVideos.has(video.id)}
              onLike={() => handleLike(video)}
              loading={actionLoading[video.id] || false}
              onClick={() => handleVideoClick(index)} 
            />
          </Grid>
        ))}

        {infiniteLoading && hasMore &&
          Array.from({ length: 8 }).map((_, index) => (
            <Grid size={{ xs: 4, sm: 3 }} key={`infinite-skeleton-${index}`}>
              <VideoCardSkeleton />
            </Grid>
          ))}
      </Grid>

      {hasMore && (
        <Box
          ref={sentinelRef}
          display="flex"
          justifyContent="center"
          alignItems="center"
          py={2}
          minHeight={50}
        >
          {infiniteLoading && (
            <Typography variant="body2" color="text.secondary">
              Loading more videos...
            </Typography>
          )}
        </Box>
      )}

      {!hasMore && displayVideos.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            You've reached the end of the videos
          </Typography>
        </Box>
      )}
    </Box>
  );
}