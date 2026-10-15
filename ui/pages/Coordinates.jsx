"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getallcordinate,
  deletecordinatebyid,
} from "@/redux/slice/cordinate-slice";
import Link from "next/link";
import toast from "react-hot-toast";
import SearchBox from "../common/SearchBox";
import Pagination from "../common/Pagination";
import { limitTextLength } from "@/utils/limitText";

const CoordinatesList = ({ page, keyword }) => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  console.log(count);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false); // optional loader

  const fetchCoordinates = async () => {
    const res = await dispatch(
      getallcordinate({ filter: { limit: 10, page, search: keyword } })
    );
    if (res?.payload?.data) {
      setData(res.payload.data);
      setCount(res.payload.count);
    }
  };

  useEffect(() => {
    fetchCoordinates();
  }, [page, keyword]);

  const confirmDelete = (id) => {
    setToDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDeleteId) return;

    setLoadingDelete(true);

    const res = await dispatch(deletecordinatebyid(toDeleteId));
    console.log(res);

    if (res?.payload?.message) {
      toast.success("Coordinate deleted successfully");
    } else {
      toast.error("Failed to delete coordinate");
    }

    setLoadingDelete(false);
    setShowDeleteModal(false);
    setToDeleteId(null);
    fetchCoordinates();
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setToDeleteId(null);
  };

  return (
    <div>
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <SearchBox />
        <Link href="/website-content/coordinates/add-coordinates">
          <button className="bg-[#0070BA] text-white cursor-pointer px-4 py-2 rounded hover:bg-[#005f8c] transition">
            Add Coordinates
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto space-y-5">
        <table className="w-full text-nowrap">
          <thead>
            <tr className="bg-[#dae8ff] text-sm uppercase">
              <th className="px-3 py-2 font-extrabold text-left">Title</th>
              <th className="px-3 py-2 font-extrabold text-center">
                Thumbnail
              </th>
              <th className="px-3 py-2 font-extrabold text-center">Latitude</th>
              <th className="px-3 py-2 font-extrabold text-center">
                Longitude
              </th>
              <th className="px-3 py-2 font-extrabold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item._id}
                className={`${
                  index !== data.length - 1 && "border-b"
                } border-gray-200 text-sm hover:bg-white`}
              >
                <td className="px-3 py-2 text-left font-semibold text-black">
                  {limitTextLength(item?.title, 40)}
                </td>
                <td className="px-3 py-2 text-center">
                  <Link target="_blank" href={item?.thumbnail?.url || "#"}>
                    <img
                      src={item?.thumbnail?.url}
                      alt="thumbnail"
                      className="h-12 w-12 object-cover rounded-full mx-auto"
                    />
                  </Link>
                </td>
                <td className="px-3 py-2 text-center">
                  {item?.coordinates?.lat}
                </td>
                <td className="px-3 py-2 text-center">
                  {item?.coordinates?.lng}
                </td>
                <td className="flex justify-center gap-3 py-2">
                  <Link
                    href={`/website-content/coordinates/add-coordinates/${item._id}`}
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
            {data.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No coordinates found.
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
            <p className="mb-6">This will permanently delete the coordinate.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border cursor-pointer rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loadingDelete}
                className={`px-4 py-2 bg-red-600 cursor-pointer text-white rounded ${
                  loadingDelete ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loadingDelete ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatesList;
