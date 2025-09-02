import { useEffect, useRef, useState } from "react";
import { Grid, Box, Card, Skeleton, } from "@mui/material";
import VideoCard from "./VideoCard";
import FullScreenVideoPlayer from "./FullScreenVideoPlayer";

const sampleVideos = [
    {
        id: "1",
        title: "Big Buck Bunny",
        thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Big_Buck_Bunny_thumbnail_vlc.png/400px-Big_Buck_Bunny_thumbnail_vlc.png",
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration: "8:18",
        uploadTime: "May 9, 2011",
        views: "24,969,123",
        author: "Vlc Media Player",
        description: "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org",
        subscriber: "25254545 Subscribers",
        isLive: true
    },
    {
        id: "2",
        title: "The first Blender Open Movie from 2006",
        thumb: "https://i.ytimg.com/vi_webp/gWw23EYM9VM/mqdefault.webp",
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        duration: "12:18",
        uploadTime: "May 9, 2011",
        views: "24,969,123",
        author: "Blender Inc.",
        description: "Song : Raja Raja Kareja Mein Samaja\nAlbum : Raja Kareja Mein Samaja\nArtist : Radhe Shyam Rasia\nSinger : Radhe Shyam Rasia\nMusic Director : Sohan Lal, Dinesh Kumar\nLyricist : Vinay Bihari, Shailesh Sagar, Parmeshwar Premi\nMusic Label : T-Series",
        subscriber: "25254545 Subscribers",
        isLive: true
    },
    {
        id: "3",
        title: "For Bigger Blazes",
        thumb: "https://i.ytimg.com/vi/Dr9C2oswZfA/mqdefault.jpg",
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration: "8:18",
        uploadTime: "May 9, 2011",
        views: "24,969,123",
        author: "T-Series Regional",
        description: "Song : Raja Raja Kareja Mein Samaja\nAlbum : Raja Kareja Mein Samaja\nArtist : Radhe Shyam Rasia\nSinger : Radhe Shyam Rasia\nMusic Director : Sohan Lal, Dinesh Kumar\nLyricist : Vinay Bihari, Shailesh Sagar, Parmeshwar Premi\nMusic Label : T-Series",
        subscriber: "25254545 Subscribers",
        isLive: true
    },
    {
        id: "4",
        title: "For Bigger Escape",
        thumb: "https://img.jakpost.net/c/2019/09/03/2019_09_03_78912_1567484272._large.jpg",
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        duration: "8:18",
        uploadTime: "May 9, 2011",
        views: "24,969,123",
        author: "T-Series Regional",
        description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for when Batman's escapes aren't quite big enough. For $35. Learn how to use Chromecast with Google Play Movies and more at google.com/chromecast.",
        subscriber: "25254545 Subscribers",
        isLive: false
    },
    {
        id: "5",
        title: "Big Buck Bunny",
        thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Big_Buck_Bunny_thumbnail_vlc.png/400px-Big_Buck_Bunny_thumbnail_vlc.png",
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration: "8:18",
        uploadTime: "May 9, 2011",
        views: "24,969,123",
        author: "Vlc Media Player",
        description: "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org",
        subscriber: "25254545 Subscribers",
        isLive: true
    },
    {
        id: "6",
        title: "For Bigger Blazes",
        thumb: "https://i.ytimg.com/vi/Dr9C2oswZfA/mqdefault.jpg",
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration: "8:18",
        uploadTime: "May 9, 2011",
        views: "24,969,123",
        author: "T-Series Regional",
        description: "Song : Raja Raja Kareja Mein Samaja\nAlbum : Raja Kareja Mein Samaja\nArtist : Radhe Shyam Rasia\nSinger : Radhe Shyam Rasia\nMusic Director : Sohan Lal, Dinesh Kumar\nLyricist : Vinay Bihari, Shailesh Sagar, Parmeshwar Premi\nMusic Label : T-Series",
        subscriber: "25254545 Subscribers",
        isLive: false
    },
    {
        id: "7",
        title: "For Bigger Escape",
        thumb: "https://img.jakpost.net/c/2019/09/03/2019_09_03_78912_1567484272._large.jpg",
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        duration: "8:18",
        uploadTime: "May 9, 2011",
        views: "24,969,123",
        author: "T-Series Regional",
        description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for when Batman's escapes aren't quite big enough. For $35. Learn how to use Chromecast with Google Play Movies and more at google.com/chromecast.",
        subscriber: "25254545 Subscribers",
        isLive: true
    },
    {
        id: "8",
        title: "The first Blender Open Movie from 2006",
        thumb: "https://i.ytimg.com/vi_webp/gWw23EYM9VM/mqdefault.webp",
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        duration: "12:18",
        uploadTime: "May 9, 2011",
        views: "24,969,123",
        author: "Blender Inc.",
        description: "Song : Raja Raja Kareja Mein Samaja\nAlbum : Raja Kareja Mein Samaja\nArtist : Radhe Shyam Rasia\nSinger : Radhe Shyam Rasia\nMusic Director : Sohan Lal, Dinesh Kumar\nLyricist : Vinay Bihari, Shailesh Sagar, Parmeshwar Premi\nMusic Label : T-Series",
        subscriber: "25254545 Subscribers",
        isLive: false
    }
];

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
    }}> 
      <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 3 }} /> 
  </Card>
  );

export default function VideoGrid() {
  const [videos, setVideos] = useState(sampleVideos);
  const [loading, setLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video');
    if (videoId) {
      const videoIndex = videos.findIndex(v => v.id === videoId);
      if (videoIndex !== -1) {
        setSelectedVideoIndex(videoIndex);
      }
    }
  }, [videos]);

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const more = sampleVideos.map((v, i) => ({
        ...v,
        id: `${videos.length + i + 1}-${loadCount + 1}`,
      }));
      setVideos((prev) => [...prev, ...more]);
      setLoadCount((prev) => prev + 1);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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
  }, [loadCount]);

  const handleVideoClick = (index) => {
    const videoId = videos[index].id;
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('video', videoId);
    window.history.pushState({}, '', newUrl);
    
    setSelectedVideoIndex(index);
  };

  const handleVideoChange = (newIndex) => {
    const videoId = videos[newIndex].id;
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('video', videoId);
    window.history.replaceState({}, '', newUrl);
  };

  const handleBack = () => {
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete('video');
    window.history.pushState({}, '', newUrl);
    
    setSelectedVideoIndex(null);
  };

  if (selectedVideoIndex !== null) {
    return (
      <FullScreenVideoPlayer
        videos={videos}
        initialIndex={selectedVideoIndex}
        onLoadMore={loadMore}
        onBack={handleBack}
        onVideoChange={handleVideoChange}
      />
    );
  }

  return (
    <Box width="100%" minHeight="100vh" pb={10}>
      <Grid container spacing={{ xs: 0.5 }}>
        {videos.map((v, index) => (
          <Grid key={v.id} size={{ xs: 4, sm: 3 }}>
            <VideoCard video={v} onClick={() => handleVideoClick(index)} />
          </Grid>
        ))}

        {loading &&
          Array.from({ length: 8 }).map((_, index) => (
            <Grid key={`skeleton-${index}`} size={{ xs: 4, sm: 3 }}>
              <VideoCardSkeleton />
            </Grid>
          ))}
      </Grid>

      <Box
        ref={sentinelRef}
        display="flex"
        justifyContent="center"
        alignItems="center"
        py={2}
        minHeight={50}
      />
    </Box>
  );
}