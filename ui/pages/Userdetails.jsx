"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getuserbyId, updatestatusofuser } from "@/redux/slice/user-slice";
import Image from "next/image";
import toast from "react-hot-toast";

const Userdetails = ({ userId }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user function reusable
  const fetchUser = async () => {
    if (!userId) return;
    try {
      const res = await dispatch(getuserbyId(userId)).unwrap();
      setUser(res?.data || null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId, dispatch]);

  const handleApprovalToggle = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await dispatch(
        updatestatusofuser({
          id: user._id,
          isApproved: !(user.isApproved && user.isVerified),
          isVerified: !(user.isApproved && user.isVerified),
        })
      ).unwrap();

      toast.success(
        !(user.isApproved && user.isVerified)
          ? "User Approved & Verified"
          : "User Unapproved"
      );

      // Re-fetch updated user data immediately after update
      await fetchUser();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading user...</p>;

  const bothTrue = user.isApproved && user.isVerified;

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex gap-4 items-center">
          <Image
            src={user.aadhaar || "/img/user.svg"}
            alt={user.name}
            width={60}
            height={60}
            className="rounded-full border"
          />
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <p
              className={`text-sm font-medium ${
                bothTrue ? "text-green-600" : "text-red-600"
              }`}
            >
              {bothTrue ? "Approved & Verified" : "Not Approved"}
            </p>
          </div>
        </div>
      </div>

      {/* Full Details */}
      <div className="px-4 pb-4 space-y-2 border-t">
        <p>
          <strong>Mobile:</strong> {user.mobile}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Status:</strong> {user.status}
        </p>
        <p>
          <strong>Category:</strong> {user.category}
        </p>
        <p>
          <strong>Gender:</strong> {user.gender}
        </p>
        <p>
          <strong>Date of Birth:</strong>{" "}
          {new Date(user.dateOfBirth).toLocaleDateString()}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(user.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(user.endDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Specialization:</strong> {user.specialization}
        </p>
        <p>
          <strong>Blocked:</strong> {user.isBlocked ? "Yes" : "No"}
        </p>

        {/* Documents */}
        <div className="flex gap-4 mt-4">
          <a
            href={user.aadhaar || "/img/user.svg"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <Image
              src={user.aadhaar || "/img/user.svg"}
              alt="Aadhaar"
              width={80}
              height={60}
              className="rounded border hover:scale-105 transition"
            />
            <p className="text-xs text-center mt-1">Aadhaar</p>
          </a>
          <a
            href={user.pan || "/img/user.svg"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <Image
              src={user.pan || "/img/user.svg"}
              alt="PAN"
              width={80}
              height={60}
              className="rounded border hover:scale-105 transition"
            />
            <p className="text-xs text-center mt-1">PAN</p>
          </a>
          <a
            href={user.bank || "/img/user.svg"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <Image
              src={user.bank || "/img/user.svg"}
              alt="Bank"
              width={80}
              height={60}
              className="rounded border hover:scale-105 transition"
            />
            <p className="text-xs text-center mt-1">Bank</p>
          </a>
        </div>

        {/* Approve / Unapprove button */}
        <button
          onClick={handleApprovalToggle}
          disabled={loading}
          className={`mt-4 w-full cursor-pointer py-2 rounded text-white ${
            bothTrue
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Processing..." : bothTrue ? "Unapprove" : "Approve"}
        </button>
      </div>
    </div>
  );
};

export default Userdetails;
