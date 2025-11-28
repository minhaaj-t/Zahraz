"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  currentImage?: string;
  label?: string;
}

export function ImageUpload({ onImageSelect, currentImage, label = "Upload Image" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File, maxWidth: number = 1920, maxHeight: number = 1920, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
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

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert("Image is too large. Please select an image smaller than 10MB.");
        return;
      }

      try {
        // Compress image before converting to base64
        const compressedBase64 = await compressImage(file);
        setPreview(compressedBase64);
        onImageSelect(compressedBase64);
      } catch (error) {
        console.error("Error compressing image:", error);
        // Fallback to original if compression fails
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setPreview(base64String);
          onImageSelect(base64String);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageSelect("");
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-gray-600 bg-gray-700/50"
        }`}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-400 mb-2">
              Drag and drop an image here, or click to select
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Image
            </Button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
      <p className="text-xs text-gray-500">
        Supported formats: JPG, PNG, GIF. Max size: 10MB. Images are automatically compressed.
      </p>
    </div>
  );
}

