"use client";

import { loginuser } from "@/redux/slice/auth-slice";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Otpverify = ({ mobile }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(mobile);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // useEffect(() => {
  //   const mobileParam = searchParams.get("mobile");
  //   if (mobileParam) {
  //     setPhoneNumber(mobileParam);
  //   }
  // }, [searchParams]);

  const handleLogin = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const res = await dispatch(
        loginuser({
          mobile: phoneNumber,
          otp,
        })
      ).unwrap();

      toast.success(res?.message || "Login successful!");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Enter OTP</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            value={phoneNumber}
            readOnly
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-800"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border rounded-lg"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full flex cursor-pointer justify-center items-center bg-blue-600 text-white font-semibold py-2 rounded-lg transition ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>
      </div>
    </div>
  );
};

export default Otpverify;
