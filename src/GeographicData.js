import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { db, collection, getDocs } from "./firebase";
import geoJsonData from "./assets/ph"; // GeoJSON file for Philippines regions

const GeographicData = ({ isDarkMode }) => {
  const [loading, setLoading] = useState(true);
  const [mappedRegionCases, setMappedRegionCases] = useState({});

  // Mapping object to align region names between database and GeoJSON
  const regionNameMapping = {
    "REGION X-NORTHERN MINDANAO": "Northern Mindanao",
    "REGION IX-ZAMBOANGA PENINSULA": "Zamboanga Peninsula",
    CAR: "Cordillera Administrative Region",
    BARMM: "Autonomous Region in Muslim Mindanao",
    "REGION XII-SOCCSKSARGEN": "Soccsksargen",
    "REGION XI-DAVAO REGION": "Davao",
    "REGION VIII-EASTERN VISAYAS": "Eastern Visayas",
    "REGION VII-CENTRAL VISAYAS": "Central Visayas",
    "REGION VI-WESTERN VISAYAS": "Western Visayas",
    "REGION V-BICOL REGION": "Bicol",
    "REGION IV-B-MIMAROPA": "Mimaropa",
    "REGION IV-A-CALABARZON": "Calabarzon",
    "REGION III-CENTRAL LUZON": "Central Luzon",
    "REGION II-CAGAYAN VALLEY": "Cagayan Valley",
    "REGION I-ILOCOS REGION": "Ilocos",
    "NATIONAL CAPITAL REGION": "National Capital Region",
    CARAGA: "Caraga",
  };

  useEffect(() => {
const fetchData = async () => {
  try {
    console.log("Fetching data from Firebase...");
    setLoading(true);

    const querySnapshot = await getDocs(collection(db, "dengueData"));
    console.log("Fetched snapshot size:", querySnapshot.size);

    const dengueData = querySnapshot.docs.map((doc) => {
      console.log("Document data:", doc.data());
      return doc.data();
    });

    console.log("Raw Dengue Data:", dengueData);

    // Function to clean up region names
    const cleanRegionName = (name) => {
      return name
        ? name.trim().toUpperCase().replace(/[\s\n\r]+/g, " ")
        : name;
    };

    // Aggregate cases by region
    const regionCases = dengueData.reduce((acc, record) => {
      const region = cleanRegionName(record.regions) || "Unknown Region"; 
      console.log(`Processing region: ${region}, cases: ${record.cases}`);
      acc[region] = (acc[region] || 0) + parseInt(record.cases || 0);
      return acc;
    }, {});

    console.log("Aggregated Region Cases:", regionCases);

    // Map region names to match GeoJSON
    const mappedCases = Object.keys(regionCases).reduce((acc, region) => {
      const mappedName = regionNameMapping[region] || region;
      console.log(`Mapped region name: ${region} -> ${mappedName}`);
      acc[mappedName] = regionCases[region];
      return acc;
    }, {});

    console.log("Mapped Region Cases for GeoJSON:", mappedCases);

    setMappedRegionCases(mappedCases);
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
  } finally {
    setLoading(false);
    console.log("Data fetching complete.");
  }
};


    fetchData();
  }, []);

  if (loading || !geoJsonData) {
    console.log("Loading GeoJSON data or Firebase data...");
    return (
      <div
        style={{
          height: "500%",
          width: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: isDarkMode ? "#64CCC5" : "#021526",
        }}
      >
        <p>Loading map data...</p>
      </div>
    );
  }

  console.log("Final Mapped Data for Choropleth:", mappedRegionCases);
  console.log("GeoJSON Data Loaded:", geoJsonData);

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#0f213d" : "#176B87",
        color: isDarkMode ? "#64CCC5" : "#021526",
        padding: "8px",
        borderRadius: "4px",
      }}
    >
      <h2 className="text-2xl font-bold mb-2 text-center">
        Philippine Dengue Cases - Choropleth Map
      </h2>
      <Plot
        data={[
          {
            type: "choroplethmapbox",
            geojson: geoJsonData,
            locations: Object.keys(mappedRegionCases),
            z: Object.values(mappedRegionCases),
            featureidkey: "properties.name",
            colorscale: "Greens",
            marker: { line: { width: 1, color: "white" } },
            text: Object.entries(mappedRegionCases).map(
              ([region, cases]) => `${region}: ${cases} cases`
            ),
          },
        ]}
        layout={{
          mapbox: {
            style: "open-street-map",
            zoom: 5.5,
            center: { lat: 12.8797, lon: 121.774 },
          },
          height: 850,
          title: "Dengue Cases by Region",
          font: { color: isDarkMode ? "#64CCC5" : "#021526" },
        }}
        config={{ mapboxAccessToken: "YOUR_MAPBOX_ACCESS_TOKEN" }}
        useResizeHandler
        style={{ width: "100%", height: "500%" }}
      />
    </div>
  );
};

export default GeographicData;
