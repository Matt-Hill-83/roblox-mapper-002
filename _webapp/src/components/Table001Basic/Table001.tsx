'use client';

import { dataGridContainer, pageHeader, pageWrapper } from '@/components/Table001Basic/styles';

import { DataGrid } from '@mui/x-data-grid';
import { buildColumns } from '@/components/Table001Basic/columns';
import { dataGridConfig } from '@/components/Table001Basic/config';

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

export default function Table001() {
  const columns = buildColumns({ rows: mockData });

  return (
    <div style={pageWrapper}>
      <h1 style={pageHeader}>Data Grid</h1>
      <div style={dataGridContainer}>
        <DataGrid
          rows={mockData}
          columns={columns}
          {...dataGridConfig}
        />
      </div>
    </div>
  );
} 