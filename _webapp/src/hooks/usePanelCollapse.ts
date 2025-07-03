"use client";

import { useState } from "react";

export type PanelId = 'table' | 'react-flow' | 'cytoscape' | 'd3' | 'tabbed-interface' | 'config-panel';

type PanelState = {
  [key in PanelId]: boolean;
};

const initialPanelState: PanelState = {
  table: false,
  'react-flow': false,
  cytoscape: false,
  d3: false,
  'tabbed-interface': false,
  'config-panel': false,
};

export function usePanelCollapse(initialState: PanelState = initialPanelState) {
  const [isCollapsed, setIsCollapsed] = useState<PanelState>(initialState);

  const handleToggle = (panelId: PanelId) => {
    setIsCollapsed(prevState => ({
      ...prevState,
      [panelId]: !prevState[panelId],
    }));
  };

  const getFlexValue = (panelId: PanelId) => {
    return isCollapsed[panelId] ? "0 0 50px" : "1";
  };

  return { isCollapsed, handleToggle, getFlexValue };
}