import React, { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { Button } from "../Button";
import Image from "next/image";
import { RiDeleteBin6Line } from "react-icons/ri";

function imageSize(
  url: string,
  setImageSize: React.Dispatch<
    React.SetStateAction<{
      width: number;
      height: number;
      size: string;
    }>
  >
) {
  const img = document.createElement("img");
  img.onload = () => {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const size = img.sizes;
    setImageSize((prev) => ({ ...prev, width, height, size }));
  };
  img.src = url;
}

const ImageInput = ({
  titleText,
  handleError,
  errorText = handleError ? handleError[0] : undefined,
  isError = handleError ? handleError[1] : undefined,
  initialImage,
  setUploadedImage,
  maxHeightDisplay,
  isDisabled,
  maxImageSize = 500,
}: {
  titleText?: string;
  handleError?: [string, boolean];
  errorText?: string;
  isError?: boolean;
  initialImage?: string;
  setUploadedImage: React.Dispatch<React.SetStateAction<File | null>>;
  maxHeightDisplay?: string;
  isDisabled?: boolean;
  maxImageSize?: number;
}) => {
  const [initialImageState, setInitialImageState] = useState(initialImage);
  const [imageInput, setImageInput] = useState<File | null>(null);
  const [imageInputSize, setImageInputSize] = useState({
    width: 0,
    height: 0,
    size: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const [isWrongFormat, setIsWrongFormat] = useState(false);
  const [isFileSizeExceedsLimit, setIsFileSizeExceedsLimit] = useState(false);

  useEffect(() => {
    if (initialImage !== undefined && initialImage !== "") {
      imageSize(initialImage, setImageInputSize);
      return;
    }
    if (imageInput !== null) {
      imageSize(URL.createObjectURL(imageInput), setImageInputSize);
      return;
    }
  }, [imageInput, initialImage]);

  const handleDrag = function (e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
      return;
    } else if (e.type === "dragleave") {
      setDragActive(false);
      return;
    }
  };

  const handleDrop = function (e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files;

    if (file && file[0]) {
      if (file[0]["type"].split("/")[0] !== "image") {
        setIsWrongFormat(true);
        return;
      }
      if (maxImageSize !== undefined && file[0].size / 1000 > maxImageSize) {
        setIsFileSizeExceedsLimit(true);
        return;
      }
      if (file !== null) {
        setIsWrongFormat(false);
        setImageInput(file[0]);
        setUploadedImage(file[0]);
        return;
      }
    }
  };

  return (
    <div className="w-full">
      <div>
        {titleText && (
          <div className="pb-1">
            <span className="label-text text-lg">{titleText}</span>
          </div>
        )}
      </div>
      <div
        className={`border-gray-300 bg-gray-100 border-2 ${
          isDisabled ? "border-none" : "border-dashed"
        } rounded-lg w-full p-4 pointer-events-auto`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          hidden
          type="file"
          id="upload-image"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file = (e.target as HTMLInputElement).files;
            if (file && file[0]) {
              if (file[0]["type"].split("/")[0] !== "image") {
                setIsWrongFormat(true);
                return;
              }
              if (
                maxImageSize !== undefined &&
                file[0].size / 1000 > maxImageSize
              ) {
                setIsFileSizeExceedsLimit(true);
                return;
              }
              if (file !== null) {
                setIsWrongFormat(false);
                setImageInput(file[0]);
                setUploadedImage(file[0]);
                return;
              }
            }
          }}
          disabled={isDisabled}
        />

        <div
          className={`w-1/2 m-auto ${maxHeightDisplay}  min-h-[200px] h-full  flex flex-col justify-center items-center gap-4 ${
            dragActive ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          {imageInput === null &&
            (initialImageState === undefined || initialImageState === "") && (
              <>
                <FaUpload size={50} color={dragActive ? "grey" : "black"} />
                {dragActive ? (
                  <>Drop your file here</>
                ) : (
                  <>
                    <span>Drag and drop file to upload</span>
                    <div
                      className={`divider w-4/5 m-auto ${
                        dragActive
                          ? "pointer-events-none"
                          : "pointer-events-auto"
                      }`}
                    >
                      OR
                    </div>
                    <label htmlFor="upload-image">
                      <div
                        className={`btn text-xl text-white w-full bg-secondary_blue ${
                          dragActive
                            ? "pointer-events-none"
                            : "pointer-events-auto"
                        } `}
                      >
                        Choose File
                      </div>
                    </label>
                  </>
                )}
              </>
            )}
          {(imageInput !== null ||
            (initialImageState !== undefined && initialImageState !== "")) && (
            <>
              <div
                className={`text-center flex flex-col gap-2 ${
                  dragActive ? "pointer-events-none" : "pointer-events-auto"
                }`}
              >
                <div className="relative mx-auto">
                  <Image
                    src={
                      imageInput !== null
                        ? URL.createObjectURL(imageInput)
                        : initialImageState !== undefined
                        ? initialImageState
                        : ""
                    }
                    alt="uploaded image"
                    height={0}
                    width={0}
                    style={{
                      height: 150,
                      width: "auto",
                      maxWidth: 300,
                    }}
                    sizes="100vw"
                  />
                  {!isDisabled && (
                    <div
                      className="absolute -right-[75px] top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-gray-200 p-4 active:scale-[85%] hover:bg-gray-300"
                      onClick={() => {
                        setImageInput(null);
                        setInitialImageState(undefined);
                        setUploadedImage(null);
                      }}
                    >
                      <RiDeleteBin6Line size={30} />
                    </div>
                  )}
                </div>
                <span>
                  {imageInputSize.width} x {imageInputSize.height} px{" "}
                </span>
                {imageInput !== null && (
                  <span>{(imageInput.size / 1000).toFixed(1)} kB</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {isWrongFormat && (
        <div
          className={`label  ${
            isWrongFormat ? "visible" : "invisible"
          } pb-0 pt-1`}
        >
          <span
            className={`label-text-alt   ${
              isWrongFormat && "text-[red] animate-wiggle"
            }`}
          >
            {isWrongFormat &&
              "Unsupported format. Accepted formats: .png, .jpeg "}
          </span>
        </div>
      )}
      {isFileSizeExceedsLimit && (
        <div
          className={`label  ${
            isFileSizeExceedsLimit ? "visible" : "invisible"
          } pb-0 pt-1`}
        >
          <span
            className={`label-text-alt   ${
              isFileSizeExceedsLimit && "text-[red] animate-wiggle"
            }`}
          >
            {isFileSizeExceedsLimit &&
              `File size exceeds limit. Maximum uploaded size: ${maxImageSize} kB `}
          </span>
        </div>
      )}
      {errorText && (
        <div
          className={`label  ${isError ? "visible" : "invisible"} pb-0 pt-1`}
        >
          <span
            className={`label-text-alt   ${
              isError && "text-[red] animate-wiggle"
            }`}
          >
            {isError && errorText}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageInput;
