
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductFilterProps } from "../types/filterTypes";
import { CustomAccordion, CustomCheckbox, CustomSlider, formatCurrency } from "./filterHelpers";




// Main Product Filter Component
export const ProductFilter: React.FC<ProductFilterProps> = ({
    products,
    onFilterChange,
    className = "",
}) => {
    // State
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [selectedAvailability, setSelectedAvailability] = useState<"all" | "inStock" | "outOfStock">("all");
    const [openSection, setOpenSection] = useState<string>("price");

    // Calculate min and max prices from products
    const maxPrice = Math.max(...products.map((p) => p.basePrice));
    const minPrice = Math.min(...products.map((p) => p.basePrice));

    useEffect(() => {
        setPriceRange([minPrice, maxPrice]);
    }, [minPrice, maxPrice]);

    // Calculate unique brands
    const brands = [...new Set(products.map((p) => p.brand))].sort();

    // Calculate unique categories (flatten array of categories)
    const categories = [...new Set(products.flatMap(p => p.category))].sort();

    // Calculate counts
    const brandCounts = brands.reduce((acc, brand) => {
        acc[brand] = products.filter((p) => p.brand === brand).length;
        return acc;
    }, {} as Record<string, number>);

    const categoryCounts = categories.reduce((acc, category) => {
        acc[category] = products.filter((p) => p.category.includes(category)).length;
        return acc;
    }, {} as Record<string, number>);

    // Rating counts based on average rating
    const ratingCounts = [4, 3, 2, 1].reduce((acc, rating) => {
        acc[rating] = products.filter((p) => p.rating.average >= rating).length;
        return acc;
    }, {} as Record<number, number>);

    // Availability counts
    const availabilityCounts = {
        inStock: products.filter((p) => p.inStock).length,
        outOfStock: products.filter((p) => !p.inStock).length,
    };

    // Handle price change
    const handlePriceChange = (values: [number, number]) => {
        setPriceRange(values);
    };

    const clearAllFilters = () => {
        setPriceRange([minPrice, maxPrice]);
        setSelectedBrands([]);
        setSelectedCategories([]);
        setSearchQuery("");
        setSelectedRating(null);
        setSelectedAvailability("all");
    };

    // Update filters
    useEffect(() => {
        onFilterChange({
            priceRange: {
                min: priceRange[0],
                max: priceRange[1],
                current: priceRange,
            },
            brands: selectedBrands,
            categories: selectedCategories,
            search: searchQuery,
            rating: selectedRating,
            availability: selectedAvailability,
            sortBy: "popular", // Default sort
        });
    }, [
        priceRange,
        selectedBrands,
        selectedCategories,
        searchQuery,
        selectedRating,
        selectedAvailability,
        onFilterChange,
    ]);

    return (
        <div className={`bg-white p-4 rounded-lg border border-gray-200 space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 
              transition-colors duration-200"
                >
                    Clear All
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
              transition-shadow duration-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {/* Price Range Filters */}
            <CustomAccordion
                title="Price Range"
                isOpen={openSection === "price"}
                onToggle={() => setOpenSection(openSection === "price" ? "" : "price")}
            >
                <div className="p-4 space-y-6">
                    <div>
                        <label className="text-sm text-gray-600 mb-2">Minimum Price</label>
                        <CustomSlider
                            range={{
                                min: minPrice,
                                max: maxPrice,
                                current: priceRange,
                            }}
                            onChange={handlePriceChange}
                            step={100}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-2">Maximum Price</label>
                        <CustomSlider
                            range={{
                                min: minPrice,
                                max: maxPrice,
                                current: priceRange,
                            }}
                            onChange={handlePriceChange}
                            step={100}
                        />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatCurrency(priceRange[0])}</span>
                        <span>{formatCurrency(priceRange[1])}</span>
                    </div>
                </div>
            </CustomAccordion>

            {/* Brand Filter */}
            <CustomAccordion
                title="Brands"
                isOpen={openSection === "brands"}
                onToggle={() => setOpenSection(openSection === "brands" ? "" : "brands")}
                badge={selectedBrands.length}
            >
                <div className="p-4 space-y-2">
                    {brands.map((brand) => (
                        <CustomCheckbox
                            key={brand}
                            label={brand}
                            checked={selectedBrands.includes(brand)}
                            onChange={() => {
                                setSelectedBrands(prev =>
                                    prev.includes(brand)
                                        ? prev.filter(b => b !== brand)
                                        : [...prev, brand]
                                );
                            }}
                            count={brandCounts[brand]}
                        />
                    ))}
                </div>
            </CustomAccordion>

            {/* Categories */}
            <CustomAccordion
                title="Categories"
                isOpen={openSection === "categories"}
                onToggle={() => setOpenSection(openSection === "categories" ? "" : "categories")}
                badge={selectedCategories.length}
            >
                <div className="p-4 space-y-2">
                    {categories.map((category) => (
                        <CustomCheckbox
                            key={category}
                            label={category}
                            checked={selectedCategories.includes(category)}
                            onChange={() => {
                                setSelectedCategories(prev =>
                                    prev.includes(category)
                                        ? prev.filter(c => c !== category)
                                        : [...prev, category]
                                );
                            }}
                            count={categoryCounts[category]}
                        />
                    ))}
                </div>
            </CustomAccordion>

            {/* Rating Filter */}
            <CustomAccordion
                title="Rating"
                isOpen={openSection === "rating"}
                onToggle={() => setOpenSection(openSection === "rating" ? "" : "rating")}
                badge={selectedRating ? 1 : undefined}
            >
                <div className="p-4 space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                        <div
                            key={rating}
                            onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                            className="flex items-center justify-between cursor-pointer p-2 
                hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <div className="flex items-center space-x-2">
                                <div className="flex">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <svg
                                            key={index}
                                            className={`w-4 h-4 ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">& Up</span>
                            </div>
                            <span className="text-xs text-gray-500">({ratingCounts[rating]})</span>
                        </div>
                    ))}
                </div>
            </CustomAccordion>

            {/* Availability Filter */}
            <CustomAccordion
                title="Availability"
                isOpen={openSection === "availability"}
                onToggle={() => setOpenSection(openSection === "availability" ? "" : "availability")}
                badge={selectedAvailability !== "all" ? 1 : undefined}
            >
                <div className="p-4 space-y-2">
                    <CustomCheckbox
                        label="In Stock"
                        checked={selectedAvailability === "inStock"}
                        onChange={() => setSelectedAvailability(
                            selectedAvailability === "inStock" ? "all" : "inStock"
                        )}
                        count={availabilityCounts.inStock}
                    />
                    <CustomCheckbox
                        label="Out of Stock"
                        checked={selectedAvailability === "outOfStock"}
                        onChange={() => setSelectedAvailability(
                            selectedAvailability === "outOfStock" ? "all" : "outOfStock"
                        )}
                        count={availabilityCounts.outOfStock}
                    />
                </div>
            </CustomAccordion>

            {/* Active Filters */}
            {(selectedBrands.length > 0 ||
                selectedCategories.length > 0 ||
                selectedRating !== null ||
                selectedAvailability !== "all") && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-900">Active Filters</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedBrands.map((brand) => (
                                <span
                                    key={brand}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                  font-medium bg-orange-50 text-orange-700 group hover:bg-orange-100"
                                >
                                    {brand}
                                    <button
                                        onClick={() => setSelectedBrands(prev => prev.filter(b => b !== brand))}
                                        className="ml-1 text-orange-500 hover:text-orange-700 transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}

                            {selectedCategories.map((category) => (
                                <span
                                    key={category}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                  font-medium bg-orange-50 text-orange-700 group hover:bg-orange-100"
                                >
                                    {category}
                                    <button
                                        onClick={() => setSelectedCategories(prev => prev.filter(c => c !== category))}
                                        className="ml-1 text-orange-500 hover:text-orange-700 transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}

                            {selectedRating !== null && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                font-medium bg-orange-50 text-orange-700 group hover:bg-orange-100"
                                >
                                    {selectedRating}★ & Up
                                    <button
                                        onClick={() => setSelectedRating(null)}
                                        className="ml-1 text-orange-500 hover:text-orange-700 transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}

                            {selectedAvailability !== "all" && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                font-medium bg-orange-50 text-orange-700 group hover:bg-orange-100"
                                >
                                    {selectedAvailability === "inStock" ? "In Stock" : "Out of Stock"}
                                    <button
                                        onClick={() => setSelectedAvailability("all")}
                                        className="ml-1 text-orange-500 hover:text-orange-700 transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                )}

            {/* Mobile Apply Filters Button */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 
        p-4 shadow-lg z-50">
                <div className="flex space-x-4 max-w-md mx-auto">
                    <button
                        onClick={clearAllFilters}
                        className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 
              hover:bg-gray-50 transition-colors duration-200"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={() => setOpenSection("")}
                        className="w-1/2 px-4 py-2 bg-orange-500 text-white rounded-lg 
              hover:bg-orange-600 transition-colors duration-200"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};
