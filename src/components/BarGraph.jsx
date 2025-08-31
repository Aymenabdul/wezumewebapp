import { 
    Bar,
    BarChart,
    CartesianGrid, 
    Legend, 
    ResponsiveContainer,
    Tooltip,
    XAxis, 
    YAxis, 
} from 'recharts';

const barChartData = [
  { "category": "Technical", "candidateScore": 8.5, "averageScore": 7.2 },
  { "category": "Communication", "candidateScore": 9.1, "averageScore": 8.0 },
  { "category": "Problem Solving", "candidateScore": 7.8, "averageScore": 7.5 },
  { "category": "Leadership", "candidateScore": 8.2, "averageScore": 6.8 },
  { "category": "Teamwork", "candidateScore": 9.3, "averageScore": 8.1 },
  { "category": "Adaptability", "candidateScore": 8.7, "averageScore": 7.6 }
];

export default function BarGraph() { 
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="category" />
            <YAxis 
                domain={[0, 10]}
                label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
                formatter={(value) => [`${value}/10`]}
                labelStyle={{ color: '#333' }}
            />
            <Legend />
            <Bar dataKey="candidateScore" fill="#4caf50" name="Candidate Score" />
            <Bar dataKey="averageScore" fill="#ff9800" name="Average Score" />
            </BarChart>
        </ResponsiveContainer>
    );
};