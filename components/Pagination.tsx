import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handleClick = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className="flex justify-center items-center gap-2 my-8">
      <button
        className="px-3 py-1 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 shadow-sm"
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <span className="font-semibold">&lt;</span>
      </button>
      {/* Hiển thị các số trang */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded-full border border-gray-300 mx-1 text-base font-semibold transition shadow-sm
            ${page === currentPage
              ? 'bg-rose-500 text-white border-rose-500 shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100'}
          `}
          onClick={() => handleClick(page)}
          disabled={page === currentPage}
        >
          {page}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 shadow-sm"
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="font-semibold">&gt;</span>
      </button>
    </div>
  );
};

export default Pagination;
