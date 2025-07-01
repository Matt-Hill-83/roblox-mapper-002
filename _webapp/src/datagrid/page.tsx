import Table001 from "@/components/Table001Basic/Table001";
import Table002 from "@/components/Table002Teams/Table002";

export default function DataGridPage() {
  const containerStyle = {
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
  };

  const table001Style = {
    height: "50%",
    overflow: "auto",
  };

  const table002Style = {
    height: "50%",
    overflow: "auto",
  };

  return (
    <div style={containerStyle}>
      <div style={table001Style}>
        <Table001 />
      </div>
      <div style={table002Style}>
        <Table002 />
      </div>
    </div>
  );
}
