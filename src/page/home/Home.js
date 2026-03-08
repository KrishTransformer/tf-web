import React, { useState, useEffect } from "react";
import {
  CheckedTable,
  Container,
  FlexContainer,
  Layout,
  TextTypo,
  SearchInput,
} from "../../components";
import { NavLink, useNavigate } from "react-router-dom";
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
import { IoMdPerson, IoIosInformationCircleOutline } from "react-icons/io";
import logo from "../../assets/dstar-electric-logo.png";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const size = 10; // Number of entries per page
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDesigns, setSelectedDesigns] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { design } = useSelector(selectEntity);
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
  });

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

  // let a;
  // console.log(a.name)
  // console.log("selectedDesigns in home page:", selectedDesigns)

  return (
    <Layout hideSidebar>
      <div className="home-page-wrapper">
        <FlexContainer align="center" justify="space-between" margin="2px 2px">
          <FlexContainer align="center" gap="10px">
            <img src={logo} alt="Company Logo" className="home-header-logo" />
            <TextTypo text="Krish Transformer Design Software" fontSize="22px" fontWeight="700" />
          </FlexContainer>
          <FlexContainer align="center">
            <button className="home-new-design-btn" onClick={handleNewDesignClick}>
              + New Design
            </button>
            
            <NavLink to="/profile" className="home-profile-link">
              <div className="home-profile-avatar">
                <IoMdPerson className="home-profile-icon" />
              </div>
            </NavLink>
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
