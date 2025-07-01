'use client';

import { DataGrid } from '@mui/x-data-grid';
import { buildColumns } from './columns';

const mockData = [
  {
    id: '1',
    type: 'invoice',
    customer: 'ACME Corp',
    amount: 1234.56,
    status: 'paid',
    created_at: '2025-01-01T08:00:00Z'
  },
  {
    id: '2', 
    type: 'user',
    name: 'John Doe',
    email: 'john@example.com',
    active: true,
    created_at: '2025-01-02T10:30:00Z'
  },
  {
    id: '3',
    type: 'product',
    name: 'Widget Pro',
    price: 99.99,
    category: 'Tools',
    in_stock: true
  }
];

export default function DataGridPage() {
  const columns = buildColumns({ rows: mockData });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Grid</h1>
      <div className="h-96 w-full">
        <DataGrid
          rows={mockData}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 }
            }
          }}
        />
      </div>
    </div>
  );
} 