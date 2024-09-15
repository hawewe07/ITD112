import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import './Datalist.css';

const DengueDataList = ({ dengueData, onDataUpdated, onDataDeleted }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });

  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      onDataDeleted(id); // Update data in App.js
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      regions: data.regions,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        regions: editForm.regions,
      });
      const updatedData = { id: editingId, ...editForm };
      onDataUpdated(updatedData); // Update data in App.js
      setEditingId(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div className="container">
      <h2>Dengue Data List</h2>
      {editingId ? (
        <form onSubmit={handleUpdate} className="form-container">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              placeholder="Location"
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cases">Cases</label>
            <input
              id="cases"
              type="number"
              placeholder="Cases"
              value={editForm.cases}
              onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="deaths">Deaths</label>
            <input
              id="deaths"
              type="number"
              placeholder="Deaths"
              value={editForm.deaths}
              onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              placeholder="Date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="regions">Regions</label>
            <input
              id="regions"
              type="text"
              placeholder="Regions"
              value={editForm.regions}
              onChange={(e) => setEditForm({ ...editForm, regions: e.target.value })}
              required
            />
          </div>
          <button type="submit">Update Data</button>
          <button className="cancel" type="button" onClick={() => setEditingId(null)}>
            Cancel
          </button>
        </form>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Cases</th>
              <th>Deaths</th>
              <th>Date</th>
              <th>Regions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dengueData.map((data) => (
              <tr key={data.id}>
                <td>{data.location}</td>
                <td>{data.cases}</td>
                <td>{data.deaths}</td>
                <td>{data.date}</td>
                <td>{data.regions}</td>
                <td>
                  <button onClick={() => handleEdit(data)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(data.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DengueDataList;
