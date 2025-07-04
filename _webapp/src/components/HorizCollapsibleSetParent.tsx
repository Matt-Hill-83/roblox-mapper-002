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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
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
          });
        }
        return child;
      })}
    </Box>
  );
}
