"use client";

import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getallassessors } from "@/redux/slice/user-slice";
import Pagination from "../common/Pagination";

const AssessorDirectory = ({ page }) => {
  const dispatch = useDispatch();
  const [assessors, setAssessors] = useState([]);
  const [count, setCount] = useState("0");
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assessors.length > 0 ? (
                assessors.map((assessor) => (
                  <tr key={assessor._id}>
                    <td className="flex gap-2 justify-center items-center">
                      {assessor.name}
                    </td>
                    <td>{assessor.mobile}</td>
                    <td>{assessor.role}</td>
                    <td>
                      <span
                        className={`${
                          assessor.status === "offline"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {assessor.status}
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
  );
};

export default AssessorDirectory;
