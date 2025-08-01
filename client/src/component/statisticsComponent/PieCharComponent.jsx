import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';

import { generateColors } from '../../utils/generateColors';



const PieCharComponent = ({ stockByCategory }) => {

    const colors = generateColors(stockByCategory.length);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                data={stockByCategory}
                dataKey="totalQuantity"
                nameKey="category"
                cx="50%"
                cy="45%"
                outerRadius={140}
                label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                }
                >
                {stockByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
                </Pie>
                <Tooltip />
                <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ marginTop: '20px' }}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default PieCharComponent