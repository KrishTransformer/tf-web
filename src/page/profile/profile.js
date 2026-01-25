import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectEntity } from "../../selectors/EntitySelector";
import { addEntity, fetchEntity, updateEntity } from "../../actions/EntityActions";
import { useActions } from "../../app/use-Actions";
import { FaEdit, FaSave, FaBan } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  MainLayout,
  TextTypo,
  CustomInput,
  Container,
  FlexContainer,
  FilledBtn,
  TextBtn,
  NavTabs,
} from "../../components";
import Layout from "../../components/layout/Layout";
import ProfileLayout from "../../components/layout/ProfileLayout";
import { ToastContainer, toast } from "react-toastify";
import Address from "./tabs/Address";
import BankDetails from "./tabs/BankDetails";
import CircularProgress from "@mui/material/CircularProgress";


const Profile = () => {
  const { profile } = useSelector(selectEntity);
  const actions = useActions({ addEntity, fetchEntity, updateEntity });

  const [profileData, setProfileData] = useState({
    primaryContact: { firstName: "", lastName: "", email: "", phone: "", companyName: "", designation: "" },
    Address: { state: "", city: "", address: "", pincode: "", },
  });

  const [title, setTitle] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalProfileData, setOriginalProfileData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = () => {
    try {
      actions.fetchEntity("profile", `offset=0&size=10&sortAttribute=createdAt&sortOrder=ASC`);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
    setLoading(false);
  };


  useEffect(() => {
    if (profile?.data?.data?.[0]) {
      setProfileData(profile.data.data[0]);
    }
  }, [profile]);

  // console.log("profileData", profileData)



  if (loading) {
    return <ProfileLayout>Loading...</ProfileLayout>;
  }

  const handleEditClick = () => {
    setOriginalProfileData(profileData);
    setIsEditing(true); setTitle("Edit Profile")
  };

  const handleSaveClick = () => {
    const updatedProfileData = { ...profileData };

    if (profile?.data?.id) {
      updatedProfileData.id = profile?.data?.id; // Retain existing ID for updates
    }
    //setIsEditing(false);
    try {
      const entityId = profile?.data.data?.[0].id;
      actions.updateEntity(entityId, updatedProfileData, "profile");
      if (profile?.data?.id) {
        toast.success("Profile updated successfully!");
      } else {
        toast.success("Profile saved successfully!");
      }

      setIsEditing(false);
      setTitle("Profile");
      setOriginalProfileData(null);

    } catch (error) {
      toast.error("Failed to save profile!");
      console.error("Error saving profile data:", error);
    }
  };

  const handleCancelClick = () => {
    if (originalProfileData) {
      setProfileData(originalProfileData);
    }
    setIsEditing(false);
    setTitle("Profile");
  };


  const handleChange = (e, section) => {

    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value
      }
    }));

  };


  const tabs = [
    {
      key: "tab1",
      label: "Address",
      content: "",
      content: <Address initialData={profileData.Address}
        onChange={handleChange} />
    },
    // {
    //   key: "tab2",
    //   label: "Bank Details",
    //   content: <BankDetails
    //     initialData={profile?.data?.otherDetails}
    //     onChange={handleChange}
    //   />,
    // },
  ];



  return (
    <ProfileLayout>
      <ToastContainer />
      <div className="container-full p-2" style={{ background: "white", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div className=" card p-4 w-100" style={{ border: "none", borderRadius: "0", backgroundColor: "white" }}>
          {!isEditing &&
          <h4>{title}</h4>
          }
          {/* ---------------- VIEW MODE ---------------- */}
          {profile?.isLoading ? (
            <FlexContainer align="center" justify="center" padding="20px" backgroundColor="white">
              <CircularProgress />
            </FlexContainer>
          ) : (
            !isEditing && (
              <>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {/* <h4>{title}</h4> */}
                    <h2 className="fw-bold">
                      {profileData.primaryContact.firstName || "Not added"}{" "}
                      {profileData.primaryContact.lastName }
                    </h2>
                    <h4
                      className="text-muted"
                      onClick={() => {
                        setIsEditing(true);
                        setTitle("Edit Profile");
                      }}
                    >
                      {`${profileData.primaryContact.designation}, ${profileData.primaryContact.companyName}` || "Click to edit"}
                    </h4>
                  </div>
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <button className="btn btn-dark" onClick={handleEditClick}>
                      <FaEdit className="me-1" /> Edit
                    </button>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-6">
                    <h5 className="fw-bold">User Details</h5>
                    {["state", "city", "address", "pincode"].map((field) => (
                      <p key={field}>
                        <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{" "}
                        {profileData?.Address?.[field] || "N/A"}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="fw-bold">My Email Address</h5>
                  <p className="text-muted">{profileData.primaryContact.email || "N/A"}</p>
                </div>

                <div className="mt-4">
                  <h5 className="fw-bold">My Mobile Number</h5>
                  <p className="text-muted">{profileData.primaryContact.phone || "N/A"}</p>
                </div>
              </>
            )
          )}


          {/* ---------------- EDIT MODE ---------------- */}
          {isEditing && (
            <>
              <Container>
                {/* <Container margin="30px 0px"> */}
                <div className="d-flex align-items-center justify-content-between mt-1">
                  <h4 className="mb-0">{title}</h4>
                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-dark" onClick={handleSaveClick}>
                      <FaSave className="me-1" /> Save
                    </button>
                    <button className="btn btn-dark" onClick={handleCancelClick}>
                      <FaBan className="me-1" /> Cancel
                    </button>
                  </div>
                </div>

                {/* <div className="d-flex justify-content-end gap-2 mt-2">
                  <button className="btn btn-success" onClick={handleSaveClick}>
                    <FaSave className="me-1" /> Save
                  </button>
                  <button className="btn btn-danger" onClick={() => {
                    setIsEditing(false);
                    setTitle("Profile");
                  }}>
                    <FaBan className="me-1" /> Cancel
                  </button>
                </div> */}


                {/* <TextTypo text="Primary Contact" fontWeight="600" /> */}

                <FlexContainer justify="">

                  {/* Salutation */}
                  {/* <CustomInput
                    type="dropdown"
                    value={salutation}
                    defaultOption="Salutation"
                    onChange={(e) => setSalutation(e.target.value)}
                    options={salutationOptions}
                    width="20%"
                    required={true}
                  /> */}

                  {/* firstName */}
                  <CustomInput
                    type="text"
                    name="firstName"
                    label="First Name"
                    value={profileData.primaryContact.firstName}
                    onChange={(e) => handleChange(e, "primaryContact")}
                    placeholder="First Name"
                    width="28%"
                    required={true}
                  />

                  {/* lastName */}
                  <CustomInput
                    type="text"
                    name="lastName"
                    label="Last Name"
                    value={profileData.primaryContact.lastName}
                    onChange={(e) => handleChange(e, "primaryContact")}
                    placeholder="Last Name"
                    width="28%"
                    required={true}
                  />
                </FlexContainer>

                <FlexContainer>
                  <CustomInput
                    type="text"
                    label="Company Name"
                    name="companyName"
                    value={profileData.primaryContact.companyName}
                    placeholder="Enter Company Name"
                    onChange={(e) => handleChange(e, "primaryContact")}
                    width="50%"
                    required={true}
                  />

                  <CustomInput
                    type="text"
                    label="Designation"
                    name="designation"
                    value={profileData.primaryContact.designation}
                    placeholder="Enter Designation"
                    onChange={(e) => handleChange(e, "primaryContact")}
                    width="50%"
                    required={true}
                  />

                </FlexContainer>

                <FlexContainer>
                  <CustomInput
                    type="email"
                    label="Email ID"
                    name="email"
                    value={profileData.primaryContact.email}
                    placeholder="Enter Email"
                    onChange={(e) => handleChange(e, "primaryContact")}
                    width="50%"
                    required={true}
                  />
                  <CustomInput
                    type="text"
                    label="Phone No."
                    name="phone"
                    value={profileData.primaryContact.phone}
                    placeholder="Enter Phone number"
                    onChange={(e) => handleChange(e, "primaryContact")}
                    width="50%"
                    required={true}
                  />
                </FlexContainer>

                <Container margin="20px 0px">
                  <NavTabs tabs={tabs} />
                </Container>

                {/* <FlexContainer justify="flex-end" margin="30px 0px">

                    <button className="btn btn-success" onClick={handleSaveClick}>
                      <FaSave className="me-1" /> Save
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setIsEditing(false);
                        setTitle("Profile");
                      }}>
                      <FaBan className="me-1" /> Cancel
                    </button>

                  </FlexContainer> */}

              </Container>

            </>
          )}

        </div>
      </div>
    </ProfileLayout>


  );
};

export default Profile;
