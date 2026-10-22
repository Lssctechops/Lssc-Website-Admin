"use client";

import { loginuser } from "@/redux/slice/auth-slice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function LoginPage() {
  const dispatch = useDispatch();

  const [formdata, setFormdata] = useState({ mobile: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rememberedLogin");
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormdata({ mobile: parsed.mobile || "", password: parsed.password || "" });
        setRemember(true);
      }
    } catch {}
  }, []);

  const handleChange = (e) => {
    setFormdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { mobile, password } = formdata;

    if (!mobile || !password) {
      toast.error("Please enter mobile number and password.");
      return;
    }
    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(loginuser({ mobile, password })).unwrap();

      if (remember) {
        localStorage.setItem("rememberedLogin", JSON.stringify({ mobile, password }));
      } else {
        localStorage.removeItem("rememberedLogin");
      }

      toast.success("Login successful");
      // hard redirect so the middleware sees the new token cookie
      window.location.href = "/";
    } catch (error) {
      const msg =
        typeof error === "string"
          ? error
          : error?.message || "Login failed. Check your mobile and password.";
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1c2555] via-[#2B3674] to-[#4318FF] px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl text-white backdrop-blur">
            <i className="ri-shield-keyhole-line" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="mt-1 text-sm text-white/60">Leather Sector Skill Council</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="flex items-center rounded-lg border border-gray-300 px-3 focus-within:border-[#2B3674] focus-within:ring-2 focus-within:ring-[#2B3674]/15">
                <span className="select-none pr-2 text-sm text-gray-500">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  name="mobile"
                  maxLength={10}
                  value={formdata.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="w-full px-1 py-2.5 text-sm outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="flex items-center rounded-lg border border-gray-300 px-3 focus-within:border-[#2B3674] focus-within:ring-2 focus-within:ring-[#2B3674]/15">
                <i className="ri-lock-2-line text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formdata.password}
                  onChange={handleChange}
                  placeholder="Enter password"
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
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2B3674] py-2.5 font-medium text-white transition-colors hover:bg-[#1f2957] disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-white/50">
          Leather Sector Skill Council · Admin
        </p>
      </div>
    </div>
  );
}