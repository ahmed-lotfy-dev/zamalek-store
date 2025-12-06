"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardBody, CardHeader } from "@heroui/card";

interface TopProductsChartProps {
  data: { name: string; sales: number }[];
}

const COLORS = [
  "hsl(var(--heroui-primary))",
  "hsl(var(--heroui-secondary))",
  "hsl(var(--heroui-success))",
  "hsl(var(--heroui-warning))",
  "hsl(var(--heroui-danger))",
];

export default function TopProductsChart({ data }: TopProductsChartProps) {
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <h3 className="text-lg font-semibold">Top 5 Products by Revenue</h3>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 40,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: "hsl(var(--heroui-background))",
                border: "1px solid hsl(var(--heroui-divider))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
