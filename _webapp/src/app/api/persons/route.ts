import { NextResponse } from 'next/server';

// Mock persons data for now - will be replaced with real database query
const mockPersons = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    department: 'Engineering',
    salary: 75000,
    active: true,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 28,
    department: 'Marketing',
    salary: 65000,
    active: true,
    created_at: '2024-02-20T14:45:00Z'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    age: 35,
    department: 'Sales',
    salary: 70000,
    active: false,
    created_at: '2024-03-10T09:15:00Z'
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    age: 32,
    department: 'Engineering',
    salary: 80000,
    active: true,
    created_at: '2024-04-05T16:20:00Z'
  }
];

export async function GET() {
  try {
    // TODO: Replace with actual database query
    // const persons = await db.query('SELECT * FROM persons');
    
    return NextResponse.json({
      success: true,
      data: mockPersons,
      count: mockPersons.length
    });
  } catch {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch persons data' 
      },
      { status: 500 }
    );
  }
} 