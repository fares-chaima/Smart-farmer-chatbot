// src/components/EvaluationChart.jsx
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function EvaluationChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/get_agriculture_evaluation")
      .then(res => res.json())
      .then(json => {
        const formatted = Object.entries(json).map(([key, value]) => ({
          indicator: key.replace(/_/g, " "),
          value: Number(value),
        }));
        setData(formatted);
      })
      .catch(err => console.error("Erreur fetch:", err));
  }, []);

  return (
    <div className="agri-chart-container">
      <h2 className="agri-section-title">Évaluation Agricole</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="indicator" angle={-25} textAnchor="end" height={60} />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="value" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
