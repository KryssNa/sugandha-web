// // components/admin/categories/CategoryFormModal.tsx
// import { Category } from '@/components/shared/types/category.types';
// import { AnimatePresence, motion } from 'framer-motion';
// import {
//   FolderTree,
//   Image as ImageIcon,
//   Link as LinkIcon,
//   X,
// } from 'lucide-react';
// import React, { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import Swal from 'sweetalert2';

// interface CategoryFormData extends Omit<Category, 'id' | 'productCount' | 'children' | 'createdAt' | 'updatedAt'> {
//   image?: Category['image'];
// }

// interface CategoryFormModalProps {
//   isOpen: boolean;
//   category?: Category;
//   categories: Category[];
//   onClose: () => void;
//   onSubmit: (data: CategoryFormData) => Promise<void>;
// }

// const showToast = (type: "success" | "error", message: string) => {
//   const Toast = Swal.mixin({
//     toast: true,
//     position: "top-end",
//     showConfirmButton: false,
//     timer: 3000,
//     timerProgressBar: true,
//     didOpen: (toast) => {
//       toast.onmouseenter = Swal.stopTimer;
//       toast.onmouseleave = Swal.resumeTimer;
//     }
//   });

//   Toast.fire({
//     customClass: { popup: "z-xxxl" },
//     icon: type,
//     title: message
//   });
// };

// // ... rest of the CategoryFormModal component remains same ...
// const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
//   isOpen,
//   category,
//   categories,
//   onClose,
//   onSubmit,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     setValue,
//     formState: { errors, isSubmitting }
//   } = useForm<CategoryFormData>({
//     defaultValues: {
//       status: 'active',
//       meta: {
//         title: '',
//         description: '',
//         keywords: ''
//       }
//     }
//   });

//   const {
//     actions: { uploadImage },
//     loading: imageLoading
//   } = useCategoryImages();

//   const name = watch('name');

//   useEffect(() => {
//     if (category) {
//       reset({
//         name: category.name,
//         slug: category.slug,
//         description: category.description || '',
//         parentId: category.parentId,
//         status: category.status,
//         meta: {
//           title: category.meta?.title || '',
//           description: category.meta?.description || '',
//           keywords: category.meta?.keywords?.join(', ') || ''
//         }
//       });
//     } else {
//       reset({
//         status: 'active',
//         meta: {
//           title: '',
//           description: '',
//           keywords: ''
//         }
//       });
//     }
//   }, [category, reset]);

//   useEffect(() => {
//     // Auto-generate slug from name
//     if (name && !category) {
//       const slug = name
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, '');
//       setValue('slug', slug);
//     }
//   }, [name, category, setValue]);

//   const handleImageUpload = async (file: File) => {
//     if (!file) return;
//     try {
//       const imageUrl = await uploadImage(file);
//       setValue('image', file);
//     } catch (error) {
//       console.error('Failed to upload image:', error);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={onClose}
//           />
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.9, y: 20 }}
//             className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 
//               md:max-w-2xl w-full bg-white rounded-xl shadow-xl z-50 max-h-[80vh] overflow-hidden"
//           >
//   {/* Header */}
//   <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//     <div className="flex items-center gap-2">
//       <FolderTree className="w-5 h-5 text-gray-400" />
//       <h2 className="text-lg font-semibold text-gray-900">
//         {category ? 'Edit Category' : 'Add Category'}
//       </h2>
//     </div>
//     <button
//       onClick={onClose}
//       className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//       title='Close'
//     >
//       <X className="w-5 h-5 text-gray-500" />
//     </button>
//   </div>

//   {/* Form */}
//   <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto max-h-[calc(80vh-80px)]">
//     <div className="p-6 space-y-6">
//       {/* Basic Information */}
//       <div className="space-y-4">
//         <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Name
//           </label>
//           <input
//             type="text"
//             {...register('name', { required: 'Name is required' })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
//               focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//           />
//           {errors.name && (
//             <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Slug
//           </label>
//           <div className="flex items-center">
//             <LinkIcon className="w-5 h-5 text-gray-400 mr-2" />
//             <input
//               type="text"
//               {...register('slug', { required: 'Slug is required' })}
//               className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
//                 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//             />
//           </div>
//           {errors.slug && (
//             <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Parent Category
//           </label>
//           <select
//             {...register('parentId')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
//               focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//           >
//             <option value="">None (Top Level)</option>
//             {categories.map(cat => (
//               <option key={cat.id} value={cat.id}>{cat.name}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Description
//           </label>
//           <textarea
//             {...register('description')}
//             rows={3}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
//               focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Status
//           </label>
//           <select
//             {...register('status')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
//               focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//           >
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>
//       </div>

//       {/* Image Upload */}
//       <div className="space-y-4">
//         <h3 className="text-sm font-medium text-gray-900">Category Image</h3>
//         <div className="flex items-center justify-center border-2 border-dashed 
//           border-gray-300 rounded-lg p-6">
//           <div className="text-center">
//             <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
//             <div className="mt-2 flex flex-col items-center">
//               <label
//                 htmlFor="image-upload"
//                 className="relative cursor-pointer rounded-md bg-white font-medium 
//                   text-orange-500 focus-within:outline-none focus-within:ring-2 
//                   focus-within:ring-orange-500 focus-within:ring-offset-2 
//                   hover:text-orange-600"
//               >
//                 <span>Upload an image</span>
//                 <input
//                   id="image-upload"
//                   type="file"
//                   className="sr-only"
//                   accept="image/*"
//                   onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
//                 />
//               </label>
//               <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* SEO Information */}
//       <div className="space-y-4">
//         <h3 className="text-sm font-medium text-gray-900">SEO Information</h3>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Meta Title
//           </label>
//           <input
//             type="text"
//             {...register('meta.title')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
//               focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Meta Description
//           </label>
//           <textarea
//             {...register('meta.description')}
//             rows={2}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
//               focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Keywords
//           </label>
//           <input
//             type="text"
//             {...register('meta.keywords')}
//             placeholder="Separate with commas"
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
//               focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//           />
//         </div>
//       </div>
//     </div>

//     {/* Footer */}
//     <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
//       <button
//         type="button"
//         onClick={onClose}
//         className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 
//           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
//       >
//         Cancel
//       </button>
//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="px-4 py-2 text-sm font-medium text-white bg-orange-500 
//           hover:bg-orange-600 rounded-lg focus:outline-none focus:ring-2 
//           focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 
//           disabled:cursor-not-allowed"
//       >
//         {isSubmitting ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
//       </button>
//     </div>
//   </form>
// </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// export default CategoryFormModal;


// components/admin/categories/CategoryFormModal.tsx
import { Category, CategoryFormData } from '@/components/shared/types/category.types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FolderTree,
  Image as ImageIcon,
  X
} from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

interface CategoryFormModalProps {
  isOpen: boolean;
  category?: Category;
  categories: Category[];
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  category,
  categories,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CategoryFormData>({
    defaultValues: {
      status: 'active',
      meta: {
        title: '',
        description: '',
        keywords: ''
      }
    }
  });

  const name = watch('name');

  // Form reset when category changes
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId || null,
        status: category.status,
        meta: {
          title: category.meta.title,
          description: category.meta.description,
          keywords: category.meta.keywords
        }
      });
    } else {
      reset({
        status: 'active',
        meta: {
          title: '',
          description: '',
          keywords: ''
        }
      });
    }
  }, [category, reset]);



  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File too large',
        text: 'Please select an image under 10MB'
      });
      return;
    }

    try {
      const imageUrl = "await uploadImage(file)";
      // const imageUrl = await uploadImage(file);
      setValue('image', file);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload image. Please try again.'
      });
    }
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      await onSubmit(data);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Category ${category ? 'updated' : 'created'} successfully`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save category. Please try again.'
      });
    }
  };

  // Filter out current category and its children from parent options
  // const availableParents = categories.filter(cat =>
  //   cat.id !== category?.id && !cat.path?.includes(category?.id || '')
  // );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-[25%] md:-translate-x-1/2 
              md:max-w-2xl w-full bg-white rounded-xl shadow-xl z-50 max-h-[80vh]  custom-scrollbar"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {category ? 'Edit Category' : 'Add Category'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title='Close'
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Category
                    </label>
                    <select
                      {...register('parentId')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">None (Top Level)</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      {...register('status')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Category Image</h3>
                  <div className="flex items-center justify-center border-2 border-dashed 
                    border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2 flex flex-col items-center">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer rounded-md bg-white font-medium 
                            text-orange-500 focus-within:outline-none focus-within:ring-2 
                            focus-within:ring-orange-500 focus-within:ring-offset-2 
                            hover:text-orange-600"
                        >
                          <span>Upload an image</span>
                          <input
                            id="image-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">SEO Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      {...register('meta.title')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      {...register('meta.description')}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keywords
                    </label>
                    <input
                      type="text"
                      {...register('meta.keywords')}
                      placeholder="Separate with commas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 
                    hover:bg-orange-600 rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 
                    disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </motion.div>

        </>
      )}
    </AnimatePresence>
  );
};

export default CategoryFormModal;