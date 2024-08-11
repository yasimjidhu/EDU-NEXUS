import { getAllCategories } from '../../components/redux/slices/adminSlice';
import Pagination from '../../components/common/Pagination';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const AllCategories = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [categories,setCategories] = useState([])
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        fetchCategories(currentPage);
    }, [currentPage]);

    const fetchCategories = async (page: number) => {
        const response = await dispatch(getAllCategories(page));
        console.log('response of get allcoures infrontend',response)
        const { categories, totalPages } = response.payload;
        setCategories(categories);
        setTotalPages(totalPages);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

  return (
    <>
    <div>
          {categories && categories.length > 0 && (
            <div className="grid md:grid-cols-4  gap-8 sm:grid-cols-2">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="border border-gray-200 shadow-lg rounded-md text-center p-6"
                >
                  <div className="rounded-full mx-auto w-36 h-36 shadow-sm border-2 border-gray-100 overflow-hidden">
                    <img
                      src={`${category.image}`}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h1 className="mt-3 text-md inter ">{category.name}</h1>
                  <p className="text-sm inter-sm">{category.coursesCount} Courses</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='mt-10'>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </>
  )
}

export default AllCategories
