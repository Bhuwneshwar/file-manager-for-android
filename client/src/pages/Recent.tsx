import { useGlobalContext } from "../MyRedux";
import { Files } from "../MyRedux/Store";
import { FixedSizeList } from "react-window";
import FileItem from "../components/FileItem";

export const sortByNew = (files: Files) => {
  return [
    ...files.archives,
    ...files.audio,
    ...files.code,
    ...files.documents,
    ...files.images,
    ...files.others,
    ...files.videos,
  ].sort(
    (a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );
};

const Recent = () => {
  const {
    store: { files },
  } = useGlobalContext();

  const recentItem = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const file = sortByNew(files)[index];
    return (
      <div style={style}>
        <FileItem file={file} />
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Recent</h2>
      <ul>
        <FixedSizeList
          height={600} // Height of the list container
          width="100%" // Width of the list container
          itemCount={sortByNew(files).length} // Total number of items
          itemSize={72} // Height of each row
        >
          {recentItem}
        </FixedSizeList>
      </ul>
    </div>
  );
};

export default Recent;
