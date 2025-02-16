import React, { useEffect } from "react";
import FileManager from "./components/FileManager";
import { Route, Routes } from "react-router-dom";
import Videos from "./pages/Videos";
import Audio from "./pages/Audio";
import Images from "./pages/ImagesList";
import Recent from "./pages/Recent";
import Search from "./pages/Search";
import Downloads from "./pages/Downloads";
import Documents from "./pages/Documents";
import Codes from "./pages/Codes";
import Archives from "./pages/Archives";
import Others from "./pages/Others";
import MainStorage from "./pages/MainStorage";
import { useGlobalContext } from "./MyRedux";
import { Files } from "./MyRedux/Store";
import axios from "axios";
import FileUpload from "./components/FilesUplads";

const App: React.FC = () => {
  const { dispatch } = useGlobalContext();

  const analytics = async () => {
    try {
      const { data }: { data: Files } = await axios.get("/api/v1/analyze");
      // console.log({ data });
      dispatch("files", data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    analytics();
  }, []);

  return (
    <Routes>
      <Route path="/storage/:dirPath?" element={<MainStorage />} />
      <Route path="/upload" element={<FileUpload />} />
      <Route path="/others" element={<Others />} />
      <Route path="/archives" element={<Archives />} />
      <Route path="/codes" element={<Codes />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/downloads" element={<Downloads />} />
      <Route path="/search" element={<Search />} />
      <Route path="/recent" element={<Recent />} />
      <Route path="/images" element={<Images />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/audio" element={<Audio />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/" element={<FileManager />} />
      <Route path="*" element={<h1>Sorry 404 page not found</h1>} />
    </Routes>
  );
};

export default App;
