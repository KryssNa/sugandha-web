// 'use client';

// import { AnimatePresence, motion } from 'framer-motion';
// import {
//     Edit,
//     Settings,
//     Trash2
// } from 'lucide-react';
// import React, { useState } from 'react';

// interface Specification {
//     label: string;
//     value: string;
// }

// interface SpecificationsSectionProps {
//     initialSpecifications?: Specification[];
//     onSpecificationsChange?: (specs: Specification[]) => void;
// }

// const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({
//     initialSpecifications = [],
//     onSpecificationsChange
// }) => {
//     const [specifications, setSpecifications] = useState<Specification[]>(initialSpecifications);
//     const [editingIndex, setEditingIndex] = useState<number | null>(null);
//     const [newSpec, setNewSpec] = useState<Specification>({ label: '', value: '' });

//     const handleAddSpecification = () => {
//         // Validate specification
//         if (!newSpec.label.trim() || !newSpec.value.trim()) {
//             return;
//         }

//         // If editing an existing specification
//         if (editingIndex !== null) {
//             const updatedSpecs = [...specifications];
//             updatedSpecs[editingIndex] = newSpec;
//             setSpecifications(updatedSpecs);
//             setEditingIndex(null);
//         } else {
//             // Adding a new specification
//             const updatedSpecs = [...specifications, newSpec];
//             setSpecifications(updatedSpecs);
//         }

//         // Callback for parent component
//         onSpecificationsChange?.(specifications);

//         // Reset form
//         setNewSpec({ label: '', value: '' });
//     };

//     const handleRemoveSpecification = (index: number) => {
//         const updatedSpecs = specifications.filter((_, i) => i !== index);
//         setSpecifications(updatedSpecs);
//         onSpecificationsChange?.(updatedSpecs);
//     };

//     const handleEditSpecification = (index: number) => {
//         setNewSpec(specifications[index]);
//         setEditingIndex(index);
//     };

//     return (
//         <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
//             <div className="flex justify-between items-center">
//                 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                     <Settings className="w-5 h-5 text-gray-400" />
//                     Product Specifications
//                 </h2>
//             </div>

//             {/* Specification Input Form */}
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Specification Label
//                         </label>
//                         <input
//                             type="text"
//                             value={newSpec.label}
//                             onChange={(e) => setNewSpec(prev => ({
//                                 ...prev,
//                                 label: e.target.value
//                             }))}
//                             className="w-full rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"
//                             placeholder="e.g., Material, Dimensions"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Specification Value
//                         </label>
//                         <input
//                             type="text"
//                             value={newSpec.value}
//                             onChange={(e) => setNewSpec(prev => ({
//                                 ...prev,
//                                 value: e.target.value
//                             }))}
//                             className="w-full rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"
//                             placeholder="e.g., Stainless Steel, 10x5 cm"
//                         />
//                     </div>
//                 </div>
//                 <div className="mt-4 flex justify-end">
//                     {editingIndex !== null ? (
//                         <div className="flex space-x-2">
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     setEditingIndex(null);
//                                     setNewSpec({ label: '', value: '' });
//                                 }}
//                                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={handleAddSpecification}
//                                 className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
//                             >
//                                 Update Specification
//                             </button>
//                         </div>
//                     ) : (
//                         <button
//                             type="button"
//                             onClick={handleAddSpecification}
//                             disabled={!newSpec.label.trim() || !newSpec.value.trim()}
//                             className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
//                 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             Add Specification
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {/* Specifications List */}
//             <AnimatePresence>
//                 {specifications.length > 0 ? (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="space-y-2"
//                     >
//                         {specifications.map((spec, index) => (
//                             <motion.div
//                                 key={`${spec.label}-${index}`}
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 exit={{ opacity: 0, x: -20 }}
//                                 className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
//                             >
//                                 <div className="flex-1">
//                                     <span className="font-medium text-gray-800 mr-2">{spec.label}:</span>
//                                     <span className="text-gray-600">{spec.value}</span>
//                                 </div>
//                                 <div className="flex items-center space-x-2">
//                                     <button
//                                         type="button"
//                                         onClick={() => handleEditSpecification(index)}
//                                         className="text-blue-500 hover:text-blue-700"
//                                         title="Edit Specification"
//                                     >
//                                         <Edit className="w-4 h-4" />
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={() => handleRemoveSpecification(index)}
//                                         className="text-red-500 hover:text-red-700"
//                                         title="Remove Specification"
//                                     >
//                                         <Trash2 className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </motion.div>
//                 ) : (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="text-center text-gray-500 py-6"
//                     >
//                         <Settings className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//                         <p className="text-sm">No specifications added yet.</p>
//                         <p className="text-xs text-gray-400 mt-1">
//                             Use the form above to add product specifications
//                         </p>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default SpecificationsSection;

'use client';

import { ISpecification } from '@/components/shared/types/productTypes';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Edit,
    Plus,
    Settings,
    Trash2
} from 'lucide-react';
import React, { useEffect, useState } from 'react';


interface SpecificationsSectionProps {
    specsManager: {
        specifications: ISpecification[];
        features: string[];
        ingredients: string[];
        loading: boolean;
        actions: {
            addSpecification: (spec: Omit<ISpecification, 'id'>) => Promise<boolean>;
            updateSpecification: (specId: string, updates: Partial<ISpecification>) => Promise<boolean>;
            deleteSpecification: (specId: string) => Promise<boolean>;
            addFeature: (feature: string) => Promise<boolean>;
            removeFeature: (feature: string) => Promise<boolean>;
            addIngredient: (ingredient: string) => Promise<boolean>;
            removeIngredient: (ingredient: string) => Promise<boolean>;
            fetchAllSpecs?: () => Promise<void>;
        };
    };
}

const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({
    specsManager
}) => {
    const [editingSpec, setEditingSpec] = useState<{
        id?: string;
        label: string;
        value: string;
    }>({ label: '', value: '' });
    const [newFeature, setNewFeature] = useState('');
    const [newIngredient, setNewIngredient] = useState('');

    useEffect(() => {
        // Fetch specifications if method exists
        specsManager.actions.fetchAllSpecs?.();
    }, []);

    const handleAddSpecification = async () => {
        // Validate specification
        if (!editingSpec.label.trim() || !editingSpec.value.trim()) {
            alert('Please fill in both label and value');
            return;
        }

        try {
            let success: boolean;
            if (editingSpec.id) {
                // Update existing specification
                success = await specsManager.actions.updateSpecification(
                    editingSpec.id,
                    { label: editingSpec.label, value: editingSpec.value }
                );
            } else {
                // Add new specification
                success = await specsManager.actions.addSpecification({
                    label: editingSpec.label,
                    value: editingSpec.value
                });
            }

            if (success) {
                // Reset form
                setEditingSpec({ label: '', value: '' });
            }
        } catch (error) {
            console.error('Failed to add/update specification', error);
            alert('Failed to add/update specification');
        }
    };

    const handleRemoveSpecification = async (specId: string) => {
        try {
            const success = await specsManager.actions.deleteSpecification(specId);
            if (!success) {
                alert('Failed to remove specification');
            }
        } catch (error) {
            console.error('Failed to remove specification', error);
            alert('Failed to remove specification');
        }
    };

    const handleAddFeature = async () => {
        if (!newFeature.trim()) {
            alert('Please enter a feature');
            return;
        }

        try {
            const success = await specsManager.actions.addFeature(newFeature);
            if (success) {
                setNewFeature('');
            }
        } catch (error) {
            console.error('Failed to add feature', error);
            alert('Failed to add feature');
        }
    };

    const handleRemoveFeature = async (feature: string) => {
        try {
            const success = await specsManager.actions.removeFeature(feature);
            if (!success) {
                alert('Failed to remove feature');
            }
        } catch (error) {
            console.error('Failed to remove feature', error);
            alert('Failed to remove feature');
        }
    };

    const handleAddIngredient = async () => {
        if (!newIngredient.trim()) {
            alert('Please enter an ingredient');
            return;
        }

        try {
            const success = await specsManager.actions.addIngredient(newIngredient);
            if (success) {
                setNewIngredient('');
            }
        } catch (error) {
            console.error('Failed to add ingredient', error);
            alert('Failed to add ingredient');
        }
    };

    const handleRemoveIngredient = async (ingredient: string) => {
        try {
            const success = await specsManager.actions.removeIngredient(ingredient);
            if (!success) {
                alert('Failed to remove ingredient');
            }
        } catch (error) {
            console.error('Failed to remove ingredient', error);
            alert('Failed to remove ingredient');
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            {/* Specifications Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-400" />
                        Product Specifications
                    </h2>
                </div>

                {/* Specification Input Form */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Specification Label
                            </label>
                            <input
                                type="text"
                                value={editingSpec.label}
                                onChange={(e) => setEditingSpec(prev => ({
                                    ...prev,
                                    label: e.target.value
                                }))}
                                className="w-full rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="e.g., Material, Dimensions"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Specification Value
                            </label>
                            <input
                                type="text"
                                value={editingSpec.value}
                                onChange={(e) => setEditingSpec(prev => ({
                                    ...prev,
                                    value: e.target.value
                                }))}
                                className="w-full rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="e.g., Stainless Steel, 10x5 cm"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        {editingSpec.id ? (
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingSpec({ label: '', value: '' })}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddSpecification}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                >
                                    Update Specification
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleAddSpecification}
                                disabled={!editingSpec.label.trim() || !editingSpec.value.trim()}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
                  disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Specification
                            </button>
                        )}
                    </div>
                </div>

                {/* Specifications List */}
                <AnimatePresence>
                    {specsManager.specifications.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-2"
                        >
                            {specsManager.specifications.map((spec) => (
                                <motion.div
                                    key={spec.value}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                                >
                                    <div className="flex-1">
                                        <span className="font-medium text-gray-800 mr-2">{spec.label}:</span>
                                        <span className="text-gray-600">{spec.value}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingSpec({
                                                id: spec.value+1,
                                                label: spec.label,
                                                value: spec.value
                                            })}
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Edit Specification"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSpecification(spec.value+99)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Remove Specification"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-500 py-6"
                        >
                            <Settings className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-sm">No specifications added yet.</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Use the form above to add product specifications
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Features Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-400" />
                        Product Features
                    </h2>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            className="rounded-md border-gray-300 w-48"
                            placeholder="Enter a feature"
                        />
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg 
                hover:bg-orange-100 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </button>
                    </div>
                </div>

                {/* Features List */}
                <AnimatePresence>
                    {specsManager.features.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-2"
                        >
                            {specsManager.features.map((feature) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                                >
                                    <span className="text-gray-800">{feature}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(feature)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Remove Feature"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-500 py-6"
                        >
                            <Settings className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-sm">No features added yet.</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Use the form above to add product features
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-400" />
                        Product Ingredients
                    </h2>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                            className="rounded-md border-gray-300 w-48"
                            placeholder="Enter an ingredient"
                        />
                        <button
                            type="button"
                            onClick={handleAddIngredient}
                            className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg 
                hover:bg-orange-100 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </button>
                    </div>
                </div>

                {/* Ingredients List */}
                <AnimatePresence>
                    {specsManager.ingredients.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-2"
                        >
                            {specsManager.ingredients.map((ingredient) => (
                                <motion.div
                                    key={ingredient}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                                >
                                    <span className="text-gray-800">{ingredient}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveIngredient(ingredient)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Remove Ingredient"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-500 py-6"
                        >
                            <Settings className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-sm">No ingredients added yet.</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Use the form above to add product ingredients
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};


export default SpecificationsSection;