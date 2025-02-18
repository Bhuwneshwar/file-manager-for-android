import { useEffect, useState } from "react";
import { useGlobalContext } from "../MyRedux";
import { FileSchema } from "../MyRedux/Store";

import { FixedSizeList as List } from "react-window";
import FileItem from "../components/FileItem";

const Search = () => {
  const {
    dispatch,
    store: { files, search },
  } = useGlobalContext();

  const [searchResult, setSearchResult] = useState<FileSchema[]>([]);

  // const navigate = useNavigate();

  useEffect(() => {
    const allFiles = [
      ...files.archives,
      ...files.audio,
      ...files.code,
      ...files.documents,
      ...files.images,
      ...files.others,
      ...files.videos,
    ];

    const pattern = new RegExp(search, "i"); // Create regex object with dynamic value

    const filtered = allFiles.filter((v) =>
      pattern.test(v.name.replace(/[.\-/]/gi, " "))
    );
    console.log({ filtered });

    setSearchResult(filtered);
  }, [search]);

  const searchItem = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const file = searchResult[index];
    return (
      <div style={style}>
        <FileItem file={file} />
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center bg-white p-3 rounded-lg shadow-md">
        <input
          type="text"
          value={search}
          onChange={(e) => dispatch("search", e.target.value)}
          placeholder='Search "confirmation"'
          className="flex-grow px-4 py-2 outline-none"
        />
      </div>
      <ul>
        <List
          height={600} // Height of the list container
          width="100%" // Width of the list container
          itemCount={searchResult.length} // Total number of items
          itemSize={72} // Height of each row
        >
          {searchItem}
        </List>
      </ul>
    </div>
  );
};

export default Search;
