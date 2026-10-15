"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { deletegallery, getallgallery } from "@/redux/slice/gallery-slice";
import toast from "react-hot-toast";
import OverlayModal from "../common/OverlayModal";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { useRouter } from "next/navigation";
import { limitTextLength } from "@/utils/limitText";
import Pagination from "../common/Pagination";

// let res = await dispatch(getallgallery({ filter: { total: 6, page } }));
const GalleryManagement = ({ page }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [galleryList, setGalleryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [count, setCount] = useState("");

  const fetchgallery = async () => {
    try {
      let res = await dispatch(getallgallery({ filter: { limit: 6, page } }));
      setCount(res?.payload?.count);
      if (res?.payload?.data) {
        setGalleryList(res?.payload?.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchgallery();
  }, [dispatch, page]);

  const handleDelete = async (id) => {
    let res = await dispatch(deletegallery(id));
    toast.success(res?.payload?.message);
    fetchgallery();
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Search filtering
  const filteredGallery = galleryList.filter((item) =>
    item.caption?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="lg:p-10 space-y-6 p-3 w-full bg-white rounded-xl">
      {/* Search bar and Add Gallery button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Button
          label="Add Gallery"
          style="bg-primary text-white"
          onClick={() => router.push("/website-content/initiatives/new")}
        />
      </div>

      {filteredGallery.length > 0 ? (
        <div className="pt-10">
          <h3 className="text-secondary text-2xl font-semibold text-center mb-6">
            Latest Gallery Images
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.slice(0, 6).map((item, index) => (
              <div
                key={item._id || index}
                className="relative border border-[#E6E7EA] rounded-xl shadow p-4 pb-10"
              >
                <Link target="_blank" href={item.image}>
                  <img
                    src={item?.image}
                    alt={item?.alt || "gallery image"}
                    className="w-full h-34 object-cover rounded-lg mb-3"
                  />
                </Link>
                <p className="text-sm text-gray-600">
                  {limitTextLength(item?.caption, 30)}
                </p>

                <button
                  className="absolute bottom-2 cursor-pointer right-2 text-red-500 hover:text-red-700"
                  onClick={() => confirmDelete(item._id)}
                >
                  <i className="ri-delete-bin-6-line ri-xl"></i>
                </button>
              </div>
            ))}
          </div>
          <Pagination pageSize={6} total={count} />
        </div>
      ) : (
        <p className="text-center text-gray-500 pt-10">
          No gallery images found.
        </p>
      )}

      {showDeleteModal && (
        <OverlayModal
          content={
            <div className="bg-white p-6 rounded shadow-md flex flex-col gap-4 text-center">
              <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
              <p className="mb-6">
                This action will permanently delete the image.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 cursor-pointer px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          }
        />
      )}
    </section>
  );
};

export default GalleryManagement;
