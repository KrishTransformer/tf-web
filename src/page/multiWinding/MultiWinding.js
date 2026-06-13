import React, { useEffect, useState } from "react";
import { Container, FlexContainer, Layout, TextTypo } from "../../components";
import { useActions } from "../../app/use-Actions";
import { addCalc, clearCalc } from "../../actions/CalcActions";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectCalc } from "../../selectors/CalcSelector";
import { initialState } from "../../reducers/CalcReducer";
import Part1 from "./Part1";
import Part2 from "./Part2";
import Part3 from "./Part3";
import "./MultiWindingTheme.css";

const MultiWinding = () => {
  const { id } = useParams();
  const { multiWindings } = useSelector(selectCalc);
  const actions = useActions({
    addCalc,
    clearCalc,
  });
  const [formState, setFormState] = useState(
    multiWindings?.data || initialState.multiWindings.data
  );
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("appTheme") === "dark"
  );
  const [activeTab, setActiveTab] = useState("part1");

  useEffect(() => {
    setFormState(multiWindings?.data || initialState.multiWindings.data);
  }, [multiWindings]);

  useEffect(() => {
    const darkModeEnabled = localStorage.getItem("appTheme") === "dark";
    setIsDarkMode(darkModeEnabled);

    if (darkModeEnabled) {
      document.body.classList.add("app-dark-mode");
      document.body.style.backgroundColor = "#101722";
      document.documentElement.style.backgroundColor = "#101722";
    } else {
      document.body.classList.remove("app-dark-mode");
      document.body.style.backgroundColor = "#ebebeb";
      document.documentElement.style.backgroundColor = "#ebebeb";
    }
  }, []);

  const handleInputChange = (fieldPath, value) => {
    setFormState((prevState) => {
      const nextState = { ...prevState };
      const keys = fieldPath.split(".");
      let current = nextState;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
          return;
        }

        current[key] = { ...(current[key] || {}) };
        current = current[key];
      });

      return nextState;
    });
  };

  const handleReset = () => {
    actions.clearCalc();
    setFormState(initialState.multiWindings.data);
    window.scrollTo(0, 0);
  };

  const handleCalculate = () => {
    actions.addCalc(formState, "multiwindings");
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        if (!multiWindings?.isLoading) {
          actions.addCalc(formState, "multiwindings");
          window.scrollTo(0, 0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [actions, formState, multiWindings?.isLoading]);

  const currentPath = formState?.designId || (id === "new" ? "New Multi Winding" : id);
  const tabs = [
    {
      key: "part1",
      label: "Inputs",
      content: (
        <Part1
          formState={formState}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      key: "part2",
      label: "Windings",
      content: (
        <Part2
          formState={formState}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      key: "part3",
      label: "Dimensions & Cost",
      content: (
        <Part3
          formState={formState}
          handleInputChange={handleInputChange}
        />
      ),
    },
  ];

  return (
    <Layout
      id={id}
      isThinHeader={true}
      headProps={{
        currentPath,
      }}
    >
      <div className={`multi-winding-page ${isDarkMode ? "multi-winding-page-dark" : ""}`}>
        <div className="multi-winding-page-shell">
          <div className="row m-1">
            <div className="col-12 mt-3">
              <div className="multi-winding-tabs-shell">
                <div className="multi-winding-topbar">
                  <div className="multi-winding-tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        className={`multi-winding-tab${
                          activeTab === tab.key ? " active" : ""
                        }`}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <FlexContainer
                    className="multi-winding-common-actions"
                    margin="0"
                  >
                    <button
                      className="multi-winding-action-btn secondary"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                    <button
                      className="multi-winding-action-btn primary btn-calculate"
                      onClick={handleCalculate}
                      disabled={multiWindings?.isLoading}
                    >
                      {multiWindings?.isLoading ? (
                        <div className="spinner-border" role="status">
                          <span className="sr-only"></span>
                        </div>
                      ) : (
                        "Calculate"
                      )}
                    </button>
                  </FlexContainer>
                </div>
                <div className="multi-winding-tab-panel">
                  {tabs.find((tab) => tab.key === activeTab)?.content}
                </div>
              </div>
            </div>
            <div className="col-12 mt-1 mb-3">
              <Container
                className="multi-winding-card"
                bgColor="var(--mw-surface)"
                padding="20px"
                borderRadius="10px"
              >
                <TextTypo text="Comments" fontWeight="700" margin="0px 0px 10px 0px" />
                <Container
                  className="multi-winding-comments-box"
                  bgColor="var(--mw-surface-soft)"
                  padding="24px"
                  borderRadius="8px"
                  fontSize="16px"
                >
                  Multi-winding inputs are now mounted. Use Ctrl+Enter to run calculation once the backend endpoint is available for your environment.
                </Container>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MultiWinding;
