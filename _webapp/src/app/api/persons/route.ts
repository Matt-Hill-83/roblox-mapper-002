import { NextResponse } from 'next/server';
import { getPersons } from '@/lib/db';

export async function GET() {
  try {
    console.log('API: Fetching persons from database...');
    const persons = getPersons();
    console.log(`API: Retrieved ${persons.length} persons from database`);
    
    return NextResponse.json({
      success: true,
      data: persons,
      count: persons.length
    });
  } catch (error) {
    console.error('API: Error fetching persons:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch persons data' 
      },
      { status: 500 }
    );
  }
} 