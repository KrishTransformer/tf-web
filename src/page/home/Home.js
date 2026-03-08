import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  CheckedTable,
  Container,
  FlexContainer,
  Layout,
  SearchInput,
} from "../../components";
import { useNavigate } from "react-router-dom";
import { useActions } from "../../app/use-Actions";
import { fetchEntity, fetchSearchEntity } from "../../actions/EntityActions";
import { clearCalc, generate3DCleared } from "../../actions/CalcActions";
import { useSelector } from "react-redux";
import Pagination from "../../components/Pagination/Pagination";
import { selectEntity } from "../../selectors/EntitySelector";
import CircularProgress from "@mui/material/CircularProgress"; // Import a loading spinner
import { selectGenerate3D, } from "../../selectors/CalcSelector";
import { resetCustomerData } from "../../actions/FileActions";
import { FaRegTrashAlt } from "react-icons/fa";
import { IconButton } from "@mui/material";
import ConfirmationDialog from "../../components/DeletingConfirmation";
import { deleteEntity } from "../../actions/EntityActions";
import { selectCalc } from "../../selectors/CalcSelector";
import { IoMdPerson } from "react-icons/io";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { signOut } from "../../actions/AuthActions";
import { selectAuth } from "../../selectors/AuthSelector";
import CustomCookies from "../../api/Cookies";
import { postApi } from "../../api";
import { COMMON_SERVICE } from "../../constants/CommonConstants";
import { parseJwt } from "../../utils/AuthUtil";
import logo from "../../assets/dstar-electric-logo.png";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const size = 10; // Number of entries per page
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDesigns, setSelectedDesigns] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const settingsMenuRef = useRef(null);

  const { design } = useSelector(selectEntity);
  const { name } = useSelector(selectAuth);
  const totalEntries = design?.data?.total || 0;
  const totalPages = Math.ceil(totalEntries / size);
  const { generate3d } = useSelector(selectGenerate3D);
  const { twoWindings } = useSelector(selectCalc);
  const [sortOption, setSortOption] = useState("updatedAt-DESC");
  
  const actions = useActions({
    fetchEntity,
    fetchSearchEntity,
    clearCalc,
    generate3DCleared,
    resetCustomerData,
    deleteEntity,
    signOut,
  });

  const profileInfo = useMemo(() => {
    const fallback = {
      username: name || "User",
      email: "N/A",
    };

    try {
      const token = CustomCookies.getAccessToken();
      if (!token) return fallback;
      const payload = parseJwt(token);
      const payloadEmail =
        Object.prototype.hasOwnProperty.call(payload || {}, "email") && payload?.email
          ? payload.email
          : "N/A";

      return {
        username:
          payload?.name ||
          payload?.preferred_username ||
          payload?.username ||
          name ||
          "User",
        email: payloadEmail,
      };
    } catch (error) {
      return fallback;
    }
  }, [name]);

  const searchPayload = {
    "attributeName": ["designId"],
    "attributeValue": searchQuery,
    "sortAttribute": "updatedAt",
    "sortOrder": "DESC"
  }

  let offset = (currentPage - 1);

  useEffect(() => {
    if (searchQuery === "") {
      fetchData();
    }
    else {
      actions.fetchSearchEntity("design", `offset=${offset}&size=${size}`, searchPayload);
    }
    if (generate3d?.data?.blob) {
      URL.revokeObjectURL(generate3d?.data?.blob);
      actions.generate3DCleared()
    }

  }, [currentPage, sortOption]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileCardOpen(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchData = () => {
    const [sortAttribute, sortOrder] = sortOption.split("-");
    //let offset = (currentPage - 1);
    actions.fetchEntity("design", `offset=${offset}&size=${size}&&sortAttribute=${sortAttribute}&sortOrder=${sortOrder}`);
  };

  const handleNewDesignClick = () => {
    console.log("new design click")
    actions.fetchEntity("lomMaterial", `offset=0&size=100&sortAttribute=createdAt&sortOrder=ASC`);
    actions.clearCalc();
    actions.resetCustomerData();
    navigate("/2windings/new");

  };

  const handleTrashClose = () => setDeleteConfirmOpen(false);
  const handleTrashOpen = () => setDeleteConfirmOpen(true);
  const handleDeleteEntities = () => {
    selectedDesigns.forEach((id) => {
      actions.deleteEntity(id, "design");
    });

    setDeleteConfirmOpen(false);
    setSelectedDesigns([]);
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    let offset = (currentPage - 1);
    if (searchQuery !== "") {
      actions.fetchSearchEntity("design", `offset=${offset}&size=${size}`, searchPayload);
    } else {
      fetchData();
    }
  };

  const handleLogout = async () => {
    const accessToken = CustomCookies.getAccessToken();
    try {
      if (accessToken) {
        await postApi(
          "/auth/logout",
          {},
          { Authorization: `Bearer ${accessToken}` },
          {},
          COMMON_SERVICE
        );
      }
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      actions.signOut();
      CustomCookies.clearTokens();
      setIsProfileCardOpen(false);
      navigate("/");
    }
  };

  const handleUpdateRates = () => {
    setIsSettingsOpen(false);
    navigate("/lomCost");
  };

  // let a;
  // console.log(a.name)
  // console.log("selectedDesigns in home page:", selectedDesigns)

  return (
    <Layout hideSidebar>
      <div className="home-page-wrapper">
        <FlexContainer align="center" justify="space-between" margin="2px 2px">
          <FlexContainer align="center" gap="10px">
            <img src={logo} alt="Company Logo" className="home-header-logo" />
            <h1 className="home-header-title" data-text="Krish Transformer Design Software">
              Krish Transformer Design Software
            </h1>
          </FlexContainer>
          <FlexContainer align="center">
            <div className="home-settings-menu" ref={settingsMenuRef}>
              <button
                type="button"
                className="home-settings-btn"
                onClick={() => setIsSettingsOpen((prev) => !prev)}
              >
                <IoSettingsOutline className="home-settings-icon" />
              </button>
              {isSettingsOpen && (
                <div className="home-settings-dropdown">
                  <button type="button" className="home-settings-item" onClick={handleUpdateRates}>
                    Update Rates
                  </button>
                </div>
              )}
            </div>
            <button className="home-new-design-btn" onClick={handleNewDesignClick}>
              + New Design
            </button>
            
            <div className="home-profile-menu" ref={profileMenuRef}>
              <button
                type="button"
                className="home-profile-link"
                onClick={() => setIsProfileCardOpen((prev) => !prev)}
              >
                <div className="home-profile-avatar">
                  <IoMdPerson className="home-profile-icon" />
                </div>
              </button>

              {isProfileCardOpen && (
                <div className="home-profile-card">
                  <div className="home-profile-card-info">
                    <p className="home-profile-name">{profileInfo.username}</p>
                    <p className="home-profile-email">{profileInfo.email}</p>
                  </div>
                  <button type="button" className="home-logout-btn" onClick={handleLogout}>
                    <IoLogOutOutline className="home-logout-icon" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </FlexContainer>
        </FlexContainer>
        <div className="home-header-divider" />


        <Container borderRadius="8px" margin="13px 2px">
          <FlexContainer justify="left" align="center" gap="12px" padding="10px 12px">
            <SearchInput placeholder="Search by Des Ref." onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
              onSortChange={handleSortChange} width="400px" />
            {selectedDesigns.length > 0 && (
              <IconButton
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "white",
                  backgroundColor: "#000000ff",
                  padding: "7px 30px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#000000ff",
                  },
                }}
                onClick={handleTrashOpen}
              >
                <FaRegTrashAlt style={{ marginRight: "8px" }} />
                Delete Design ({selectedDesigns?.length})
              </IconButton>
            )}
          </FlexContainer>
        </Container>

        <Container bgColor="white" padding="0px" borderRadius="8px" boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)">
          {design?.isLoading ? ( // Show loading spinner if isLoading is true
            <FlexContainer align="center" justify="center" padding="20px">
              <CircularProgress />
            </FlexContainer>
          ) : (
            <CheckedTable currentPage={currentPage} rows={design?.data?.data || []} size={size} selectedDesigns={selectedDesigns} setSelectedDesigns={setSelectedDesigns} />
          )}
        </Container>

        <ConfirmationDialog
          isDelete={true}
          open={deleteConfirmOpen}
          handleClose={handleTrashClose}
          handleAgree={handleDeleteEntities}
          message="This cannot be undone and the item gets deleted permanently."
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onPageChange={handlePageChange}
          totalEntries={totalEntries}
          entriesPerPage={size}
        />
      </div>
    </Layout>
  );
};

export default Home;
