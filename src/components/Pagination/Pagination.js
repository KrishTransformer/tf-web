import React from "react";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";

const Pagination = ({
  currentPage,
  totalPages,
  onNext,
  onPrevious,
  onPageChange,
  activeColor = "#444cf71a",
  totalEntries,
  entriesPerPage,
}) => {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  return (
    <nav aria-label="Page navigation example">
      <div className="d-flex justify-content-end align-items-center mt-3">
        {entriesPerPage && totalEntries ? (
          <span
            className="text-muted fw-bold me-4"
            style={{ fontSize: "15px" }}
          >
            Showing {startEntry} to {endEntry} out of {totalEntries} entries
          </span>
        ) : (
          ""
        )}
        <ul className="pagination mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link text-dark"
              onClick={onPrevious}
              disabled={currentPage === 1}
            >
              <MdArrowBackIos />
            </button>
          </li>
          {pageNumbers.map((page) => (
            <li
              key={page}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
              <button
                className="page-link text-dark"
                onClick={() => onPageChange(page)}
                style={{
                  backgroundColor:
                    currentPage === page ? activeColor : "transparent",
                  color: currentPage === page ? "#fff" : "#000",
                  borderColor: currentPage === page ? activeColor : "#dee2e6",
                }}
              >
                {page}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link text-dark"
              onClick={onNext}
              disabled={currentPage === totalPages}
            >
              <MdArrowForwardIos />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Pagination;
