"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getallcategory } from "@/redux/slice/category-slice";
import {
  coursegetbyid,
  createcourse,
  getallcoursesegment,
  updatecourse,
} from "@/redux/slice/course-slice";
import Select from "../atoms/Select";
import Input from "../atoms/Input";
import Textarea from "../atoms/Textarea";
import Button from "../atoms/Button";
import FileUploader from "../common/FileUploader";

const Addnewcourse = ({ courseId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const [categories, setCategories] = useState([]);
  const [segment, setSegment] = useState([]);

  const [formdata, setFormdata] = useState({
    category: "",
    title: "",
    slug: "",
    scheme: "",
    description: "",
    type: "offline",
    price: "0",
    totalHours: "",
    level: "",
    courseSegment: "",
    priority: "",
    access: "",
    qp_link: "",
    qp_code: "",
    curriculam_link: "",
    nsqf_level: "",
    version_no: "",
    duration: "",
    featured: false,
    rating: "",
    thumbnail: {
      url: "",
      publicId: "",
      alt: "",
    },
  });

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await dispatch(getallcategory());
      console.log(res);
      const formatted = res.payload?.data?.map((cat) => ({
        label: cat.title,
        value: cat._id,
      }));
      setCategories(formatted || []);
    };
    fetchCategory();
  }, []);
  useEffect(() => {
    const fetchCoursesegment = async () => {
      const res = await dispatch(getallcoursesegment());
      console.log(res.payload.data);
      const formatted = res.payload?.data?.map((seg) => ({
        label: seg.title,
        value: seg._id,
      }));
      setSegment(formatted || []);
    };
    fetchCoursesegment();
  }, []);

  useEffect(() => {
    if (courseId && courseId !== "New") {
      dispatch(coursegetbyid(courseId)).then((res) => {
        const data = res.payload?.data || {};
        setFormdata({
          priority: data.priority || "",
          category: data.category?._id || "",
          courseSegment: data.courseSegment?._id || "",
          scheme: data.scheme || "",
          qp_code: data.qp_code || "",
          title: data.title || "",
          slug: data.slug || "",
          description: data.description || "",
          type: data.type || "offline",
          price: data.price || "0",
          duration: data.duration || "",
          totalHours: data.totalHours || "",
          level: data.level || "",
          access: data.access || "",
          qp_link: data.qp_link || "",
          rating: data.rating || "",
          curriculam_link: data.curriculam_link || "",
          nsqf_level: data.nsqf_level || "",
          version_no: data.version_no || "",
          featured: data.featured || false,
          thumbnail: {
            url: data.thumbnail?.url || "",
            publicId: data.thumbnail?.publicId || "",
            alt: data.thumbnail?.alt || "",
          },
        });
      });
    }
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormdata((prev) => ({ ...prev, [name]: fieldValue }));
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
    setError("");
    setLoading(true);

    const requiredFields = [
      "category",
      "title",
      "slug",
      "scheme",
      "description",
      "duration",
      "type",
      "price",
      "totalHours",
      "level",
      "access",
      "qp_link",
      "curriculam_link",
      "nsqf_level",
      "version_no",
      "thumbnail",
      "courseSegment",
      "scheme",
      "qp_code",
      "rating",
    ];

    for (let field of requiredFields) {
      const value = formdata[field];
      if (!value || (field === "thumbnail" && !value.url)) {
        setLoading(false);
        return setError("All fields are required!");
      }
      if (field === "qp_link" && !isValidUrl(value)) {
        setLoading(false);
        return setError("Please enter a valid qp_link");
      }
      if (field === "curriculam_link" && !isValidUrl(value)) {
        setLoading(false);
        return setError("Please enter a valid curriculam_link");
      }
    }

    try {
      if (courseId) {
        const res = await dispatch(updatecourse({ courseId, formdata }));
        if (res.error) {
          toast.error("Update failed");
        } else {
          toast.success("Course updated successfully");
          router.push("/website-content/courses");
        }
      } else {
        const res = await dispatch(createcourse(formdata));
        console.log(res);
        if (
          res?.payload?.response?.data?.error?.includes(
            "E11000 duplicate key error collection"
          )
        ) {
          toast.error("Duplicate title is not allowed");
        } else {
          toast.success(res?.payload?.message || "Course created successfully");
          setFormdata({
            category: "",
            courseSegment: "",
            scheme: "",
            qp_code: "",
            title: "",
            slug: "",
            description: "",
            type: "",
            price: "",
            duration: "",
            totalHours: "",
            level: "",
            access: "",
            qp_link: "",
            rating: "",
            curriculam_link: "",
            nsqf_level: "",
            version_no: "",
            featured: false,
            thumbnail: {
              url: "",
              publicId: "",
              alt: "",
            },
          });
        }
      }
    } catch (error) {
      toast.error(error.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-4 lg:p-10 bg-white rounded-xl">
      <h2 className="text-3xl font-bold text-secondary text-center mb-6">
        Add / Update Course
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-4">
          <Select
            label="Category"
            name="category"
            value={formdata.category}
            options={categories}
            onChange={handleChange}
          />
          <Input
            name="title"
            label="Title"
            value={formdata.title}
            onChange={handleChange}
          />
          <Input
            name="slug"
            label="Slug"
            value={formdata.slug}
            onChange={handleChange}
          />
          <Textarea
            name="description"
            label="Description"
            value={formdata.description}
            onChange={handleChange}
          />
          <Select
            label="Type"
            name="type"
            value={formdata.type}
            options={[
              { label: "Live", value: "live" },
              { label: "Offline", value: "offline" },
            ]}
            onChange={handleChange}
          />
          <Input
            name="price"
            label="Price"
            type="number"
            value={formdata.price}
            onChange={handleChange}
          />
          <Input
            name="qp_link"
            label="QP Link"
            value={formdata.qp_link}
            onChange={handleChange}
          />
          <Input
            name="qp_code"
            label="QP Code"
            value={formdata.qp_code}
            onChange={handleChange}
          />
          <Input
            name="curriculam_link"
            label="Curriculum Link"
            value={formdata.curriculam_link}
            onChange={handleChange}
          />
          <Select
            label="Course Segment"
            name="courseSegment"
            value={formdata.courseSegment}
            options={segment}
            onChange={handleChange}
          />
          <Select
            label="Duration"
            name="duration"
            value={formdata.duration}
            options={[
              { label: "Short Duration", value: "short" },
              { label: "Long Duration", value: "long" },
            ]}
            onChange={handleChange}
          />
          <Input
            type={"number"}
            name="priority"
            label="Priority"
            value={formdata.priority}
            onChange={handleChange}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col space-y-4">
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl border shadow-sm">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Upload Thumbnail
              </label>
              <FileUploader
                onSuccess={(fileData) =>
                  setFormdata((prev) => ({
                    ...prev,
                    thumbnail: {
                      ...prev.thumbnail,
                      url: fileData?.image,
                      publicId: fileData?.publicId,
                    },
                  }))
                }
                onDelete={() =>
                  setFormdata((prev) => ({
                    ...prev,
                    thumbnail: {},
                  }))
                }
                className="h-24"
              />
              {formdata.thumbnail?.url && (
                <img
                  src={formdata.thumbnail.url}
                  alt="Preview"
                  className="w-full h-28 object-cover rounded border mt-2"
                />
              )}
            </div>
            <Input
              name="alt"
              label="Thumbnail Alt Text"
              value={formdata.thumbnail?.alt}
              onChange={(e) =>
                setFormdata((prev) => ({
                  ...prev,
                  thumbnail: {
                    ...prev.thumbnail,
                    alt: e.target.value,
                  },
                }))
              }
            />
          </div>

          <Input
            name="totalHours"
            label="Total Hours"
            type="number"
            value={formdata.totalHours}
            onChange={handleChange}
          />
          <Select
            name="level"
            onChange={handleChange}
            value={formdata.level}
            label="Level"
            options={["Beginner", "Intermediate", "Advanced"]}
          />
          <Select
            name="access"
            onChange={handleChange}
            value={formdata.access}
            label="Access"
            options={["lifetime", "limited"]}
          />
          <Input
            name="nsqf_level"
            label="NSQF Level"
            value={formdata.nsqf_level}
            onChange={handleChange}
          />
          <Input
            name="version_no"
            label="Version No."
            value={formdata.version_no}
            onChange={handleChange}
          />
          <Select
            label="Schemes"
            name="scheme"
            value={formdata.scheme}
            options={[
              {
                label: "Pmkvy-pradhan-mantri-kaushal-vikas-yojana",
                value: "pmkvy-pradhan-mantri-kaushal-vikas-yojana",
              },
              {
                label: "Pm-vishwakarma-yojana",
                value: "pm-vishwakarma-yojana",
              },
              {
                label: "State-skill-development-missions-ssdm",
                value: "state-skill-development-missions-ssdm",
              },
              {
                label: "National-apprenticeship",
                value: "national-apprenticeship",
              },
              {
                label: "PWd",
                value: "pwd",
              },
            ]}
            onChange={handleChange}
          />
          <Input
            name="rating"
            label="Rating"
            type="number"
            value={formdata.rating}
            onChange={handleChange}
          />
          <label className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              name="featured"
              checked={formdata.featured}
              onChange={handleChange}
            />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>

        {/* ERROR + SUBMIT */}
        <div className="lg:col-span-3">
          {Error && <p className="text-red-500 mb-2">{Error}</p>}
          <Button
            type="submit"
            disabled={loading}
            style={`w-full bg-[#0070BA] text-white ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            label={
              loading
                ? "Please wait..."
                : courseId && courseId !== "New"
                ? "Update Course"
                : "Add Course"
            }
          />
        </div>
      </form>
    </section>
  );
};

export default Addnewcourse;
