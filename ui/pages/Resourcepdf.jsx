"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteresourcePdf,
  getallresourcePdf,
} from "@/redux/slice/bookandnewslatter-slice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import { limitTextLength } from "@/utils/limitText";

// Reuse OverlayModal
const OverlayModal = ({ content }) => {
  return (
    <section className="w-full h-screen fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 flex justify-center items-center">
      <div className="xl:w-[50%] w-[90%]" onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </section>
  );
};

const Resourcepdf = ({ page }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [alldata, setalldata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [count, setCount] = useState(0);

  const getAllResourcePdf = async () => {
    const res = await dispatch(
      getallresourcePdf({ filter: { limit: 10, page } })
    );
    const data = res?.payload?.data || [];
    setCount(res?.payload?.count);
    setalldata(data);
  };

  useEffect(() => {
    getAllResourcePdf();
  }, [dispatch, page]);

  const handledelete = async (id) => {
    let res = await dispatch(deleteresourcePdf(id));
    toast.success(res?.payload?.message);
    getAllResourcePdf();
  };

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-secondary">All Resources</h2>
        <Link
          href="/website-content/newslatterandbookmgmt/new"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
        >
          Add New Resource
        </Link>
      </div>

      {alldata.length === 0 ? (
        <>
          {/* Show table header only */}
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 text-center">Title</th>
                <th className="py-2 px-4 text-center">Category</th>
                <th className="py-2 px-4 text-left">Cover Image</th>
                <th className="py-2 px-4 text-center">PDF Link</th>
                <th className="px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
          </table>
          {/* Show no data message */}
          <p className="text-center py-6 text-gray-600 text-lg">
            No resources found.
          </p>
        </>
      ) : (
        <>
          {/* Show full table with data */}
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 text-center">Title</th>
                <th className="py-2 px-4 text-center">Category</th>
                <th className="py-2 px-4 text-left">Cover Image</th>
                <th className="py-2 px-4 text-center">PDF Link</th>
                <th className="px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alldata.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td
                    className="py-2 px-4 max-w-xs truncate"
                    title={item?.title}
                  >
                    {limitTextLength(item?.title, 25)}
                  </td>
                  <td className="py-2 px-4">{item?.category}</td>
                  <td className="py-2 px-4">
                    <img
                      src={item?.coverImage}
                      alt="cover"
                      className="w-20 h-14 object-cover rounded border"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <a
                      href={item?.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View PDF
                    </a>
                  </td>
                  <td className="flex justify-center gap-3 py-2">
                    <Link
                      href={`/website-content/newslatterandbookmgmt/new/${item._id}`}
                      className="cursor-pointer text-gray-600 hover:text-blue-600"
                    >
                      <i className="ri-edit-box-line ri-xl"></i>
                    </Link>
                    <span className="cursor-pointer text-gray-600 hover:text-blue-600">
                      <i className="ri-git-repository-private-line ri-xl"></i>
                    </span>
                    <span
                      onClick={() => {
                        setSelectedId(item._id);
                        setShowModal(true);
                      }}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                    >
                      <i className="ri-delete-bin-6-line ri-xl"></i>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Show Pagination only when data exists */}
          <Pagination total={count} pageSize={10} />
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <OverlayModal
          content={
            <div className="bg-white rounded-lg shadow-xl p-6 text-center space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Are you sure you want to delete this resource?
              </h2>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={async () => {
                    await handledelete(selectedId);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 cursor-pointer text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default Resourcepdf;
