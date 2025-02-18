import { FileFolderSchema, FileSchema } from "../MyRedux/Store";

import {
  FaFile,
  FaFileImage,
  FaFilePdf,
  FaFileAudio,
  FaFileVideo,
  FaFileArchive,
  FaFileCode,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
} from "react-icons/fa";

// MIME type to icon mapping
export const mimeTypeToIcon: any = {
  // Images
  "image/jpeg": FaFileImage,
  "image/png": FaFileImage,
  "image/gif": FaFileImage,
  "image/svg+xml": FaFileImage,

  // Video
  "video/mp4": FaFileVideo,
  "video/quicktime": FaFileVideo,
  "video/x-msvideo": FaFileVideo,

  // PDF
  "application/pdf": FaFilePdf,

  // Audio
  "audio/mpeg": FaFileAudio,
  "audio/wav": FaFileAudio,
  "audio/ogg": FaFileAudio,

  // Archives
  "application/zip": FaFileArchive,
  "application/x-tar": FaFileArchive,
  "application/x-rar-compressed": FaFileArchive,

  // Code
  "text/plain": FaFileCode,
  "text/html": FaFileCode,
  "application/javascript": FaFileCode,
  "application/json": FaFileCode,

  // Documents
  "application/msword": FaFileWord,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    FaFileWord,
  "application/vnd.ms-excel": FaFileExcel,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    FaFileExcel,
  "application/vnd.ms-powerpoint": FaFilePowerpoint,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    FaFilePowerpoint,

  // Default
  default: FaFile,
};

export const makeIcon = (file: FileSchema) => {
  if (file.name.endsWith(".ts")) {
    const Icon = mimeTypeToIcon["text/html"];
    return <Icon fontSize="1.5rem" />;
  } else if (file.mimeType.startsWith("image/")) {
    return (
      <img src={file.url} alt={file.name} className="w-12 h-12 rounded-lg" />
    );
  } else if (file.mimeType.startsWith("video/")) {
    return <video src={file.url} className="w-12 h-12 rounded-lg" />;
  } else {
    const Icon = mimeTypeToIcon[file.mimeType] || mimeTypeToIcon.default;
    return <Icon fontSize="1.5rem" />;
  }
};
export const makeIconFolder = (file: FileFolderSchema) => {
  if (file.name.endsWith(".ts")) {
    const Icon = mimeTypeToIcon["text/html"];
    return <Icon fontSize="1.5rem" />;
  } else if (file.mimeType?.startsWith("image/")) {
    return (
      <img src={file.url} alt={file.name} className="w-12 h-12 rounded-lg" />
    );
  } else if (file.mimeType?.startsWith("video/")) {
    return <video src={file.url} className="w-12 h-12 rounded-lg" />;
  } else {
    const Icon =
      mimeTypeToIcon[file.mimeType || "default"] || mimeTypeToIcon.default;
    return <Icon fontSize="1.5rem" />;
  }
};
