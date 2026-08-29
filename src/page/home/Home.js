import React, { useState, useEffect, useMemo, useRef } from "react";
import { CheckedTable, CustomModal, Layout, SearchInput } from "../../components";
import { useNavigate } from "react-router-dom";
import { useActions } from "../../app/use-Actions";
import { fetchEntity, fetchSearchEntity } from "../../actions/EntityActions";
import { clearCalc, generate3DCleared } from "../../actions/CalcActions";
import { useSelector } from "react-redux";
import Pagination from "../../components/Pagination/Pagination";
import { selectEntity } from "../../selectors/EntitySelector";
import CircularProgress from "@mui/material/CircularProgress";
import { selectGenerate3D } from "../../selectors/CalcSelector";
import { resetCustomerData } from "../../actions/FileActions";
import { FaRegTrashAlt } from "react-icons/fa";
import ConfirmationDialog from "../../components/DeletingConfirmation";
import { deleteEntity } from "../../actions/EntityActions";
import { IoMdPerson } from "react-icons/io";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { signOut } from "../../actions/AuthActions";
import { selectAuth } from "../../selectors/AuthSelector";
import CustomCookies from "../../api/Cookies";
import { clearAuthTokens, getIdToken } from "../../api/authToken";
import { postApi } from "../../api";
import { COMMON_SERVICE } from "../../constants/CommonConstants";
import { parseJwt } from "../../utils/AuthUtil";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const size = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDesigns, setSelectedDesigns] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [designTypeModalOpen, setDesignTypeModalOpen] = useState(false);
  const [activeDesignTab, setActiveDesignTab] = useState("two");
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("appTheme") === "dark";
  });
  const showMultiWdgOption = true;
  const profileMenuRef = useRef(null);
  const settingsMenuRef = useRef(null);

  const { design } = useSelector(selectEntity);
  const { name } = useSelector(selectAuth);
  const totalEntries = design?.data?.total || 0;
  const totalPages = Math.ceil(totalEntries / size);
  const { generate3d } = useSelector(selectGenerate3D);
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
      const token = getIdToken();
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
    attributeName: ["designId"],
    attributeValue: searchQuery,
    sortAttribute: "updatedAt",
    sortOrder: "DESC",
  };

  let offset = currentPage - 1;

  useEffect(() => {
    if (searchQuery === "") {
      fetchData();
    } else {
      actions.fetchSearchEntity("design", `offset=${offset}&size=${size}`, searchPayload);
    }
    if (generate3d?.data?.blob?.startsWith?.("blob:")) {
      URL.revokeObjectURL(generate3d?.data?.blob);
      actions.generate3DCleared();
    }
  }, [currentPage, sortOption]);

  useEffect(() => {
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }

    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  useEffect(() => {
    const previousBodyBackground = document.body.style.backgroundColor;
    const previousHtmlBackground = document.documentElement.style.backgroundColor;

    if (isDarkMode) {
      localStorage.setItem("appTheme", "dark");
      document.body.style.backgroundColor = "#101722";
      document.documentElement.style.backgroundColor = "#101722";
      document.body.classList.add("app-dark-mode");
    } else {
      localStorage.setItem("appTheme", "light");
      document.body.style.backgroundColor = "#ebebeb";
      document.documentElement.style.backgroundColor = "#ebebeb";
      document.body.classList.remove("app-dark-mode");
    }

    return () => {
      document.body.style.backgroundColor = previousBodyBackground;
      document.documentElement.style.backgroundColor = previousHtmlBackground;
      document.body.classList.remove("app-dark-mode");
    };
  }, [isDarkMode]);

  const fetchData = () => {
    const [sortAttribute, sortOrder] = sortOption.split("-");
    actions.fetchEntity(
      "design",
      `offset=${offset}&size=${size}&&sortAttribute=${sortAttribute}&sortOrder=${sortOrder}`
    );
  };

  const handleNewDesignClick = () => {
    setDesignTypeModalOpen(true);
  };

  const handleDesignTypeSelection = (designType) => {
    if (designType === "multi" && !showMultiWdgOption) {
      return;
    }

    sessionStorage.setItem("newDesignType", designType);
    actions.fetchEntity("lomMaterial", `offset=0&size=100&sortAttribute=createdAt&sortOrder=ASC`);
    actions.clearCalc();
    actions.resetCustomerData();
    setDesignTypeModalOpen(false);

    if (designType === "multi") {
      navigate("/multiwindings/new");
      return;
    }

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
    if (totalPages === 0) {
      setCurrentPage(1);
      return;
    }

    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
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
    if (searchQuery !== "") {
      actions.fetchSearchEntity("design", `offset=0&size=${size}`, searchPayload);
    } else {
      fetchData();
    }
  };

  const handleLogout = async () => {
    const accessToken = getIdToken();
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
      clearAuthTokens();
      CustomCookies.clearAuthRedirectMessage();
      setIsProfileCardOpen(false);
      navigate("/");
    }
  };

  const handleUpdateRates = () => {
    setIsSettingsOpen(false);
    navigate("/lomCost");
  };

  const designTypeOptions = useMemo(() => {
    const options = [
      {
        key: "two",
        designType: "two",
        badge: "2W",
        title: "2 Winding",
        description: "Start the standard two-winding design workflow.",
        cta: "Open 2 Winding",
      },
    ];

    if (showMultiWdgOption) {
      options.push({
        key: "multi",
        designType: "multi",
        badge: "MW",
        title: "Multi Winding",
        description: "Open the multi-winding design workspace.",
        cta: "Open Multi Winding",
      });
    }

    return options;
  }, [showMultiWdgOption]);

  const isSingleDesignTypeOption = designTypeOptions.length === 1;
  const designRows = useMemo(() => design?.data?.data || [], [design?.data?.data]);
  const twoWindingRows = useMemo(
    () =>
      designRows.filter(
        (row) => row?.designType !== "multi" && !(row?.multiWindings && !row?.twoWindings)
      ),
    [designRows]
  );
  const multiWindingRows = useMemo(
    () =>
      designRows.filter(
        (row) => row?.designType === "multi" || (!row?.designType && !!row?.multiWindings)
      ),
    [designRows]
  );
  const designTabs = [
    {
      key: "two",
      label: "2 Winding Designs",
      rows: twoWindingRows,
    },
    {
      key: "multi",
      label: "Multi Winding Designs",
      rows: multiWindingRows,
      hidden: !showMultiWdgOption,
    },
  ].filter((tab) => !tab.hidden);

  const currentTab =
    designTabs.find((tab) => tab.key === activeDesignTab) || designTabs[0];

  useEffect(() => {
    if (!designTabs.some((tab) => tab.key === activeDesignTab) && designTabs[0]) {
      setActiveDesignTab(designTabs[0].key);
    }
  }, [activeDesignTab, designTabs]);

  return (
    <Layout hideSidebar>
      <div className={`home-page-wrapper ${isDarkMode ? "home-page-wrapper-dark" : ""}`}>
        <header className="home-topbar">
            <div className="home-title-block">
              <h1 className="home-header-title">Krish Transformer Design Software</h1>
              <p className="home-title-subline">Design Library</p>
            </div>

            <div className="home-control-cluster">
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
                    <label className="home-settings-toggle">
                      <span className="home-settings-toggle-label">Dark Mode</span>
                      <button
                        type="button"
                        className={`home-darkmode-switch ${isDarkMode ? "active" : ""}`}
                        onClick={() => setIsDarkMode((prev) => !prev)}
                        aria-pressed={isDarkMode}
                      >
                        <span className="home-darkmode-knob" />
                      </button>
                    </label>
                    <button
                      type="button"
                      className="home-settings-item"
                      onClick={handleUpdateRates}
                    >
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
            </div>
        </header>

        <section className="home-shell">
          <div className="home-toolbar">
            <SearchInput
              placeholder="Search by design reference"
              value={searchQuery}
              sortValue={sortOption}
              inputWidth="min(420px, 100%)"
              selectWidth="210px"
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              onSortChange={handleSortChange}
            />
            <button type="button" className="home-search-btn" onClick={handleSearch}>
              Search
            </button>
            {selectedDesigns.length > 0 && (
              <button type="button" className="home-delete-btn" onClick={handleTrashOpen}>
                <FaRegTrashAlt />
                Delete ({selectedDesigns.length})
              </button>
            )}
          </div>

          <div className="home-library-header">
            <div>
              <h2 className="home-library-title">{currentTab?.label || "Saved Designs"}</h2>
              <p className="home-library-summary">
                {currentTab?.rows?.length || 0} shown • {totalEntries} total • Page{" "}
                {totalPages === 0 ? 0 : currentPage} of {totalPages}
              </p>
            </div>
          </div>

          <div className="home-tab-row">
            {designTabs.map((tab) => {
              const isActive = currentTab?.key === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={`home-tab-chip ${isActive ? "active" : ""}`}
                  onClick={() => setActiveDesignTab(tab.key)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="home-table-shell">
            {design?.isLoading ? (
              <div className="home-loading-state">
                <CircularProgress size={34} />
                <p className="home-loading-copy">Loading saved designs...</p>
              </div>
            ) : currentTab?.rows?.length > 0 ? (
              <CheckedTable
                currentPage={currentPage}
                rows={currentTab.rows}
                size={size}
                selectedDesigns={selectedDesigns}
                setSelectedDesigns={setSelectedDesigns}
                isDarkMode={isDarkMode}
              />
            ) : (
              <div className="home-empty-state">
                <h3 className="home-empty-title">No designs match this view</h3>
                <p className="home-empty-copy">
                  Try a different tab, clear the search, or start a fresh design.
                </p>
              </div>
            )}
          </div>
        </section>

        <ConfirmationDialog
          isDelete={true}
          open={deleteConfirmOpen}
          handleClose={handleTrashClose}
          handleAgree={handleDeleteEntities}
          message="This cannot be undone and the item gets deleted permanently."
        />

        <CustomModal
          open={designTypeModalOpen}
          onClose={() => setDesignTypeModalOpen(false)}
          title="Create New Design"
          showButtons={false}
          minWidth={isSingleDesignTypeOption ? 420 : 620}
        >
          <div
            className={`home-design-type-modal ${
              isSingleDesignTypeOption ? "home-design-type-modal-single" : ""
            }`}
          >
            <div
              className={`home-design-type-grid ${
                isSingleDesignTypeOption ? "home-design-type-grid-single" : ""
              }`}
            >
              {designTypeOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className="home-design-type-card"
                  onClick={() => handleDesignTypeSelection(option.designType)}
                >
                  <div className="home-design-type-card-top">
                    <span className="home-design-type-badge">{option.badge}</span>
                  </div>
                  <span className="home-design-type-title">{option.title}</span>
                  <span className="home-design-type-description">{option.description}</span>
                  <span className="home-design-type-cta">{option.cta}</span>
                </button>
              ))}
            </div>
          </div>
        </CustomModal>

        <div className="home-pagination-wrap">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onPageChange={handlePageChange}
            totalEntries={totalEntries}
            entriesPerPage={size}
            activeColor={isDarkMode ? "#4d8dff" : "#444cf71a"}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
