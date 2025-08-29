"use client";

import { useMutation } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { tasksApi } from "@/lib/api/tasks";

interface AvatarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AvatarModal({
  open,
  onOpenChange,
  onSuccess,
}: AvatarModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setDragActive(false);
    }
  }, [open]);

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const uploadAvatarMutation = useMutation({
    mutationFn: tasksApi.uploadAvatar,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Profile picture uploaded successfully!");
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to upload profile picture");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to upload profile picture"
      );
    },
  });

  const validateFile = (file: File) => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, or WebP)";
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select an image file");
      return;
    }

    uploadAvatarMutation.mutate(selectedFile);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const isLoading = uploadAvatarMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-w-lg min-h-[500px] mx-4 p-0 border border-white/10 overflow-hidden rounded-xl"
        showCloseButton={false}
        style={{
          background: "linear-gradient(to bottom, #11042F, #04010E)",
        }}
      >
        <div className="relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex flex-col items-center justify-center h-full">
            <DialogTitle className="sr-only">
              Upload Profile Picture
            </DialogTitle>

            <div className="p-8 w-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Upload Profile Picture
                </h2>
                <p className="text-gray-400 text-sm mb-8">
                  Choose a profile picture for your account
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-left">
                    {!selectedFile ? (
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          dragActive
                            ? "border-purple-400 bg-purple-400/10"
                            : "border-gray-500 hover:border-gray-400"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFileInputChange}
                          className="hidden"
                          disabled={isLoading}
                        />

                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-white text-lg font-medium mb-2">
                          Drop your image here
                        </p>
                        <p className="text-gray-400 text-sm mb-4">
                          or click to browse files
                        </p>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLoading}
                          className="bg-transparent border-gray-500 text-white hover:bg-gray-800 hover:border-gray-400"
                        >
                          Choose File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative flex items-center justify-center">
                          <img
                            src={previewUrl!}
                            alt="Preview"
                            className="size-48 object-cover rounded-lg border border-gray-500 "
                          />
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            disabled={isLoading}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-gray-300">
                            <span className="font-medium">File:</span>{" "}
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            <span className="font-medium">Size:</span>{" "}
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-sm text-gray-400">
                            <span className="font-medium">Type:</span>{" "}
                            {selectedFile.type}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !selectedFile}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Uploading..." : "Upload Profile Picture"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
