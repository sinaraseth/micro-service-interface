import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://devops-api-gateway-production.up.railway.app/api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { quantity } = await request.json();

    console.log('Removing stock for product:', id, 'Quantity:', quantity);

    const response = await fetch(`${API_BASE_URL}/stock/products/${id}/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error removing stock:', errorText);
      return NextResponse.json(
        { error: 'Failed to remove stock' },
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