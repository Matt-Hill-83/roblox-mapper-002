import { useState, ReactNode } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Alert,
} from "@mui/material";
import { Minimize, Maximize } from "@mui/icons-material";
import { HierarchyResult } from "../../app/(pages)/hierarchy-tester/page";

interface GraphContainerProps {
  title: string;
  children: ReactNode;
  result: HierarchyResult | null;
  isCollapsed: boolean;
  onToggle: () => void;
  flex: string;
}

export default function GraphContainer({
  title,
  children,
  result,
  isCollapsed,
  onToggle,
  flex,
}: GraphContainerProps) {
  if (!result) {
    return (
      <Alert severity="info">No data available for graph visualization</Alert>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: "100%",
        flex: flex,
        display: "flex",
        flexDirection: "column",
        transition: "flex 0.3s ease-in-out",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <IconButton
        onClick={onToggle}
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 1000,
          backgroundColor: "white",
          border: "1px solid #ccc",
          "&:hover": { backgroundColor: "#f5f5f5" },
        }}
        size="small"
      >
        {isCollapsed ? <Maximize /> : <Minimize />}
      </IconButton>
      {!isCollapsed && (
        <>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textTransform: "capitalize", ml: 5 }}
          >
            {title}
          </Typography>
          <Box sx={{ flex: 1, minHeight: 0, width: "100%", height: "100%" }}>
            {children}
          </Box>
        </>
      )}
    </Paper>
  );
}
