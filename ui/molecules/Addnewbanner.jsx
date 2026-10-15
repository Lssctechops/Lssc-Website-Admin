"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  createbanner,
  getbannerbyId,
  updatebannerbyId,
} from "@/redux/slice/banner-slice";
import toast from "react-hot-toast";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import Button from "../atoms/Button";
import FileUploader from "../common/FileUploader";

const Addnewbanner = ({ bannerId }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    position: "",
    thumbnail: {},
    link: "",
  });

  const [uploaderKey, setUploaderKey] = useState(Date.now());
  const [errormsg, seterrormsg] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (bannerId) {
      (async () => {
        const res = await dispatch(getbannerbyId(bannerId));
        const data = res.payload.data;
        setFormData({
          title: data.title,
          position: data.position?.toString() || "",
          thumbnail: {
            url: data.thumbnail || "",
            publicId: data.publicId || "",
          },
          link: data.link || "",
        });
      })();
    }
  }, [bannerId, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, name) => {
    if (selectedOption?.target) {
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOption.target.value,
      }));
    } else if (typeof selectedOption === "object" && selectedOption?.value) {
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOption.value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOption,
      }));
    }
  };

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    seterrormsg("");
    setLoading(true);
    if (!formData.title || !formData.position || !formData.thumbnail?.url) {
      setLoading(false);
      return seterrormsg("All fields are required");
    }

    try {
      if (formData.link && !isValidUrl(formData.link)) {
        setLoading(false);
        return seterrormsg("Please enter a valid Hyperlink");
      }

      const payload = {
        title: formData.title,
        position: formData.position,
        thumbnail: formData.thumbnail.url,
        publicId: formData.thumbnail.publicId,
        link: formData?.link,
      };

      if (bannerId) {
        const res = await dispatch(
          updatebannerbyId({ bannerId, updatedData: payload })
        );
        toast.success(res.payload.message);
      } else {
        const res = await dispatch(createbanner(payload));
        toast.success(res.payload.message);
      }

      setFormData({ title: "", position: "", thumbnail: {}, link: "" });
      setUploaderKey(Date.now());
      router.push("/website-content/hero-section");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-white max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-secondary">
        {bannerId ? "Update Banner" : "Add New Banner"}
      </h2>

      <Input
        label="Banner Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
      />

      <Select
        label={"Select Banner Position"}
        name="position"
        value={formData.position}
        options={[
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
          { label: "5", value: "5" },
        ]}
        onChange={(option) => handleSelectChange(option, "position")}
      />

      <Input
        label="Hyper Link (Optional)"
        name="link"
        value={formData.link}
        onChange={handleChange}
      />

      <FileUploader
        key={uploaderKey}
        onSuccess={(fileData) =>
          setFormData((prev) => ({
            ...prev,
            thumbnail: {
              url: fileData?.image,
              publicId: fileData?.publicId,
            },
          }))
        }
        onDelete={() => setFormData((prev) => ({ ...prev, thumbnail: {} }))}
      />

      {formData.thumbnail?.url && (
        <img
          src={formData.thumbnail.url}
          alt="Preview"
          className="mt-2 w-32 h-20 object-cover rounded border"
        />
      )}

      <p className="text-red-500">{errormsg}</p>

      <div className="flex gap-4">
        <Button
          label="Cancel"
          style="w-full border border-[#E6E7EA]"
          onClick={() => router.push("/website-content/hero-section")}
          disabled={loading}
        />
        <Button
          label={loading ? "Submitting..." : "Submit"}
          style={`w-full ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#0070BA] text-white"
          }`}
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default Addnewbanner;
