import { FixedSizeList } from "react-window";
import { useGlobalContext } from "../MyRedux";
import {
  formatDate,
  formatSize,
  truncateText,
} from "../components/FileManager";
import { FaCode, FaDownload } from "react-icons/fa";

const Codes = () => {
  const {
    store: { files },
  } = useGlobalContext();

  const Item = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const file = files.code[index];
    return (
      <div style={style}>
        <a
          href={file.url}
          target="_blank"
          key={index}
          className="flex items-center gap-4 p-2 border-b last:border-b-0"
        >
          <FaCode fontSize={"1.5rem"} />
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
            download={true}
            className="text-gray-500 hover:text-black"
          >
            <FaDownload />
          </a>
        </a>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Code</h2>
      <ul>
        <FixedSizeList
          height={600} // Height of the list container
          width="100%" // Width of the list container
          itemCount={files.code.length} // Total number of items
          itemSize={72} // Height of each row
        >
          {Item}
        </FixedSizeList>
      </ul>
    </div>
  );
};

export default Codes;
