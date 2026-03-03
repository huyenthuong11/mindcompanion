import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function MoodChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[1, 5]} />
        <Tooltip />
        <Line type="monotone" dataKey="mood" />
        <Line type="monotone" dataKey="energy" />
      </LineChart>
    </ResponsiveContainer>
  );
}