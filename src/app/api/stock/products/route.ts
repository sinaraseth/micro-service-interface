import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://devops-api-gateway-production.up.railway.app/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/stock/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || "Failed to create inventory" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
