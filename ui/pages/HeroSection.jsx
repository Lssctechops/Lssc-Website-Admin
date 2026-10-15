"use client";
import Link from "next/link";
import Button from "../atoms/Button";
import BannerCard from "../molecules/BannerCard";
import OverlayModal from "../common/OverlayModal";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deletebanner, getallbanner } from "@/redux/slice/banner-slice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Pagination from "../common/Pagination";

const HeroSection = ({ page }) => {
  const dispatch = useDispatch();
  const [banners, setBanners] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  let router = useRouter();

  const fetchBanners = async () => {
    const res = await dispatch(getallbanner({ filter: { limit: 10, page } }));
    // console.log("mil gya bannaer count", res.payload.count);
    setCount(res?.payload?.count);
    if (Array.isArray(res?.payload?.data)) {
      setBanners(res?.payload?.data);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [page]);

  const handledelete = async (id) => {
    const res = await dispatch(deletebanner(id));
    toast.success(res?.payload?.message);
    fetchBanners();
  };

  const filteredBanners = banners.filter((banner) =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex px-4 justify-between items-center mb-10">
        <Link href="/website-content/hero-section/New">
          <Button label="Add New Banner" style="bg-primary text-white" />
        </Link>
      </div>

      <div className="p-4 space-y-6 rounded-xl">
        {filteredBanners.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No banners found.</p>
        ) : (
          <>
            <div className="grid lg:grid-cols-2 gap-10">
              {filteredBanners.map((banner) => (
                <BannerCard
                  key={banner._id}
                  id={banner._id}
                  title={banner.title}
                  img={banner.thumbnail}
                  description={banner.position}
                  route="#"
                  ondelete={() => {
                    setDeleteId(banner._id);
                    setShowDeleteModal(true);
                  }}
                  onedit={() =>
                    router.push(
                      `/website-content/hero-section/New/${banner._id}`
                    )
                  }
                />
              ))}
            </div>
            <Pagination total={count} pageSize={10} />
          </>
        )}

        {showDeleteModal && (
          <OverlayModal
            content={
              <div className="bg-white p-6 rounded shadow-md flex flex-col gap-4 text-center">
                <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
                <p>This action will permanently delete the banner.</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      handledelete(deleteId);
                      setShowDeleteModal(false);
                    }}
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
      </div>
    </div>
  );
};

export default HeroSection;
