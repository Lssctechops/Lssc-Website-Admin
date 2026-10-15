"use client";
import Button from "../atoms/Button";
import AssessorDirectory from "../molecules/AssessorDirectory";
import AssessorStat from "../molecules/AssessorStat";
import data from "@/public/db/data.json";
import PendingApproval from "../molecules/PendingApproval";
import RecentReports from "../molecules/RecentReports";
import { useEffect, useState } from "react";
import OverlayModal from "../common/OverlayModal";
import AddAssessor from "../molecules/AddAssessor";
import Link from "next/link";
import { getallassessors } from "@/redux/slice/user-slice";
import { useDispatch } from "react-redux";
import { getallstats } from "@/redux/slice/assessordashboard-slice";
import Pagination from "../common/Pagination";

const Assessor = ({ page }) => {
  const [isAssessor, setIsAssessor] = useState(false);
  // let dispatch = useDispatch();
  const [Value, setValue] = useState("");
  const dispatch = useDispatch();
  const [assessors, setAssessors] = useState([]);
  const [count, setCount] = useState("0");

  const allcarddata = async () => {
    let res = await dispatch(getallstats());
    console.log(res?.payload);
    if (res) {
      setValue(res?.payload);
    }
  };

  useEffect(() => {
    allcarddata();
  }, [dispatch]);
  const assessorstat = [
    {
      img: "/icon/assessor/user.svg",
      title: "Active Assessors",
      count: Value?.activeAssessors,
    },
    {
      img: "/icon/assessor/note.svg",
      title: "Pending Assignments",
      count: Value?.pendingAssignments,
    },
    {
      img: "/icon/assessor/file.svg",
      title: "Reports Under Review",
      count: Value?.reportsUnderReview,
    },
    {
      img: "/icon/assessor/refresh.svg",
      title: "Approval Pending",
      count: Value?.approvalPending,
    },
  ];

  // console.log(count);

  const fetchAssessors = async (page) => {
    const res = await dispatch(getallassessors({ filter: { limit: 3, page } }));
    setCount(res.payload.count);
    if (res?.payload && res?.payload?.data) {
      setAssessors(res?.payload?.data);
    }
  };

  useEffect(() => {
    fetchAssessors(page);
  }, [dispatch, page]);

  return (
    <section className="space-y-6">
      <h2 className="text-secondary font-bold text-3xl">Assessor Management</h2>
      {/* <div className=" grid lg:grid-cols-4 gap-6">
        {assessorstat?.map((stat, i) => (
          <AssessorStat key={i} {...stat} />
        ))}
      </div> */}
      <div className="flex flex-col lg:flex-row gap-3">
        <Button
          className="cursor-pointerr"
          onClick={() => setIsAssessor(true)}
          label={"Add New Assessor "}
          style={"bg-blue-500 text-white"}
          icon={"ri-add-fill"}
        />
        {/* <Link href="/assessor/notification">
          <Button
            className="cursor-pointerr"
            label={"Notification"}
            style={"border border-[#808080] text-[#808080]"}
            icon={"ri-notification-3-line w-full"}
          />
        </Link> */}

        {/* <Button
          className="cursor-pointerr"
          label={"Export Data "}
          style={"border border-[#808080] text-[#808080]"}
          icon={"ri-export-line"}
        /> */}
        <Link href="/assessor/report">
          <Button
            label="View Reports"
            icon="ri-arrow-right-up-line"
            style="bg-[#B8FFF4] text-[#00B69B] w-full"
          />
        </Link>
      </div>

      <div className="">
        <RecentReports />
        {/* <PendingApproval /> */}
      </div>

      <div className="p-6 space-y-5 bg-white shadow rounded-xl">
        {/* {page} */}
        <div className="flex justify-between">
          <h3 className="text-secondary font-bold text-2xl">
            Assessor Directory
          </h3>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1000px] lg:min-w-full">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Trainer Name</th>
                  <th>Mobile No</th>
                  <th>Role</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {assessors.length > 0 ? (
                  assessors.map((assessor) => (
                    <tr key={assessor._id}>
                      {/* <td className="flex gap-2 justify-center items-center">
                        {assessor.name}
                      </td> */}
                      <Link
                        href={`/assessor/Userdetails/${assessor._id}`}
                        className="text-blue-600 hover:underline flex gap-2 justify-center items-center"
                      >
                        {assessor?.name}
                      </Link>
                      <td>{assessor.mobile}</td>
                      <td>{assessor.role}</td>
                      <td className="text-left">
                        <span
                          className={`font-medium ${
                            assessor.status === "inactive"
                              ? "text-gray-500"
                              : assessor.status === "active"
                              ? "text-blue-600"
                              : assessor.isVerified && assessor.isApproved
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {assessor.status === "active"
                            ? "Active"
                            : assessor.status === "inactive"
                            ? "Inactive"
                            : assessor.isVerified && assessor.isApproved
                            ? "Verified"
                            : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No Assessors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination pageSize={3} total={count} />
          </div>
        </div>
      </div>
      {isAssessor && (
        <OverlayModal
          content={<AddAssessor onClose={() => setIsAssessor(false)} />}
        />
      )}
    </section>
  );
};

export default Assessor;
