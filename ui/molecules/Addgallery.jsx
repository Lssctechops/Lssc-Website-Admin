"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { creategallery, getallgallery } from "@/redux/slice/gallery-slice";
import toast from "react-hot-toast";
import Button from "../atoms/Button";
import Textarea from "../atoms/Textarea";
import FileUploader from "../common/FileUploader";
import { useRouter } from "next/navigation";

const Addgallery = () => {
  const dispatch = useDispatch();
  let router = useRouter();
  const [Error, setError] = useState();
  const [loading, setLoading] = useState(false); // Loader state added
  const [formdata, setFormdata] = useState({
    caption: "",
    thumbnail: {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // show loader

    if (!formdata.caption) {
      setError("caption is required");
      setLoading(false);
      return;
    }

    if (!formdata.thumbnail?.image || !formdata.thumbnail?.publicId) {
      setError("Please upload an image");
      setLoading(false);
      return;
    }

    const payload = {
      image: formdata.thumbnail.image,
      publicId: formdata.thumbnail.publicId,
      caption: formdata.caption,
    };

    try {
      let res = await dispatch(creategallery(payload));
      toast.success(res.payload.message);
      router.push("/website-content/initiatives");
      setFormdata({ caption: "", thumbnail: {} });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // hide loader
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl shadow space-y-4 lg:w-[80%] p-4 border border-[#E6E7EA]"
    >
      <h3 className="text-secondary text-center text-2xl font-semibold">
        Add Thumbnail
      </h3>

      <div className="flex justify-center">
        <div className="lg:w-[38%]">
          <FileUploader
            onSuccess={(fileData) =>
              setFormdata((prev) => ({
                ...prev,
                thumbnail: {
                  image: fileData.image,
                  publicId: fileData.publicId,
                },
              }))
            }
            onDelete={() =>
              setFormdata((prev) => ({
                ...prev,
                thumbnail: {},
              }))
            }
          />
        </div>
      </div>

      <Textarea
        name="caption"
        value={formdata.caption}
        onChange={handleChange}
        label="Caption"
        placeholder="Write your message"
      />
      <p className="text-red-500">{Error}</p>

      <div className="flex gap-6">
        <Button
          type="button"
          style="w-full border border-[#E6E7EA]"
          label="Cancel"
          onClick={() => setFormdata({ caption: "", thumbnail: {} })}
          disabled={loading}
        />
        <Button
          type="submit"
          style="bg-[#0070BA] text-white w-full"
          label={loading ? "Adding..." : "Add Image"} // Button label changes during loading
          disabled={loading}
        />
      </div>
    </form>
  );
};

export default Addgallery;
