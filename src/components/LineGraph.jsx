import { 
    CartesianGrid, 
    Legend, 
    Line, 
    LineChart, 
    ResponsiveContainer,
    Tooltip,
    XAxis, 
    YAxis, 
} from 'recharts';

const lineChartData = [
    {month: 'Jan', confidenceScore: 6.5},
    {month: 'Feb', confidenceScore: 7.2},
    {month: 'Mar', confidenceScore: 6.8},
    {month: 'Apr', confidenceScore: 8.1},
    {month: 'May', confidenceScore: 7.9},
    {month: 'Jun', confidenceScore: 8.5},
    {month: 'Jul', confidenceScore: 8.8},
    {month: 'Aug', confidenceScore: 9.1},
];

export default function LineGraph() {
    return (
     <ResponsiveContainer width="100%" height={300}>
       <LineChart data={lineChartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
         <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
         <Line 
           type="monotone" 
           dataKey="confidenceScore" 
           stroke="#1976d2" 
           strokeWidth={3}
           dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
           name="Confidence Score" 
         />
         <XAxis dataKey="month" />
         <YAxis 
           domain={[0, 10]}
           label={{ value: 'Confidence Score', angle: -90, position: 'insideLeft' }} 
         />
         <Tooltip 
           formatter={(value) => [`${value}/10`, 'Confidence Score']}
           labelStyle={{ color: '#333' }}
         />
         <Legend />
       </LineChart>
     </ResponsiveContainer>
   );
}

