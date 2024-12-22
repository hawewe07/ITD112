import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import AddDengueData from "./AddDengueData";
import CsvUpload from "./CsvUpload";
import DengueDataList from "./DengueDataList";

const DataManagement = ({ isDarkMode, onDataAdded, onDataUploaded }) => {
  const [dengueData, setDengueData] = useState([]);
  const [showAddDataForm, setShowAddDataForm] = useState(false);
  const [showCsvUploadForm, setShowCsvUploadForm] = useState(false);

  // Real-time Data Fetching with onSnapshot
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "dengueData"),
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setDengueData(fetchedData);
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleDataAdded = (newData) => {
    setDengueData((prev) => [...prev, newData]);
    if (onDataAdded) onDataAdded(newData);
  };

  const handleDataDeleted = (id) => {
    setDengueData((prev) => prev.filter((data) => data.id !== id));
  };

  const handleDataUpdated = (updatedData) => {
    setDengueData((prev) =>
      prev.map((data) => (data.id === updatedData.id ? updatedData : data))
    );
  };

  return (
    <div
      className="p-6 min-h-screen"
      style={{
        backgroundColor: isDarkMode ? "#001C30" : "#DAFFFB",
        color: isDarkMode ? "#64CCC5" : "#021526",
      }}
    >
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-10">Data Management</h1>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mb-10">
        <button
          className="px-6 py-3 font-semibold rounded-lg shadow-md"
          style={{
            backgroundColor: isDarkMode ? "#176B87" : "#64CCC5",
            color: isDarkMode ? "#001C30" : "#021526",
          }}
          onClick={() => setShowAddDataForm((prev) => !prev)}
        >
          {showAddDataForm ? "Close Add Data Form" : "Add Dengue Data"}
        </button>

        <button
          className="px-6 py-3 font-semibold rounded-lg shadow-md"
          style={{
            backgroundColor: isDarkMode ? "#176B87" : "#64CCC5",
            color: isDarkMode ? "#001C30" : "#021526",
          }}
          onClick={() => setShowCsvUploadForm((prev) => !prev)}
        >
          {showCsvUploadForm ? "Close CSV Upload Form" : "Upload CSV"}
        </button>
      </div>

      {/* Forms */}
      {showAddDataForm && (
        <div
          className="p-6 rounded-lg shadow-lg mb-10"
          style={{
            backgroundColor: isDarkMode ? "#0f213d" : "#176B87",
          }}
        >
          <AddDengueData isDarkMode={isDarkMode} onDataAdded={handleDataAdded} />
        </div>
      )}

      {showCsvUploadForm && (
        <div
          className="p-6 rounded-lg shadow-lg mb-10"
          style={{
            backgroundColor: isDarkMode ? "#0f213d" : "#176B87",
          }}
        >
          <CsvUpload isDarkMode={isDarkMode} onDataUploaded={handleDataAdded} />
        </div>
      )}

      {/* Dengue Data List */}
      <div
        className="mt-10 p-6 rounded-lg shadow-lg"
        style={{
          backgroundColor: isDarkMode ? "#0f213d" : "#176B87",
        }}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Dengue Data List</h2>
        {dengueData.length > 0 ? (
          <DengueDataList
            dengueData={dengueData}
            onDataUpdated={handleDataUpdated}
            onDataDeleted={handleDataDeleted}
            isDarkMode={isDarkMode}
          />
        ) : (
          <p className="text-center">No data available to display.</p>
        )}
      </div>
    </div>
  );
};

export default DataManagement;
