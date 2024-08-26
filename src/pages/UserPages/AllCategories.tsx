import { getAllCategories } from '../../components/redux/slices/adminSlice';
import Pagination from '../../components/common/Pagination';
import { AppDispatch } from '../../components/redux/store/store';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AllCategoriesSkeleton from '../../components/skelton/AllCategories';

const AllCategories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const fetchCategories = async (page: number) => {
    setIsLoading(true); // Start loading
    const response = await dispatch(getAllCategories(page));
    const { categories, totalPages } = response.payload;
    setCategories(categories);
    setTotalPages(totalPages);
    setIsLoading(false); // Stop loading
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewClick = (categoryId: string) => {
    navigate(`/viewcategory/${categoryId}`);
  };

  if (isLoading) {
    return <AllCategoriesSkeleton length={8} />;
  }

  return (
    <>
      <div>
        {categories && categories.length > 0 && (
          <div className="grid md:grid-cols-4 gap-8 sm:grid-cols-2">
            {categories.map((category, index) => (
              <div
                key={index}
                className="border border-gray-200 shadow-lg rounded-md text-center p-6 cursor-pointer"
                onClick={() => handleViewClick(category.id)}
              >
                <div className="rounded-full mx-auto w-36 h-36 shadow-sm border-2 border-gray-100 overflow-hidden">
                  <img
                    src={`${category.image}`}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h1 className="mt-3 text-md inter">{category.name}</h1>
                <p className="text-sm inter-sm">{category.coursesCount} Courses</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {categories && categories.length > 8 && (
      <div className="mt-10">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      )}
    </>
  );
};

export default AllCategories;
