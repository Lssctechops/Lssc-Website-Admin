"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formdata, setFormdata] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rememberedLogin");
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormdata({ email: parsed.email || "", password: parsed.password || "" });
        setRemember(true);
      }
    } catch {}
  }, []);

  const handleChange = (e) => {
    setFormdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (remember) {
        localStorage.setItem("rememberedLogin", JSON.stringify(formdata));
      } else {
        localStorage.removeItem("rememberedLogin");
      }
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Admin (Dev)",
          email: formdata.email || "admin@local",
          role: "superadmin",
        })
      );
    } catch {}
    Cookies.set("token", "dev-token-123", { expires: 7, path: "/" });
    toast.success("Signed in (local)");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1c2555] via-[#2B3674] to-[#4318FF] px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl text-white backdrop-blur">
            <i className="ri-shield-keyhole-line" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="mt-1 text-sm text-white/60">Local development login</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <div className="flex items-center rounded-lg border border-gray-300 px-3 focus-within:border-[#2B3674] focus-within:ring-2 focus-within:ring-[#2B3674]/15">
                <i className="ri-mail-line text-gray-400" />
                <input
                  type="text"
                  name="email"
                  value={formdata.email}
                  onChange={handleChange}
                  placeholder="anything@local"
                  className="w-full px-2 py-2.5 text-sm outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <div className="flex items-center rounded-lg border border-gray-300 px-3 focus-within:border-[#2B3674] focus-within:ring-2 focus-within:ring-[#2B3674]/15">
                <i className="ri-lock-2-line text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formdata.password}
                  onChange={handleChange}
                  placeholder="anything"
                  className="w-full px-2 py-2.5 text-sm outline-none"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
                className="h-4 w-4 rounded border-gray-300 text-[#2B3674] focus:ring-[#2B3674]"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2B3674] py-2.5 font-medium text-white transition-colors hover:bg-[#1f2957]"
            >
              Login
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-white/50">
          Leather Sector Skill Council · Admin (local)
        </p>
      </div>
    </div>
  );
}