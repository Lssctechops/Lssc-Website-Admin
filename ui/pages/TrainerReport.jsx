"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import { getalltrainersreports } from "@/redux/slice/reports-slice";
import Pagination from "../common/Pagination";
import SearchBox from "../common/SearchBox";

const TrainerReport = ({ page, keyword }) => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]); // initialize as empty array
  console.log(data);
  const [Count, setCount] = useState("");
  const trainerReportState = useSelector((state) => state.trainerreport);

  useEffect(() => {
    if (trainerReportState) {
      setCount(trainerReportState?.reports?.total);
    }
  });

  // fetch data on mount
  useEffect(() => {
    dispatch(
      getalltrainersreports({ filter: { limit: 10, page, search: keyword } })
    );
  }, [dispatch, page, keyword]);

  // update local state when redux state changes
  useEffect(() => {
    if (
      trainerReportState?.reports?.data &&
      Array.isArray(trainerReportState?.reports?.data)
    ) {
      setData(trainerReportState?.reports?.data);
    }
  }, [trainerReportState]);

  return (
    <section className="space-y-6">
      <div className="flex lg:flex-row gap-3 flex-col justify-between">
        <h2 className="font-bold text-3xl">Trainer Detail</h2>
        <SearchBox />
      </div>{" "}
      <div className="bg-white rounded-xl border border-quinary">
        <div className="overflow-x-auto py-4">
          <div className="min-w-[1000px] lg:min-w-full">
            <table className="w-full">
              <thead className="bg-white">
                <tr className="border-b border-quinary">
                  <th>Trainer Id</th>
                  <th>Name</th>
                  <th>Batch Name</th>
                  <th>Students</th>
                  <th>Start Date</th>
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
                  data.map((item, i) => (
                    <tr key={item.id || i} className="border-b border-quinary">
                      <td>{item?.trainerId || "N/A"}</td>
                      <td className="text-nowrap">
                        {item?.trainerName || "N/A"}
                      </td>
                      <td className=" text-center">
                        {item?.batchName || "N/A"}
                      </td>
                      <td>{item?.students || "No"}</td>
                      <td className="text-nowrap">{item.startDate || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination total={Count} pageSize={10} />
        </div>
      </div>
    </section>
  );
};

export default TrainerReport;
