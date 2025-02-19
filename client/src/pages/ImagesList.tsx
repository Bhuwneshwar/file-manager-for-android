import { useGlobalContext } from "../MyRedux";
import {
  formatDate,
  formatSize,
  truncateText,
} from "../components/FileManager";
import { FaDownload } from "react-icons/fa";
// import RecyclableListView from "../components/RecyclableListView";
import { FixedSizeList as List } from "react-window";

const ImageList = () => {
  const {
    store: { files },
  } = useGlobalContext();

  const sortedBySize = files.images.sort((a, b) => a.size - b.size);

  const imageItem = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    return (
      <div style={style}>
        <a
          href={sortedBySize[index].url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-2 border-b last:border-b-0 hover:bg-gray-50"
        >
          <img
            src={sortedBySize[index].url}
            alt={sortedBySize[index].name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-medium truncate">
              {truncateText(sortedBySize[index].name, 25)}
            </p>
            <p className="text-xs text-gray-500">
              {formatSize(sortedBySize[index].size)},{" "}
              {formatDate(sortedBySize[index].lastModified)}
            </p>
          </div>
          <a
            href={sortedBySize[index].url}
            target="_blank"
            rel="noopener noreferrer"
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
      <h2 className="text-lg font-semibold mb-4">Images</h2>
      <ul>
        {/* <RecyclableListView /> */}

        <List
          height={600} // Height of the list container
          width="100%" // Width of the list container
          itemCount={files.images.length} // Total number of items
          itemSize={72} // Height of each row
        >
          {imageItem}
        </List>
      </ul>
    </div>
  );
};

export default ImageList;
