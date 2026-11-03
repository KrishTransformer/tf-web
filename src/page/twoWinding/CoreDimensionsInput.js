import React, { useState } from "react";
import { CustomInput, CustomModal } from "../../components";
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
        readOnly onClick={show} style={{ cursor: "pointer" }} />
    </div>
    <CustomModal open={open} title="Core Dimensions" onClose={() => setOpen(false)} onModalSubmit={save}>
      {[ ["coreWidth", "Core Width (mm)"], ["coreDepth", "Core Depth (mm)"] ].map(([key, label]) =>
        <label key={key} style={{ display: "block", marginBottom: 12 }}>{label}
          <input aria-label={label} type="number" min="1" step="1" value={draft[key] ?? ""}
            className="custominput-inputFeild box" style={{ display: "block", width: "100%", padding: 8,
              color: "var(--tw-page-text)", background: "var(--app-input-bg)", border: "1px solid var(--app-input-border)", borderRadius: 4 }}
            onChange={(e) => { setDraft({ ...draft, [key]: e.target.value }); setChanged({ ...changed, [key]: true }); }} />
        </label>)}
      <p>Leave a field blank to calculate it automatically. Width-only input calculates depth rounded up to 5 or 0.</p>
      {error && <p role="alert">{error}</p>}
      <button type="button" onClick={() => {
        setDraft({ coreWidth: "", coreDepth: "" });
        setChanged({ coreWidth: true, coreDepth: true });
        setError("");
      }}>Reset to calculated defaults</button>
    </CustomModal>
  </>;
}
