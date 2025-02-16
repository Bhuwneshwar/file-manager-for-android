import { useEffect, useState } from "react";
import { useGlobalContext } from "../MyRedux";
import {
  formatDate,
  formatSize,
  truncateText,
} from "../components/FileManager";
import { FaDownload } from "react-icons/fa";
import { FileSchema } from "../MyRedux/Store";

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

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center bg-white p-3 rounded-lg shadow-md">
        <input
          type="text"
          value={search}
          onChange={(e) => dispatch("search", e.target.value)}
          // onKeyUp={(e) => {
          //   if (e.key === "Enter") navigate("/search");
          // }}
          placeholder='Search "confirmation"'
          className="flex-grow px-4 py-2 outline-none"
        />
      </div>
      <ul>
        {searchResult.map((image, index) => (
          <a
            href={image.url}
            target="_blank"
            key={index}
            className="flex items-center gap-4 p-2 border-b last:border-b-0"
          >
            <img
              src={image.url}
              alt={image.name}
              className="w-12 h-12 rounded-lg"
            />
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

export default Search;
