"use client";

import { useDataStore } from "../stores/dataStore";
import { useEffect } from "react";

export default function DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchAllData = useDataStore((state) => state.fetchAllData);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return <>{children}</>;
}
