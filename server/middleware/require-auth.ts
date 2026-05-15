/**
 * Authentication middleware
 * Ensures user is authenticated before accessing protected routes
 */

import { NextRequest, NextResponse } from "next/server";

export async function requireAuth(request: NextRequest) {
  // TODO: Implement authentication check
  // 1. Extract token from headers/cookies
  // 2. Verify token
  // 3. Attach user to request
  // 4. Return 401 if not authenticated
  
  const token = request.headers.get("authorization");
  
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  return null; // Continue to route handler
}
