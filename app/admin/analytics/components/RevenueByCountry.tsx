"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueByCountryProps {
    data: { name: string; flag: string; revenue: number }[];
}

export function RevenueByCountry({ data }: RevenueByCountryProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickFormatter={(value, index) => data[index]?.flag || ""} />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#FF385C" radius={[4, 4, 0, 0]} animationDuration={1500} />
            </BarChart>
        </ResponsiveContainer>
    );
}