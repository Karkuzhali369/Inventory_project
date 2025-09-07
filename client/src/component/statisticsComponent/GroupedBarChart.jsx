import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { generateColors } from '../../utils/generateColors';

const GroupedBarChart = ({ groupedData }) => {
    const [categories, setCategories] = useState([]);
    const token = localStorage.getItem('Token');
    const [colors, setColors] = useState([]);

    const getCategory = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/get-category`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setCategories(data.data.categories);
            setColors(generateColors(data.data.categories.length));
        }
        catch (error) {

        }
    };

    useEffect(() => {
        getCategory();
    }, []);

    return (
        <ResponsiveContainer width="100%" height={400}>
        <BarChart
            data={groupedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {categories.map((category, index) => (
            <Bar
                key={category}
                dataKey={category}
                fill={colors[index % colors.length]}
            />
            ))}
        </BarChart>
        </ResponsiveContainer>
    );
};

export default GroupedBarChart;
