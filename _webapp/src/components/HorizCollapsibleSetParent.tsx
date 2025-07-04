import React, { useState } from 'react';
import { Box } from '@mui/material';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HorizCollapsibleSetChild from './HorizCollapsibleSetChild';


interface HorizCollapsibleSetParentProps {
  children: React.ReactNode;
  initialCollapsedState?: { [key: string]: boolean };
}

export default function HorizCollapsibleSetParent({
  children,
  initialCollapsedState = {},
}: HorizCollapsibleSetParentProps) {
  const [collapsedState, setCollapsedState] = useState<{ [key: string]: boolean }>(initialCollapsedState);

  const handleToggle = (id: string) => {
    setCollapsedState((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const getFlexValues = () => {
    const childrenArray = React.Children.toArray(children);
    const numChildren = childrenArray.length;
    const numCollapsed = Object.values(collapsedState).filter(Boolean).length;
    const numExpanded = numChildren - numCollapsed;

    const collapsedWidth = 50; // px
    const totalCollapsedWidth = numCollapsed * collapsedWidth;

    // Calculate remaining flexible space
    // This assumes the parent container has a defined width (e.g., 100% or fixed px)
    // For simplicity, we'll distribute remaining flex units.
    // A more robust solution might involve actual pixel calculations if parent width is known.
    const totalFlexUnits = 100; // Arbitrary total flex units for distribution
    const flexPerExpanded = numExpanded > 0 ? (totalFlexUnits - totalCollapsedWidth) / numExpanded : 0;

    const flexValues: { [key: string]: string } = {};
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props.id) {
        const id = child.props.id;
        if (collapsedState[id]) {
          flexValues[id] = `${collapsedWidth}px`;
        } else {
          flexValues[id] = `${flexPerExpanded}fr`; // Using 'fr' for flexible units
        }
      }
    });
    return flexValues;
  };

  const flexValues = getFlexValues();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        gap: 2,
        flexWrap: 'nowrap',
      }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.props.id) {
          const id = child.props.id;
          return React.cloneElement(child, {
            isCollapsed: collapsedState[id] || false,
            onToggle: handleToggle,
            flex: flexValues[id] || '1fr', // Default to 1fr if not calculated
          });
        }
        return child;
      })}
    </Box>
  );
}
