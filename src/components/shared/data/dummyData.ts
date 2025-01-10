import { Product } from "../types/productTypes";

export const generateSampleProducts = (count: number) => {
    const products = Array(count).fill(null).map((_, index) => ({
        id: `${index + 1}`,
        // Basic Information
        title: index % 3 === 0
            ? "Creed Aventus EDP 100ml"
            : index % 3 === 1
                ? "Emporio Armani Stronger With You"
                : "Tom Ford Oud Wood",
        slug: `product-${index + 1}`,
        sku: `SKU${(index + 1).toString().padStart(6, '0')}`,
        brand: index % 3 === 0 ? "Creed" : index % 3 === 1 ? "Emporio Armani" : "Tom Ford",
        description: "Luxurious fragrance with deep notes...",
        shortDescription: "A captivating blend of...",

        // Media
        images: [
            {
                id: `img-${index}-1`,
                url: "/assets/images/products/armani.png",
                alt: "Primary Image",
                isPrimary: true
            },
            {
                id: `img-${index}-2`,
                url: "/assets/images/products/image3.png",
                alt: "Secondary Image",
                isPrimary: false
            }
        ],
        thumbnail: "/assets/images/products/armani.png",
        coverImage: "/assets/images/products/image3.png",
        video: undefined,

        // Pricing & Inventory
        variants: [
            {
                size: 100,
                sku: `SKU${(index + 1).toString().padStart(6, '0')}-100`,
                price: 12500 + index * 1000,
                originalPrice: 15000 + index * 1000,
                quantity: 50,
                inStock: true
            },
            {
                size: 50,
                sku: `SKU${(index + 1).toString().padStart(6, '0')}-50`,
                price: (12500 + index * 1000) * 0.6,
                originalPrice: (15000 + index * 1000) * 0.6,
                quantity: 30,
                inStock: true
            }
        ],
        basePrice: 12500 + index * 1000,
        originalPrice: 15000 + index * 1000,
        discount: 29,
        discountEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        quantity: 80,
        inStock: true,

        // Categories & Organization
        category: ["Perfume"],
        subCategory: ["Luxury"],
        tags: ["Premium", "Bestseller"],
        collections: ["Summer Collection", "Luxury Edition"],
        gender: index % 3 === 0 ? "male" : index % 3 === 1 ? "unisex" : "female",

        // Perfume Specific
        concentration: index % 2 === 0 ? "EDP" : "EDT",
        scentNotes: [
            {
                type: "top",
                notes: ["Bergamot", "Blackcurrant"]
            },
            {
                type: "middle",
                notes: ["Rose", "Jasmine"]
            },
            {
                type: "base",
                notes: ["Vanilla", "Musk"]
            }
        ],
        sillage: "Strong",
        longevity: "Long Lasting",
        seasonality: ["Spring", "Summer"],
        timeOfDay: ["Day", "Night"],
        occasions: ["Casual", "Formal"],

        // Product Details
        specifications: [
            { label: "Volume", value: "100ml" },
            { label: "Type", value: "Eau de Parfum" }
        ],
        features: ["Long-lasting", "Premium Quality"],
        ingredients: ["Alcohol", "Fragrance", "Water"],
        madeIn: "France",
        launchYear: 2020,
        perfumer: "Oliver Creed",

        // Ratings & Reviews
        rating: {
            average: 4.8 - (index % 3) * 0.5,
            count: 1000 - index * 50,
            distribution: {
                1: 10,
                2: 20,
                3: 50,
                4: 200,
                5: 720
            }
        },
        reviews: [
            {
                id: `review-${index}-1`,
                name: "John Doe",
                userId: "user1",
                rating: 5,
                title: "Amazing Fragrance",
                comment: "Excellent fragrance! Long-lasting and unique.",
                datePosted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                helpful: 25,
                verifiedPurchase: true
            }
        ],

        // Marketing & Sales
        isHot: index < 3,
        isFeatured: index < 5,
        isNewArrival: index < 4,
        isBestSeller: index < 6,
        isLimited: index < 2,

        // SEO & Meta
        metaTitle: "Premium Fragrance",
        metaDescription: "Discover luxury fragrances...",
        keywords: ["luxury", "perfume", "fragrance"],

        // Timestamps
        createdAt: new Date(),
        updatedAt: new Date(),

        // Methods
        async updateStock(quantity: number): Promise<void> {
            this.quantity += quantity;
            this.inStock = this.quantity > 0;
            // In a real implementation, this would update the database
            return Promise.resolve();
        }
    }));

    return count === 1 ? products[0] : products;
};