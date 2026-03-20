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
  const safeTotalPages = Math.max(totalPages || 0, 0);
  const safeCurrentPage = safeTotalPages === 0
    ? 1
    : Math.min(Math.max(currentPage, 1), safeTotalPages);
  const maxVisiblePages = 5;
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(safeCurrentPage - halfVisiblePages, 1);
  let endPage = Math.min(startPage + maxVisiblePages - 1, safeTotalPages);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  const pageNumbers = Array.from(
    { length: Math.max(endPage - startPage + 1, 0) },
    (_, index) => startPage + index
  );

  const startEntry = totalEntries > 0
    ? (safeCurrentPage - 1) * entriesPerPage + 1
    : 0;
  const endEntry = totalEntries > 0
    ? Math.min(safeCurrentPage * entriesPerPage, totalEntries)
    : 0;

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
          <li className={`page-item ${safeCurrentPage === 1 || safeTotalPages === 0 ? "disabled" : ""}`}>
            <button
              className="page-link text-dark"
              onClick={onPrevious}
              disabled={safeCurrentPage === 1 || safeTotalPages === 0}
            >
              <MdArrowBackIos />
            </button>
          </li>
          {startPage > 1 && (
            <>
              <li className="page-item">
                <button
                  className="page-link text-dark"
                  onClick={() => onPageChange(1)}
                >
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link text-dark">...</span>
                </li>
              )}
            </>
          )}
          {pageNumbers.map((page) => (
            <li
              key={page}
              className={`page-item ${safeCurrentPage === page ? "active" : ""}`}
            >
              <button
                className="page-link text-dark"
                onClick={() => onPageChange(page)}
                style={{
                  backgroundColor:
                    safeCurrentPage === page ? activeColor : "transparent",
                  color: safeCurrentPage === page ? "#fff" : "#000",
                  borderColor: safeCurrentPage === page ? activeColor : "#dee2e6",
                }}
              >
                {page}
              </button>
            </li>
          ))}
          {endPage < safeTotalPages && (
            <>
              {endPage < safeTotalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link text-dark">...</span>
                </li>
              )}
              <li className="page-item">
                <button
                  className="page-link text-dark"
                  onClick={() => onPageChange(safeTotalPages)}
                >
                  {safeTotalPages}
                </button>
              </li>
            </>
          )}
          <li
            className={`page-item ${
              safeCurrentPage === safeTotalPages || safeTotalPages === 0 ? "disabled" : ""
            }`}
          >
            <button
              className="page-link text-dark"
              onClick={onNext}
              disabled={safeCurrentPage === safeTotalPages || safeTotalPages === 0}
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
