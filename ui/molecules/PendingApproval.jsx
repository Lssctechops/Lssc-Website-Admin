"use client";

import Image from "next/image";
import Button from "../atoms/Button";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getallunapprovedassessors,
  updateunapprovedassessors,
  updateuserstatus,
} from "@/redux/slice/user-slice";
import toast from "react-hot-toast";

const PendingApproval = () => {
  const dispatch = useDispatch();
  const [approvals, setApprovals] = useState([]);
  console.log(approvals);
  const [selectedUsers, setSelectedUsers] = useState({});

  // ✅ Fetch unapproved users
  const fetchUnapproved = async () => {
    try {
      const res = await dispatch(getallunapprovedassessors()).unwrap();
      setApprovals(res?.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUnapproved();
  }, []);

  // ✅ Handle checkbox toggle
  const handleCheckboxChange = (id) => {
    setSelectedUsers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ Approve selected users
  const handleApprove = async () => {
    const selectedIds = Object.keys(selectedUsers).filter(
      (id) => selectedUsers[id]
    );

    if (selectedIds.length === 0) {
      toast.error("No users selected.");
      return;
    }

    try {
      for (let id of selectedIds) {
        await dispatch(
          updateunapprovedassessors({ id, isApproved: true })
        ).unwrap();
      }
      toast.success("Selected users approved.");
      fetchUnapproved(); // refresh the list
      setSelectedUsers({});
    } catch (err) {
      console.error("Approval error:", err);
      toast.error("Failed to approve users.");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white shadow rounded-xl">
      <h3 className="text-secondary font-bold text-2xl">Pending Approval</h3>

      <div className="space-y-6">
        {approvals.length > 0 ? (
          approvals.map((user) => {
            const { _id, name, createdAt } = user;
            const formattedTime = new Date(createdAt).toLocaleString();

            return (
              <div key={_id} className="flex justify-between items-center">
                <div className="flex gap-5 items-center">
                  <Image
                    className="w-16 h-16 rounded-full"
                    src={user?.avatar}
                    alt="user"
                    width={100}
                    height={100}
                  />
                  <div>
                    <h4 className="font-semibold text-lg">{name}</h4>
                    <p className="text-[#8A92A6]">{formattedTime}</p>
                  </div>
                </div>
                <input
                  className="transform scale-150"
                  type="checkbox"
                  checked={!!selectedUsers[_id]}
                  onChange={() => handleCheckboxChange(_id)}
                />
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No pending approvals.</p>
        )}
      </div>

      <Button
        label="Approve"
        style="bg-blue-500 text-white w-full"
        onClick={handleApprove}
      />
    </div>
  );
};

export default PendingApproval;
