// src/types/image.types.ts
export interface Image {
    id: string;
    url: string;
    alt?: string;
    isPrimary?: boolean;
    uploadedAt: Date;
    fileSize: number;
    mimeType: string;
    productId?: string;
    userId?: string;
}

export interface ImageUploadResponse extends Image {
    uploadPath: string;
}
// src/types/image.types.ts
export interface ImageFile {
    id: string;
    url: string;
    alt: string;
    file?: File;
    isPrimary: boolean;
    uploadProgress?: number;
}