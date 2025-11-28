"use client";

import NextImage from "next/image";
import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  limit?: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function MultiImageUpload({
  images,
  onChange,
  label = "Gallery Images (optional)",
  limit = 6,
}: MultiImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const compressImage = (
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1920,
    quality: number = 0.8
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return;

    const currentImages = [...images];
    const remainingSlots = limit - currentImages.length;
    if (remainingSlots <= 0) {
      alert(`Maximum of ${limit} images allowed.`);
      return;
    }

    const files = Array.from(fileList).slice(0, remainingSlots);
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_FILE_SIZE) {
        alert(`Image "${file.name}" is larger than 10MB. Please select a smaller file.`);
        continue;
      }

      try {
        const compressed = await compressImage(file);
        currentImages.push(compressed);
      } catch (error) {
        console.error("Error compressing image:", error);
        // fallback to original
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          currentImages.push(base64String);
          onChange([...currentImages]);
        };
        reader.readAsDataURL(file);
      }
    }

    onChange([...currentImages]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-600 bg-gray-700/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group h-32">
              <NextImage
                src={img}
                alt={`Gallery ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 20vw, 40vw"
                className="object-cover rounded-lg border border-gray-600"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {images.length < limit && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-600 rounded-lg h-32 flex flex-col items-center justify-center text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors"
            >
              <Upload className="h-6 w-6 mb-2" />
              <span>Add Image</span>
              <span className="text-xs mt-1">({images.length}/{limit})</span>
            </button>
          )}
        </div>

        {images.length === 0 && (
          <div className="text-center py-6 text-gray-400">
            <ImageIcon className="h-12 w-12 mx-auto mb-3" />
            <p className="text-sm mb-2">Drag and drop multiple images here, or click below</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Select Images
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>
      <p className="text-xs text-gray-500">
        You can upload up to {limit} images. Each image must be under 10MB. Images are automatically compressed.
      </p>
    </div>
  );
}


