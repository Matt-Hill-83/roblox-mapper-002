'use client';

import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { buildColumns } from '@/components/Table001Basic/columns';
import { dataGridConfig } from '@/components/Table001Basic/config';
import { dataGridContainer, pageHeader, pageWrapper } from '@/components/Table001Basic/styles';
import { personService, type Person } from '@/services/personService';



export default function Table001() {
  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    const fetchPersons = async () => {
      console.log('Fetching persons data...');
      const response = await personService.getPersons();
      console.log('Persons API response:', response);
      
      if (response.success) {
        setPersons(response.data);
        console.log('Persons data loaded:', response.data);
        console.log('First person recordType:', response.data[0]?.recordType);
        console.log('All recordTypes:', response.data.map(p => p.recordType));
      } else {
        console.error('Failed to fetch persons:', response.error);
      }
    };

    fetchPersons();
  }, []);

  // Use persons data if available, otherwise fall back to mock data
  const data = persons.length > 0 ? persons : []
  const columns = buildColumns({ rows: data as unknown as Record<string, unknown>[] });

  console.log('Current data being displayed:', data);
  console.log('Generated columns:', columns.map(c => c.field));


  return (
    <div style={pageWrapper}>
      <h1 style={pageHeader}>Persons</h1>
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