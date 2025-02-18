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
import { FixedSizeList } from "react-window";
import { makeIconFolder } from "../utils/Utils";

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

  const Item = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const file = storageFiles[index];
    return (
      <div style={style}>
        <a
          href={
            file.type === "folder"
              ? `/storage/${encodeURIComponent(file.fullPath)}`
              : file.url
          }
          // target="_blank"
          key={index}
          className="flex jh items-center gap-4 p-2 border-b last:border-b-0"
        >
          {file.type === "folder" ? (
            <FaFolderClosed fontSize={30} />
          ) : (
            makeIconFolder(file)
          )}

          <div className="flex-1">
            <p className="text-sm font-medium truncate">
              {truncateText(file.name, 25)}
            </p>
            <p className="text-xs text-gray-500">
              {file.type === "folder"
                ? file.numberOfFiles + " Files"
                : formatSize(file.size || 0)}
              , {formatDate(file.lastModified)}
            </p>
          </div>
          <a
            href={file.url}
            target="_blank"
            download={true}
            className="text-gray-500 hover:text-black"
          ></a>
        </a>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Storage</h2>
      <ul>
        <FixedSizeList
          height={600} // Height of the list container
          width="100%" // Width of the list container
          itemCount={storageFiles.length} // Total number of items
          itemSize={72} // Height of each row
        >
          {Item}
        </FixedSizeList>{" "}
      </ul>
    </div>
  );
};

export default MainStorage;
