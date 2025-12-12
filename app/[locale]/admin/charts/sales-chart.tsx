"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesChartProps {
  data: { date: string; amount: number }[];
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Sales Over Time (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Sales"]}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
              }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
