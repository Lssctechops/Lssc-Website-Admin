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

// PUT /api/governing-council/:id
export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const list = await readAll();

  const index = list.findIndex((m) => m._id === id);
  if (index === -1) {
    return NextResponse.json(
      { success: false, message: "Member not found." },
      { status: 404 }
    );
  }

  // only one chairman at a time
  if (body.isChairman) {
    list.forEach((m) => (m.isChairman = false));
  }

  list[index] = {
    ...list[index],
    name: body.name ?? list[index].name,
    designation: body.designation ?? list[index].designation,
    company: body.company ?? list[index].company,
    image: body.image ?? list[index].image,
    order: body.order ?? list[index].order,
    isActive: body.isActive ?? list[index].isActive,
    isChairman: body.isChairman ?? false,
    _id: id,
  };

  await writeAll(list);

  return NextResponse.json({
    success: true,
    message: "Member updated",
    data: list[index],
  });
}

// DELETE /api/governing-council/:id
export async function DELETE(request, { params }) {
  const { id } = await params;
  const list = await readAll();

  const next = list.filter((m) => m._id !== id);
  if (next.length === list.length) {
    return NextResponse.json(
      { success: false, message: "Member not found." },
      { status: 404 }
    );
  }

  await writeAll(next);

  return NextResponse.json({ success: true, message: "Member removed" });
}