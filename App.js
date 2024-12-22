import React, { useState, useEffect } from "react";
import AddDengueData from "./AddDengueData";
import DengueDataList from "./DengueDataList";
import CsvUpload from "./CsvUpload";
import ComparisonChart from "./ComparisonChart";
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './App.css';

function App() {
  const [dengueData, setDengueData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // Fetch dengue data from Firebase
  const fetchData = async () => {
    const dengueCollection = collection(db, 'dengueData');
    const dengueSnapshot = await getDocs(dengueCollection);
    const dataList = dengueSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDengueData(dataList);
    setFilteredData(dataList); // Set the initial filtered data
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter the data based on the selected month and year
  useEffect(() => {
    const filtered = dengueData.filter((data) => {
      const dataDate = new Date(data.date);
      const month = dataDate.getMonth() + 1; // Months are 0-based, so add 1
      const year = dataDate.getFullYear();

      // Apply filters based on user selections
      const monthMatch = selectedMonth === "all" || month === Number(selectedMonth);
      const yearMatch = selectedYear === "all" || year === Number(selectedYear);

      return monthMatch && yearMatch;
    });

    setFilteredData(filtered);
  }, [selectedMonth, selectedYear, dengueData]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const addData = (newData) => {
    setDengueData([...dengueData, newData]);
  };

  const updateData = (updatedData) => {
    setDengueData(dengueData.map(data => data.id === updatedData.id ? updatedData : data));
  };

  const deleteData = (id) => {
    setDengueData(dengueData.filter(data => data.id !== id));
  };

  return (
    <div className="App">
      <div className="header-section">
        <h1>Dengue Data CRUD App</h1>
      </div>
      
      <div className="content-container">
        <div className="add-dengue-container">
          <AddDengueData onDataAdded={addData} />
        </div>
        <div className="upload-csv-container">
          <CsvUpload onDataAdded={fetchData} />
        </div>
      </div>
      <div className="filter-section">
        <label>
          Filter by Month:
          <select value={selectedMonth} onChange={handleMonthChange}>
            <option value="all">All</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </label>
        <label>
          Filter by Year:
          <select value={selectedYear} onChange={handleYearChange}>
            <option value="all">All</option>
            {Array.from(new Set(dengueData.map(data => new Date(data.date).getFullYear()))).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="data-list">
        <DengueDataList
          dengueData={filteredData} // Pass filtered data
          onDataUpdated={updateData}
          onDataDeleted={deleteData}
        />
      </div>
      <div className="chart-container">
        <ComparisonChart dengueData={filteredData} /> {/* Pass filtered data */}
      </div>
    </div>
  );
}

export default App;
