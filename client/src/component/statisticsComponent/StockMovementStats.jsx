import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const StockMovementStats = ({ lastEightWeeksStock }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lastEightWeeksStock}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 5 }}
            />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default StockMovementStats