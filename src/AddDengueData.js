import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { MapPinIcon, CalendarDaysIcon, UsersIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { validateLatLng } from "./utils/validators";


const AddDengueData = ({ onDataAdded, isDarkMode }) => {
  const [form, setForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
    lat: "",
    lng: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!form.location || !form.cases || !form.deaths || !form.date || !form.regions || !form.lat || !form.lng) {
      toast.error("All fields are required.");
      return;
    }
  
    // Validate latitude and longitude
    if (!validateLatLng(form.lat, form.lng)) {
      toast.error("Invalid latitude or longitude values.");
      return;
    }
  
    setLoading(true);
    try {
      await addDoc(collection(db, "dengueData"), {
        ...form,
        cases: Number(form.cases),
        deaths: Number(form.deaths),
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
      });
      onDataAdded();
      toast.success("Data added successfully!");
      setForm({ location: "", cases: "", deaths: "", date: "", regions: "", lat: "", lng: "" });
    } catch (error) {
      toast.error("Error adding data. Try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div
      className="p-6 rounded shadow-md max-w-9xl mx-auto"
      style={{
        backgroundColor: isDarkMode ? " #0f213d" : "#176B87",
        color: isDarkMode ? "#64CCC5" : "#021526",
      }}
    >
      <h2 className="text-xl font-bold mb-3 flex items-center">
        <PlusCircleIcon className="h-6 w-6 mr-2" /> Add Dengue Data
      </h2>
      <p className="mb-4 text-sm">
        Fill in the form below to add data about dengue cases to the database.
      </p>

      {error && (
        <div
          className="mb-4 p-3 rounded"
          style={{
            backgroundColor: isDarkMode ? "#4A171E" : "#FEE2E2",
            color: isDarkMode ? "#FCA5A5" : "#B91C1C",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Location and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Location</label>
            <div className="flex items-center border rounded p-2">
              <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Date</label>
            <div className="flex items-center border rounded p-2">
              <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-400" />
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 2: Cases and Deaths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Cases</label>
            <div className="flex items-center border rounded p-2">
              <input
                type="number"
                name="cases"
                value={form.cases}
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
                placeholder="Enter number of cases"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Deaths</label>
            <div className="flex items-center border rounded p-2">
              <input
                type="number"
                name="deaths"
                value={form.deaths}
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
                placeholder="Enter number of deaths"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 3: Regions */}
        <div>
          <label className="block text-sm mb-1">Regions</label>
          <div className="flex items-center border rounded p-2">
            <UsersIcon className="h-5 w-5 mr-2 text-gray-400" />
            <input
              type="text"
              name="regions"
              value={form.regions}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none"
              placeholder="Enter affected regions"
              required
            />
          </div>
        </div>

        {/* Row 4: Latitude and Longitude */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Latitude</label>
            <div className="flex items-center border rounded p-2">
              <input
                type="text"
                name="lat"
                value={form.lat}
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
                placeholder="Enter latitude (-90 to 90)"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Longitude</label>
            <div className="flex items-center border rounded p-2">
              <input
                type="text"
                name="lng"
                value={form.lng}
                onChange={handleChange}
                className="w-full bg-transparent focus:outline-none"
                placeholder="Enter longitude (-180 to 180)"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 rounded font-bold flex items-center justify-center"
          style={{
            backgroundColor: loading
              ? "#6B7280"
              : isDarkMode
              ? "#176B87"
              : "#021526",
            color: loading ? "#FFFFFF" : isDarkMode ? "#001C30" : "#DAFFFB",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Data"}
        </button>
      </form>
    </div>
  );
};

export default AddDengueData;
