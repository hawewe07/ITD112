import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import {
  UserGroupIcon,
  HeartIcon,
  MapIcon,
  TableCellsIcon,
  ChartBarIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const Home = ({ isDarkMode }) => {
  const [dengueData, setDengueData] = useState([]);
  const [totalCases, setTotalCases] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [totalRegions, setTotalRegions] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch dengue data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "dengueData"));
        let cases = 0;
        let deaths = 0;
        const regionsSet = new Set();
        const data = [];

        querySnapshot.forEach((doc) => {
          const record = doc.data();
          data.push(record);
          cases += record.cases || 0;
          deaths += record.deaths || 0;
          if (record.regions) {
            regionsSet.add(record.regions);
          }
        });

        setDengueData(data);
        setTotalCases(cases);
        setTotalDeaths(deaths);
        setTotalRegions(regionsSet.size);
        setLastUpdated(new Date().toLocaleString());
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []); // Runs only once

  // Styles for cards
  const cardStyle = {
    backgroundImage: isDarkMode
      ? "linear-gradient(to right, #0f213d, #03346A)"
      : "linear-gradient(to right, #176B87, #64CCC5)",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,255)",
    color: isDarkMode ? "#64CCC5" : "#021526",
  };

  // Top 10 critical regions based on cases > 100
  const criticalRegions = React.useMemo(() => {
    return dengueData
      .filter((data) => data.cases > 100)
      .sort((a, b) => b.cases - a.cases)
      .slice(0, 10);
  }, [dengueData]);

  // Trend chart data
  const trendChartData = {
    labels: dengueData.map((data) => data.date),
    datasets: [
      {
        label: "Cases",
        data: dengueData.map((data) => data.cases),
        borderColor: "#FF6384",
        fill: false,
      },
      {
        label: "Deaths",
        data: dengueData.map((data) => data.deaths),
        borderColor: "#36A2EB",
        fill: false,
      },
    ],
  };

  return (
    <div>
      {/* Dashboard Content */}
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

      {/* Statistics Overview */}
      <div className="p-1 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Mortality Rate",
            value: totalCases > 0 ? ((totalDeaths / totalCases) * 100).toFixed(2) + "%" : "N/A",
            description: "Percentage of deaths relative to cases",
            icon: <ChartBarIcon className="h-10 w-10 mb-2" />,
          },
          {
            label: "Total Cases",
            value: totalCases,
            description: "Total reported dengue cases",
            icon: <UserGroupIcon className="h-10 w-10 mb-2" />,
          },
          {
            label: "Total Deaths",
            value: totalDeaths,
            description: "Total deaths due to dengue",
            icon: <HeartIcon className="h-10 w-10 mb-2" />,
          },
          {
            label: "Regions Tracked",
            value: totalRegions,
            description: "Number of regions reporting dengue cases",
            icon: <MapIcon className="h-10 w-10 mb-2" />,
          },
          
        ].map((stat, index) => (
          <div
            key={index}
            style={cardStyle}
            className="p-4 flex flex-col items-center text-center"
          >
            {stat.icon}
            <h2 className="text-xl font-bold">{stat.label}</h2>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
            <p className="mt-1 text-sm">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            path: "/data-management",
            label: "Data Management",
            description: "Manage and update dengue data",
            icon: <TableCellsIcon className="h-8 w-8" />,
          },
          {
            path: "/insights",
            label: "Insights",
            description: "View analytics and trends",
            icon: <ChartBarIcon className="h-8 w-8" />,
          },
          {
            path: "/geographic-data",
            label: "Geographic Data",
            description: "Explore data on maps",
            icon: <GlobeAltIcon className="h-8 w-8" />,
          },
        ].map((link, index) => (
          <Link
            key={index}
            to={link.path}
            style={cardStyle}
            className="flex items-center justify-between"
          >
            <div>
              <h3 className="text-xl font-bold">{link.label}</h3>
              <p>{link.description}</p>
            </div>
            {link.icon}
          </Link>
        ))}
      </div>

      {/* Trend Chart and Critical Alerts */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div style={cardStyle}>
          <h3 className="text-lg font-bold">Trend Chart</h3>
          <Line data={trendChartData} />
        </div>

        {/* Critical Alerts */}
        <div style={cardStyle}>
          <h3 className="text-lg font-bold mb-1">Critical Alerts</h3>
          <p>Top 10 critical regions based on cases.</p>
          {criticalRegions.length > 0 ? (
            <div className="overflow-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr
                    className="text-left bg-dark-100"
                    style={{ color: isDarkMode ? "#64CCC5" : "#021526" }}
                  >
                    <th className="p-2 border">Region</th>
                    <th className="p-2 border">Cases</th>
                  </tr>
                </thead>
                <tbody>
                  {criticalRegions.map((region, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="p-2 border">{region.location}</td>
                      <td className="p-2 border">{region.cases}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No critical regions detected.</p>
          )}
        </div>
      </div>

      {/* Performance Indicators */}
      <div style={cardStyle} className="text-center mb-2">
        <h3 className="text-lg font-bold">Last Updated</h3>
        <p>{lastUpdated}</p>
      </div>
    </div>
  );
};

export default Home;
