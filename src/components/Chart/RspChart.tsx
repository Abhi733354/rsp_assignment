// src/components/Chart/RspChart.tsx
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import '../../styles/main.css'

interface RspChartProps {
  city: string;
  fuel: string;
  year: string;
  data: { month: string; value: number }[];
}

const RspChart: React.FC<RspChartProps> = ({ city, fuel, year, data }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chart = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chart.current) {
      chart.current = echarts.init(chartRef.current);
    }

    const option: echarts.EChartsOption = {
      title: {
        text: `${fuel} Prices in ${city} (${year})`,
        left: "center",
      },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: data.map((d) => d.month),
      },
      yAxis: {
        type: "value",
        name: "₹ per litre",
      },
      series: [
        {
          type: "bar",
          data: data.map((d) => d.value),
        },
      ],
    };

    chart.current.setOption(option);
    window.addEventListener("resize", () => chart.current?.resize());

    return () => {
      chart.current?.dispose();
      chart.current = null;
    };
  }, [data, city, fuel, year]);

  return <div ref={chartRef} style={{ width: "100%", height: "420px", marginTop: "2rem" }} />;
};

export default RspChart;


