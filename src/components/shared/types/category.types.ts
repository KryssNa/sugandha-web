// types/category.types.ts
export interface CategoryMeta {
    title: string;
    description: string;
    keywords: string;
  }
  
  export interface CategoryImage {
    url: string;
    alt: string;
    key?: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string | null;
    status?: 'active' | 'inactive';
    meta: CategoryMeta;
    image?: CategoryImage;
    productCount: number;
    children?: Category[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CategoryFormData {
    name: string;
    slug: string;
    description?: string;
    parentId?: string | null;
    status: 'active' | 'inactive';
    meta: CategoryMeta;
    image?: File;
  }