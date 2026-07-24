import React, { useEffect, useState } from "react";
import { Container, TextTypo, CustomModalWithMaximize } from "../../components";
import AccessoriesTabs from "./AccessoriesTabs";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectGenerate3D } from "../../selectors/CalcSelector";
import ImagePreview from "../../components/imagePreview/ImagePreview";
import MyGlbViewer from "../../components/glbViewer/MyGlbViewer";
import { CircularProgress } from "@mui/material";


const Part3 = ({ formState, handleInputChange }) => {
  const [isTabsVisible, setIsTabsVisible] = useState(true);
  const { generate3d } = useSelector(selectGenerate3D);
  const [open, setOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const currentBlob = generate3d?.data?.blob;
  const isViewerUnavailable =
    currentBlob?.includes?.("generate3d") === true ||
    currentBlob === "" ||
    currentBlob === undefined;

  const toggleTabsVisibility = () => {
    setIsTabsVisible((prevState) => !prevState);
  };

  const handleOpen = () => {
    // checkIfFileExists(formState.restOfVariables.designId).then(exists => {
    //   console.log('Does the file exist?', exists);
    //   if (exists) {
    setOpen(true);
    // }  else {
    //   alert("File not generated")
    // }
    // });
  };
  const handleClose = () => {
    setOpen(false);
    setIsMaximized(false); // added to reset maximize on close
  };

  useEffect(() => {
    const handleViewerShortcuts = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "m") {
        if (!isViewerUnavailable) {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleViewerShortcuts);
    return () => {
      window.removeEventListener("keydown", handleViewerShortcuts);
    };
  }, [isViewerUnavailable, open]);

  return (
    <Container margin="0px 0px 10px 0px">
      <Container className="fabrication-card" bgColor="var(--fab-surface)" padding="20px" borderRadius="10px">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={toggleTabsVisibility}
        >
          <h5>
            <TextTypo
              text="Accessories /Fittings:"
              fontSize="18px"
              fontWeight="600"
            />
          </h5>
          <button
            type="button"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "16px",
            }}
          >
            {isTabsVisible ? (
              <IoIosArrowDown size={23} />
            ) : (
              <IoIosArrowForward size={23} />
            )}
          </button>
        </div>
        {isTabsVisible && (
          <AccessoriesTabs
            formState={formState}
            handleInputChange={handleInputChange}
          />
        )}
      </Container>

      <Container className="fabrication-card" bgColor="var(--fab-surface)" padding="10px" borderRadius="20px" margin="10px 0px 0px 0px">

        <ImagePreview btnText="Maximize" btnOnClick={handleOpen}
          buttonMode="icon"
          buttonLabel="Open 3D viewer fullscreen"
          disablebtn={isViewerUnavailable}
          showSpinner={
            (currentBlob !== "" &&
              currentBlob?.includes?.("generate3d") === true) || currentBlob === undefined
          }
        >
          {generate3d?.isLoading ? (
            <CircularProgress
              size={32}
              style={{
                color: "#ffffff",
              }}
            />
          ) : (
            <MyGlbViewer canvasHeight="400" canvasWidth="550" isActive={!open} />
          )}
        </ImagePreview>

      </Container>

      <CustomModalWithMaximize 
        title="" 
        open={open} 
        onClose={handleClose} 
        showButtons={false}
        isMaximized={isMaximized}
        onToggleMaximize={() => setIsMaximized(prev => !prev)}
      >
        {open && generate3d?.isLoading ? (
          <CircularProgress
            size={32}
            style={{
              color: "#ffffff",
            }}
          />
        ) : (
        // <MyGlbViewer canvasHeight="600" canvasWidth="1200" open={open} isMaximized={isMaximized}/>
        <MyGlbViewer
          canvasHeight={isMaximized ? "750" :"600"}
          canvasWidth={isMaximized ? "1600" : "1200"}
          open={open}
          isActive={open}
        />
        // <MyGlbViewer canvasHeight="700" canvasWidth="1500" open={open} />
          
        )}

      </CustomModalWithMaximize>
 


    </Container>
  );
};

export default Part3;
