import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Verify the caller is a logged-in admin using their bearer token.
async function requireAdmin(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return { ok: false, status: 401, message: "Not signed in." };

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return { ok: false, status: 401, message: "Invalid session." };
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false, status: 403, message: "Admins only." };
  }

  return { ok: true, user };
}

// GET /api/users  -> list all users
export async function GET(request) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json(
      { success: false, message: check.message },
      { status: check.status }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, name, email, mobile, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
}

// POST /api/users  -> create a new user
export async function POST(request) {
  const check = await requireAdmin(request);
  if (!check.ok) {
    return NextResponse.json(
      { success: false, message: check.message },
      { status: check.status }
    );
  }

  const body = await request.json();
  const { name, email, password, mobile, role } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { success: false, message: "Name, email, password and role are required." },
      { status: 400 }
    );
  }

  // 1. Create the auth user (auto-confirmed so they can log in immediately)
  const { data: created, error: createErr } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role },
    });

  if (createErr) {
    return NextResponse.json(
      { success: false, message: createErr.message },
      { status: 400 }
    );
  }

  // 2. Add their profile row
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: created.user.id,
      name,
      email,
      mobile: mobile || "",
      role,
    })
    .select()
    .single();

  if (profileErr) {
    // roll back the auth user if the profile insert failed
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json(
      { success: false, message: profileErr.message },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { success: true, message: "User created", data: profile },
    { status: 201 }
  );
}