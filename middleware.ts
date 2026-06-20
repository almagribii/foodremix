import { NextRequest, NextResponse } from "next/server";

// TEMPORARILY DISABLED MIDDLEWARE FOR DEBUGGING
// Auth is handled client-side with AuthProvider context + localStorage
export function middleware(request: NextRequest) {
  // Allow all requests through for now
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
