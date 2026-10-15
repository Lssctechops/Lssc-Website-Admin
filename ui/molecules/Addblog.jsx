"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Input from "../atoms/Input";
import Textarea from "../atoms/Textarea";
import Select from "../atoms/Select";
import Button from "../atoms/Button";
import FileUploader from "../common/FileUploader";
import { TextEditor } from "../common/TextEditor";

import { bloggetbyid, createblog, updateblog } from "@/redux/slice/blog-slice";
import { generateSlug } from "@/utils/generate-slug";
import Link from "next/link";

const EMPTY_FORM = {
  title: "",
  shortDescription: "",
  content: "",
  type: "",
  thumbnail: { url: "", publicId: "", alt: "" },
  seo: { metaTitle: "", metaDescription: "", metaKeywords: "" },
  author: { name: "", designation: "" },
  slug: "",
};

const Addblog = ({ blogId }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formdata, setFormdata] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load blog if editing
  useEffect(() => {
    const fetchBlogById = async () => {
      if (!blogId) return;

      try {
        setLoading(true);

        const res = await dispatch(bloggetbyid(blogId)).unwrap();
        const {
          title = "",
          shortDescription = "",
          content = "",
          type = "",
          slug = "",
          thumbnail = {},
          seo = {},
          author = {},
        } = res.data || {};

        setFormdata({
          title,
          shortDescription,
          content,
          type,
          slug,
          thumbnail: {
            url: thumbnail.url || "",
            publicId: thumbnail.publicId || "",
            alt: thumbnail.alt || "",
          },
          seo: {
            metaTitle: seo.metaTitle || "",
            metaDescription: seo.metaDescription || "",
            metaKeywords: Array.isArray(seo.metaKeywords)
              ? seo.metaKeywords.join(", ")
              : seo.metaKeywords || "",
          },
          author: {
            name: author.name || "",
            designation: author.designation || "",
          },
        });
      } catch (err) {
        toast.error(
          err?.message || "Error loading blog data. Please try again."
        );
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogById();
  }, [blogId, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("seo.")) {
      const key = name.split(".")[1];
      setFormdata((prev) => ({
        ...prev,
        seo: { ...prev.seo, [key]: value },
      }));
    } else if (name.startsWith("author.")) {
      const key = name.split(".")[1];
      setFormdata((prev) => ({
        ...prev,
        author: { ...prev.author, [key]: value },
      }));
    } else {
      setFormdata((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formdata.title) {
      setError("Blog title is required.");
      setLoading(false);
      return;
    }
    if (!formdata.type) {
      setError("Blog type is required.");
      setLoading(false);
      return;
    }
    if (!formdata.content) {
      setError("Blog content is required.");
      setLoading(false);
      return;
    }
    if (!formdata.thumbnail?.publicId) {
      setError("Image is required");
      setLoading(false);
      return;
    }
    if (!formdata.thumbnail?.url) {
      setError("Thumbnail URL is required.");
      setLoading(false);
      return;
    }
    if (!formdata.slug) {
      setError("Blog slug is required.");
      setLoading(false);
      return;
    }
    if (!formdata.shortDescription) {
      setError("Short description is required.");
      setLoading(false);
      return;
    }

    try {
      const action = blogId
        ? updateblog({ formdata, blogId })
        : createblog(formdata);
      const res = await dispatch(action).unwrap();
      console.log(res);
      toast.success(res.message || "Blog saved successfully!");
      setFormdata(EMPTY_FORM);
      router.push("/website-content/blog-management");
    } catch (err) {
      const message =
        err?.message || err?.error || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Link href="/website-content/blog-management">
        <button className="bg-[#0070BA] text-white  mb-4 px-4 py-2 rounded hover:bg-[#005f8c] transition">
          {blogId ? "Cancel" : "See Blogs"}
        </button>
      </Link>

      <div className="rounded-xl shadow p-4 border border-[#E6E7EA] w-full lg:flex lg:justify-between lg:items-start gap-8 bg-white">
        <form onSubmit={handleSubmit} className="lg:w-2/3 space-y-4">
          <h3 className="text-secondary text-2xl font-semibold text-center lg:text-left">
            {blogId ? "Edit Blog" : "New Blog"}
          </h3>

          <Input
            label="Title"
            placeholder="Enter Title"
            name="title"
            value={formdata.title}
            onChange={handleChange}
            onBlur={(e) =>
              setFormdata((prev) => ({
                ...prev,
                slug: generateSlug(formdata.title),
                seo: { ...prev.seo, metaTitle: formdata.title },
              }))
            }
          />

          <Textarea
            label="Short Description"
            placeholder="Enter short description"
            name="shortDescription"
            value={formdata.shortDescription}
            onChange={handleChange}
            onBlur={(e) =>
              setFormdata((prev) => ({
                ...prev,
                seo: { ...prev.seo, metaDescription: formdata.title },
              }))
            }
          />

          <TextEditor
            handleBlur={(data) =>
              setFormdata((prev) => ({ ...prev, content: data }))
            }
            initialValue={formdata.content}
          />

          <Input
            label="SEO Meta Title"
            placeholder="Enter SEO title"
            name="seo.metaTitle"
            value={formdata.seo.metaTitle}
            onChange={handleChange}
          />

          <Textarea
            label="SEO Meta Description"
            placeholder="Enter SEO description"
            name="seo.metaDescription"
            value={formdata.seo.metaDescription}
            onChange={handleChange}
          />

          <Input
            label="SEO Keywords"
            placeholder="Comma separated keywords"
            name="seo.metaKeywords"
            value={formdata.seo.metaKeywords}
            onChange={handleChange}
          />

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex gap-6">
            <Button
              type="button"
              style="w-full border border-[#E6E7EA]"
              label="Reset"
              onClick={() => setFormdata(EMPTY_FORM)}
              disabled={loading}
            />
            <Button
              type="submit"
              style="bg-[#0070BA] text-white w-full"
              label={loading ? "Submitting..." : blogId ? "Update" : "Submit"}
              disabled={loading}
            />
          </div>
        </form>

        <div className="lg:w-1/3 flex flex-col items-center space-y-4">
          <h3 className="text-secondary text-2xl font-semibold text-center">
            Details
          </h3>

          <FileUploader
            onSuccess={(fileData) =>
              setFormdata((prev) => ({
                ...prev,
                thumbnail: {
                  url: fileData.image,
                  publicId: fileData.publicId,
                  alt: fileData.alt || "thumbnail",
                },
              }))
            }
            onDelete={() =>
              setFormdata((prev) => ({
                ...prev,
                thumbnail: { url: "", publicId: "", alt: "" },
              }))
            }
          />

          {formdata.thumbnail.url && (
            <img
              src={formdata.thumbnail.url}
              alt={formdata.thumbnail.alt}
              className="w-full h-40 object-cover rounded border"
            />
          )}

          <Select
            label="Type"
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
            value={formdata.type}
            onChange={handleChange}
          />

          <Input
            label="Author Name"
            placeholder="Enter author name"
            name="author.name"
            value={formdata.author.name}
            onChange={handleChange}
          />

          <Input
            label="Author Designation"
            placeholder="Enter author designation"
            name="author.designation"
            value={formdata.author.designation}
            onChange={handleChange}
          />

          <Input
            label="Slug"
            placeholder="Enter slug"
            name="slug"
            value={formdata.slug}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Addblog;
