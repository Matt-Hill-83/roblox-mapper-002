'use client';

import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { buildColumns } from '@/components/Table001Basic/columns';
import { dataGridConfig } from '@/components/Table001Basic/config';
import { dataGridContainer, pageHeader, pageWrapper } from '@/components/Table001Basic/styles';
import { personService, type Person } from '@/services/personService';

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
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersons = async () => {
      console.log('Fetching persons data...');
      const response = await personService.getPersons();
      console.log('Persons API response:', response);
      
      if (response.success) {
        setPersons(response.data);
        console.log('Persons data loaded:', response.data);
      } else {
        console.error('Failed to fetch persons:', response.error);
      }
      setLoading(false);
    };

    fetchPersons();
  }, []);

  // Use persons data if available, otherwise fall back to mock data
  const data = persons.length > 0 ? persons : mockData;
  const columns = buildColumns({ rows: data as Record<string, unknown>[] });

  console.log('Current data being displayed:', data);

  if (loading) {
    return (
      <div style={pageWrapper}>
        <h1 style={pageHeader}>Data Grid</h1>
        <div style={dataGridContainer}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageWrapper}>
      <h1 style={pageHeader}>Data Grid</h1>
      <div style={dataGridContainer}>
        <DataGrid
          rows={data}
          columns={columns}
          {...dataGridConfig}
        />
      </div>
    </div>
  );
} 