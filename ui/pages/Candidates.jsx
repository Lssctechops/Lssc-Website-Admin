"use client";

import { getAllCandidates } from "@/redux/slice/candidate-slice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../common/Pagination";

const Candidates = ({ page }) => {
  const dispatch = useDispatch();

  const [candidatedata, setCandidatedata] = useState([]);
  const [count, setCount] = useState(0);

  const candidate = useSelector((state) => state.candidate);
  if (candidate) {
    useEffect(() => {
      setCount(candidate.candidates.count);
    });
  }
  useEffect(() => {
    dispatch(getAllCandidates({ filter: { limit: 10, page } }));
  }, [dispatch, page]);

  useEffect(() => {
    if (candidate.candidates?.data) {
      const data = candidate.candidates.data;

      if (Array.isArray(data)) {
        setCandidatedata(data);
      } else {
        console.error("Expected array but got:", data);
        setCandidatedata([]);
      }
    }
  }, [candidate.candidates]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow mt-8">
      <h1 className="text-3xl font-bold mb-6  pb-2">Candidate List</h1>

      {candidate.loading && (
        <p className="text-blue-600 font-medium">Loading...</p>
      )}

      {candidate.error && (
        <p className="text-red-500 font-medium">Error: {candidate.error}</p>
      )}

      {!candidate.loading && !candidate.error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center text-gray-700 ">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Mobile</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">State</th>
              </tr>
            </thead>
            <tbody>
              {candidatedata.length > 0 ? (
                candidatedata.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <Link
                        href={`/candidate/Candidatedetail/${item._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.personalDetails?.name || "-"}
                      </Link>
                    </td>
                    <td className="px-4 py-2 ">
                      {item.personalDetails?.email || "-"}
                    </td>
                    <td className="px-4 py-2 ">
                      {item.personalDetails?.mobile || "-"}
                    </td>
                    <td className="px-4 py-2 ">
                      {item.personalDetails?.city || "-"}
                    </td>
                    <td className="px-4 py-2 ">
                      {item.personalDetails?.state || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No candidates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination total={count} pageSize={10} />
    </div>
  );
};

export default Candidates;
