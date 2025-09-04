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
      <DialogContent className="bg-gradient-to-br from-[#11042F]/95 to-[#020106]/95 backdrop-blur-xl border border-[#2a2a4e]/50 rounded-3xl shadow-2xl shadow-[#EE4FFB]/10 p-0 overflow-hidden">
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/5 to-[#28A9A3]/5 opacity-50"></div>

          <div className="flex flex-col items-center justify-center h-full relative z-10">
            <DialogTitle className="sr-only">
              Upload Profile Picture
            </DialogTitle>

            <div className="p-4 lg:p-8 w-full">
              <div className="text-center space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="p-3 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-2xl w-fit mx-auto">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Upload Profile Picture
                  </h2>
                  <p className="text-[#A5A9C1] text-sm">
                    Choose a profile picture for your account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-left">
                    {!selectedFile ? (
                      <div
                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                          dragActive
                            ? "border-[#EE4FFB] bg-[#EE4FFB]/10"
                            : "border-white/20 hover:border-[#EE4FFB]/50 bg-white/5"
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

                        <Upload className="mx-auto h-12 w-12 text-[#A5A9C1] mb-4" />
                        <p className="text-white text-lg font-medium mb-2">
                          Drop your image here
                        </p>
                        <p className="text-[#A5A9C1] text-sm mb-4">
                          or click to browse files
                        </p>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLoading}
                          className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-[#EE4FFB]/50 transition-all duration-300"
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
                            className="size-48 object-cover rounded-2xl border border-white/20 shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            disabled={isLoading}
                            className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full p-1 transition-all duration-300 transform hover:scale-110"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-left bg-white/5 rounded-2xl p-4 border border-white/20">
                          <p className="text-sm text-white">
                            <span className="font-medium">File:</span>{" "}
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-[#A5A9C1]">
                            <span className="font-medium">Size:</span>{" "}
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-sm text-[#A5A9C1]">
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
                    className="w-full bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] hover:from-[#FF6B9D] hover:to-[#EE4FFB] text-white py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#EE4FFB]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Uploading...
                      </div>
                    ) : (
                      "Upload Profile Picture"
                    )}
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
