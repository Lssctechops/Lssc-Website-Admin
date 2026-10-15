// "use client";

// import { getAlltalentform } from "@/redux/slice/talent-slice";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Pagination from "../common/Pagination";

// const Talentbank = ({ page }) => {
//   const dispatch = useDispatch();
//   const { talent } = useSelector((state) => state.talent);
//   const [count, setCount] = useState(0);

//   const [statusMap, setStatusMap] = useState({}); // use for status only
//   useEffect(() => {
//     // use for sttaus
//     if (talent?.data) {
//       const initialStatus = {};
//       talent.data.forEach((item) => {
//         initialStatus[item._id] = "open"; // default
//       });
//       setStatusMap(initialStatus);
//     }
//   }, [talent]);
//   const handleStatusChange = (id, newStatus) => {
//     // status
//     setStatusMap((prev) => ({
//       ...prev,
//       [id]: newStatus,
//     }));
//   };

//   const dataSource = talent?.data || [];
//   console.log(dataSource);

//   useEffect(() => {
//     dispatch(getAlltalentform({ filter: { limit: 10, page } }));
//   }, [dispatch, page]);

//   useEffect(() => {
//     if (talent) {
//       setCount(talent.count);
//     }
//   }, [talent]);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4 text-gray-800">Talent Bank</h1>

//       <div className="overflow-x-auto rounded shadow">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
//             <tr>
//               <th className="px-3 py-2">Company Name</th>
//               <th className="px-3 py-2">City</th>
//               <th className="px-3 py-2">Age</th>
//               <th className="px-3 py-2">Job Role</th>
//               <th className="px-3 py-2">Requirements</th>
//               <th className="px-3 py-2">Letter of Intent</th>
//               <th className="px-3 py-2">Created Date </th>
//               <th className="px-3 py-2">Status</th>
//             </tr>
//           </thead>

//           <tbody className="text-gray-700 text-sm">
//             {dataSource
//               .filter(
//                 (item) =>
//                   item?.totalWorkforce &&
//                   item?.totalWorkforce.toLowerCase() !== "na"
//               )
//               .map((item) => (
//                 <tr key={item._id} className="hover:bg-gray-50">
//                   <td className="px-3 py-2">
//                     <Link
//                       href={`/talent-bank/talentdetail/${item._id}`}
//                       className="text-blue-600 underline"
//                     >
//                       {item?.companyName}
//                     </Link>
//                   </td>
//                   <td className="px-3 py-2">{item?.city}</td>
//                   <td className="px-3 py-2">{item?.age}</td>
//                   <td className="px-3 py-2">
//                     {item?.jobRole?.map((role, i) => (
//                       <span
//                         key={i}
//                         className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1"
//                       >
//                         {role}
//                       </span>
//                     ))}
//                   </td>
//                   <td className="px-3 py-2">{item?.totalWorkforce}</td>
//                   <td className="px-3 py-2">
//                     {item?.letterOfIntent ? (
//                       <a
//                         href={item?.letterOfIntent}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         View
//                       </a>
//                     ) : (
//                       "PENDING"
//                     )}
//                   </td>
//                   <td className="px-3 py-2">
//                     {item?.createdAt
//                       ? new Date(item.createdAt).toLocaleDateString("en-CA") // YYYY-MM-DD
//                       : ""}
//                   </td>
//                   <td className="px-3 py-2">
//                     <select
//                       value={statusMap[item._id] || "open"}
//                       onChange={(e) =>
//                         handleStatusChange(item._id, e.target.value)
//                       }
//                       className="border px-2 py-1 rounded text-sm"
//                     >
//                       <option value="open">Open</option>
//                       <option value="close">Close</option>
//                     </select>
//                   </td>
//                 </tr>
//               ))}

//             {dataSource.filter(
//               (item) =>
//                 item?.totalWorkforce &&
//                 item?.totalWorkforce.toLowerCase() !== "na"
//             ).length === 0 && (
//               <tr>
//                 <td colSpan="10" className="text-center text-gray-500 py-4">
//                   No data available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         <Pagination total={count} pageSize={10} />
//       </div>
//     </div>
//   );
// };

// export default Talentbank;
"use client";

import { getAlltalentform, updatetalentform } from "@/redux/slice/talent-slice";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../common/Pagination";
import toast from "react-hot-toast";

const Talentbank = ({ page }) => {
  const dispatch = useDispatch();
  const { talent } = useSelector((state) => state.talent);
  const [count, setCount] = useState(0);

  const [statusMap, setStatusMap] = useState({}); // use for status only

  useEffect(() => {
    if (talent?.data) {
      const initialStatus = {};
      talent.data.forEach((item) => {
        initialStatus[item._id] = item.status || "open"; // default or from server
      });
      setStatusMap(initialStatus);
    }
  }, [talent]);

  const handleStatusChange = async (id, newStatus) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: newStatus,
    }));

    try {
      await dispatch(
        updatetalentform({ talentId: id, status: newStatus })
      ).unwrap();
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to update status");
    }
  };

  const dataSource = talent?.data || [];

  useEffect(() => {
    dispatch(getAlltalentform({ filter: { limit: 10, page } }));
  }, [dispatch, page]);

  useEffect(() => {
    if (talent) {
      setCount(talent.count);
    }
  }, [talent]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Talent Bank</h1>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-3 py-2">Company Name</th>
              <th className="px-3 py-2">City</th>
              <th className="px-3 py-2">Age</th>
              <th className="px-3 py-2">Job Role</th>
              <th className="px-3 py-2">Requirements</th>
              <th className="px-3 py-2">Letter of Intent</th>
              <th className="px-3 py-2">Created Date</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 text-sm">
            {dataSource
              .filter(
                (item) =>
                  item?.totalWorkforce &&
                  item?.totalWorkforce.toLowerCase() !== "na"
              )
              .map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <Link
                      href={`/talent-bank/talentdetail/${item._id}`}
                      className="text-blue-600 underline"
                    >
                      {item?.companyName}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{item?.city}</td>
                  <td className="px-3 py-2">{item?.age}</td>
                  <td className="px-3 py-2">
                    {item?.jobRole?.map((role, i) => (
                      <span
                        key={i}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1"
                      >
                        {role}
                      </span>
                    ))}
                  </td>
                  <td className="px-3 py-2">{item?.totalWorkforce}</td>
                  <td className="px-3 py-2">
                    {item?.letterOfIntent ? (
                      <a
                        href={item?.letterOfIntent}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      "PENDING"
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {item?.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-CA")
                      : ""}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={statusMap[item._id] || "open"}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                      className="border px-2 py-1 rounded text-sm"
                    >
                      <option value="open">Open</option>
                      <option value="close">Close</option>
                    </select>
                  </td>
                </tr>
              ))}

            {dataSource.filter(
              (item) =>
                item?.totalWorkforce &&
                item?.totalWorkforce.toLowerCase() !== "na"
            ).length === 0 && (
              <tr>
                <td colSpan="10" className="text-center text-gray-500 py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination total={count} pageSize={10} />
      </div>
    </div>
  );
};

export default Talentbank;
