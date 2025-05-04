"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueByCategoryProps {
    data: { name: string; revenue: number }[];
}

export function RevenueByCategory({ data }: RevenueByCategoryProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#FF385C" radius={[4, 4, 0, 0]} animationDuration={1500} />
            </BarChart>
        </ResponsiveContainer>
    );
}