"use client";

import { VideoIcon, XCircleIcon } from "lucide-react";
import Dropzone from "react-dropzone";
import { cn } from "@/app/utils/cn";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface VideoUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
}

export default function VideoUploadInput({
  value,
  onChange,
  isUploading,
  setIsUploading,
}: VideoUploadInputProps) {
  const handleUpload = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video file is too large (max 50MB)");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading video to Cloudinary...");

    try {
      // 1. Get upload signature and configurations from Next.js server
      const signResponse = await fetch("/api/upload", {
        method: "POST",
      });

      if (!signResponse.ok) {
        const errorData = await signResponse.json().catch(() => ({}));
        throw new Error(errorData?.error || "Failed to generate upload signature");
      }

      const { signature, timestamp, cloudName, apiKey, folder } = await signResponse.json();

      // 2. Prepare Form Data for direct Cloudinary upload
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("api_key", apiKey);
      cloudinaryFormData.append("timestamp", timestamp.toString());
      cloudinaryFormData.append("signature", signature);
      cloudinaryFormData.append("folder", folder);

      // 3. Post the file directly to Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(
          errorData?.error?.message || "Failed to upload directly to Cloudinary"
        );
      }

      const uploadData = await uploadResponse.json();
      if (uploadData.secure_url) {
        onChange(uploadData.secure_url);
        toast.success("Video uploaded to Cloudinary successfully!", { id: toastId });
      } else {
        throw new Error("Invalid response structure from Cloudinary");
      }
    } catch (err: any) {
      console.error("Cloudinary upload failed:", err);
      toast.error(err.message || "Upload failed. Please check server logs.", {
        id: toastId,
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <Label className="text-xs font-semibold tracking-tight text-neutral-500">
        Product Video Lookbook
      </Label>
      <div className="mt-2 w-full">
        {value ? (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-200 bg-neutral-950 flex items-center justify-center">
            <button
              type="button"
              className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/85 hover:bg-white text-neutral-800 hover:text-red-650 transition-all shadow-md cursor-pointer hover:scale-110 active:scale-95 border-0"
              onClick={() => onChange("")}
              title="Remove Video"
            >
              <XCircleIcon className="h-5 w-5 text-red-500 fill-red-100" />
            </button>
            <video
              src={value}
              controls
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <Dropzone
            accept={{
              "video/*": [".mp4", ".mov", ".webm", ".avi", ".mkv"],
            }}
            maxFiles={1}
            disabled={isUploading}
            onDrop={(acceptedFiles) => {
              const file = acceptedFiles[0];
              if (file) {
                handleUpload(file);
              }
            }}
          >
            {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => (
              <div
                {...getRootProps()}
                className={cn(
                  "flex aspect-video items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-400 transition-all focus:outline-none cursor-pointer",
                  {
                    "border-blue-500 bg-blue-50/30": isDragActive && isDragAccept,
                    "border-red-500 bg-red-50/30": isDragActive && isDragReject,
                    "opacity-50 pointer-events-none": isUploading,
                  }
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-center p-4">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-neutral-500 font-medium">Uploading video...</span>
                    </div>
                  ) : (
                    <>
                      <VideoIcon className="h-10 w-10 text-neutral-400" strokeWidth={1.5} />
                      <span className="text-xs text-neutral-500 font-medium">
                        Drag & drop video here, or <span className="text-blue-600 underline">browse</span>
                      </span>
                      <span className="text-[10px] text-neutral-400">Max size 50MB (MP4, WEBM, MOV)</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </Dropzone>
        )}
      </div>
    </div>
  );
}
