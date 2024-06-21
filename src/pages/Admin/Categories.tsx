import React, { useEffect, useState } from "react";
import CategoryModal, { Category } from "../../components/Admin/CategoryModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { getAllCategories } from "../../components/redux/slices/adminSlice";

const Categories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { categories } = useSelector((state: RootState) => state.category);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategories());
  }, []);

  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full px-8  flex justify-end">
        <button
          className="bg-lite-black py-1 px-4 rounded-md text-white poppins-normal"
          onClick={() => setIsModalOpen(true)}
        >
          Create Category
        </button>
      </div>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddCategory={(category: Category) => {
        }}
      />
      {categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-8 md:ml-64 py-4 mt-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="rounded-md flex h-36 justify-around items-center p-4 shadow-xl bg-pure-white"
            >
              <div className="w-1/3">
                <div className="rounded-full overflow-hidden w-24 h-24">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-2/3 px-4">
                <p className="text-black text-sm inter text-justify mb-4">
                  {category.description}
                </p>
                <button className="bg-medium-rose border inter-sm border-medium-rose py-1 text-center px-2 rounded-md text-white hover:bg-strong-rose hover:text-white transition duration-300">
                  Category Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center mt-4">
          <img
            src="/assets/images/verify.png"
            alt="No categories available"
            className="w-1/3"
          />
        </div>
      )}
    </>
  );
};

export default Categories;
