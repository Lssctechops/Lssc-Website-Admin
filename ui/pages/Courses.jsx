"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";

import {
  getallcourse,
  deletecourse,
  updatecourse,
} from "@/redux/slice/course-slice";
import toast from "react-hot-toast";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import OverlayModal from "../common/OverlayModal";
import Pagination from "../common/Pagination";
import { limitTextLength } from "@/utils/limitText";
import SearchBox from "../common/SearchBox";

const Courses = ({ page, keyword }) => {
  const dispatch = useDispatch();
  const [allcourse, setAllCourse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    dispatch(
      getallcourse({ filter: { limit: 10, page, search: keyword } })
    ).then((res) => {
      setAllCourse(res.payload?.data || []);
      setCount(res.payload.count);
    });
  }, [page]);

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deletecourse(courseToDelete));
      toast.success("Course Deleted successfully");
      setAllCourse(allcourse.filter((item) => item._id !== courseToDelete));
    } catch {
      toast.error("Failed");
    } finally {
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  const toggelFeatured = async (id, data) => {
    const res = await dispatch(updatecourse({ courseId: id, formdata: data }));
  };
  return (
    <section className="p-4 lg:p-10 space-y-6 bg-white rounded-xl">
      <div className="flex justify-between">
        <SearchBox />
        <Link href="/website-content/courses/new">
          <Button label="Add Newcourse" style="bg-primary text-white" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="text-left">Title</th>
              <th className="text-left">Access</th>
              <th className="text-left">Price</th>
              <th className="text-center">Course Duration</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          {/* Show tbody only if courses exist */}
          {allcourse.length > 0 ? (
            <tbody>
              {allcourse.map((item) => (
                <tr key={item._id} className="text-sm shadow">
                  <td className="text-left max-w-xs whitespace-normal break-words overflow-hidden">
                    <div className="inline-flex gap-2 items-center">
                      <Link target="_blank" href={item?.thumbnail?.url || "#"}>
                        <img
                          src={item?.thumbnail?.url}
                          className="h-12 aspect-square rounded-full"
                        />
                      </Link>
                      {limitTextLength(item?.title, 60)}
                    </div>
                  </td>
                  <td className="text-left">{item?.access || "N/A"}</td>
                  <td className="text-blue-600 text-left">{item?.price}</td>
                  <td>
                    <span className="bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs font-semibold">
                      {item?.duration}
                    </span>
                  </td>
                  <td className="flex justify-center gap-3">
                    <Link href={`/website-content/courses/new/${item._id}`}>
                      <i className="ri-edit-box-line ri-xl text-gray-600 hover:text-blue-600"></i>
                    </Link>
                    <span
                      onClick={() => {
                        setCourseToDelete(item._id);
                        setShowDeleteModal(true);
                      }}
                      className="cursor-pointerr text-red-500 hover:text-red-700"
                    >
                      <i className="ri-delete-bin-6-line ri-xl"></i>
                    </span>
                    <input
                      checked={item?.featured}
                      onChange={() =>
                        toggelFeatured(item?._id, { featured: !item.featured })
                      }
                      type="checkbox"
                    />
                    <input
                      // value={item?.priority}
                      onChange={(e) =>
                        toggelFeatured(item?._id, { priority: e.target.value })
                      }
                      className="w-10 border"
                      type="number"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
      </div>

      {/* Show pagination only if courses exist */}
      {allcourse.length > 0 ? (
        <Pagination total={count} pageSize={10} />
      ) : (
        <p className="text-center text-gray-500 mt-4 font-medium">
          No courses found.
        </p>
      )}

      {showDeleteModal && (
        <OverlayModal
          content={
            <div className="bg-white rounded-xl p-6 space-y-6 shadow-lg max-w-sm mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800">
                Confirm Delete
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete this course? This action is{" "}
                <span className="font-semibold text-red-600">permanent</span>{" "}
                and cannot be undone.
              </p>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2 border cursor-pointer border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2 bg-red-600 cursor-pointer text-white rounded-md hover:bg-red-700 transition"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          }
        />
      )}
    </section>
  );
};

export default Courses;
