import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryModal from "../../components/Admin/CategoryModal";
import EditCategoryModal from "../../components/Admin/EditCategoryModal";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import {getAllCategories,updateCategories} from "../../components/redux/slices/adminSlice";
import { Category } from "../../types/category";
import CategoryBlockConfirmation from "../../components/ui/categoryBlockConfirmation";
import { toast } from "react-toastify";
import Pagination from "../../components/common/Pagination";

const Categories: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { categories } = useSelector((state: RootState) => state.category);

  const dispatch: AppDispatch = useDispatch();

  const handleBlockSuccess = () => {
    toast.success("Category deleted Successfully");
    dispatch(getAllCategories(currentPage));
  };

  useEffect(() => {
    fetchCategories(currentPage);
}, [currentPage]);

  const fetchCategories = async (page: number) => {
    const response = await dispatch(getAllCategories(page));
    const { totalPages } = response.payload as any
    setTotalPages(totalPages);
};

  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
};

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSaveCategory = (updatedCategory: Partial<Category>) => {
    if (selectedCategory && updatedCategory._id) {
      dispatch(updateCategories({categoryId:updatedCategory._id,category:updatedCategory}));
    }
    dispatch(getAllCategories(currentPage))
    closeEditModal();
  };

  const handleAddCategory = () => {
    closeCreateModal();
  };

  const handleBlockError = () => {
    toast.error("error occured during block category");
  };

  return (
    <>
      <div className="w-full px-8 flex justify-end">
        <button
          className="bg-lite-black py-1 px-4 rounded-md text-white poppins-normal"
          onClick={handleCreateClick}
        >
          Create Category
        </button>
      </div>
      <CategoryModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onAddCategory={handleAddCategory}
      />
      {selectedCategory && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={handleSaveCategory}
          initialData={selectedCategory}
        />
      )}
      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-8  py-4 ">
          {categories.map((category) => (
            <div
              key={category._id}
              className="rounded-md flex flex-col md:flex-row items-center p-4 shadow-xl bg-pure-white"
            >
              <div className="w-full md:w-1/3 flex justify-center md:justify-start mb-4 md:mb-0">
                <div className="rounded-full overflow-hidden w-36 h-36">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3 px-4">
                <h1 className="text-lg font-bold mb-2">{category.name}</h1>
                <p className="inter-sm text-gray-700 mb-4">
                  {category.description}
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-medium-rose border border-medium-rose py-1 px-3 rounded-full text-white hover:bg-strong-rose hover:text-white transition duration-300"
                    onClick={() => handleEditClick(category)}
                  >
                    Edit
                  </button>
                  <CategoryBlockConfirmation
                    categoryId={category._id}
                    onSuccess={handleBlockSuccess}
                    onError={handleBlockError}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-4">
          <img
            src="/assets/images/verify.png"
            alt="No categories available"
            className="w-1/3"
          />
          <p className="mt-4 text-gray-600">No categories available</p>
        </div>
      )}
       <div className='mt-10 '>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </>
  );
};

export default Categories;
