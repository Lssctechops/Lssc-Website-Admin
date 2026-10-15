import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const FILE = path.join(process.cwd(), "data", "team-members.json");

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

export async function GET() {
  const list = await readAll();
  list.sort((a, b) => (a.order || 0) - (b.order || 0));
  return NextResponse.json({ success: true, data: list });
}

export async function POST(request) {
  const body = await request.json();

  if (!body?.name || !body?.designation) {
    return NextResponse.json(
      { success: false, message: "Name and designation are required." },
      { status: 400 }
    );
  }

  const list = await readAll();

  if (body.isCeo) list.forEach((m) => (m.isCeo = false));

  const record = {
    _id: `tm-${Date.now()}`,
    name: body.name,
    designation: body.designation,
    email: body.email || "",
    mobile: body.mobile || "",
    linkedin: body.linkedin || "",
    image: body.image || "",
    order: body.order ?? list.length + 1,
    isActive: body.isActive ?? true,
    isCeo: body.isCeo ?? false,
  };

  list.push(record);
  await writeAll(list);

  return NextResponse.json(
    { success: true, message: "Member added", data: record },
    { status: 201 }
  );
}