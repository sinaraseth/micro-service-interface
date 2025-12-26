import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://devops-api-gateway-production.up.railway.app/api';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    console.log('Removing stock for product:', params.id, body);

    const response = await fetch(`${API_BASE_URL}/stock/${params.id}/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error removing stock:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Failed to remove stock' };
      }

      return NextResponse.json(
        { error: errorData.message || 'Failed to remove stock' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}