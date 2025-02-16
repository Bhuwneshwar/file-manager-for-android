export interface FileSchema {
  fullPath: string;
  url: string;
  lastModified: Date;
  mimeType: string;
  name: string;
  size: number;
  type: "file" | "folder";
}
export interface FileFolderSchema {
  fullPath: string;
  url: string;
  lastModified: Date;
  mimeType?: string;
  name: string;
  size?: number;
  numberOfFiles?: number;
  type: "file" | "folder";
}

export interface Files {
  archives: FileSchema[];
  audio: FileSchema[];
  code: FileSchema[];
  documents: FileSchema[];
  images: FileSchema[];
  others: FileSchema[];
  videos: FileSchema[];
  downloads: FileSchema[];
}

export interface InitialState {
  files: Files;
  search: string;
  storageFiles: FileFolderSchema[];
}

const initialState: InitialState = {
  files: {
    archives: [],
    audio: [],
    code: [],
    documents: [],
    images: [],
    others: [],
    videos: [],
    downloads: [],
  },
  search: "",
  storageFiles: [],
};

export default initialState;
// Compare this snippet from file-manager-for-android/client/src/MyRedux/index.tsx:
