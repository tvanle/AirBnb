"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RevenueOverviewProps {
  data: { name: string; revenue: number }[];
}

export function RevenueOverview({ data }: RevenueOverviewProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value) => [`$${value}`, "Revenue"]}
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#FF385C"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
