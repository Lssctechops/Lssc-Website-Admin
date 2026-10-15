import { NextResponse } from "next/server";

// Local dev stand-in for the real backend's /api/auth/profile.
// Returns a fake admin so the header and guards work without a backend.
// When the real backend is connected, point NEXT_PUBLIC_API_URL at it
// and this route is simply ignored.

const DEV_USER = {
  _id: "dev-admin",
  name: "Admin (Dev)",
  email: "admin@leatherssc.org",
  mobile: "9999999999",
  role: "admin",
  isApproved: true,
  isVerified: true,
};

export async function GET() {
  return NextResponse.json({ success: true, user: DEV_USER });
}

export async function PUT(request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    success: true,
    user: { ...DEV_USER, ...body },
  });
}