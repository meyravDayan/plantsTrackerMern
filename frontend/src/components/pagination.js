import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <nav aria-label="...">
            <ul className="pagination justify-content-center">
                <li
                    className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                    }`}
                >
                    <button className="page-link" onClick={handlePrevPage}>
                        Previous
                    </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                    <li
                        key={index + 1}
                        className={`page-item ${
                            currentPage === index + 1 ? "active" : ""
                        }`}
                        aria-current={currentPage === index + 1 ? "page" : null}
                    >
                        <button
                            className="page-link"
                            onClick={() => onPageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    </li>
                ))}
                <li
                    className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                    }`}
                >
                    <button className="page-link" onClick={handleNextPage}>
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;
