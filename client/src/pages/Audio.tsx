import { useGlobalContext } from "../MyRedux";
import { FaDownload } from "react-icons/fa";

const Audio = () => {
  const {
    store: { files },
  } = useGlobalContext();

  return (
    <div>
      {files.audio.map((audio) => {
        return (
          <>
            <audio controls src={audio.url} key={audio.fullPath} />;{audio.name}
            <a className=" bg-amber-400" href={audio.url} download>
              <FaDownload />
            </a>
          </>
        );
      })}
    </div>
  );
};

export default Audio;
