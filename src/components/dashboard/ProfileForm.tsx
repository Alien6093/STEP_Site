"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Camera, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────────── */

export interface ProfileData {
  full_name:    string | null;
  email:        string;           // from auth.users — not editable
  phone:        string | null;
  linkedin_url: string | null;
  organisation: string | null;
  avatar_url:   string | null;
}

/* ─── Field component ─────────────────────────────────────────────────── */

function Field({
  id,
  label,
  type = "text",
  value,
  disabled = false,
  placeholder,
  onChange,
}: {
  id:           string;
  label:        string;
  type?:        string;
  value:        string;
  disabled?:    boolean;
  placeholder?: string;
  onChange?:    (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-slate-400 tracking-wide uppercase"
      >
        {label}
        {disabled && (
          <span className="ml-2 normal-case text-[10px] font-medium text-slate-600 bg-slate-700/50 px-1.5 py-0.5 rounded">
            Managed via Auth
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl text-sm border transition-all duration-150 outline-none
          ${disabled
            ? "bg-slate-800/30 border-slate-700/40 text-slate-500 cursor-not-allowed"
            : "bg-slate-800/60 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          }`}
      />
    </div>
  );
}

/* ─── Component ───────────────────────────────────────────────────────── */

export default function ProfileForm({
  initialData,
}: {
  initialData: ProfileData;
}) {
  const router  = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    fullName:     initialData.full_name    ?? "",
    phone:        initialData.phone        ?? "",
    linkedin:     initialData.linkedin_url ?? "",
    organization: initialData.organisation ?? "",
    avatarUrl:    initialData.avatar_url   ?? "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading,  setIsUploading]  = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [error,        setError]        = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Avatar upload ─────────────────────────────────────────────────── */
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const fileExt  = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      setForm((prev) => ({ ...prev, avatarUrl: publicUrl }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setIsUploading(false);
      /* Reset so the same file can be re-selected if needed */
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* Derive initials from name */
  const initials =
    form.fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const handleSave = async () => {
    setError("");
    setSaved(false);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/profile/update", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName:     form.fullName,
          phone:        form.phone,
          linkedinUrl:  form.linkedin,
          organisation: form.organization,
          avatarUrl:    form.avatarUrl || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Failed to save.");
      }

      setSaved(true);
      router.refresh();                        // revalidate Server Component data
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your personal information and how it appears on the platform.
        </p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 sm:p-8 space-y-8">

        {/* ── Avatar section ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative shrink-0">
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-slate-600
                          flex items-center justify-center text-white text-2xl font-bold
                          ring-4 ring-slate-700 select-none"
            >
              {form.avatarUrl || initialData.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.avatarUrl || initialData.avatar_url!}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-slate-900/60 opacity-0 hover:opacity-100
                            flex items-center justify-center transition-opacity duration-200 cursor-pointer">
              <Camera size={20} className="text-white" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-200">Profile Photo</p>
            <p className="text-xs text-slate-500 leading-relaxed">JPG, GIF or PNG. Max size of 2 MB.</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600
                         text-sm font-medium text-slate-300 hover:text-white hover:border-slate-500
                         hover:bg-slate-700/50 transition-all duration-150 self-start
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <><Loader2 size={14} className="animate-spin" /> Uploading…</>
              ) : (
                <><Camera size={14} /> Upload new photo</>
              )}
            </button>

            {/* Hidden file input — triggered by the button above */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <hr className="border-slate-700/60" />

        {/* ── Form grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field
            id="profile-fullname"
            label="Full Name"
            value={form.fullName}
            placeholder="Your full name"
            onChange={set("fullName")}
          />
          <Field
            id="profile-email"
            label="Email"
            type="email"
            value={initialData.email}
            disabled
          />
          <Field
            id="profile-phone"
            label="Phone Number"
            type="tel"
            value={form.phone}
            placeholder="+91 00000 00000"
            onChange={set("phone")}
          />
          <Field
            id="profile-linkedin"
            label="LinkedIn URL"
            type="url"
            value={form.linkedin}
            placeholder="https://linkedin.com/in/yourhandle"
            onChange={set("linkedin")}
          />
          <div className="sm:col-span-2">
            <Field
              id="profile-org"
              label="Organisation / Startup Name"
              value={form.organization}
              placeholder="Your organisation or startup"
              onChange={set("organization")}
            />
          </div>
        </div>

        {/* ── Action row ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">

          {/* Feedback messages */}
          <div aria-live="polite" className="flex items-center gap-2 text-sm min-h-[20px]">
            {saved && (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={15} /> Changes saved successfully!
              </span>
            )}
            {error && (
              <span className="flex items-center gap-1.5 text-red-400">
                <AlertCircle size={15} /> {error}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                       bg-cyan-500 text-slate-900 text-sm font-semibold
                       hover:bg-cyan-400 active:scale-95 transition-all duration-150
                       hover:shadow-lg hover:shadow-cyan-500/25 sm:ml-auto
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><Loader2 size={15} className="animate-spin" /> Saving…</>
            ) : (
              <><Save size={15} /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
