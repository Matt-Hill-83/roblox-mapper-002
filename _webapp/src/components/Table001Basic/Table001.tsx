"use client";

import {
  dataGridContainer,
  pageHeader,
  pageWrapper,
} from "@/components/Table001Basic/styles";

import { DataGrid } from "@mui/x-data-grid";
import { buildColumns } from "@/components/Table001Basic/columns";
import { dataGridConfig } from "@/components/Table001Basic/config";
import { useDataStore } from "@/stores/dataStore";

export default function Table001() {
  const persons = useDataStore((state) => state.persons);
  const isLoading = useDataStore((state) => state.isLoading);
  const error = useDataStore((state) => state.error);

  console.log("Table001 - persons from zustand:", persons);
  console.log("Table001 - isLoading:", isLoading);
  console.log("Table001 - error:", error);

  const data = persons;
  const columns = buildColumns({
    rows: data as unknown as Record<string, unknown>[],
  });

  console.log("Current data being displayed:", data);
  console.log(
    "Generated columns:",
    columns.map((c) => c.field)
  );

  return (
    <div style={pageWrapper}>
      <h1 style={pageHeader}>Persons</h1>
      <div style={dataGridContainer}>
        <DataGrid rows={data} columns={columns} {...dataGridConfig} />
      </div>
    </div>
  );
}
