import { DataGridProps } from '@mui/x-data-grid';

export const dataGridConfig: Partial<DataGridProps> = {
  // Pagination settings
  pageSizeOptions: [25, 50, 100, 200],
  initialState: {
    pagination: {
      paginationModel: { 
        pageSize: 25,
        page: 0
      }
    },
    // Default density
    density: 'compact',
    // Default filter state
    filter: {
      filterModel: {
        items: []
      }
    },
    // Default sorting
    sorting: {
      sortModel: []
    }
  },
  
  // Grid behavior
  checkboxSelection: true,
  disableRowSelectionOnClick: true,
  disableColumnMenu: false,
  
  // Performance settings
  rowBufferPx: 10,
  columnBufferPx: 2,
  
  // UI settings
  hideFooterSelectedRowCount: false,
  autoHeight: false,
};

export const gridDensityOptions = [
  { value: 'compact', label: 'Compact' },
  { value: 'standard', label: 'Standard' },
  { value: 'comfortable', label: 'Comfortable' }
] as const;

export const defaultPageSizes = [25, 50, 100, 200] as const; 