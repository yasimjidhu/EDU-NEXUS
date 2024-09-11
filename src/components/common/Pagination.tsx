import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentUsers?: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      console.log('changing page', page)
      onPageChange(page);
    }
  };

  return (
    <nav>
      <ul className="pagination w-full flex justify-center items-center px-4 space-x-4 mt-4">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className={`page-link flex items-center justify-center bg-gray-300 text-black py-2 px-3 rounded-lg cursor-pointer transition duration-200 ease-in-out 
              ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </li>
        <ul className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index}>
              <button
                className={`page-link inter transition duration-300 ease-in-out transform hover:scale-105 
                  ${currentPage === index + 1 ? 'bg-pink-500 text-white font-bold px-3 py-1 rounded-full' : 'bg-gray-200 text-gray-800 px-3 py-1 rounded-full'}
                `}
                onClick={() => handlePageChange(index + 1)} 
              >
                { currentPage <= 5 ?  index + 1 : index}
              </button>
            </li>
          ))}
        </ul>
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className={`page-link flex items-center justify-center bg-gray-300 text-black py-2 px-3 rounded-lg cursor-pointer transition duration-200 ease-in-out 
              ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
