"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deletenotice, getnotices } from "@/redux/slice/notice-slice";
import { useRouter } from "next/navigation";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import OverlayModal from "../common/OverlayModal";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import { limitTextLength } from "@/utils/limitText";
import SearchBox from "../common/SearchBox";
import { useToggleQueryParam } from "@/utils/toggleQueryParam";
import Select from "../atoms/Select";

const NoticeUpdate = ({ page, keyword, type }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toggleQueryParam = useToggleQueryParam();

  const [notices, setnotices] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  const fetchNotices = async () => {
    try {
      const res = await dispatch(
        getnotices({ filter: { limit: 10, type: type, page, search: keyword } })
      ).unwrap();
      setnotices(res?.data);
      setCount(res?.count);
    } catch (err) {
      toast.error("Failed to load notices");
    }
  };

  const handleDeleteClick = (id) => {
    setNoticeToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deletenotice(noticeToDelete)).unwrap();
      toast.success("Notice deleted successfully!");
      fetchNotices();
    } catch {
      toast.error("Delete failed");
    } finally {
      setShowDeleteModal(false);
      setNoticeToDelete(null);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [page, type, keyword]);

  return (
    <div className="bg-white p-6 rounded-xl space-y-4">
      <div className="flex justify-between mb-4">
        <SearchBox />
        <Link href="/website-content/notices-updates/new">
          <Button label="Add New Notice" style="bg-primary text-white" />
        </Link>
      </div>
      <Select
        label="Filter by type"
        options={["event", "notice"]}
        name="type"
        value={type}
        onChange={(e) => toggleQueryParam("type", e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 text-center">Title</th>
              <th className="p-2 text-center">Description</th>
              <th className="p-2 text-center">Link</th>
              <th className="p-2 text-center">Type</th>

              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No notices found.
                </td>
              </tr>
            ) : (
              notices.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 text-sm">
                  <td className="text-center max-w-xs whitespace-normal break-words overflow-hidden">
                    {limitTextLength(item?.title, 60)}
                  </td>
                  <td className="text-center max-w-xs whitespace-normal break-words overflow-hidden">
                    {limitTextLength(item?.content, 80)}
                  </td>
                  <td className="truncate text-center text-blue-600 cursor-pointer">
                    <Link
                      href={item?.hyperLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {item?.hyperLink}
                    </Link>
                  </td>

                  <td>
                    <span
                      className={`text-center rounded-full px-3 py-1 text-xs font-semibold ${
                        item.type === "event"
                          ? "bg-green-100 text-green-700"
                          : item.type === "notice"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item?.type}
                    </span>
                  </td>
                  <td className="flex justify-center gap-3">
                    <span
                      onClick={() =>
                        router.push(
                          `/website-content/notices-updates/new/${item._id}`
                        )
                      }
                      className="cursor-pointer text-gray-600 hover:text-blue-600"
                    >
                      <i className="ri-edit-box-line ri-xl"></i>
                    </span>
                    <span
                      onClick={() => handleDeleteClick(item._id)}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                    >
                      <i className="ri-delete-bin-6-line ri-xl"></i>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {notices.length > 0 && <Pagination total={count} pageSize={10} />}

      {showDeleteModal && (
        <OverlayModal
          content={
            <div className="bg-white p-6 rounded-xl text-center space-y-4">
              <h2 className="text-xl font-semibold">Confirm Delete</h2>
              <p>Are you sure you want to delete this notice?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 cursor-pointer rounded bg-gray-300"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded cursor-pointer bg-red-600 text-white"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default NoticeUpdate;
