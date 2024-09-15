import React, { useState } from "react";
import Papa from "papaparse";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import './CsvUpload.css';

const CsvUpload = ({ onDataAdded }) => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "text/csv") {
      setError("Please upload a valid CSV file.");
      setCsvData([]);
      setSuccess("");
      return;
    }

    Papa.parse(file, {
      complete: (result) => {
        if (result.data.length === 0) {
          setError("The CSV file is empty or incorrectly formatted.");
          return;
        }
        setCsvData(result.data);
        setError(null);
        setSuccess("CSV file loaded successfully!");
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const saveToDatabase = async () => {
    if (csvData.length === 0) {
      setError("No data to save. Please upload a CSV file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess("");

    try {
      for (const row of csvData) {
        if (!row.loc || !row.cases || !row.deaths || !row.date || !row.Region || !row.year) {
          console.warn("Skipping row due to missing fields:", row);
          continue;
        }

        await addDoc(collection(db, "dengueData"), {
          location: row.loc,
          cases: Number(row.cases),
          deaths: Number(row.deaths),
          date: row.date,
          regions: row.Region,
          year: row.year,
        });
      }
      setLoading(false);
      setSuccess("Data saved to database successfully!");
      onDataAdded(); 
    } catch (error) {
      setLoading(false);
      setError("Error saving data: " + error.message);
    }
  };

  return (
    <div className="upload-section">
      <h2 className="upload-title">Upload CSV File</h2>

      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileUpload} 
        className="file-input"
      />

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      {csvData.length > 0 && (
        <button 
          onClick={saveToDatabase} 
          disabled={loading} 
          className={`save-button ${loading ? "disabled" : ""}`}
        >
          {loading ? <span className="spinner"></span> : "Save to Database"}
        </button>
      )}
    </div>
  );
};

export default CsvUpload;
