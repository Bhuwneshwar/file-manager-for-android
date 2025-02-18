import { useGlobalContext } from "../MyRedux";
import { FixedSizeList } from "react-window";
import FileItem from "../components/FileItem";

const Downloads = () => {
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
    const file = files.downloads[index];
    return (
      <div style={style}>
        <FileItem file={file} />
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Downloads</h2>
      <ul>
        <FixedSizeList
          height={600} // Height of the list container
          width="100%" // Width of the list container
          itemCount={files.downloads.length} // Total number of items
          itemSize={72} // Height of each row
        >
          {Item}
        </FixedSizeList>
      </ul>
    </div>
  );
};

export default Downloads;
