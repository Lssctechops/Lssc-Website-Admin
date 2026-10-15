import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const FILE = path.join(process.cwd(), "data", "users.json");

async function readAll() {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf-8"));
  } catch {
    return [];
  }
}

async function writeAll(list) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf-8");
}

// DELETE /api/users/:id
export async function DELETE(request, { params }) {
  const { id } = await params;
  const list = await readAll();
  const next = list.filter((u) => (u.id || u._id) !== id);

  if (next.length === list.length) {
    return NextResponse.json(
      { success: false, message: "User not found." },
      { status: 404 }
    );
  }

  await writeAll(next);
  return NextResponse.json({ success: true, message: "User removed" });
}