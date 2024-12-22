import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "react-toastify";

const DengueDataList = ({ dengueData, onDataUpdated, onDataDeleted, isDarkMode }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const [month, day, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // Format date for Firestore
  const formatDateForFirestore = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  // Filter data based on search term
  const filteredData = dengueData.filter((data) =>
    (data.location && data.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (data.regions && data.regions.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      onDataDeleted(id);
      toast.success("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete data.");
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location || "",
      cases: data.cases || 0,
      deaths: data.deaths || 0,
      date: formatDateForInput(data.date) || "",
      regions: data.regions || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.location || !editForm.cases || !editForm.deaths || !editForm.date || !editForm.regions) {
      toast.error("All fields are required.");
      return;
    }

    if (isNaN(editForm.cases) || isNaN(editForm.deaths)) {
      toast.error("Cases and Deaths must be valid numbers.");
      return;
    }

    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      const formattedDate = formatDateForFirestore(editForm.date);

      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: formattedDate,
        regions: editForm.regions,
      });

      const updatedData = { id: editingId, ...editForm };
      onDataUpdated(updatedData);
      setEditingId(null);
      toast.success("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update data. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    toast.info("Edit canceled.");
  };

  return (
    <div
      className="p-6 rounded shadow-md"
      style={{
        backgroundColor: isDarkMode ? "#0f213d" : "#176B87",
        color: isDarkMode ? "#64CCC5" : "#021526",
      }}
    >
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Location or Regions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded bg-transparent focus:outline-none"
          style={{
            backgroundColor: isDarkMode ? "#0f213d" : "#176B87",
            color: isDarkMode ? "#64CCC5" : "#021526",
          }}
        />
      </div>

      {editingId ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["location", "cases", "deaths", "date", "regions"].map((field, idx) => (
              <div key={idx}>
                <label className="block text-sm mb-1 capitalize">{field}</label>
                <input
                  type={field === "cases" || field === "deaths" ? "number" : field === "date" ? "date" : "text"}
                  placeholder={`Enter ${field}`}
                  value={editForm[field]}
                  onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                  className="w-full p-2 border rounded bg-transparent focus:outline-none"
                  required
                />
              </div>
            ))}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Update Data
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="overflow-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr
                style={{
                  backgroundColor: isDarkMode ? "#0f213d" : "#176B87",
                  color: isDarkMode ? "#64CCC5" : "#021526",
                }}
              >
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Cases</th>
                <th className="p-2 border">Deaths</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Regions</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((data) => (
                  <tr key={data.id}>
                    <td className="p-2 border">{data.location}</td>
                    <td className="p-2 border">{data.cases}</td>
                    <td className="p-2 border">{data.deaths}</td>
                    <td className="p-2 border">{data.date}</td>
                    <td className="p-2 border">{data.regions}</td>
                    <td className="p-2 border space-x-2">
                      <button
                        onClick={() => handleEdit(data)}
                        className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(data.id)}
                        className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    No data available to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-center space-x-2 mt-4">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-400" : "bg-gray-300 hover:bg-gray-400"}`}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <span className="px-2 py-1 bg-gray-200 rounded">{`Page ${currentPage} of ${Math.ceil(filteredData.length / rowsPerPage)}`}</span>
  <button
    onClick={() =>
      setCurrentPage((prev) =>
        Math.min(prev + 1, Math.ceil(filteredData.length / rowsPerPage))
      )
    }
    className={`px-4 py-2 rounded ${currentPage >= Math.ceil(filteredData.length / rowsPerPage) ? "bg-gray-400" : "bg-gray-300 hover:bg-gray-400"}`}
    disabled={currentPage >= Math.ceil(filteredData.length / rowsPerPage)}
  >
    Next
  </button>
</div>

        </div>
      )}
    </div>
  );
};

export default DengueDataList;
