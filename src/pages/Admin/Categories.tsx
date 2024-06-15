// import React, { useState } from "react";
// import CategoryModal, { Category } from "../../components/Admin/CategoryModal";

// const Categories: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleAddCategory = (category: Category) => {};

//   const cloaseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <>
//       <div className=" w-full px-8 py-4 flex justify-end">
//         <button
//           className="bg-medium-rose py-2 px-1  rounded-md  text-white poppins-normal"
//           onClick={() => setIsModalOpen(true)}
//         >
//           Create Category
//         </button>
//       </div>
//       <CategoryModal
//         isOpen={isModalOpen}
//         onClose={cloaseModal}
//         onAddCategory={handleAddCategory}
//       />
//       <div className=" grid grid-cols-2 gap-10 md:ml-64 px-8 py-2">
//         <div className=" rounded-md flex justify-between p-4 shadow-xl">
//           <div className="rounded-full bg-blue-500 w-28 h-28  m-auto object-cover">
//             <img
//               src="/assets/images/person1.png"
//               alt="description"
//               className="w-full h-full  rounded-full object-cover"
//             />
//           </div>
//           <div className=" w-1/2 p-4 mx-auto">
//             <p className="text-black text-sm poppins-normal">
//               kfajifojfjfdkjijksdjksjdsdjskjlkllkljk
//             </p>
//             <button className="bg-white  border  border-medium-rose py-1 px-2 mt-4 rounded-md  text-medium-rose poppins-normal poppins-normal hover:bg-medium-rose hover:text-white transition duration-300 mx-auto">
//               Category Details
//             </button>
//           </div>
//         </div>
//         <div className=" rounded-md flex justify-between p-4 shadow-xl">
//           <div className="rounded-full bg-blue-500 w-28 h-28  m-auto object-cover">
//             fadf
//           </div>
//           <div className="bg-yellow-600 w-1/2 p-4 mx-auto">
//             <p className="text-black text-sm poppins-normal text-center">
//               kfajifojfjfdkjijksdjksjdsdjskjlkllkljk
//             </p>
//             <button className="bg-white  border  border-medium-rose py-1 px-2 mt-4 rounded-md  text-medium-rose poppins-normal poppins-normal hover:bg-medium-rose hover:text-white transition duration-300 mx-auto">
//               Category Details
//             </button>
//           </div>
//         </div>
//         <div className=" rounded-md flex justify-between p-4 shadow-xl">
//           <div className="rounded-full bg-blue-500 w-28 h-28  m-auto object-cover">
//             fadf
//           </div>
//           <div className="bg-yellow-600 w-1/2 p-4 mx-auto">
//             <p className="text-black text-sm poppins-normal text-center">
//               kfajifojfjfdkjijksdjksjdsdjskjlkllkljk
//             </p>
//             <button className="bg-white  border  border-medium-rose py-1 px-2 mt-4 rounded-md  text-medium-rose poppins-normal poppins-normal hover:bg-medium-rose hover:text-white transition duration-300 mx-auto">
//               Category Details
//             </button>
//           </div>
//         </div>
//         <div className=" rounded-md flex justify-between p-4 shadow-xl">
//           <div className="rounded-full bg-blue-500 w-28 h-28  m-auto object-cover">
//             fadf
//           </div>
//           <div className="bg-yellow-600 w-1/2 p-4 mx-auto">
//             <p className="text-black text-sm poppins-normal text-center">
//               kfajifojfjfdkjijksdjksjdsdjskjlkllkljk
//             </p>
//             <button className="bg-white  border  border-medium-rose py-1 px-2 mt-4 rounded-md  text-medium-rose poppins-normal poppins-normal hover:bg-medium-rose hover:text-white transition duration-300 mx-auto">
//               Category Details
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Categories;
