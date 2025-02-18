import { useGlobalContext } from "../MyRedux";
import {
  formatDate,
  formatSize,
  truncateText,
} from "../components/FileManager";
import { FaDownload } from "react-icons/fa";
import { FixedSizeList as List } from "react-window";

const Videos = () => {
  const {
    store: { files },
  } = useGlobalContext();

  const videoItem = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => (
    <div style={style}>
      <a
        href={files.videos[index].url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-2 border-b last:border-b-0 hover:bg-gray-50"
      >
        <video
          src={files.videos[index].url}
          // alt={files.videos[index].name}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-medium truncate">
            {truncateText(files.videos[index].name, 25)}
          </p>
          <p className="text-xs text-gray-500">
            {formatSize(files.videos[index].size)},{" "}
            {formatDate(files.videos[index].lastModified)}
          </p>
        </div>
        <a
          href={files.videos[index].url}
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

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Videos</h2>
      <ul>
        <List
          height={600} // Height of the list container
          width="100%" // Width of the list container
          itemCount={files.videos.length} // Total number of items
          itemSize={72} // Height of each row
        >
          {videoItem}
        </List>
      </ul>
    </div>
  );
};

export default Videos;
