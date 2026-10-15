"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import Textarea from "../atoms/Textarea";
import FileUploader from "../common/FileUploader";
import {
  Addcordinate,
  getcordinatebyid,
  updatecordinatebyId,
} from "@/redux/slice/cordinate-slice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { successToast } from "@/utils/toastMessage";

const AddCoordinates = ({ MapId }) => {
  const dispatch = useDispatch();
  let router = useRouter();

  const [formData, setFormData] = useState({
    thumbnail: {},
    category: "training",
    title: "",
    description: "",
    coordinates: { lat: "", lng: "" },
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (MapId) {
      fetchCoordinateById();
    }
  }, [MapId]);

  const fetchCoordinateById = async () => {
    const res = await dispatch(getcordinatebyid(MapId));
    if (res?.payload?.data) {
      const data = res.payload.data;
      setFormData({
        thumbnail: data.thumbnail || {},
        category: data.category || "training",
        title: data.title || "",
        description: data.description || "",
        coordinates: {
          lat: data.coordinates?.lat || "",
          lng: data.coordinates?.lng || "",
        },
      });
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
    setErrors((prev) => ({ ...prev, category: null }));
  };

  const handleCoordinatesChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      coordinates: { ...prev.coordinates, [name]: value },
    }));
    setErrors((prev) => ({
      ...prev,
      coordinates: { ...(prev.coordinates || {}), [name]: null },
    }));
  };

  const handleFileUploadSuccess = (fileData) => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: {
        url: fileData.url || fileData.image,
        publicId: fileData.publicId,
      },
    }));
    setErrors((prev) => ({ ...prev, thumbnail: null }));
  };

  const handleFileDelete = () => {
    setFormData((prev) => ({ ...prev, thumbnail: {} }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.thumbnail.url || !formData.thumbnail.publicId) {
      newErrors.thumbnail = "Thumbnail is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.coordinates.lat || isNaN(formData.coordinates.lat)) {
      newErrors.coordinates = {
        ...(newErrors.coordinates || {}),
        lat: "Valid latitude is required",
      };
    }
    if (!formData.coordinates.lng || isNaN(formData.coordinates.lng)) {
      newErrors.coordinates = {
        ...(newErrors.coordinates || {}),
        lng: "Valid longitude is required",
      };
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);

    const payload = {
      ...formData,
      coordinates: {
        lat: parseFloat(formData.coordinates.lat),
        lng: parseFloat(formData.coordinates.lng),
      },
      location: {
        coordinates: [
          parseFloat(formData.coordinates.lng),
          parseFloat(formData.coordinates.lat),
        ],
      },
    };
    try {
      let res;
      if (isEditing) {
        res = await dispatch(updatecordinatebyId({ MapId, payload }));
      } else {
        res = await dispatch(Addcordinate(payload));
        console.log(res);
      }

      if (res?.payload) {
        toast.success(res?.payload?.message || "Success");
        router.push("/website-content/coordinates");
      } else {
        toast.error("Error in server");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col lg:flex-row gap-4">
      <Link href={"/website-content"}>
        <i className="ri-arrow-left-line hidden lg:block ri-2x cursor-pointer text-gray-600 hover:text-gray-800"></i>
      </Link>

      <div className="w-full bg-white rounded-xl shadow p-4 lg:p-8">
        <div className="flex flex-col gap-6 items-center">
          <h2 className="text-[#0070BA] font-bold text-2xl lg:text-3xl">
            Map Management
          </h2>

          <div className="w-full lg:w-[80%] bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            {/* File uploader + preview */}
            {/* Wrap uploader and image side by side, centered */}
            <div className="flex items-center justify-center gap-6 py-10 px-4">
              <div className="max-w-[250px] w-full">
                <FileUploader
                  onSuccess={handleFileUploadSuccess}
                  onDelete={handleFileDelete}
                  disabled={isLoading}
                  defaultFile={formData.thumbnail?.url || ""}
                />
                {errors.thumbnail && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.thumbnail}
                  </p>
                )}
              </div>

              {/* Image preview next to uploader */}
              {formData.thumbnail?.url && (
                <img
                  src={formData.thumbnail.url}
                  alt="Preview"
                  className="w-40 h-28 rounded-md border shadow object-cover"
                />
              )}
            </div>

            {errors.thumbnail && (
              <p className="text-red-600 text-sm">{errors.thumbnail}</p>
            )}

            {/* Category */}
            <Select
              label="Category"
              name="category"
              value={formData.category}
              options={[
                { label: "Training", value: "training" },
                { label: "Event", value: "event" },
                { label: "Other", value: "other" },
              ]}
              onChange={handleCategoryChange}
              disabled={isLoading}
            />
            {errors.category && (
              <p className="text-red-600 text-sm">{errors.category}</p>
            )}

            {/* Title */}
            <Input
              label="Title"
              name="title"
              placeholder="Enter Title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-red-600 text-sm">{errors.title}</p>
            )}

            {/* Description */}
            <Textarea
              label="Description"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-red-600 text-sm">{errors.description}</p>
            )}

            {/* Coordinates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                label="Latitude"
                name="lat"
                placeholder="Enter Latitude"
                value={formData.coordinates.lat || ""}
                onChange={handleCoordinatesChange}
                type="number"
                disabled={isLoading}
              />
              <Input
                label="Longitude"
                name="lng"
                placeholder="Enter Longitude"
                value={formData.coordinates.lng || ""}
                onChange={handleCoordinatesChange}
                type="number"
                disabled={isLoading}
              />
            </div>
            {(errors.coordinates?.lat || errors.coordinates?.lng) && (
              <div className="text-red-600 text-sm">
                {errors.coordinates.lat && <p>{errors.coordinates.lat}</p>}
                {errors.coordinates.lng && <p>{errors.coordinates.lng}</p>}
              </div>
            )}
            <Link
              href="https://www.latlong.net/convert-address-to-lat-long.html"
              target="_blank"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Find a Lat Long
            </Link>

            {/* Buttons */}
            <div className="flex flex-col lg:flex-row gap-4 mt-4">
              <Button
                style="w-full border border-gray-300 bg-white hover:bg-gray-50"
                label="Cancel"
                onClick={() =>
                  setFormData({
                    thumbnail: {},
                    category: "training",
                    title: "",
                    description: "",
                    coordinates: { lat: "", lng: "" },
                  })
                }
                disabled={isLoading}
              />
              <Button
                style={`w-full text-white rounded ${
                  isLoading ? "bg-gray-400" : "bg-[#0070BA] hover:bg-[#005fa3]"
                }`}
                label={
                  isLoading
                    ? "Loading..."
                    : isEditing
                    ? "Update Coordinates"
                    : "Add Coordinates"
                }
                onClick={handleSubmit}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddCoordinates;
