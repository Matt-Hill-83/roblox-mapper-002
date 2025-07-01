"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { useDataStore } from "@/stores/dataStore";
import { useMemo } from "react";

interface PivotData {
  id: number;
  department: string;
  count: number;
  avgAge: number;
  avgSalary: number;
  activeCount: number;
}

export default function PivotPage() {
  const persons = useDataStore((state) => state.persons);
  const isLoading = useDataStore((state) => state.isLoading);
  const error = useDataStore((state) => state.error);

  console.log("PivotPage - persons from zustand:", persons);
  console.log("PivotPage - isLoading:", isLoading);
  console.log("PivotPage - error:", error);

  const pivotData: PivotData[] = useMemo(() => {
    if (!persons.length) return [];

    // Group by department and calculate aggregated data
    const grouped = persons.reduce(
      (acc, person) => {
        const department = person.department || "Unknown";

        if (!acc[department]) {
          acc[department] = {
            department,
            count: 0,
            totalAge: 0,
            totalSalary: 0,
            activeCount: 0,
          };
        }

        acc[department].count += 1;
        acc[department].totalAge += person.age || 0;
        acc[department].totalSalary += person.salary || 0;
        if (person.active) {
          acc[department].activeCount += 1;
        }

        return acc;
      },
      {} as Record<
        string,
        {
          department: string;
          count: number;
          totalAge: number;
          totalSalary: number;
          activeCount: number;
        }
      >
    );

    // Convert to array with calculated averages
    return Object.values(grouped).map((group, index) => ({
      id: index + 1,
      department: group.department,
      count: group.count,
      avgAge: Math.round(group.totalAge / group.count),
      avgSalary: Math.round(group.totalSalary / group.count),
      activeCount: group.activeCount,
    }));
  }, [persons]);

  const columns: GridColDef[] = [
    {
      field: "department",
      headerName: "Department",
      width: 150,
      sortable: true,
    },
    {
      field: "count",
      headerName: "Count",
      width: 100,
      type: "number",
      sortable: true,
    },
    {
      field: "avgAge",
      headerName: "Avg Age",
      width: 100,
      type: "number",
      sortable: true,
    },
    {
      field: "avgSalary",
      headerName: "Avg Salary",
      width: 120,
      type: "number",
      sortable: true,
      valueFormatter: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
    {
      field: "activeCount",
      headerName: "Active Employees",
      width: 150,
      type: "number",
      sortable: true,
    },
  ];

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
      <h1 className="text-2xl font-bold mb-6">
        Pivot Table - Persons Data Analysis
      </h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-600 mb-4">
          Data aggregated by department showing count, average age, average
          salary, and active employee count.
        </p>
        {pivotData.length > 0 ? (
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={pivotData}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              disableRowSelectionOnClick
            />
          </div>
        ) : (
          <p className="text-gray-600">
            No persons data available for pivot analysis
          </p>
        )}
      </div>
    </div>
  );
}
