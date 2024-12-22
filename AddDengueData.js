import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import './App.css';

const AddDengueData = ({ onDataAdded }) => {
  const [location, setLocation] = useState("");
  const [cases, setCases] = useState("");
  const [deaths, setDeaths] = useState("");
  const [date, setDate] = useState("");
  const [regions, setRegions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!location || !cases || !deaths || !date || !regions) {
      setError("All fields are required.");
      return;
    }

    if (Number(cases) < 0 || Number(deaths) < 0) {
      setError("Cases and deaths must be non-negative numbers.");
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "dengueData"), {
        location,
        cases: Number(cases),
        deaths: Number(deaths),
        date,
        regions,
      });
      const newData = {
        id: docRef.id,
        location,
        cases: Number(cases),
        deaths: Number(deaths),
        date,
        regions,
      };
      onDataAdded(newData);
      setLocation("");
      setCases("");
      setDeaths("");
      setDate("");
      setRegions("");
      setSuccess("Data added successfully!");
    } catch (error) {
      setError("Error adding data. Please try again.");
      console.error("Error adding document: ", error);
    }
    setLoading(false);
  };

  return (
    <div className="add-dengue">
      <h2 className="form-header">Add Dengue Data</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cases"
          value={cases}
          onChange={(e) => setCases(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Deaths"
          value={deaths}
          onChange={(e) => setDeaths(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Regions"
          value={regions}
          onChange={(e) => setRegions(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Data"}
        </button>
      </form>
    </div>
  );
};

export default AddDengueData;
