import axios from "axios";
import { useEffect } from "react";
import { useGlobalContext } from "../MyRedux";
import {
  formatDate,
  formatSize,
  truncateText,
} from "../components/FileManager";
import { FaFolderClosed } from "react-icons/fa6";
import { useParams } from "react-router-dom";

const MainStorage = () => {
  const {
    dispatch,
    store: { storageFiles },
  } = useGlobalContext();

  const { dirPath } = useParams();

  console.log({ dirPath });

  const readDirectory = async () => {
    try {
      const newPath = dirPath
        ? `/api/v1/read-dir?dirPath=${encodeURIComponent(dirPath)}`
        : undefined;
      const { data } = await axios.get(newPath || "/api/v1/read-dir");
      // console.log({ data });
      dispatch("storageFiles", data.items);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    readDirectory();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Storage</h2>
      <ul>
        {storageFiles.map((image, index) => (
          <a
            href={
              image.type === "folder"
                ? `/storage/${encodeURIComponent(image.fullPath)}`
                : image.url
            }
            // target="_blank"
            key={index}
            className="flex jh items-center gap-4 p-2 border-b last:border-b-0"
          >
            {/* <FaQuestion /> */}
            {image.type === "folder" ? (
              <FaFolderClosed fontSize={30} color="hsl(257, 100%, 86%)" />
            ) : (
              <img
                src={image.url}
                alt={image.name}
                className="w-12 h-12 rounded-lg "
              />
            )}

            <div className="flex-1">
              <p className="text-sm font-medium truncate">
                {truncateText(image.name, 25)}
              </p>
              <p className="text-xs text-gray-500">
                {image.type === "folder"
                  ? image.numberOfFiles + " Files"
                  : formatSize(image.size || 0)}
                , {formatDate(image.lastModified)}
              </p>
            </div>
            <a
              href={image.url}
              target="_blank"
              download={true}
              className="text-gray-500 hover:text-black"
            >
              {/* <FaDownload /> */}
            </a>
          </a>
        ))}
      </ul>
    </div>
  );
};

export default MainStorage;
