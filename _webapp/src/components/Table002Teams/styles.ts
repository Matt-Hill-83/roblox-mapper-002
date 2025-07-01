// DataGrid container styles
export const dataGridContainer = {
  height: '600px',
  width: '100%',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  overflow: 'hidden'
};

// Page wrapper styles
export const pageWrapper = {
  padding: '24px',
  minHeight: '100vh',
  backgroundColor: '#f9fafb'
};

// Header styles
export const pageHeader = {
  fontSize: '24px',
  fontWeight: '700',
  marginBottom: '24px',
  color: '#111827'
};

// Grid toolbar styles
export const gridToolbar = {
  padding: '12px 16px',
  borderBottom: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

// Filter button styles
export const filterButton = {
  padding: '8px 16px',
  backgroundColor: '#3b82f6',
  color: 'white',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '500',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

// Density selector styles
export const densitySelector = {
  padding: '4px 8px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
  backgroundColor: 'white'
};

// Stats card styles
export const statsCard = {
  backgroundColor: 'white',
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  marginBottom: '16px'
};

// Loading overlay styles
export const loadingOverlay = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

// Error message styles
export const errorMessage = {
  padding: '12px 16px',
  backgroundColor: '#fef2f2',
  borderLeft: '4px solid #ef4444',
  color: '#991b1b',
  fontSize: '14px',
  marginBottom: '16px'
}; 