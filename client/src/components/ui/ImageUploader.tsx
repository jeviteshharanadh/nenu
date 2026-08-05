import React, { useState } from "react";
import { UploadCloud, X, Camera, Image as ImageIcon, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  files,
  onChange,
  maxFiles = 3,
  maxSizeMB = 5,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setError(null);

    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
  };

  const validateAndAddFiles = (newFiles: File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed per request.`);
      return;
    }

    const validFiles: File[] = [];
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    for (const file of newFiles) {
      if (!allowedTypes.includes(file.type)) {
        setError(`File ${file.name} is not a valid format (JPEG, PNG, WEBP only).`);
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File ${file.name} exceeds ${maxSizeMB}MB size limit.`);
        return;
      }
      validFiles.push(file);
    }

    onChange([...files, ...validFiles]);
  };

  const removeFile = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    onChange(updated);
    setError(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">
        Photos of Affected Crop / Symptoms <span className="text-slate-500">(Optional, Max {maxFiles} images)</span>
      </label>

      {error && (
        <div className="flex items-center space-x-2 text-rose-400 text-xs bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/50">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Zone */}
      {files.length < maxFiles && (
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700/80 hover:border-agri-500 rounded-xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all group">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-agri-500/10 text-agri-400 rounded-full group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-agri-400" />
          </div>
          <p className="text-sm font-medium text-slate-200">
            Click to upload or take a photo
          </p>
          <p className="text-xs text-slate-500 mt-1">
            JPEG, PNG, or WEBP (Max {maxSizeMB}MB each)
          </p>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      )}

      {/* Image Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 pt-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-700 bg-slate-900 aspect-square">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-slate-950/80 text-slate-300 hover:text-rose-400 rounded-full transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-slate-950/75 px-2 py-1 text-[10px] text-slate-300 truncate">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
