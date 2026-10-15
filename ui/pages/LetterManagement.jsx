"use client";

import Link from "next/link";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getallnewslatter,
  deletnewslatter,
} from "@/redux/slice/newslatter-slice";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import { limitTextLength } from "@/utils/limitText";
import SearchBox from "../common/SearchBox";

const LetterTable = ({ page, keyword }) => {
  const dispatch = useDispatch();
  const [newsletters, setNewsletters] = useState([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [count, setCount] = useState(0);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAllNewsletters = async () => {
    let res = await dispatch(
      getallnewslatter({ filter: { limit: 10, page, search: keyword } })
    );
    setCount(res?.payload?.count);
    if (res?.payload && res?.payload?.data) {
      const data = res?.payload?.data;
      setNewsletters(data);
    }
  };

  useEffect(() => {
    fetchAllNewsletters();
  }, [dispatch, page, keyword]);

  // Delete modal handlers
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    await dispatch(deletnewslatter(deleteId));
    toast.success("Newsletter Deleted Successfully");
    setShowDeleteModal(false);
    setDeleteId(null);
    fetchAllNewsletters();
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div>
      {/* Search + Add New button (Always Visible) */}
      <div className="flex justify-between items-center mb-4">
        <SearchBox />
        <Link href="/website-content/news-letter-management/new">
          <Button label="Add New Newsletter" style="bg-primary text-white" />
        </Link>
      </div>

      {/* Table OR No Data Message */}
      {newsletters.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-2">Newsletters</h2>
          <p className="text-gray-500">No newsletters found.</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f1f4f9] font-semibold text-sm text-gray-600">
                  <th className="px-3 py-2 text-left">Subject</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">Thumbnail</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsletters.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-200 text-sm"
                  >
                    <td className="px-3 py-2 text-left">
                      {limitTextLength(item?.subject, 50) || "N/A"}
                    </td>
                    <td className="px-3 py-2 text-left">{item?.type}</td>
                    <td className="px-3 py-2">
                      {item.thumbnail?.url ? (
                        <img
                          src={item?.thumbnail?.url}
                          alt={item?.subject || "Thumbnail"}
                          className="w-16 h-12 object-cover rounded border"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="flex justify-center gap-3 py-2">
                      <Link
                        href={`/website-content/news-letter-management/new/${item._id}`}
                        className="cursor-pointer text-gray-600 hover:text-blue-600"
                      >
                        <i className="ri-edit-box-line ri-xl"></i>
                      </Link>

                      <span
                        onClick={() => confirmDelete(item._id)}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                      >
                        <i className="ri-delete-bin-6-line ri-xl"></i>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (Only if newsletter length > 0) */}
          <Pagination total={count} pageSize={10} />
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg border border-black max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">
              This action will permanently delete the newsletter.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border cursor-pointer rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterTable;
