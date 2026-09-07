import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

const STORAGE_KEY = "guests";

export async function GET() {
  const entries = (await kv.get(STORAGE_KEY)) || [];
  return NextResponse.json(entries);
}

export async function POST(request) {
  const body = await request.json();
  const { nama, noIdentitas, tipeLayanan, tujuan } = body || {};

  if (!nama?.trim() || !noIdentitas?.trim() || !tipeLayanan?.trim()) {
    return NextResponse.json(
      { error: "Nama, nomor identitas, dan tipe layanan wajib diisi" },
      { status: 400 }
    );
  }

  const entries = (await kv.get(STORAGE_KEY)) || [];

  const newEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nama: nama.trim(),
    noIdentitas: noIdentitas.trim(),
    tipeLayanan: tipeLayanan.trim(),
    tujuan: (tujuan || "").trim(),
    waktu: new Date().toISOString(),
  };

  const updated = [newEntry, ...entries];
  await kv.set(STORAGE_KEY, updated);

  return NextResponse.json(newEntry, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id wajib disertakan" }, { status: 400 });
  }

  const entries = (await kv.get(STORAGE_KEY)) || [];
  const updated = entries.filter((e) => e.id !== id);
  await kv.set(STORAGE_KEY, updated);

  return NextResponse.json({ ok: true });
}
