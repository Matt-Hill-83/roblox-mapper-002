import { NextResponse } from 'next/server';

// Mock teams data
const mockTeams = [
  {
    id: '1',
    name: 'Manchester United',
    city: 'Manchester',
    country: 'England',
    league: 'Premier League',
    founded: 1878,
    stadium: 'Old Trafford',
    capacity: 74879,
    coach: 'Erik ten Hag',
    active: true,
    created_at: '2024-01-15T10:30:00Z',
    recordType: 'team'
  },
  {
    id: '2',
    name: 'Real Madrid',
    city: 'Madrid',
    country: 'Spain',
    league: 'La Liga',
    founded: 1902,
    stadium: 'Santiago Bernabéu',
    capacity: 81044,
    coach: 'Carlo Ancelotti',
    active: true,
    created_at: '2024-02-20T14:45:00Z',
    recordType: 'team'
  },
  {
    id: '3',
    name: 'FC Barcelona',
    city: 'Barcelona',
    country: 'Spain',
    league: 'La Liga',
    founded: 1899,
    stadium: 'Camp Nou',
    capacity: 99354,
    coach: 'Xavi Hernández',
    active: true,
    created_at: '2024-03-10T09:15:00Z',
    recordType: 'team'
  },
  {
    id: '4',
    name: 'Bayern Munich',
    city: 'Munich',
    country: 'Germany',
    league: 'Bundesliga',
    founded: 1900,
    stadium: 'Allianz Arena',
    capacity: 75000,
    coach: 'Thomas Tuchel',
    active: true,
    created_at: '2024-04-05T16:20:00Z',
    recordType: 'team'
  },
  {
    id: '5',
    name: 'AC Milan',
    city: 'Milan',
    country: 'Italy',
    league: 'Serie A',
    founded: 1899,
    stadium: 'San Siro',
    capacity: 75923,
    coach: 'Stefano Pioli',
    active: true,
    created_at: '2024-05-12T11:30:00Z',
    recordType: 'team'
  }
];

export async function GET() {
  try {
    console.log('API: Returning teams dummy data...');
    console.log(`API: Retrieved ${mockTeams.length} teams`);
    
    return NextResponse.json({
      success: true,
      data: mockTeams,
      count: mockTeams.length
    });
  } catch (error) {
    console.error('API: Error fetching teams:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch teams data' 
      },
      { status: 500 }
    );
  }
} 