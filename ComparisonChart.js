import React, { useEffect, useRef } from 'react';
import {
  Chart,
  ScatterController,
  BarController,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

Chart.register(
  ScatterController,
  BarController,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale
);

const ComparisonChart = ({ dengueData }) => {
  const scatterChartRef = useRef(null);
  const barChartRef = useRef(null);
  const scatterChartInstanceRef = useRef(null);
  const barChartInstanceRef = useRef(null);

  useEffect(() => {
    if (dengueData.length > 0) {
      const ctxScatter = scatterChartRef.current.getContext('2d');
      const ctxBar = barChartRef.current.getContext('2d');

      const scatterData = dengueData.map((data) => ({
        x: data.cases,
        y: data.deaths,
      }));

      const barLabels = dengueData.map((data) => data.location);
      const barCases = dengueData.map((data) => data.cases);

      // Destroy existing charts
      if (scatterChartInstanceRef.current) scatterChartInstanceRef.current.destroy();
      if (barChartInstanceRef.current) barChartInstanceRef.current.destroy();

      // Create Scatter plot
      scatterChartInstanceRef.current = new Chart(ctxScatter, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Cases vs Deaths',
            data: scatterData,
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor: 'rgba(75, 192, 192, 1)',
          }],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Cases',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Deaths',
              },
            },
          },
          plugins: {
            legend: { display: true },
            tooltip: { enabled: true },
          },
        },
      });

      // Create Bar chart
      barChartInstanceRef.current = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: barLabels,
          datasets: [{
            label: 'Cases by Location',
            data: barCases,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }],
        },
        options: {
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Locations',
              },
            },
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Cases' },
            },
          },
          plugins: {
            legend: { display: true },
            tooltip: { enabled: true },
          },
        },
      });
    }

    return () => {
      if (scatterChartInstanceRef.current) scatterChartInstanceRef.current.destroy();
      if (barChartInstanceRef.current) barChartInstanceRef.current.destroy();
    };
  }, [dengueData]);

  return (
    <div className="chart-container">
      <h3>Scatter Plot (Cases vs Deaths)</h3>
      <canvas ref={scatterChartRef} />
      <h3>Bar Chart (Cases by Location)</h3>
      <canvas ref={barChartRef} />
    </div>
  );
};

export default ComparisonChart;
