"use client";
import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CiZoomIn } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import RefreshIcon from "@mui/icons-material/Refresh";
import Swal from "sweetalert2";

type AllImagesProps = {
  images: string[];
  totalPage: number;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  setTotalPage: React.Dispatch<React.SetStateAction<number>>;
};

const AllImages = ({
  images,
  setImages,
  totalPage,
  setTotalPage,
}: AllImagesProps) => {
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios
      .get(
        `https://trailnest-backend.vercel.app/api/v1/campsite/allImages?page=${page}`
      )
      .then((res) => {        
        setImages(res.data?.result.paginatedUrls);
        setTotalPage(res.data?.result.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching images:", err);
      });
  }, [page]);

  const deleteImage = async (imageUrl: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            "https://trailnest-backend.vercel.app/api/v1/campsite/image/delete",
            {
              data: { imageUrl },
            }
          );

          if (response.data.success == true) {
            Swal.fire({
              title: "Deleted!",
              text: "Image has been deleted.",
              icon: "success",
            });
            axios
              .get(
                `https://trailnest-backend.vercel.app/api/v1/campsite/allImages?page=${1}`
              )
              .then((res) => {
                setTotalPage(res.data?.result.totalPages);
                setImages(res.data?.result.paginatedUrls);
                setPage(1)
              });
          }
        } catch (error) {
          console.error("Error deleting image:", error);

          Swal.fire({
            title: "Error!",
            text: "There was a problem deleting the image.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div>
      {!loading ? (
        <div className="px-6">
          <h2 className="text-2xl my-4">Uploaded Images:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images?.map((url, index) => (
              <div key={index} className="relative group">
                <Image
                  height={200}
                  width={200}
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="w-full h-48 rounded shadow object-cover"
                />

                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded">
                  <button
                    onClick={() => deleteImage(url)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    <MdDelete />
                  </button>
                  <button
                    onClick={() => setZoomImage(url)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    <CiZoomIn />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {zoomImage && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
              <div className="relative max-w-4xl w-full p-4">
                <img
                  src={zoomImage}
                  alt="Zoomed"
                  className="w-full h-auto rounded shadow-lg"
                />
                <button
                  onClick={() => setZoomImage(null)}
                  className="absolute top-4 right-6 text-white text-2xl font-bold hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center">
          <RefreshIcon
            sx={{ fontSize: "130px", color: "blue" }}
            className="animate-spin"
          ></RefreshIcon>
        </div>
      )}
      <div className="flex items-center justify-center mt-6 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-md border transition ${
            page === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Previous
        </button>
        {[...Array(totalPage)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-md border ${
              page === i + 1
                ? "bg-blue-500 text-white border-blue-500 font-bold"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPage}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-md border transition ${
            page === totalPage
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllImages;
