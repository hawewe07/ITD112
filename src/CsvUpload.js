import React, { useState } from "react";
import { collection, doc, writeBatch, deleteDoc, getDocs } from "firebase/firestore";
import { terminate, getFirestore } from "firebase/firestore";
import { db } from "./firebase"; // Firestore instance
import Papa from "papaparse";
import { toast } from "react-toastify";

const CsvUpload = ({ onDataUploaded, isDarkMode }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Function to clear the existing database
  const clearDatabase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "dengueData"));
      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log("Database cleared successfully.");
      toast.info("Existing data cleared from the database.");
  
      // Clear Firestore Cache
      await terminate(getFirestore());
      console.log("Firestore cache cleared successfully!");
    } catch (error) {
      console.error("Error clearing database:", error);
      toast.error("Failed to clear existing data.");
    }
  };

  // Function to handle the file upload
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = reader.result;

        // Parse CSV data
        const parsedData = Papa.parse(result, { header: true, skipEmptyLines: true }).data;

        // Preprocess and validate data
        const formattedData = parsedData.map((row) => ({
          location: row.location?.trim() || null,
          cases: row.cases ? parseInt(row.cases, 10) : null,
          deaths: row.deaths ? parseInt(row.deaths, 10) : 0,
          date: row.date?.trim(),
          regions: row.regions?.trim(),
        }));

        const validData = formattedData.filter(
          (row) => row.location && row.cases && row.date && row.regions
        );

        if (validData.length === 0) {
          toast.error("No valid rows to upload. Check the CSV file.");
          return;
        }

        // Clear existing database records before uploading
        await clearDatabase();

        // Upload new data in chunks
        const chunkSize = 500;
        for (let i = 0; i < validData.length; i += chunkSize) {
          const chunk = validData.slice(i, i + chunkSize);
          const batch = writeBatch(db);

          chunk.forEach((data) => {
            const docRef = doc(collection(db, "dengueData"));
            batch.set(docRef, data);
          });

          await batch.commit();
          toast.success(`Uploaded ${chunk.length} records successfully (Batch ${i / chunkSize + 1}).`);
        }

        // Trigger data refresh and reset file input
        onDataUploaded();
        setFile(null);
      } catch (error) {
        console.error("Error during upload:", error);
        toast.error("Error uploading data.");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      toast.error("Error reading the file.");
    };

    reader.readAsText(file);
  };

  return (
    <div
      className="p-6 shadow-md rounded max-w-9xl mx-auto"
      style={{
        backgroundColor: isDarkMode ? "#0f213d" : "#176B87",
        color: isDarkMode ? "#64CCC5" : "#021526",
      }}
    >
      <h2 className="text-xl font-bold mb-2 flex items-center">Upload CSV</h2>
      <p className="mb-4 text-sm">Select a CSV file to upload your data to the database.</p>
      <div className="space-y-4">
        {/* File Input */}
        <input
          id="fileInput"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex items-center border rounded p-2">
          <input
            type="text"
            placeholder="No file chosen"
            value={file ? file.name : ""}
            disabled
            className="w-full bg-transparent focus:outline-none"
          />
          <label
            htmlFor="fileInput"
            className="ml-2 p-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
            style={{
              color: isDarkMode ? "#001C30" : "#021526",
            }}
          >
            Browse
          </label>
        </div>
        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full p-3 rounded font-bold flex items-center justify-center"
          style={{
            backgroundColor: loading ? "#6B7280" : isDarkMode ? "#176B87" : "#021526",
            color: isDarkMode ? "#001C30" : "#DAFFFB",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default CsvUpload;
