import { CustomButton } from '@/components/shared/buttons/customButtons';
import ImageGallery from '@/components/shared/image/ImageGallery';
import CustomInput from '@/components/shared/input/customInput';
import { CustomSelect } from '@/components/shared/select/customSelect';
import { showToast } from '@/components/shared/toast/showAlet';
import { Category } from '@/components/shared/types/category.types';
import { Product } from '@/components/shared/types/product.types';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit, Package, Save, Trash } from 'lucide-react';
import React, { useState } from 'react';

interface Rating {
  average: number;
  count: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface Review {
  id: string;
  name: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  datePosted: string;
  helpful: number;
  verifiedPurchase: boolean;
}

export interface ProductFormData {
  // Basic Info
  title: string;
  slug: string;
  sku: string;
  brand: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  // Categories & Organization
  category: {
    id: string;
    name: string;
  }[];
  subCategory: string[];
  tags: string[];
  collections: string[];
  gender: 'male' | 'female' | 'unisex';

  // Pricing & Inventory
  basePrice: number;
  originalPrice: number;
  discountEndDate?: Date;
  quantity: number;
  inStock: boolean;

  // Media
  images: Array<{
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  thumbnail: string;
  coverImage: string;
  video?: string;

  // Variants
  variants: Array<{
    size: number;
    sku: string;
    price: number;
    originalPrice: number;
    quantity: number;
    inStock: boolean;
  }>;

  // Perfume Specific
  concentration: 'Parfum' | 'EDP' | 'EDT' | 'EDC';
  scentNotes: Array<{
    type: 'top' | 'middle' | 'base';
    notes: string[];
  }>;
  sillage: 'Intimate' | 'Moderate' | 'Strong' | 'Enormous';
  longevity: 'Poor' | 'Moderate' | 'Long Lasting' | 'Very Long Lasting';
  seasonality: string[];
  timeOfDay: string[];
  occasions: string[];
  madeIn: string;
  launchYear?: number;
  perfumer?: string;

  // Product Status
  isHot: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimited: boolean;

  // Specifications & Details
  specifications: Array<{
    label: string;
    value: string;
  }>;
  features: string[];
  ingredients: string[];

  // Ratings & Reviews (readonly)
  rating?: Rating;
  reviews?: Review[];
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: Product) => Promise<void>;
  categories: Category[];
}

const INITIAL_FORM_DATA: ProductFormData = {
  // Basic Info
  title: '',
  slug: '',
  sku: '',
  brand: '',
  shortDescription: '',
  metaTitle: '',
  metaDescription: '',
  keywords: [],

  // Categories
  category: [],
  subCategory: [],
  tags: [],
  collections: [],
  gender: 'unisex',

  // Pricing
  basePrice: 0,
  originalPrice: 0,
  quantity: 0,
  inStock: true,

  // Media
  images: [],
  thumbnail: '',
  coverImage: '',

  // Product Details
  concentration: 'EDT',
  scentNotes: [],
  sillage: 'Moderate',
  longevity: 'Moderate',
  seasonality: [],
  timeOfDay: [],
  occasions: [],
  madeIn: '',

  // Status
  isHot: false,
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
  isLimited: false,

  // Other
  specifications: [],
  features: [],
  ingredients: [],
  variants: []
};

const CONCENTRATION_OPTIONS = [
  {
    value: 'perfume',
    label: 'Perfume Extract',
  },
  {
    value: 'perfumeWater',
    label: 'Perfume Water',
  },
  {
    value: 'toiletWater',
    label: 'Toilet Water',
  },
  {
    value: 'cologneWater',
    label: 'Cologne Water',
  }
];
// {
// value: 'perfume',
// label: 'Perfume Extract',
//   concentration: '20-40%',
//   longevity: '6-8 hours',
//   description: 'Strongest and most concentrated form'
// },
// {
// value: 'perfumeWater',
// label: 'Perfume Water',
//   concentration: '15-20%',
//   longevity: '4-6 hours',
//   description: 'Strong concentration for daily wear'
// },
// {
// value: 'toiletWater',
// label: 'Toilet Water',
//   concentration: '5-15%',
//   longevity: '2-4 hours',
//   description: 'Light concentration for casual use'
// },
// {
// value: 'cologneWater',
// label: 'Cologne Water',
//   concentration: '2-4%',
//   longevity: '1-2 hours',
//   description: 'Lightest concentration for frequent application'
// }

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unisex', label: 'Unisex' }
];

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  categories
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    ...INITIAL_FORM_DATA,
    ...initialData
  });
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<number>(0);

  const validateForm = () => {
    const errors: string[] = [];

    // Basic Info Validation
    if (!formData.title.trim()) errors.push("Product title is required");
    if (!formData.brand.trim()) errors.push("Brand is required");
    if (!formData.shortDescription.trim()) errors.push("Short description is required");
    if (!formData.sku.trim()) errors.push("SKU is required");

    // Price Validation
    if (formData.basePrice <= 0) errors.push("Base price must be greater than 0");
    if (formData.originalPrice < formData.basePrice) {
      errors.push("Original price cannot be less than base price");
    }

    // Category Validation
    if (formData.category.length === 0) {
      errors.push("At least one category must be selected");
    }

    // Media Validation
    if (formData.images.length === 0) {
      errors.push("At least one product image is required");
    }
    if (!formData.images.some(img => img.isPrimary)) {
      errors.push("A primary image must be selected");
    }
    if (!formData.thumbnail) errors.push("Thumbnail image is required");
    if (!formData.coverImage) errors.push("Cover image is required");

    // Variant Validation
    if (formData.variants.length === 0) {
      errors.push("At least one variant must be added");
    }

    // Scent Notes Validation
    if (formData.scentNotes.length === 0) {
      errors.push("At least one scent note must be added");
    }

    // Additional Details Validation
    if (!formData.madeIn.trim()) errors.push("Country of origin is required");
    if (!formData.discountEndDate) {
      errors.push("Discount end date is required when discount is applied");
    }

    // SEO Validation
    if (!formData.metaTitle.trim()) errors.push("Meta title is required");
    if (!formData.metaDescription.trim()) errors.push("Meta description is required");
    if (formData.keywords.length === 0) errors.push("At least one keyword is required");

    return errors;
  };


  // Add Thumbnail and Cover Image Selection
  const handleImageSelection = (imageId: string, type: 'thumbnail' | 'coverImage') => {
    const selectedImage = formData.images.find(img => img.id === imageId);
    if (selectedImage) {
      setFormData(prev => ({
        ...prev,
        [type]: selectedImage.url
      }));
    }
  };

  // Variant Management
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [newVariant, setNewVariant] = useState({
    size: '',
    sku: '',
    price: '',
    quantity: ''
  });

  // Specification Management
  const [showSpecForm, setShowSpecForm] = useState(false);
  const [newSpec, setNewSpec] = useState({
    label: '',
    value: ''
  });
  const [newFeature, setNewFeature] = useState('');
  const [newIngredient, setNewIngredient] = useState('');

  // Scent Notes Management
  const [showScentForm, setShowScentForm] = useState(false);
  const [newScentNote, setNewScentNote] = useState<{
    type: 'top' | 'middle' | 'base';
    notes: string[];
  }>({
    type: 'top',
    notes: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagesChange = (images: ProductFormData['images']) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  // Variant Handlers
  const handleAddVariant = () => {
    if (!newVariant.size || !newVariant.sku || !newVariant.price || !newVariant.quantity) {
      alert('Please fill in all variant fields');
      return;
    }

    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        size: parseFloat(newVariant.size),
        sku: newVariant.sku,
        price: parseFloat(newVariant.price),
        originalPrice: parseFloat(newVariant.price),
        inStock: true,
        quantity: parseInt(newVariant.quantity)
      }]
    }));

    setNewVariant({ size: '', sku: '', price: '', quantity: '' });
    setShowVariantForm(false);
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleEditVariant = (index: number) => {
    const variant = formData.variants[index];
    setNewVariant({
      size: variant.size.toString(),
      sku: variant.sku,
      price: variant.price.toString(),
      quantity: variant.quantity.toString()
    });
    setShowVariantForm(true);
  };

  // Specification Handlers
  const handleAddSpec = () => {
    if (!newSpec.label || !newSpec.value) {
      alert('Please fill in both label and value');
      return;
    }

    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, newSpec]
    }));

    setNewSpec({ label: '', value: '' });
    setShowSpecForm(false);
  };

  const handleRemoveSpec = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  // Feature Handlers
  const handleAddFeature = () => {
    if (!newFeature.trim()) return;

    setFormData(prev => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }));
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Ingredient Handlers
  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;

    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient.trim()]
    }));
    setNewIngredient('');
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  // Scent Note Handlers
  const handleAddScentNote = () => {
    if (!newScentNote.notes.length) {
      alert('Please add at least one note');
      return;
    }

    setFormData(prev => ({
      ...prev,
      scentNotes: [...prev.scentNotes.filter(note => note.type !== newScentNote.type), newScentNote]
    }));

    setNewScentNote({ type: 'top', notes: [] });
    setShowScentForm(false);
  };

  const handleRemoveScentNote = (type: 'top' | 'middle' | 'base') => {
    setFormData(prev => ({
      ...prev,
      scentNotes: prev.scentNotes.filter(note => note.type !== type)
    }));
  };

  // Update Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      // Show errors in a nice format
      const errorMessage = errors.map(err => `• ${err}`).join('\n');
      showToast("error", `Please fix the following errors:\n\n${errorMessage}`);
      return;
    }

    setLoading(true);
    try {
      // Prepare the data
      const submitData: Product = {
        ...formData,
        id: initialData?.id || '', // Ensure id is included
        description: formData.shortDescription, // Map shortDescription to description
        discount: formData.originalPrice - formData.basePrice, // Calculate discount
        updateStock: () => { }, // Placeholder function for updateStock
        discountEndDate: formData.discountEndDate ? new Date(formData.discountEndDate) : undefined
      };

      await onSubmit(submitData);
      // await onSubmit({
      //   ...submitData,
      //   discountEndDate: formData.discountEndDate ? new Date(formData.discountEndDate) : undefined,
      // });

      // Show success message (you might want to use a toast here)
      alert('Product saved successfully!');
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const sections = [
    // Basic Information
    {
      title: 'Basic Information',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput
              label="Product Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter product name"
            />

            <CustomInput
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
              placeholder="Enter brand name"
            />
          </div>

          {/* Add Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label> */}
              <div className="space-y-2">
                <CustomSelect
                  title='Select category'
                  required
                  value={formData.category[0]?.id || ''}
                  onChange={(selectedId) => {
                    const selectedCategory = categories.find(cat => cat.id === selectedId);
                    if (selectedCategory) {
                      setFormData(prev => ({
                        ...prev,
                        category: [{
                          id: selectedCategory.id,
                          name: selectedCategory.name
                        }]
                      }));
                    }
                  }}
                  options={categories.map(cat => ({
                    value: cat.id,
                    label: cat.name
                  }))}
                  className="w-full"
                />

                {/* Show selected categories */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.category.map((cat) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm"
                    >
                      <span>{cat.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            category: prev.category.filter(c => c.id !== cat.id)
                          }));
                        }}
                        className="hover:text-orange-900"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <CustomInput
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              required
              placeholder="Enter product SKU"
            />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput
              label="Base Price"
              name="basePrice"
              type="number"
              value={formData.basePrice.toString()}
              onChange={handleInputChange}
              required
              placeholder="0.00"
            />

            <CustomInput
              label="Original Price"
              name="originalPrice"
              type="number"
              value={formData.originalPrice.toString()}
              onChange={handleInputChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomSelect
              title="Concentration"
              value={formData.concentration}
              onChange={handleSelectChange('concentration')}
              options={CONCENTRATION_OPTIONS}
            />

            <CustomSelect
              title='Select gender'
              value={formData.gender}
              onChange={handleSelectChange('gender')}
              options={GENDER_OPTIONS}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description<span className="text-red"> *</span>
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow duration-200"
              placeholder="Enter product description"
            />
          </div>
        </div>
      )
    },
    // Media
    {
      title: 'Images',
      content: (
        <ImageGallery
          images={formData.images}
          onImagesChange={(newImages) => {
            setFormData(prev => ({
              ...prev,
              images: newImages,
              // Automatically set thumbnail and cover image
              thumbnail: newImages.find(img => img.isPrimary)?.url || newImages[0]?.url || '',
              coverImage: newImages[1]?.url || '',
            }));
          }}
          maxImages={8}
          uploadEndpoint={`/uploads/products/images`}
        />
      )
    },
    // Pricing & Inventory
    {
      title: 'Variants',
      content: (
        <div className="space-y-6">
          {/* Add Variant Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
              <CustomButton
                variant="outline"
                size="sm"
                onClick={() => setShowVariantForm(prev => !prev)}
              >
                {showVariantForm ? 'Cancel' : 'Add Variant'}
              </CustomButton>
            </div>

            {/* Variant Form */}
            <AnimatePresence>
              {showVariantForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                    <CustomInput
                      label="Size (ml)"
                      name="size"
                      type="number"
                      value={newVariant.size}
                      onChange={(e) => setNewVariant(prev => ({
                        ...prev,
                        size: e.target.value
                      }))}
                      placeholder="50"
                    />
                    <CustomInput
                      label="SKU"
                      name="sku"
                      value={newVariant.sku}
                      onChange={(e) => setNewVariant(prev => ({
                        ...prev,
                        sku: e.target.value
                      }))}
                      placeholder="PROD-001"
                    />
                    <CustomInput
                      label="Price"
                      name="price"
                      type="number"
                      value={newVariant.price}
                      onChange={(e) => setNewVariant(prev => ({
                        ...prev,
                        price: e.target.value
                      }))}
                      placeholder="99.99"
                    />
                    <CustomInput
                      label="Quantity"
                      name="quantity"
                      type="number"
                      value={newVariant.quantity}
                      onChange={(e) => setNewVariant(prev => ({
                        ...prev,
                        quantity: e.target.value
                      }))}
                      placeholder="100"
                    />
                  </div>
                  <div className="flex justify-end">
                    <CustomButton onClick={handleAddVariant}>
                      Add Variant
                    </CustomButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Variants Table */}
            {formData.variants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Size (ml)</th>
                      <th className="px-4 py-2 text-left">SKU</th>
                      <th className="px-4 py-2 text-left">Price</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.variants.map((variant, index) => (
                      <motion.tr
                        key={variant.sku}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-t border-gray-200"
                      >
                        <td className="px-4 py-2">{variant.size}</td>
                        <td className="px-4 py-2">{variant.sku}</td>
                        <td className="px-4 py-2">${variant.price}</td>
                        <td className="px-4 py-2">{variant.quantity}</td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditVariant(index)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveVariant(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No variants added yet
              </div>
            )}
          </div>
        </div>
      )
    },
    // Specifications & Details
    {
      title: 'Specifications',
      content: (
        <div className="space-y-6">
          {/* Specifications Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
              <CustomButton
                variant="outline"
                size="sm"
                onClick={() => setShowSpecForm(prev => !prev)}
              >
                {showSpecForm ? 'Cancel' : 'Add Specification'}
              </CustomButton>
            </div>

            <AnimatePresence>
              {showSpecForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                    <CustomInput
                      label="Label"
                      name="specLabel"
                      value={newSpec.label}
                      onChange={(e) => setNewSpec(prev => ({
                        ...prev,
                        label: e.target.value
                      }))}
                      placeholder="e.g., Material"
                    />
                    <CustomInput
                      label="Value"
                      name="specValue"
                      value={newSpec.value}
                      onChange={(e) => setNewSpec(prev => ({
                        ...prev,
                        value: e.target.value
                      }))}
                      placeholder="e.g., Glass"
                    />
                  </div>
                  <div className="flex justify-end">
                    <CustomButton onClick={handleAddSpec}>
                      Add Specification
                    </CustomButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Specifications List */}
            <div className="space-y-4">
              {formData.specifications.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-gray-900">{spec.label}: </span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveSpec(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
            </div>
            <div className="flex gap-2 mb-4">
              <CustomInput
                name="newFeature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature..."
                className="flex-1"
              />
              <CustomButton
                variant="outline"
                onClick={handleAddFeature}
              >
                Add
              </CustomButton>
            </div>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span>{feature}</span>
                  <button
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Ingredients</h3>
            </div>
            <div className="flex gap-2 mb-4">
              <CustomInput
                name="newIngredient"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Add an ingredient..."
                className="flex-1"
              />
              <CustomButton
                variant="outline"
                onClick={handleAddIngredient}
              >
                Add
              </CustomButton>
            </div>
            <div className="space-y-2">
              {formData.ingredients.map((ingredient, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span>{ingredient}</span>
                  <button
                    onClick={() => handleRemoveIngredient(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    // Scent
    {
      title: 'Scent Notes',
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Scent Notes</h3>
              <CustomButton
                variant="outline"
                size="sm"
                onClick={() => setShowScentForm(prev => !prev)}
              >
                {showScentForm ? 'Cancel' : 'Add Scent Note'}
              </CustomButton>
            </div>

            <AnimatePresence>
              {showScentForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <div className="grid gap-4">
                      <CustomSelect
                        value={newScentNote.type}
                        onChange={(value) => setNewScentNote(prev => ({
                          ...prev,
                          type: value as 'top' | 'middle' | 'base'
                        }))}
                        options={[
                          { value: 'top', label: 'Top Notes' },
                          { value: 'middle', label: 'Middle Notes' },
                          { value: 'base', label: 'Base Notes' }
                        ]}
                      />
                      <div>
                        <CustomInput
                          label="Notes (comma separated)"
                          name="notes"
                          value={newScentNote.notes.join(', ')}
                          onChange={(e) => setNewScentNote(prev => ({
                            ...prev,
                            notes: e.target.value.split(',').map(note => note.trim())
                          }))}
                          placeholder="e.g., Bergamot, Lemon, Orange"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <CustomButton onClick={handleAddScentNote}>
                      Add Scent Note
                    </CustomButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scent Notes Display */}
            <div className="space-y-6">
              {(['top', 'middle', 'base'] as const).map(type => {
                const notes = formData.scentNotes.find(note => note.type === type);
                return (
                  <div key={type} className="space-y-2">
                    <h4 className="font-medium text-gray-900 capitalize">{type} Notes</h4>
                    {notes ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap gap-2"
                      >
                        {notes.notes.map((note, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                          >
                            {note}
                          </span>
                        ))}
                        <button
                          onClick={() => handleRemoveScentNote(type)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ) : (
                      <p className="text-gray-500 text-sm">No notes added</p>
                    )}
                  </div>
                );
              }
              )}
            </div>
          </div>
        </div>
      )
    },
    // SEO & Meta
    {
      title: 'SEO & Meta',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput
              label="Meta Title"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              placeholder="SEO title"
            />

            <CustomInput
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="product-url-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="SEO description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords (comma separated)
            </label>
            <CustomInput
              name="keywords"
              value={formData.keywords.join(', ')}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                keywords: e.target.value.split(',').map(k => k.trim())
              }))}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>
      )
    },
    // Additional Details
    {
      title: 'Additional Details',
      content: (
        <div className="space-y-6">
          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomSelect
              value={formData.sillage}
              onChange={handleSelectChange('sillage')}
              options={[
                { value: 'Intimate', label: 'Intimate' },
                { value: 'Moderate', label: 'Moderate' },
                { value: 'Strong', label: 'Strong' },
                { value: 'Enormous', label: 'Enormous' }
              ]}
            />

            <CustomSelect
              value={formData.longevity}
              onChange={handleSelectChange('longevity')}
              options={[
                { value: 'Poor', label: 'Poor' },
                { value: 'Moderate', label: 'Moderate' },
                { value: 'Long Lasting', label: 'Long Lasting' },
                { value: 'Very Long Lasting', label: 'Very Long Lasting' }
              ]}
            />

            <CustomInput
              label="Made In"
              name="madeIn"
              value={formData.madeIn}
              onChange={handleInputChange}
              placeholder="Country of origin"
            />

            <CustomInput
              label="Launch Year"
              name="launchYear"
              type="number"
              value={formData.launchYear?.toString() || ''}
              onChange={handleInputChange}
              placeholder="2024"
            />

            <CustomInput
              label="Perfumer"
              name="perfumer"
              value={formData.perfumer || ''}
              onChange={handleInputChange}
              placeholder="Perfumer name"
            />

            <CustomInput
              label="Discount End Date"
              name="discountEndDate"
              type="datetime-local"
              value={formData.discountEndDate
                ? new Date(formData.discountEndDate).toISOString().slice(0, 16)
                : ''
              }
              onChange={handleInputChange}
            />
          </div>

          {/* Tags & Collections */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <CustomInput
                name="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  tags: e.target.value.split(',').map(t => t.trim())
                }))}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collections (comma separated)
              </label>
              <CustomInput
                name="collections"
                value={formData.collections.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  collections: e.target.value.split(',').map(c => c.trim())
                }))}
                placeholder="summer, luxury, etc"
              />
            </div>
          </div>
        </div>
      )
    },
    // Product Status
    {
      title: 'Product Status',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isHot}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isHot: e.target.checked
                }))}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span>Hot Product</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isFeatured: e.target.checked
                }))}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span>Featured</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isNewArrival: e.target.checked
                }))}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span>New Arrival</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isBestSeller: e.target.checked
                }))}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span>Best Seller</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isLimited}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isLimited: e.target.checked
                }))}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span>Limited Edition</span>
            </label>
          </div>
        </div>
      )
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto py-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>

          <CustomButton
            type='submit'
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Product'}
          </CustomButton>
        </div>

        {/* Navigation */}
        <div className="flex space-x-2 border-b border-gray-200">
          {sections.map((section, index) => (
            <button
              key={section.title}
              type="button"
              onClick={() => setCurrentSection(index)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative
                ${currentSection === index
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {section.title}
              {currentSection === index && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Current Section Content */}
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {sections[currentSection].content}
        </motion.div>
      </div>
    </form>
  );
};

export default ProductForm;