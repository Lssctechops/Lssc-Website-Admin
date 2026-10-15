"use client";

import { getallassesorreports } from "@/redux/slice/reports-slice";
import { Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RecentReport = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]); // initialize as empty array
  console.log(data);
  const trainerReportState = useSelector((state) => state.trainerreport);

  const assesor = async () => {
    let res = await dispatch(getallassesorreports());
    console.log(res);
  };

  // fetch data on mount
  useEffect(() => {
    assesor();
  }, [dispatch]);

  // update local state when redux state changes
  useEffect(() => {
    if (
      trainerReportState?.reports?.data &&
      Array.isArray(trainerReportState?.reports?.data)
    ) {
      setData(trainerReportState?.reports?.data);
    }
  }, [trainerReportState]);

  console.log(data);

  return (
    <section className="space-y-6">
      <div className="flex lg:flex-row gap-3 flex-col justify-between">
        <h2 className="font-bold text-3xl">Recent Report</h2>
      </div>

      <div className="bg-white rounded-xl border border-quinary">
        <div className="overflow-x-auto py-4">
          <div className="min-w-[1000px] lg:min-w-full">
            <table className="w-full">
              <thead className="bg-white">
                <tr className="border-b border-quinary">
                  <th>AssessorId</th>
                  <th>NAME</th>
                  <th>BatchName</th>
                  <th>Center</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No reports found.
                    </td>
                  </tr>
                ) : (
                  data.slice(0, 3).map((item, i) => (
                    <tr key={item.id || i} className="border-b border-quinary">
                      <td>{item?.assessorId || "N/A"}</td>
                      <td className="text-nowrap">
                        {item?.assessorName || "N/A"}
                      </td>
                      <td className=" text-center">
                        {item?.batchName || "N/A"}
                      </td>
                      <td>{item?.center || "No"}</td>
                      <td className="text-nowrap">{item?.date || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentReport;
