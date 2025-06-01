"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ScoreChartProps = {
  scores: { name: string; score: number }[];
};

export const ScoreChart = ({ scores }: ScoreChartProps) => {
  if (!scores || scores.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
      <h2 className="text-sm font-semibold mb-2">スコア推移グラフ</h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scores}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
