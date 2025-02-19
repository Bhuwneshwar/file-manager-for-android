import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { useGlobalContext } from "../MyRedux";
import { formatSize, truncateText } from "../components/FileManager";
import { FaDownload } from "react-icons/fa";

interface Song {
  id: string;
  title: string;
  size: number;
  format: string;
  src: string;
}

export default function MusicPlayer() {
  const {
    store: { files },
  } = useGlobalContext();

  const musicList: Song[] = files.audio
    .map((audio) => {
      const arrByDot = audio.name.split(".");
      const format = arrByDot[arrByDot.length - 1].toUpperCase();

      return {
        id: audio.fullPath,
        title: audio.name,
        size: audio.size,
        format,
        src: audio.url,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  const [playing, setPlaying] = useState<boolean>(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>("0:00:00");
  const [targetTime, setTargetTime] = useState<string>("0:00:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (musicList.length > 0 && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = new Audio(musicList[currentSongIndex].src);

      if (playing) audioRef.current.play();
      // setTargetTime(formatTime(audioRef.current.duration));
      audioRef.current.ontimeupdate = () => {
        // console.log(audioRef.current?.duration);

        setProgress(
          audioRef.current
            ? (audioRef.current.currentTime / audioRef.current.duration) * 100
            : 0
        );
        setTargetTime(formatTime(audioRef.current?.duration || 0));
        setCurrentTime(formatTime(audioRef.current?.currentTime || 0));

        if (
          (audioRef.current
            ? (audioRef.current.currentTime / audioRef.current.duration) * 100
            : 0) === 100
        ) {
          changeSong(currentSongIndex + 1);
        }
      };
    }

    // return () => {
    //   if (audioRef.current) {
    //     if (playing) audioRef.current.pause();
    //   }
    // };
  }, [currentSongIndex]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const changeSong = (index: number) => {
    if (index >= 0 && index < musicList.length) {
      setCurrentSongIndex(index);
      setPlaying(true);
    }
    if (index >= musicList.length || index < 0) {
      setCurrentSongIndex(0);
      setPlaying(true);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">My Music Files</h2>

      <div className="flex flex-col h-screen">
        <div className="bg-gray-800  p-4 rounded-lg mb-4">
          <p className=" text-center mb-2">
            {truncateText(musicList[currentSongIndex].title, 35)}
          </p>
          <div className="bg-gray-800 flex items-center justify-between">
            <button
              onClick={() => changeSong(currentSongIndex - 1)}
              className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            <button
              onClick={togglePlayPause}
              className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
            >
              {playing ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={() => changeSong(currentSongIndex + 1)}
              className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
          <div className="flex gap-1 justify-center">
            <span className="">{currentTime}</span>

            <input
              type="range"
              className="w-full "
              min={0}
              max={100}
              value={progress}
              onChange={(e) => {
                if (audioRef.current) {
                  audioRef.current.currentTime =
                    (parseFloat(e.target.value) / 100) *
                    audioRef.current.duration;
                }
              }}
            />
            <span>{targetTime}</span>
          </div>
          <audio hidden ref={audioRef}></audio>
        </div>
        <div className="mb-4 h-full overflow-auto ">
          {musicList.map((song, index) => (
            <div
              key={song.id}
              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer ${
                currentSongIndex === index ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
              onClick={() => changeSong(index)}
            >
              <div>
                <p className="font-light">{truncateText(song.title, 35)}</p>
                <p className="text-xs text-gray-400">
                  {formatSize(song.size)} | {song.format}
                </p>
              </div>
              <a href={song.src} target="_blank">
                <FaDownload />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
