"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Input from "../atoms/Input";
import { getallassesorreports } from "@/redux/slice/reports-slice";
import Pagination from "../common/Pagination";
import SearchBox from "../common/SearchBox";

const AssesorReport = ({ page, keyword }) => {
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

  const assesor = async () => {
    let res = await dispatch(
      getallassesorreports({ filter: { limit: 10, page, search: keyword } })
    );
    console.log(res?.payload);
  };

  // fetch data on mount
  useEffect(() => {
    assesor();
  }, [dispatch, page, keyword]);

  // update local state when redux state changes
  useEffect(() => {
    if (
      trainerReportState?.reports?.data &&
      Array.isArray(trainerReportState.reports.data)
    ) {
      setData(trainerReportState?.reports?.data);
    }
  }, [trainerReportState]);

  console.log(data);

  return (
    <section className="space-y-6">
      <div className="flex lg:flex-row gap-3 flex-col justify-between">
        <h2 className="font-bold text-3xl">Assessor Detail</h2>
        <SearchBox />
      </div>

      <div className="bg-white rounded-xl border border-quinary">
        <div className="overflow-x-auto py-4">
          <div className="min-w-[1000px] lg:min-w-full">
            <table className="w-full">
              <thead className="bg-white">
                <tr className="border-b border-quinary">
                  <th>Assessor Id</th>
                  <th>Name</th>
                  <th>Batch Name</th>
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
                  data.map((item, i) => (
                    <tr key={item.id || i} className="border-b border-quinary">
                      <td>{item?.assessorId || "N/A"}</td>
                      <td className="text-nowrap">
                        {item?.assessorName || "N/A"}
                      </td>
                      <td className=" text-center">
                        {item?.batchName || "N/A"}
                      </td>
                      <td>{item.center || "No"}</td>
                      <td className="text-nowrap">{item?.date || "N/A"}</td>
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

export default AssesorReport;
