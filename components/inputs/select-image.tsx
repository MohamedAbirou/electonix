"use client";
import { ImageType } from "@/types";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface SelectImageProps {
  item?: ImageType;
  handleFileChange: (value: File) => void;
}

export const SelectImage = ({ item, handleFileChange }: SelectImageProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileChange(acceptedFiles[0]);
      }
    },
    [handleFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png"] },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-sky-400 p-2 border-dashed cursor-pointer text-sm font-normal text-sky-400 flex items-center justify-center"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here ...</p>
      ) : (
        <p>+ {item?.color} Image</p>
      )}
    </div>
  );
};
