import React from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react'

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentUsers?: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      console.log('changing page',page)
      onPageChange(page);
    }
  };

  return (
    <nav>
      <ul className="pagination   w-full flex justify-center px-4 space-x-4 mt-4">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link text-center bg-gray-300 text-black py-1 px-2 inter-sm rounded-lg cursor-pointer"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ArrowLeft/>
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
            <button className="page-link inter" onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link bg-medium-rose text-white py-1 px-2 inter-sm rounded-lg cursor-pointer"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ArrowRight/>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
