// import axios from 'axios';
// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '../redux/store/store';

// interface CategoryModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onAddCategory: (category: Category) => void;
// }

// export interface Category {
//   name: string;
//   description: string;
//   image: string;
// }

// const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onAddCategory }) => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState('');
//   const [imagePreview, setImagePreview] = useState('');

//   const dispatch :AppDispatch = useDispatch()

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setImage(URL.createObjectURL(file));
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async(e: React.FormEvent) => {
//     e.preventDefault();
//     const newCategory: Category = {
//       name,
//       description,
//       image,
//     };

//     const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
//     const uploadPreset = import.meta.env.VITE_CLOUDINARY_CATEGORY_PRESET;

//     if(image){
//      const formDataUpload = new FormData()
//      formDataUpload.append('file',image) ;
//      formDataUpload.append('upload_preset',uploadPreset);
//      formDataUpload.append('cloud_name',cloudName)

//      try {
//       const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//         formDataUpload)
//       const imageUrl = response.data.secure_url

//       const payload = {
//         name,
//         description,
//         image:imageUrl
//       }

//     //   await dispatch(addCategory(formData:payload))
//     //  } catch (error) {
      
//     //  }
//     }


//     onAddCategory(newCategory);
//     setName('');
//     setDescription('');
//     setImage('');
//     setImagePreview('');
//     onClose();
//   };

//   const closeModal = () => {
//     const modal = document.getElementById('crud-modal');
//     if (modal) {
//       modal.classList.add('hidden');
//       modal.setAttribute('aria-hidden', 'true');
//     }
//   };

 

//   return (
//     <>
//       {isOpen && (
//         <div
//           id="crud-modal"
//           tabIndex={-1}
//           aria-hidden="false"
//           className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-700 bg-opacity-50"
//         >
//           <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow">
//             <div className="flex items-center justify-between p-4 border-b rounded-t">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Create New Category
//               </h3>
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
//                 data-modal-toggle="crud-modal"
//               >
//                 <svg
//                   className="w-3 h-3"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 14 14"
//                 >
//                   <path
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
//                   />
//                 </svg>
//                 <span className="sr-only">Close modal</span>
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="p-4">
//               <div className="grid gap-4 mb-4">
//                 <div>
//                   <label
//                     htmlFor="name"
//                     className="block mb-2 text-sm font-medium text-gray-900"
//                   >
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     name="name"
//                     id="name"
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
//                     placeholder="Type category name"
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="image"
//                     className="block mb-2 text-sm font-medium text-gray-900"
//                   >
//                     Image
//                   </label>
//                   <div>

//                   <input
//                     type="file"
//                     onChange={handleFileChange}
//                     name="image"
//                     id="image"
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
//                   />
//                   <div className='flex justify-center'>
//                   {imagePreview && (
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       className="mt-4 w-48 h-48 rounded-lg"
//                     />
//                   )}
//                   </div>
//                   </div>
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="description"
//                     className="block mb-2 text-sm font-medium text-gray-900"
//                   >
//                     Description
//                   </label>
//                   <textarea
//                     id="description"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     rows={4}
//                     className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Write category description here"
//                   />
//                 </div>
//               </div>
//               <button
//                 type="submit"
//                 className="text-white inline-flex items-center justify-center bg-black w-full  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
//               >
//                 <svg
//                   className="mr-1 -ml-1 w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 Add new Category
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CategoryModal;
