/**
 * Admin authorization middleware
 * Ensures user has admin role before accessing admin routes
 */

import { NextRequest, NextResponse } from "next/server";

export async function requireAdmin(request: NextRequest) {
  // TODO: Implement admin check
  // 1. Check if user is authenticated (call requireAuth)
  // 2. Check if user has ADMIN role
  // 3. Return 403 if not admin
  
  const token = request.headers.get("authorization");
  
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // TODO: Verify admin role
  
  return null; // Continue to route handler
}
