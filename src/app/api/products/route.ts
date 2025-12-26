import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://devops-api-gateway-production.up.railway.app/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';

    console.log('Fetching products from:', `${API_BASE_URL}/products?page=${page}`);

    const response = await fetch(`${API_BASE_URL}/products?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return NextResponse.json(
        { error: `Failed to fetch products: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();

    console.log('Creating product at:', `${API_BASE_URL}/stock/products`);
    console.log('Product data (image truncated):', {
      ...productData,
      image: productData.image ? `${productData.image.substring(0, 50)}...` : null
    });

    const response = await fetch(`${API_BASE_URL}/stock/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();

    if (!response.ok) {
      console.error('Error response from backend:', responseText);
      
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText || 'Failed to create product' };
      }

      return NextResponse.json(
        { error: errorData.message || 'Failed to create product', details: responseText },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}