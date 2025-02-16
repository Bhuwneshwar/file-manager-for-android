// import axios from "axios";
import React from "react";
import {
  FaDownload,
  FaFileImage,
  FaFilm,
  FaMusic,
  FaFileAlt,
  FaQuestion,
  FaSync,
  FaCode,
  FaArchive,
} from "react-icons/fa";

// import { useRebybRedux } from "rebyb-redux";
// import { IState } from "../Store";
import { useGlobalContext } from "../MyRedux";
import { Link, useNavigate } from "react-router-dom";
import { sortByNew } from "../pages/Recent";
// import FileUpload from "./FilesUplads";
import { FaUpload } from "react-icons/fa6";

export function formatDate(isoDate: Date) {
  const date = new Date(isoDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return size.toFixed(2) + " " + units[unitIndex];
}

export function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

const FileManager: React.FC = () => {
  //   const {
  //     dispatch: rebybDispatch,
  //     store: { files },
  //   } = useRebybRedux<IState>();

  const {
    dispatch,
    store: { files, search },
  } = useGlobalContext();

  const navigate = useNavigate();

  const calculateSize = (files: any[]) => {
    let size = 0;
    files.forEach((item) => {
      size += item.size;
    });
    return formatSize(size);
  };

  // const [selectedFiles, setSelectedFiles] = useState([]);
  // const [uploadProgress, setUploadProgress] = useState(0);
  // const [uploading, setUploading] = useState(false);

  // const copyHere = async () => {
  //   try {
  //     const formData = new FormData();
  //     console.log({ selectedFiles });

  //     for (let i = 0; i < selectedFiles.length; i++) {
  //       formData.append("files", selectedFiles[i]);
  //     }

  //     //   dispatch("loading", true);
  //     const { data } = await axios.post(`/api/v1/upload-files`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //       onUploadProgress: (progressEvent) => {
  //         // Calculate the percentage completed
  //         const percentCompleted = Math.round(
  //           (progressEvent.loaded * 100) / (progressEvent.total || 0)
  //         );
  //         setUploadProgress(percentCompleted);
  //       },
  //     });

  //     console.log("File uploaded successfully:", { data });

  //     if (data.success) {
  //     }
  //   } catch (error: any) {
  //     console.error("Error uploading file:", error);
  //     alert(error.message);

  //     //   toast.error("Error uploading cover image!");
  //   }
  //   // dispatch("loading", false);
  // };

  // const handleFileChange = (e: any) => {
  //   setSelectedFiles(e.target.files);
  // };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Search Bar */}
      <div className="flex items-center bg-white p-3 rounded-lg shadow-md">
        <input
          type="text"
          value={search}
          onChange={(e) => dispatch("search", e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") navigate("/search");
          }}
          placeholder='Search "confirmation"'
          className="flex-grow px-4 py-2 outline-none"
        />
      </div>

      {/* Recents */}
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold mt-4">Recents</h2>
        <Link
          to={"/recent"}
          className="text-md font-semibold mt-4 text-blue-500"
        >
          See All
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-2 overflow-y-auto">
        {sortByNew(files)
          .slice(0, 4)
          .map((item) => (
            <a
              href={item.url}
              target="_blank"
              key={item.fullPath}
              className="h-24 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden"
            >
              <FaFileImage className="text-gray-500 text-3xl" />
              {/* <img
                src={item.url}
                alt={item.name}
                className="w-12 h-12 rounded-lg"
              /> */}

              {item.name}
            </a>
          ))}
      </div>

      {/* Categories */}
      <h2 className="text-lg font-semibold mt-6">Categories</h2>
      <div className="grid grid-cols-2 gap-3 mt-2">
        <Link to={"/downloads"}>
          <CategoryCard
            icon={<FaDownload />}
            title="Downloads"
            size={calculateSize(files.downloads)}
          />
        </Link>
        <Link to={"/images"}>
          <CategoryCard
            icon={<FaFileImage />}
            title="Images"
            size={calculateSize(files.images)}
          />
        </Link>
        <Link to={"/videos"}>
          <CategoryCard
            icon={<FaFilm />}
            title="Videos"
            size={calculateSize(files.videos)}
          />
        </Link>
        <Link to={"/audio"}>
          <CategoryCard
            icon={<FaMusic />}
            title="Audio"
            size={calculateSize(files.audio)}
          />
        </Link>
        <Link to={"/documents"}>
          <CategoryCard
            icon={<FaFileAlt />}
            title="Documents"
            size={calculateSize(files.documents)}
          />
        </Link>
        <Link to={"/codes"}>
          <CategoryCard
            icon={<FaCode />}
            title="Codes"
            size={calculateSize(files.code)}
          />
        </Link>
        <Link to={"/archives"}>
          <CategoryCard
            icon={<FaArchive />}
            title="Archives"
            size={calculateSize(files.archives)}
          />
        </Link>
        <Link to={"/others"}>
          <CategoryCard
            icon={<FaQuestion />}
            title="Others"
            size={calculateSize(files.others)}
          />
        </Link>
      </div>

      {/* Collections */}
      {/* <h2 className="text-lg font-semibold mt-6">Collections</h2>
      <div className="grid grid-cols-2 gap-3 mt-2">
        <CategoryCard icon={<FaStar />} title="Starred" />
        <CategoryCard icon={<FaLock />} title="Safe folder" />
      </div> */}

      {/* Storage */}
      <h2 className="text-lg font-semibold mt-6">All Storage</h2>
      <div className="grid grid-cols-2 gap-3 mt-2">
        <Link to={"/storage"}>
          <CategoryCard icon={<FaSync />} title="Storage" size="11 GB free" />
        </Link>
        <Link to={"/upload"}>
          <CategoryCard
            icon={<FaUpload />}
            title="Upload Files"
            size="Tap Hare"
          />
        </Link>
        {/* <div className="drop-files flex items-center bg-white p-3 rounded-lg shadow-md">
          <input type="file" onChange={handleFileChange} multiple />
          <button onClick={copyHere}>Upload Files</button>
          {uploadProgress > 0 && (
            <div style={{ marginTop: "20px" }}>
              <progress value={uploadProgress} max="100" />
              <span>{uploadProgress}%</span>
            </div>
          )}
        </div> */}

        {/* <FileUpload /> */}
      </div>
    </div>
  );
};

const CategoryCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  size?: string;
}> = ({ icon, title, size }) => {
  return (
    <div className="flex items-center bg-white p-3 rounded-lg shadow-md">
      <div className="text-blue-500 text-2xl">{icon}</div>
      <div className="ml-3">
        <p className="text-md font-semibold">{title}</p>
        {size && <p className="text-sm text-gray-500">{size}</p>}
      </div>
    </div>
  );
};

export default FileManager;
