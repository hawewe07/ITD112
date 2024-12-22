import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import { db } from "./firebase";

const Insights = ({ isDarkMode }) => {
  const [dengueData, setDengueData] = useState([]);
  const [regionFilter, setRegionFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const barChartRef = useRef();
  const lineChartRef = useRef();
  const pieChartRef = useRef();
  const scatterChartRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "dengueData"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setDengueData(data);
    };
    fetchData();
  }, []);

  const filteredData = dengueData.filter((data) => {
    const matchesRegion = !regionFilter || data.regions === regionFilter;
    const matchesDate =
      (!dateRange.start && !dateRange.end) ||
      (data.date &&
        new Date(data.date) >= new Date(dateRange.start) &&
        new Date(data.date) <= new Date(dateRange.end));
    return matchesRegion && matchesDate;
  });

  const uniqueRegions = [...new Set(dengueData.map((data) => data.regions))];

  // Chart Data Configurations
  const barChartData = {
    labels: filteredData.map((data) => data.regions),
    datasets: [
      {
        label: "Cases",
        data: filteredData.map((data) => data.cases),
        backgroundColor: isDarkMode ? "#64CCC5" : "#176B87",
      },
      {
        label: "Deaths",
        data: filteredData.map((data) => data.deaths),
        backgroundColor: isDarkMode ? "#FF6666" : "#FF4D4D",
      },
    ],
  };

  const lineChartData = {
    labels: filteredData.map((data) => data.date),
    datasets: [
      {
        label: "Cases",
        data: filteredData.map((data) => data.cases),
        borderColor: isDarkMode ? "#64CCC5" : "#176B87",
        fill: false,
      },
      {
        label: "Deaths",
        data: filteredData.map((data) => data.deaths),
        borderColor: isDarkMode ? "#FF6666" : "#FF4D4D",
        fill: false,
      },
    ],
  };

  const pieChartData = {
    labels: [...new Set(filteredData.map((data) => data.regions))],
    datasets: [
      {
        label: "Distribution",
        data: filteredData.reduce((acc, data) => {
          const regionIndex = acc.labels.indexOf(data.regions);
          if (regionIndex === -1) {
            acc.labels.push(data.regions);
            acc.data.push(data.cases);
          } else {
            acc.data[regionIndex] += data.cases;
          }
          return acc;
        }, { labels: [], data: [] }).data,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const scatterChartData = {
    datasets: [
      {
        label: "Cases vs Deaths",
        data: filteredData.map((data) => ({ x: data.cases, y: data.deaths })),
        backgroundColor: isDarkMode ? "#64CCC5" : "#FF6666",
      },
    ],
  };

  const exportChart = (chartRef, chartName) => {
    const chart = chartRef.current;
    if (chart) {
      const image = chart.toBase64Image();
      const link = document.createElement("a");
      link.href = image;
      link.download = `${chartName}.png`;
      link.click();
    }
  };

  return (
    <div
      className="p-6 min-h-screen"
      style={{
        backgroundColor: isDarkMode ? "#001C30" : "#DAFFFB",
        color: isDarkMode ? "#64CCC5" : "#021526",
      }}
    >
      <h1 className="text-3xl font-bold text-center mb-10">Insights</h1>

      {/* Filters */}
      <div
        className="p-6 rounded-lg shadow-md mb-6"
        style={{
          backgroundColor: isDarkMode ? "#0f213d" : "#176B87",
        }}
      >
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col">
            <label className="mb-2 text-sm">Region</label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="p-2 border rounded bg-transparent focus:outline-none"
              style={{
                backgroundColor: isDarkMode ? "#0f213d" : "#176B87",
                color: isDarkMode ? "#64CCC5" : "#021526",
              }}
            >
              <option value="">All Regions</option>
              {uniqueRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="p-2 border rounded bg-transparent focus:outline-none"
              style={{
                backgroundColor: isDarkMode ? "#0f213d" : "#176B87",
                color: isDarkMode ? "#64CCC5" : "#021526",
              }}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="p-2 border rounded bg-transparent focus:outline-none"
              style={{
                backgroundColor: isDarkMode ? "#0f213d" : "#176B87",
                color: isDarkMode ? "#64CCC5" : "#021526",
              }}
            />
          </div>
        </div>
      </div>

      {/* Visualization Containers */}
      {filteredData.length === 0 ? (
        <p className="text-center">No data available for the selected filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: isDarkMode ? "#0f213d" : "#176B87" }}>
            <h2 className="text-xl font-bold mb-4 text-center">Cases and Deaths by Region</h2>
            <Bar ref={barChartRef} data={barChartData} />
            <button
              onClick={() => exportChart(barChartRef, "cases_and_deaths_by_region")}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download Chart
            </button>
          </div>

          {/* Line Chart */}
          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: isDarkMode ? "#0f213d" : "#176B87" }}>
            <h2 className="text-xl font-bold mb-4 text-center">Trends Over Time</h2>
            <Line ref={lineChartRef} data={lineChartData} />
            <button
              onClick={() => exportChart(lineChartRef, "trends_over_time")}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download Chart
            </button>
          </div>

          {/* Pie Chart */}
          <div className="p-20 rounded-lg shadow-md" style={{ backgroundColor: isDarkMode ? "#0f213d" : "#176B87" }}>
            <h2 className="text-xl font-bold mb-4 text-center">Case Distribution by Region</h2>
            <Pie ref={pieChartRef} data={pieChartData} />
            <button
              onClick={() => exportChart(pieChartRef, "case_distribution_by_region")}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download Chart
            </button>
          </div>

          {/* Scatter Plot */}
          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: isDarkMode ? "#0f213d" : "#176B87" }}>
            <h2 className="text-xl font-bold mb-4 text-center">Cases vs Deaths Correlation</h2>
            <Scatter ref={scatterChartRef} data={scatterChartData} />
            <button
              onClick={() => exportChart(scatterChartRef, "cases_vs_deaths_correlation")}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download Chart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
