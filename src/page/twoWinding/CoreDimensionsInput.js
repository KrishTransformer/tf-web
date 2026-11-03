import React, { useState } from "react";
import { CustomInput, CustomModal, FlexContainer } from "../../components";
import { dimensionPair } from "../../utils/rectangularDimensions";

export default function CoreDimensionsInput({ formState, onSave }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({});
  const [changed, setChanged] = useState({});
  const [error, setError] = useState("");
  const current = {
    coreWidth: formState.coreDimensionOverrides?.coreWidth ?? formState.core?.coreWidth ?? formState.rectCoilDimensions?.coreWidth ?? "",
    coreDepth: formState.coreDimensionOverrides?.coreDepth ?? formState.core?.coreDepth ?? formState.rectCoilDimensions?.coreDepth ?? "",
  };
  const show = () => {
    setDraft(current);
    setChanged({});
    setError("");
    setOpen(true);
  };
  const save = () => {
    const overrides = { ...formState.coreDimensionOverrides };
    for (const key of ["coreWidth", "coreDepth"]) {
      if (!changed[key]) continue;
      const value = draft[key];
      if (value !== "" && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
        setError("Enter positive whole numbers, or leave a field blank for automatic calculation.");
        return;
      }
      if (value === "") delete overrides[key];
      else overrides[key] = Number(value);
    }
    onSave(overrides);
    setOpen(false);
  };
  return <>
    <div style={{ width: "100%" }} onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); }
    }}>
      <CustomInput label="Core Dimensions" value={dimensionPair(current.coreWidth, current.coreDepth)}
        readOnly onClick={show} bgColor="var(--app-input-accent-bg, #D7F3FC)"
        borderColor="var(--app-input-border, #00000033)" style={{ cursor: "pointer" }} />
    </div>
    <CustomModal open={open} title="Core Dimensions" onClose={() => setOpen(false)} onModalSubmit={save}>
      <FlexContainer>
        {[ ["coreWidth", "Core Width (mm)"], ["coreDepth", "Core Depth (mm)"] ].map(([key, label]) =>
          <CustomInput key={key} label={label} value={draft[key] ?? ""}
            bgColor="var(--app-input-accent-bg, #D7F3FC)"
            borderColor="var(--app-input-border, #00000033)"
            onChange={(e) => { setDraft({ ...draft, [key]: e.target.value }); setChanged({ ...changed, [key]: true }); }} />)}
      </FlexContainer>
      <p>Leave a field blank to calculate it automatically. Width-only input calculates depth rounded up to 5 or 0.</p>
      {error && <p role="alert">{error}</p>}
      <button type="button" className="custom-modal-btn custom-modal-btn-secondary" onClick={() => {
        setDraft({ coreWidth: "", coreDepth: "" });
        setChanged({ coreWidth: true, coreDepth: true });
        setError("");
      }}>Reset to calculated defaults</button>
    </CustomModal>
  </>;
}
