"use client";

import { useEffect, useState } from "react";
import Select from "../atoms/Select";
import Input from "../atoms/Input";
import Textarea from "../atoms/Textarea";
import FileUploader from "../common/FileUploader";
import Button from "../atoms/Button";
import { useDispatch } from "react-redux";
import {
  createNewsletter,
  updatenewslatter,
  newsgetbyid,
} from "@/redux/slice/newslatter-slice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Addnewslatter = ({ newsId, onSuccess }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ added
  const [formdata, setformdata] = useState({
    type: "",
    subject: "",
    message: "",
    thumbnail: {},
  });

  const handlechange = (e) => {
    const { name, value } = e.target;
    setformdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, name) => {
    if (selectedOption?.target) {
      setformdata((prev) => ({
        ...prev,
        [name]: selectedOption.target.value,
      }));
    } else if (typeof selectedOption === "object" && selectedOption?.value) {
      setformdata((prev) => ({
        ...prev,
        [name]: selectedOption.value,
      }));
    } else {
      setformdata((prev) => ({
        ...prev,
        [name]: selectedOption,
      }));
    }
  };

  const getnewsbyid = async () => {
    if (!newsId) return;
    const res = await dispatch(newsgetbyid(newsId));
    if (res?.payload?.data) {
      const data = res.payload.data;
      setformdata({
        type: data.type,
        subject: data.subject,
        message: data.message,
        thumbnail: {
          url: data.thumbnail?.url || "",
          publicId: data.thumbnail?.publicId || "",
          alt: data.thumbnail?.alt || "",
        },
      });
    }
  };

  useEffect(() => {
    if (newsId) getnewsbyid();
  }, [newsId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // ✅ start loader

    if (!formdata.type) {
      setError("Please select type");
      setLoading(false); // ✅ stop loader
      return;
    }
    if (!formdata.subject) {
      setError("Subject is required");
      setLoading(false);
      return;
    }
    if (!formdata.message || formdata.message.trim().length < 20) {
      setError("Message is required and must be at least 20 characters long.");
      setLoading(false);
      return;
    }
    if (!formdata.thumbnail?.url || !formdata.thumbnail?.publicId) {
      setError("Please upload an image");
      setLoading(false);
      return;
    }

    try {
      if (newsId) {
        let res = await dispatch(updatenewslatter({ formdata, newsId }));
        toast.success(res.payload.message);
      } else {
        let res = await dispatch(createNewsletter(formdata));
        toast.success(res.payload.message);
      }
      setformdata({
        type: "",
        subject: "",
        message: "",
        thumbnail: {},
      });
      if (onSuccess) onSuccess();
      router.push("/website-content/news-letter-management");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  return (
    <div className="rounded-xl shadow space-y-4 lg:w-[80%] p-4 border border-[#E6E7EA]">
      <Select
        label="To"
        name="type"
        value={formdata.type}
        options={[
          { label: "subscriber", value: "subscriber" },
          { label: "user", value: "user" },
        ]}
        onChange={(option) => handleSelectChange(option, "type")}
      />
      <Input
        name="subject"
        onChange={handlechange}
        value={formdata.subject}
        label="Subject"
        placeholder="Enter Subject"
      />
      <Textarea
        name="message"
        onChange={handlechange}
        value={formdata.message}
        label="Message"
        placeholder="Write your message"
      />
      <h3 className="text-secondary text-center text-2xl font-semibold">
        Add Attachment
      </h3>
      <div className="flex justify-center">
        <div className="lg:w-[38%]">
          <FileUploader
            onSuccess={(fileData) =>
              setformdata((prev) => ({
                ...prev,
                thumbnail: {
                  url: fileData?.image,
                  publicId: fileData?.publicId,
                },
              }))
            }
            onDelete={() =>
              setformdata((prev) => ({
                ...prev,
                thumbnail: {},
              }))
            }
          />
          {formdata.thumbnail?.url && (
            <img
              src={formdata.thumbnail.url}
              alt="Preview"
              className="mt-2 w-32 h-20 object-cover rounded border"
            />
          )}
        </div>
      </div>
      <p className="text-red-500">{Error}</p>
      <div className="flex gap-6">
        <Button
          style="w-full border border-[#E6E7EA]"
          label="Cancel"
          onClick={() => {
            setformdata({
              type: "",
              subject: "",
              message: "",
              thumbnail: {},
            });
            if (newsId) router.push("/website-content/news-letter-management");
          }}
        />
        <Button
          onClick={handleSubmit}
          style="bg-[#0070BA] text-white w-full"
          label={loading ? "Loading..." : newsId ? "Update" : "Submit"} // ✅ dynamic label
          disabled={loading} // ✅ disable during loading
        />
      </div>
    </div>
  );
};

export default Addnewslatter;
