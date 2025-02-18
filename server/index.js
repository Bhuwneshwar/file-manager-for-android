import express from "express";
import { config } from "dotenv";
import path from "path";
import fs from "fs";
import { promises as fspro } from "fs";
import util from "util";
import multer from "multer";
import bodyParser from "body-parser";
import crypto from "crypto";
import mime from "mime-types";
import os from "os";
import { exec } from "child_process";
import { sharedIpAddress } from "./getSharedIpAdd.js";
// import second from '../client/dist'
config();

const readdirAsync = util.promisify(fs.readdir);
const statAsync = util.promisify(fs.stat);

const app = express();

app.use(express.json());
const targetDirectory = "D:/C data"; // Change to any directory path
const downloadPath = "D:\\C data\\downloads";
app.use(express.static(targetDirectory));

// app.get("/", async (req, res) => {
//   console.log("Server down nahi ");
//   res.send("server down nahi");
// });

app.get("/api/v1/serve", (req, res) => {
  try {
    const filePath = req.query.filePath;
    // console.log({ filePath });

    if (!filePath) {
      res.sendStatus(404);
    }
    res.sendFile(filePath);
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }
});

// app.use("/api/v1/sdcard", express.static("/sdcard"));

const port = process.env.PORT || 5006;
const serverUrl = sharedIpAddress(port);
console.log({ serverUrl });

// const serverUrl = `http://localhost:${port}`;

// Define file categories
const categories = {
  images: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"],
  videos: [".mp4", ".mkv", ".avi", ".mov", ".wmv"],
  audio: [".mp3", ".wav", ".flac", ".aac", ".ogg"],
  documents: [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".txt",
    ".exe",
    ".md",
  ],
  archives: [".zip", ".rar", ".tar", ".gz", ".7z", ".apk"],
  code: [
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
    ".html",
    ".css",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".json",
    ".scss",
    ".xml",
    ".ttf",
    ".cjs",
  ],
  others: [], // For files that don't match any category,

  // downloads: ["C:/Users/Krabi/Downloads"], //
};

// 🔹 Expanded ignored paths list
const ignoredPaths = [
  "node_modules",
  ".git",
  "logs",
  "temp",
  "cache",
  "dist",
  "build",
  "out",
  ".vscode",
  ".idea",
  ".DS_Store",
  "Thumbs.db",
  "debug.log",
  "npm-debug.log",
  ".env",
  ".gitignore",
  ".eslintcache",
  "coverage",
];

// Function to categorize a file
const getCategory = (ext) => {
  for (const category in categories) {
    if (categories[category].includes(ext.toLowerCase())) {
      return category;
    }
  }
  return "others";
};

// Function to check if a file/folder should be ignored
const shouldIgnore = (filePath) => {
  return ignoredPaths.some((ignore) => filePath.includes(ignore));
};

// Function to recursively analyze files
const analyzeFiles = (dir, results = {}) => {
  if (shouldIgnore(dir)) return results; // Ignore directory

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (shouldIgnore(filePath)) return; // Ignore file/folder

    if (stats.isDirectory()) {
      analyzeFiles(filePath, results);
    } else {
      const ext = path.extname(file);
      const category = getCategory(ext);

      if (!results[category]) {
        results[category] = [];
      }
      if (!results["downloads"]) {
        results["downloads"] = [];
      }

      const mimeType = mime.lookup(filePath) || "application/octet-stream";
      const node = {
        name: file,
        type: "file",
        mimeType: mimeType,
        url: `${serverUrl}/api/v1/serve?filePath=${encodeURIComponent(
          filePath
        )}`,
        fullPath: filePath,
        size: stats.size,
        // serverUrl: sharedIpAddress,
        lastModified: stats.mtime,
      };

      results[category].push(node);

      if (filePath.startsWith(downloadPath)) {
        results["downloads"].push(node);
      }
    }
  });

  return results;
};

// Set the directory to analyze (Change this path if needed)

// Run the script
app.get("/api/v1/analyze", (req, res) => {
  const results = analyzeFiles(targetDirectory);
  console.log("File analysis completed");

  res.json(results);
});

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const directoryPath = path.join(targetDirectory, "/", "Uploads");
    // console.log({ directoryPath });

    // Example: Dynamically setting the path based on a field in the request body
    const dynamicPath = directoryPath || "./uploads"; // Use './uploads' if no dynamicPath is provided

    // Make sure the directory exists, or create it
    fs.mkdir(dynamicPath, { recursive: true }, (err) => {
      if (err) {
        return cb(err, dynamicPath);
      }
      cb(null, dynamicPath);
    });
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
      // file.originalname
    );
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 * 1024 }, // 10 GB limit per file
}).array("files", 100); // Accept up to 100 files at once

app.post("/api/v1/upload-files", (req, res) => {
  try {
    upload(req, res, (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({ message: "Upload failed", error: err });
      }
      res.status(200).json({
        message: "Files uploaded successfully",
        success: true,
        files: req.files,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(501);
  }
});

app.get("/api/v1/read-dir", async (req, res) => {
  try {
    // console.log({ ...req.query });

    const directory = req.query.dirPath || targetDirectory;

    const files = await fspro.readdir(directory);
    // console.log({ files }, "files");

    const items = [];
    for (const file of files) {
      const currentPath = path.join(directory, file);
      // console.log({ currentPath });

      try {
        const stat = fs.statSync(currentPath);

        let node;
        if (stat.isDirectory()) {
          node = {
            name: file,
            type: "folder",
            url: `${serverUrl}/api/v1/read-dir?dirPath=${encodeURIComponent(
              currentPath
            )}`,
            fullPath: currentPath,
            numberOfFiles: fs.readdirSync(currentPath).length,
            lastModified: stat.mtime,
          };
        } else {
          const mimeType =
            mime.lookup(currentPath) || "application/octet-stream";

          node = {
            name: file,
            type: "file",
            mimeType: mimeType,
            url: `${serverUrl}/api/v1/serve?filePath=${encodeURIComponent(
              currentPath
            )}`,
            fullPath: currentPath,
            size: stat.size,
            // serverUrl: sharedIpAddress,
            lastModified: stat.mtime,
          };
        }
        items.push(node);
      } catch (error) {
        console.log(error);
      }
    }

    res.send({ items });
  } catch (error) {
    console.log("error in read directory", error);
    res.status(500).send("Error reading directory");
  }
});

app.use(express.static(path.resolve("./client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve("./client/dist/index.html"));
});

app.listen(port, () => {
  console.log("running", serverUrl);
});
