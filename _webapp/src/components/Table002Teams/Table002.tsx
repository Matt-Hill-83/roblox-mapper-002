'use client';

import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { buildColumns } from './columns';
import { dataGridConfig } from './config';
import { dataGridContainer, pageHeader } from './styles';
import { teamService, type Team } from '@/services/teamService';

const mockTeamData = [
  {
    id: 'mock-1',
    name: 'Mock FC',
    city: 'Mock City',
    country: 'Mock Country',
    league: 'Mock League',
    founded: 2000,
    stadium: 'Mock Stadium',
    capacity: 50000,
    coach: 'Mock Coach',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    recordType: 'team'
  }
];

export default function Table002() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      console.log('Fetching teams data...');
      const response = await teamService.getTeams();
      console.log('Teams API response:', response);
      
      if (response.success) {
        setTeams(response.data);
        console.log('Teams data loaded:', response.data);
        console.log('First team recordType:', response.data[0]?.recordType);
        console.log('All recordTypes:', response.data.map(t => t.recordType));
      } else {
        console.error('Failed to fetch teams:', response.error);
      }
      setLoading(false);
    };

    fetchTeams();
  }, []);

  // Use teams data if available, otherwise fall back to mock data
  const data = teams.length > 0 ? teams : mockTeamData;
  const columns = buildColumns({ rows: data as Record<string, unknown>[] });

  console.log('Current teams data being displayed:', data);
  console.log('Generated team columns:', columns.map(c => c.field));

  const table2Wrapper = {
    padding: '24px',
    backgroundColor: '#f9fafb'
  };

  
  return (
    <div style={table2Wrapper}>
      <h1 style={pageHeader}>Teams</h1>
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