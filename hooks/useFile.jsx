import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { getCloudinaryPublicId } from "@/utils/getCloudinaryPublicId";
const useFile = () => {
  const [fileUploading, setFileUploading] = useState(false);
  const [fileDeleting, setFileDeleting] = useState(false);
  const token = Cookies.get("token");
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  // Upload a single file
  const uploadFile = useCallback(async (file) => {
    setFileUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/media/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFileUploading(false);
      return response.data.data;
    } catch (error) {
      setFileUploading(false);

      console.error("File upload error:", error);
      throw error;
    }
  }, []);

  // Delete a file by ID
  const deleteFile = useCallback(async (fileUrl) => {
    setFileUploading(true);
    const publicId = getCloudinaryPublicId(fileUrl);
    try {
      const response = await axios.delete(
        `${NEXT_PUBLIC_API_URL}/api/media/${publicId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFileUploading(false);
      return response.data;
    } catch (error) {
      setFileUploading(false);
      console.error("File deletion error:", error);
      throw error;
    }
  }, []);

  return {
    fileUploading,
    fileDeleting,
    uploadFile,
    deleteFile,
  };
};

export default useFile;
