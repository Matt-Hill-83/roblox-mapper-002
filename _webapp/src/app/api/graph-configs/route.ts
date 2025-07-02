import { NextRequest, NextResponse } from 'next/server';
import { getGraphConfigs, saveGraphConfig, toggleFavoriteGraphConfig, deleteGraphConfig, GraphConfig, TestDataConfig } from '../../../lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const configs = getGraphConfigs();
    
    return NextResponse.json({
      success: true,
      data: configs,
      count: configs.length
    });
  } catch (error) {
    console.error('Error fetching graph configurations:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch graph configurations',
      data: [],
      count: 0
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'save': {
        const { name, description, config } = data;
        
        if (!name || !description || !config) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields: name, description, config'
          }, { status: 400 });
        }

        const graphConfig: Omit<GraphConfig, 'created_at' | 'updated_at'> = {
          uuid: data.uuid || randomUUID(),
          name,
          description,
          config_data: JSON.stringify(config),
          is_favorite: data.is_favorite || false,
          is_system: data.is_system || false
        };

        const savedConfig = saveGraphConfig(graphConfig);
        
        return NextResponse.json({
          success: true,
          data: savedConfig
        });
      }

      case 'toggle_favorite': {
        const { uuid } = data;
        
        if (!uuid) {
          return NextResponse.json({
            success: false,
            error: 'Missing required field: uuid'
          }, { status: 400 });
        }

        const newFavoriteStatus = toggleFavoriteGraphConfig(uuid);
        
        return NextResponse.json({
          success: true,
          data: { uuid, is_favorite: newFavoriteStatus }
        });
      }

      case 'delete': {
        const { uuid } = data;
        
        if (!uuid) {
          return NextResponse.json({
            success: false,
            error: 'Missing required field: uuid'
          }, { status: 400 });
        }

        const deleted = deleteGraphConfig(uuid);
        
        if (!deleted) {
          return NextResponse.json({
            success: false,
            error: 'Configuration not found'
          }, { status: 404 });
        }
        
        return NextResponse.json({
          success: true,
          data: { uuid, deleted: true }
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: save, toggle_favorite, delete'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing graph configuration request:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}