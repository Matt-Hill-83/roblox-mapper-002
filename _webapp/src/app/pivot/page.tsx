"use client";

// Import WebDataRocks styles and component
import "@webdatarocks/webdatarocks/webdatarocks.min.css";

import React, { useEffect, useRef } from "react";

import { useDataStore } from "@/stores/dataStore";

export default function PivotPage() {
  const persons = useDataStore((state) => state.persons);
  const isLoading = useDataStore((state) => state.isLoading);
  const error = useDataStore((state) => state.error);
  const fetchAllData = useDataStore((state) => state.fetchAllData);

  const pivotRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const webDataRocksInstance = useRef<any>(null);

  useEffect(() => {
    const loadWebDataRocks = async () => {
      try {
        console.log("Pivot - Loading WebDataRocks...");
        // Dynamic import to avoid SSR issues
        const WebDataRocks = (await import("@webdatarocks/webdatarocks"))
          .default;

        if (pivotRef.current && !webDataRocksInstance.current) {
          console.log("Pivot - Creating WebDataRocks instance");

          // Transform current data for initial load
          const transformedData =
            persons.length > 0
              ? persons.map((person) => ({
                  id: person.id,
                  name: person.name,
                  department: person.department || "Unknown",
                  age: person.age || 0,
                  salary: person.salary || 0,
                  active: person.active ? "Active" : "Inactive",
                  ageRange: getAgeRange(person.age || 0),
                  salaryRange: getSalaryRange(person.salary || 0),
                }))
              : [];

          webDataRocksInstance.current = new WebDataRocks({
            container: pivotRef.current,
            toolbar: true,
            height: 600,
            report: {
              dataSource: {
                data: transformedData,
              },
              slice:
                transformedData.length > 0
                  ? {
                      rows: [{ uniqueName: "department" }],
                      columns: [{ uniqueName: "[Measures]" }],
                      measures: [
                        { uniqueName: "salary", aggregation: "average" },
                        { uniqueName: "age", aggregation: "average" },
                        { uniqueName: "id", aggregation: "count" },
                      ],
                    }
                  : {},
            },
          });
          console.log(
            "Pivot - WebDataRocks instance created successfully with",
            transformedData.length,
            "records"
          );
        }
      } catch (error) {
        console.error("Error loading WebDataRocks:", error);
      }
    };

    loadWebDataRocks();

    // Fetch data when component mounts
    if (persons.length === 0) {
      console.log("Pivot - No persons data, triggering fetchAllData");
      fetchAllData();
    }

    return () => {
      if (webDataRocksInstance.current) {
        webDataRocksInstance.current.dispose();
        webDataRocksInstance.current = null;
      }
    };
  }, [persons]);

  const getAgeRange = (age: number) => {
    if (age < 25) return "Under 25";
    if (age < 30) return "25-29";
    if (age < 35) return "30-34";
    if (age < 40) return "35-39";
    return "40+";
  };

  const getSalaryRange = (salary: number) => {
    if (salary < 1000000) return "Under $1M";
    if (salary < 2000000) return "$1M-$2M";
    if (salary < 3000000) return "$2M-$3M";
    if (salary < 4000000) return "$3M-$4M";
    return "$4M+";
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Pivot Table</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Pivot Table</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-red-600">Error loading data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pivot Table - WebDataRocks</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <p className="text-gray-600 mb-2">
          Interactive pivot analysis with {persons.length} records
        </p>
        <button
          onClick={fetchAllData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Data
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div ref={pivotRef} style={{ width: "100%", height: "600px" }} />
      </div>
    </div>
  );
}
