import "./Signin.css";

export default function CheckedTable({ rows }) {
  return (
    <div style={{ width: "100%" }}>
      <table
        border="1"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          // padding: "20px",
        }}
      >
        <thead>
          <tr>
            <th>Step No</th>
            <th>Width</th>
            <th>Stack</th>
          </tr>
        </thead>
        <tbody>
          {stepsData?.map((row) => (
            <tr
              key={row.stepNo}
              onClick={() => handleRowSelect(row.stepNo)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  selectedStep === row.stepNo ? "#f0f0f0" : "white",
              }}
            >
              <td>{row.stepNo}</td>
              <td>{row.width}</td>
              <td>{row.stack}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
