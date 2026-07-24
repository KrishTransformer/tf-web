import React from "react";
import "./ImagePreview.css";
import { CircularProgress } from "@mui/material";
import { MdOutlineFullscreen } from "react-icons/md";

const ImagePreview = ({
  btnText = "Preview",
  btnOnClick,
  disablebtn,
  showSpinner,
  children,
  buttonMode = "default",
  buttonLabel = "Open preview",
}) => {
  const isIconButton = buttonMode === "icon";

  return (
    <div className="image-container w-100">
      {/* <img
        src="https://c8.alamy.com/comp/D95B7C/electrical-station-in-portland-D95B7C.jpg"
        alt="Transformer Diagram"
        style={{backgroundColor:"#333"}}
      /> */}

      
      <button
        type="button"
        className={`preview-button${isIconButton ? " preview-button-icon" : ""}`}
        onClick={btnOnClick}
        disabled={disablebtn}
        aria-label={buttonLabel}
        title={buttonLabel}
      >
        {isIconButton ? (
          showSpinner ? (
            <div className="preview-spinner-wrapper">
              <CircularProgress size={20} color="inherit" />
            </div>
          ) : (
            <MdOutlineFullscreen size={22} />
          )
        ) : (
          <>
            {showSpinner ? (
              <div className="preview-spinner-wrapper">
                <CircularProgress size={20} color="inherit" />
              </div>
            ) : (
              btnText
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-arrow-up-right"
            >
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </>
        )}
      </button>
      

      {children}
    </div>
  );
};

export default ImagePreview;
