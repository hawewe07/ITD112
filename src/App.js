import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import {
  HomeIcon,
  TableCellsIcon,
  ChartBarSquareIcon,
  GlobeAltIcon,
  CubeIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import Home from "./Home";
import DataManagement from "./DataManagement";
import Insights from "./Insights";
import GeographicData from "./GeographicData";
import { ToastContainer } from "react-toastify";
import { db } from "./firebase"; // Import the Firestore instance
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleMouseEnter = () => setIsCollapsed(false);
  const handleMouseLeave = () => setIsCollapsed(true);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <>
      <Router>
        <div
          className="flex min-h-screen"
          style={{
            backgroundColor: isDarkMode ? "#001C30" : "#DAFFFB",
            color: isDarkMode ? "#64CCC5" : "#021526",
          }}
        >
          {/* Sidebar */}
          <aside
            className={`fixed top-0 left-0 h-full flex-shrink-0 transition-all duration-300 ${
              isCollapsed ? "w-16" : "w-64"
            }`}
            style={{
              backgroundColor: "#176B87",
              color: isDarkMode ? "#64CCC5" : "#021526",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <CubeIcon className="h-8 w-8" />
                {!isCollapsed && (
                  <span className="ml-4 text-xl font-bold">Dengue Data App</span>
                )}
              </div>
              {!isCollapsed && (
                <button
                  onClick={toggleDarkMode}
                  className="hover:opacity-80 transition-opacity"
                >
                  {isDarkMode ? (
                    <SunIcon className="h-6 w-6" />
                  ) : (
                    <MoonIcon className="h-6 w-6" />
                  )}
                </button>
              )}
            </div>
            <nav className="space-y-2 p-4">
              {[
                { to: "/", label: "Home", icon: <HomeIcon className="h-6 w-6" /> },
                {
                  to: "/data-management",
                  label: "Data Management",
                  icon: <TableCellsIcon className="h-6 w-6" />,
                },
                {
                  to: "/insights",
                  label: "Insights",
                  icon: <ChartBarSquareIcon className="h-6 w-6" />,
                },
                {
                  to: "/geographic-data",
                  label: "Geographic Data",
                  icon: <GlobeAltIcon className="h-6 w-6" />,
                },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded transition-all duration-300 ${
                      isDarkMode
                        ? `hover:bg-[#64CCC5] hover:text-[#001C30] ${
                            isActive ? "bg-[#64CCC5] text-[#001C30]" : ""
                          }`
                        : `hover:bg-[#021526] hover:text-[#DAFFFB] ${
                            isActive ? "bg-[#021526] text-[#DAFFFB]" : ""
                          }`
                    }`
                  }
                >
                  {link.icon}
                  {!isCollapsed && <span className="ml-4">{link.label}</span>}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main
            className="flex-grow p-6 ml-16 transition-all duration-300"
            style={{
              marginLeft: isCollapsed ? "4rem" : "16rem", // Adjust spacing for content
            }}
          >
            <Routes>
              <Route path="/" element={<Home db={db} isDarkMode={isDarkMode} />} />
              <Route
                path="/data-management"
                element={<DataManagement db={db} isDarkMode={isDarkMode} />}
              />
              <Route path="/insights" element={<Insights db={db} isDarkMode={isDarkMode} />} />
              <Route
                path="/geographic-data"
                element={<GeographicData db={db} isDarkMode={isDarkMode} />}
              />
            </Routes>
          </main>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
