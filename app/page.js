"use client";

import { useState, useEffect } from "react";

const TIPE_LAYANAN = [
  "Pertemuan Tatap Muka (Dengan Perjanjian)",
  "Saksi",
  "Mengantarkan Surat",
  "Tamu Mengunjungi Rutan Kejaksaan (menemui tahanan)",
];

function formatWaktu(iso) {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    noIdentitas: "",
    tipeLayanan: "",
    tujuan: "",
  });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    setLoading(true);
    try {
      const res = await fetch("/api/tamu");
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (e) {
      setNotice("Gagal memuat data. Coba muat ulang halaman.");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  function validate() {
    const er = {};
    if (!form.nama.trim()) er.nama = "Nama wajib diisi";
    if (!form.noIdentitas.trim()) er.noIdentitas = "Nomor identitas wajib diisi";
    if (!form.tipeLayanan) er.tipeLayanan = "Pilih tipe layanan";
    setErrors(er);
    return Object.keys(er).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setNotice("");
    try {
      const res = await fetch("/api/tamu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setNotice(data.error || "Gagal menyimpan data.");
        return;
      }

      const newEntry = await res.json();
      setEntries((prev) => [newEntry, ...prev]);
      setForm({ nama: "", noIdentitas: "", tipeLayanan: "", tujuan: "" });
    } catch (e) {
      setNotice("Gagal menyimpan data. Periksa koneksi lalu coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const prev = entries;
    setEntries((cur) => cur.filter((en) => en.id !== id));
    try {
      const res = await fetch(`/api/tamu?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("gagal hapus");
    } catch (e) {
      setEntries(prev);
      setNotice("Gagal menghapus data.");
    }
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          background: "#16233A",
          borderBottom: "3px solid #A9832F",
          padding: "28px 24px",
        }}
      >
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 26,
              fontWeight: 600,
              color: "#F5F2EA",
              letterSpacing: 0.2,
            }}
          >
            Buku Tamu — Kejaksaan Negeri Banyuasin
          </h1>
          <p style={{ margin: "6px 0 0", color: "#A9B4C2", fontSize: 14 }}>
            Pencatatan kunjungan tamu secara digital
          </p>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "32px 24px 64px",
          display:
