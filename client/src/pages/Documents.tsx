import { useGlobalContext } from "../MyRedux";
import {
  formatDate,
  formatSize,
  truncateText,
} from "../components/FileManager";
import { FaDownload } from "react-icons/fa";
import { makeIcon } from "../utils/Utils";

const Documents = () => {
  const {
    store: { files },
  } = useGlobalContext();

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Documents</h2>
      <ul>
        {files.documents.map((image, index) => (
          <a
            href={image.url}
            target="_blank"
            key={index}
            className="flex items-center gap-4 p-2 border-b last:border-b-0"
          >
            {/* <FaFileAlt fontSize={"1.5rem"} /> */}
            {makeIcon(image)}
            <div className="flex-1">
              <p className="text-sm font-medium truncate">
                {truncateText(image.name, 25)}
              </p>
              <p className="text-xs text-gray-500">
                {formatSize(image.size)}, {formatDate(image.lastModified)}
              </p>
            </div>
            <a
              href={image.url}
              target="_blank"
              download={true}
              className="text-gray-500 hover:text-black"
            >
              <FaDownload />
            </a>
          </a>
        ))}
      </ul>
    </div>
  );
};

export default Documents;
