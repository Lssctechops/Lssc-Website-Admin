"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getallblog, deleteblog } from "@/redux/slice/blog-slice";
import Link from "next/link";
import toast from "react-hot-toast";
import SearchBox from "../common/SearchBox";
import Select from "../atoms/Select";
import { useToggleQueryParam } from "@/utils/toggleQueryParam";
import { limitTextLength } from "@/utils/limitText";
import Pagination from "../common/Pagination";

const BlogList = ({ page, keyword, type }) => {
  const dispatch = useDispatch();

  const [blogList, setBlogList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [count, setCount] = useState(0);
  const toggleQueryParam = useToggleQueryParam();
  const fetchedblog = async () => {
    const res = await dispatch(
      getallblog({
        filter: { limit: 10, page, search: keyword, type: type || null },
      })
    );
    if (res?.payload && res?.payload?.data) {
      setBlogList(res?.payload?.data);
      setCount(res?.payload?.count);
    }
  };

  useEffect(() => {
    fetchedblog();
  }, [dispatch, page, keyword, type]);

  // Delete handlers
  const confirmDelete = (id) => {
    setBlogToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (blogToDelete) {
      dispatch(deleteblog(blogToDelete));
      toast.success("Blog deleted successfully");
      fetchedblog();
      setShowDeleteModal(false);
      setBlogToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  return (
    <div>
      {/* New Top Bar with Search and Add New Blog */}
      <div className="flex justify-between items-center mb-4">
        <SearchBox />
        <Link href="/website-content/blog-management/new">
          <button className="bg-[#0070BA] text-white cursor-pointer px-4 py-2 rounded hover:bg-[#005f8c] transition">
            Add New Blog
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto space-y-5">
        <Select
          label="Filter by type"
          options={[
            "blog",
            "news",
            "service",
            "event",
            "media",
            "industry",
            "faqs",
            "informative",
          ]}
          name="type"
          value={type}
          onChange={(e) => toggleQueryParam("type", e.target.value)}
        />
        <table className="w-full text-nowrap">
          <thead className="">
            <tr className="bg-[#dae8ff] text-sm uppercase">
              <th className="px-3 py-2 font-extrabold  text-left">Title</th>
              <th className="px-3 py-2 font-extrabold  text-center">
                Author Name
              </th>
              <th className="px-3 py-2 font-extrabold  text-center">
                Category
              </th>
              <th className="px-3 py-2 font-extrabold  text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogList.map((item, index) => (
              <tr
                key={item._id}
                className={`${
                  index !== blogList?.length - 1 && "border-b"
                }  border-gray-200 text-sm hover:bg-white`}
              >
                <td className=" px-3 text-left py-2 ">
                  <div className="flex flex-row items-center gap-2">
                    <Link target="_blank" href={item?.thumbnail?.url || "#"}>
                      <img
                        src={item?.thumbnail?.url}
                        alt={item?.thumbnail?.alt || "thumbnail"}
                        className="aspect-square h-10 object-cover rounded-full"
                      />
                    </Link>

                    <span className="font-semibold text-black">
                      {limitTextLength(item?.title, 40)}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 text-center py-2">
                  {limitTextLength(item?.author?.name, 20)}
                </td>
                <td className="whitespace-nowrap text-center px-3 py-2">
                  <span className="bg-purple-100 text-purple-500 px-4 py-2 rounded-md text-xs font-semibold uppercase">
                    {item?.type}
                  </span>
                </td>
                <td className="flex justify-center gap-3 py-2">
                  <Link
                    href={`/website-content/blog-management/new/${item._id}`}
                    className="cursor-pointer text-gray-600 hover:text-blue-600"
                  >
                    <i className="ri-edit-box-line ri-xl"></i>
                  </Link>
                  {/* <span className="cursor-pointer text-gray-600 hover:text-blue-600">
                    <i className="ri-git-repository-private-line ri-xl"></i>
                  </span> */}
                  <span
                    onClick={() => confirmDelete(item._id)}
                    className="cursor-pointer text-red-500 hover:text-red-700"
                  >
                    <i className="ri-delete-bin-6-line ri-xl"></i>
                  </span>
                </td>
              </tr>
            ))}
            {blogList.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full flex items-center justify-center py-5">
        <Pagination total={count} pageSize={10} />
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="p-6 rounded shadow-lg bg-white border border-black max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">
              This action will permanently delete the notice.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border cursor-pointer rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
