"use client";
import axios from "axios";
import { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import Swal from "sweetalert2";

type AllImagesProps = {
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  setTotalPage: React.Dispatch<React.SetStateAction<number>>;
};

const UploadFile = ({ setImages,setTotalPage }: AllImagesProps) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length === 0) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please select an image",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (files.length > 5) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "You can't upload more than 5 image at once",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post(
        "https://trailnest-backend.vercel.app/api/v1/campsite/uploadImage",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      axios
        .get(`https://trailnest-backend.vercel.app/api/v1/campsite/allImages?page=${1}`)
        .then((res) => {
          setTotalPage(res.data?.result.totalPages)
          setImages(res.data?.result.paginatedUrls);
        });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Image Uploaded Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log("Upload Success:", response);

      setLoading(false);
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 mt-12 mr-6 bg-white rounded-lg border space-y-4"
    >
      <input
        className="border w-full p-2"
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <button
        disabled={loading}
        type="submit"
        className="bg-blue-500 w-full text-white p-2 rounded-lg"
      >
        {loading ? (
          <RefreshIcon className="animate-spin"></RefreshIcon>
        ) : (
          "Upload"
        )}
      </button>
    </form>
  );
};

export default UploadFile;
