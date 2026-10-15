import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const FILE = path.join(process.cwd(), "data", "governing-council.json");

async function readAll() {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeAll(list) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf-8");
}

// GET /api/governing-council
export async function GET() {
  const list = await readAll();
  list.sort((a, b) => (a.order || 0) - (b.order || 0));
  return NextResponse.json({ success: true, data: list });
}

// POST /api/governing-council
export async function POST(request) {
  const body = await request.json();

  if (!body?.name || !body?.designation) {
    return NextResponse.json(
      { success: false, message: "Name and designation are required." },
      { status: 400 }
    );
  }

  const list = await readAll();

  // only one chairman at a time
  if (body.isChairman) {
    list.forEach((m) => (m.isChairman = false));
  }

  const record = {
    _id: `gc-${Date.now()}`,
    name: body.name,
    designation: body.designation,
    company: body.company || "",
    image: body.image || "",
    order: body.order ?? list.length + 1,
    isActive: body.isActive ?? true,
    isChairman: body.isChairman ?? false,
  };

  list.push(record);
  await writeAll(list);

  return NextResponse.json(
    { success: true, message: "Member added", data: record },
    { status: 201 }
  );
}