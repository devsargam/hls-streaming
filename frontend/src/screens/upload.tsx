import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const a = axios.create({ baseURL: "http://localhost:3000" });

export default function Upload() {
  return (
    <main className="py-6 flex flex-col gap-y-6">
      <h1 className="text-center text-red-500 font-bold text-xl">
        Upload Route
      </h1>
      <MyDropzone />
    </main>
  );
}

function MyDropzone() {
  // TODO: Fix the types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop = useCallback(async (acceptedFiles: any) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    const upload = await a.put("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(upload.data);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <div className="flex items-center justify-center w-60 mx-auto">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input id="dropzone-file" className="hidden" {...getInputProps()} />
        </label>
      </div>

      {/* {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )} */}
    </div>
  );
}
