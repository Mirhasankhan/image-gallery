"use client";
import AllImages from "@/components/AllImages";
import UploadFile from "@/components/UploadImage";
import React, { useState } from "react";

const Home = () => {
  const [images, setImages] = useState<string[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  return (
    <div className="grid grid-cols-4">
      <div className="col-span-4 md:col-span-3">
        <AllImages images={images} setImages={setImages} totalPage={totalPage} setTotalPage={setTotalPage}></AllImages>
      </div>
      <div className="col-span-4 md:col-span-1">
        <UploadFile setImages={setImages} setTotalPage={setTotalPage}></UploadFile>
      </div>
    </div>
  );
};

export default Home;
