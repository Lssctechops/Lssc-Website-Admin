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

  if (body.isCeo) list.forEach((m) => (m.isCeo = false));

  list[index] = {
    ...list[index],
    name: body.name ?? list[index].name,
    designation: body.designation ?? list[index].designation,
    email: body.email ?? list[index].email,
    mobile: body.mobile ?? list[index].mobile,
    linkedin: body.linkedin ?? list[index].linkedin,
    image: body.image ?? list[index].image,
    order: body.order ?? list[index].order,
    isActive: body.isActive ?? list[index].isActive,
    isCeo: body.isCeo ?? false,
    _id: id,
  };

  await writeAll(list);

  return NextResponse.json({
    success: true,
    message: "Member updated",
    data: list[index],
  });
}

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