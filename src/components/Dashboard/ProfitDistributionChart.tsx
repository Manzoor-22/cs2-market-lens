import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ItemData } from "@/lib/googleSheets";

interface ProfitDistributionChartProps {
  data: ItemData[];
}

const COLORS = [
  'hsl(45 100% 51%)',    // Primary gold
  'hsl(142 76% 45%)',    // Success green
  'hsl(220 70% 50%)',    // Chart blue
  'hsl(280 70% 50%)',    // Chart purple
  'hsl(0 84% 60%)',      // Destructive red
  'hsl(35 100% 55%)',    // Orange
  'hsl(200 70% 50%)',    // Cyan
  'hsl(320 70% 50%)',    // Pink
];

export const ProfitDistributionChart = ({ data }: ProfitDistributionChartProps) => {
  const chartData = data.map((item, index) => ({
    name: item.item.length > 30 ? item.item.substring(0, 30) + '...' : item.item,
    value: item.currentValue,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          🎯 Portfolio Distribution
          <span className="text-sm text-muted-foreground font-normal">By Current Value</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
