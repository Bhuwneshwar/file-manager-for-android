import { FileSchema } from "../MyRedux/Store";
import { makeIcon } from "../utils/Utils";
import { formatDate, formatSize, truncateText } from "./FileManager";
import { FaDownload } from "react-icons/fa";

const FileItem = ({ file }: { file: FileSchema }) => (
  <a
    href={file.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 p-2 border-b last:border-b-0 hover:bg-gray-50"
  >
    {makeIcon(file)}
    <div className="flex-1">
      <p className="text-sm font-medium truncate">
        {truncateText(file.name, 25)}
      </p>
      <p className="text-xs text-gray-500">
        {formatSize(file.size)}, {formatDate(file.lastModified)}
      </p>
    </div>
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      download={true}
      className="text-gray-500 hover:text-black"
    >
      <FaDownload />
    </a>
  </a>
);

export default FileItem;
