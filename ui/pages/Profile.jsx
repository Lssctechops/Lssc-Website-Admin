"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

const Userprofile = () => {
  const [formData, setFormData] = useState(null);

  // Read the logged-in user from redux (set by useFetchUserOnLoad, local dev)
  const reduxUser = useSelector((state) => state.user?.user);

  useEffect(() => {
    // Fall back to the dev user stored at login if redux is empty
    let u = reduxUser;
    if (!u?.name && typeof window !== "undefined") {
      try {
        u = JSON.parse(localStorage.getItem("user")) || {};
      } catch {
        u = {};
      }
    }
    setFormData({
      name: u?.name || "Admin (Dev)",
      email: u?.email || "admin@local",
      role: u?.role || "superadmin",
      phoneNo: u?.mobile || "-",
      address: u?.address || "-",
      userImage: u?.userImage || "",
    });
  }, [reduxUser]);

  if (!formData) {
    return (
      <div className="mt-10 text-center text-gray-600">Loading profile...</div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center space-x-6">
        <div className="relative">
          <Image
            src={formData.userImage || "/icon/uploadImage.png"}
            alt="User"
            width={100}
            height={100}
            className="rounded-full border-2 border-gray-300 object-cover"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {formData.name}
          </h2>
          <p className="text-gray-500">{formData.email}</p>
          <span className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-800">
            {formData.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Phone Number" value={formData.phoneNo} />
        <Field label="Address" value={formData.address} />
        <Field label="Role" value={formData.role} />
      </div>
    </div>
  );
};

const Field = ({ label, value, color = null }) => {
  const textColor =
    color === null
      ? "text-gray-800"
      : color
      ? "text-green-600"
      : "text-red-600";
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <div className={`font-medium ${textColor}`}>{value}</div>
    </div>
  );
};

export default Userprofile;