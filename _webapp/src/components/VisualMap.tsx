"use client";

import { Box, Typography, Paper, Alert } from "@mui/material";

interface VisualMapProps {
  positioned: unknown[];
}

export default function VisualMap({ positioned }: VisualMapProps) {
  if (!positioned || positioned.length === 0) {
    return <Alert severity="warning">No positioned entities to display</Alert>;
  }

  // Create a simple 2D visualization using CSS positioning
  const bounds = positioned.reduce(
    (acc, entity: any) => ({
      minX: Math.min(acc.minX, entity.x),
      maxX: Math.max(acc.maxX, entity.x),
      minY: Math.min(acc.minY, entity.y),
      maxY: Math.max(acc.maxY, entity.y),
    }),
    { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  );

  const width = Math.max(bounds.maxX - bounds.minX, 400);
  const height = Math.max(bounds.maxY - bounds.minY, 300);
  const scale = Math.min(600 / width, 400 / height);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        2D Visual Representation
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          position: "relative",
          width: width * scale + 100,
          height: height * scale + 100,
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
        }}
      >
        {positioned.map((entity: any) => {
          const x = (entity.x - bounds.minX) * scale + 50;
          const y = (bounds.maxY - entity.y) * scale + 50; // Flip Y axis

          return (
            <Box
              key={entity.entityId}
              sx={{
                position: "absolute",
                left: x - 15,
                top: y - 15,
                width: 30,
                height: 30,
                borderRadius: entity.type === "Parent" ? "50%" : "4px",
                backgroundColor:
                  entity.level === 0
                    ? "#1976d2"
                    : entity.level === 1
                    ? "#42a5f5"
                    : "#90caf9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "10px",
                fontWeight: "bold",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.2)",
                  zIndex: 10,
                },
              }}
              title={`${entity.entityId} (${entity.type}) - Level ${entity.level}`}
            >
              {entity.entityId.replace("entity_", "")}
            </Box>
          );
        })}
      </Paper>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        🔵 Root Entities • 🔷 Level 1 • 🔸 Level 2+
      </Typography>
    </Box>
  );
}
