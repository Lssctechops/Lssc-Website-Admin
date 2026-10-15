"use client";

import { useEffect, useState } from "react";
import FileUploader from "../common/FileUploader";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Select from "../atoms/Select";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  createresourcePdf,
  getallresourcePdf,
  getresourcePdfbyId,
  updateresourcePdfbyId,
} from "@/redux/slice/bookandnewslatter-slice";

const Addbookandnewslatter = ({ resourceId }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [error, seterror] = useState();
  const [loading, setLoading] = useState(false); // ✅ Loader state
  const [formData, setFormData] = useState({
    title: "",
    coverImage: "",
    pdfUrl: "",
    category: "",
    publicId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getAllResourcePdf = async () => {
    const res = await dispatch(getallresourcePdf());
  };

  useEffect(() => {
    getAllResourcePdf();
  }, [dispatch]);

  const getresourcebyid = async () => {
    if (!resourceId) return;

    try {
      const res = await dispatch(getresourcePdfbyId(resourceId));
      const prefilldata = res.payload?.data;

      if (prefilldata) {
        setFormData({
          title: prefilldata.title || "",
          coverImage: prefilldata.coverImage || "",
          pdfUrl: prefilldata.pdfUrl || "",
          category: prefilldata.category || "",
          publicId: prefilldata.publicId || "",
        });
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (resourceId) {
      getresourcebyid();
    }
  }, [dispatch, resourceId]);

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
    seterror("");
    setLoading(true); // ✅ Start loader

    try {
      if (
        !formData.title ||
        !formData.coverImage ||
        !formData.pdfUrl ||
        !formData.category
      ) {
        seterror("Please fill all required fields.");
        setLoading(false); // ✅ Stop loader
        return;
      }

      if (formData.pdfUrl && !isValidUrl(formData.pdfUrl)) {
        setLoading(false); // ✅ Stop loader
        return seterror("Please enter a valid URL");
      }

      const payload = {
        title: formData.title,
        coverImage: formData.coverImage,
        pdfUrl: formData.pdfUrl,
        category: formData.category,
      };

      let res;
      if (resourceId) {
        res = await dispatch(
          updateresourcePdfbyId({ id: resourceId, data: payload })
        );
      } else {
        res = await dispatch(createresourcePdf(payload));
      }

      if (res?.payload) {
        toast.success(res.payload.message);
        await getAllResourcePdf();
        router.push("/website-content/newslatterandbookmgmt");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
      console.error(error);
    } finally {
      setLoading(false); // ✅ Always stop loader
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-secondary">
        {resourceId ? "Update" : "Add"} Resource
      </h2>

      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter title"
      />

      <Input
        label="PDF URL"
        name="pdfUrl"
        value={formData.pdfUrl}
        onChange={handleChange}
        placeholder="https://example.com/file.pdf"
      />

      <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={[
          { label: "Books", value: "Books" },
          { label: "News Letter", value: "News Letter" },
          { label: "Study Report", value: "Study Report" },
          { label: "Model Curriculum", value: "Model Curriculum" },
          {
            label: "Apprenticeship Curriculum",
            value: "Apprenticeship Curriculum",
          },
        ]}
      />

      <div className="mb-12">
        <div className="h-24 w-48 mb-10">
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Cover Image
          </label>
          <FileUploader
            onSuccess={(fileData) =>
              setFormData((prev) => ({
                ...prev,
                coverImage: fileData.image,
                publicId: fileData.publicId,
              }))
            }
            onDelete={() =>
              setFormData((prev) => ({
                ...prev,
                coverImage: "",
                publicId: "",
              }))
            }
          />
        </div>
        {formData.coverImage && (
          <img
            src={formData.coverImage}
            alt="Preview"
            className="mt-2 w-48 h-24 mb-10 object-cover border rounded"
          />
        )}
      </div>

      {error && <span className="text-red-500">{error}</span>}

      <Button
        label={
          loading
            ? "Loading..."
            : resourceId
            ? "Update Resource"
            : "Add Resource"
        } // ✅ loading text
        type="button"
        onClick={handleSubmit}
        disabled={loading} // ✅ disable while loading
        style="w-full bg-blue-600 text-white mt-10"
      />
    </div>
  );
};

export default Addbookandnewslatter;
