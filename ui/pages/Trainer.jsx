"use client";
import data from "@/public/db/data.json";
import StatsCard from "../molecules/StatsCard";
import Button from "../atoms/Button";
import Link from "next/link";
import { useEffect, useState } from "react";
import OverlayModal from "../common/OverlayModal";
import AddTrainer from "../molecules/AddTrainer";
import { useDispatch } from "react-redux";
import { getalltrainers } from "@/redux/slice/user-slice";
import Pagination from "../common/Pagination";
import { getallstatscard } from "@/redux/slice/trainerdashboard-slice";
import PendingApprovalTrainers from "../molecules/PendingApprovalTrainers";

const Trainer = ({ page }) => {
  const [isTrainer, setIsTrainer] = useState(false);
  const [trainers, setTrainers] = useState([]);
  console.log(trainers);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const itemsPerPage = 3;
  const dispatch = useDispatch();
  const [Value, setValue] = useState("");
  const getAllTrainer = async () => {
    const res = await dispatch(getalltrainers({ filter: { limit: 3, page } }));
    setCount(res?.payload?.count);
    if (res?.payload?.data) {
      setTrainers(res?.payload?.data);
    }
  };

  useEffect(() => {
    getAllTrainer();
  }, [dispatch, page]);
  const allcarddata = async () => {
    let res = await dispatch(getallstatscard());
    console.log(res?.payload);
    if (res) {
      setValue(res?.payload);
    }
  };

  useEffect(() => {
    allcarddata();
  }, [dispatch]);
  const trainerstat = [
    {
      title: "total trainers",
      icon: "/icon/users.png",
      count: Value?.totalTrainers,
      growth: "8.5",
      timeline: "yesterday",
    },
    {
      title: "total batch",
      icon: "/icon/product.png",
      count: Value?.totalBatches,
      growth: "1.3",
      timeline: "yesterday",
    },
    {
      title: "total assessments",
      icon: "/icon/grow.png",
      count: Value?.totalAssessments,
      growth: "1.3",
      timeline: "yesterday",
    },
    // {
    //   title: "pending approval",
    //   icon: "/icon/watch.png",
    //   count: Value?.pendingApprovals,
    //   growth: "1.8",
    //   timeline: "yesterday",
    // },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-secondary font-bold text-3xl">Trainer Management</h2>

      <div className="p-6 rounded-xl space-y-4 bg-white shadow">
        <h3 className="text-secondary font-bold text-2xl">Quick Action</h3>
        <div className="flex flex-col gap-4 lg:flex-row justify-between">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
            <Link className="w-full" href={"/trainer/report"}>
              <Button
                label="View Reports"
                icon="ri-arrow-right-up-line"
                style="bg-[#B8FFF4] text-[#00B69B] w-full"
              />
            </Link>
            {/* <Link className="w-full" href={"/trainer/notification"}>
              <Button
                label="Send Notification"
                icon="ri-notification-3-line"
                style="bg-[#FFE6B8] text-[#A36A00] w-full"
              />
            </Link> */}
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
            <Button
              onClick={() => setIsTrainer(true)}
              label="Add Trainers"
              icon="ri-add-fill"
              style="bg-blue-500 text-white w-full"
            />
            {/* <Button
              label="Export Data"
              icon="ri-import-line"
              style="bg-blue-500 text-white w-full"
            /> */}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {trainerstat?.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
      {/* <PendingApprovalTrainers /> */}

      <div className="rounded-xl space-y-4 bg-white shadow">
        <div className="px-4 pt-6 flex justify-between">
          <h3 className="text-secondary font-bold text-2xl">
            Trainer Directory
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-1/4 text-left px-4 py-3 border border-gray-200">
                  Trainer Name
                </th>
                <th className="w-1/4 text-left px-4 py-3 border border-gray-200">
                  Mobile No
                </th>
                <th className="w-1/4 text-left px-4 py-3 border border-gray-200">
                  Role
                </th>
                <th className="w-1/4 text-left px-4 py-3 border border-gray-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer) => (
                <tr
                  key={trainer._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 border text-left border-gray-200">
                    <Link
                      href={`/trainer/userdetails/${trainer._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {trainer?.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 border text-left border-gray-200">
                    {trainer?.mobile}
                  </td>
                  <td className="px-4 py-3 border text-left border-gray-200 capitalize">
                    {trainer?.role}
                  </td>
                  <td className="text-left">
                    <span
                      className={`font-medium ${
                        trainer.status === "inactive"
                          ? "text-gray-500"
                          : trainer.status === "active"
                          ? "text-blue-600"
                          : trainer.isVerified && trainer.isApproved
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {trainer.status === "active"
                        ? "Active"
                        : trainer.status === "inactive"
                        ? "Inactive"
                        : trainer.isVerified && trainer.isApproved
                        ? "Verified"
                        : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination pageSize={3} total={count} />

      {isTrainer && (
        <OverlayModal
          content={
            <AddTrainer
              onClose={() => setIsTrainer(false)}
              refreshTrainerList={getAllTrainer}
            />
          }
        />
      )}
    </section>
  );
};

export default Trainer;
