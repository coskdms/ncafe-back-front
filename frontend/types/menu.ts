// Menu 관련 타입 정의

export interface Menu {
  id: string;
  korName: string;
  engName: string;
  description: string;
  price: number;
  categoryId: string;
  images: MenuImage[];
  isAvailable: boolean;
  isSoldOut: boolean;
  sortOrder: number;
  optionGroups: MenuOptionGroup[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuImage {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface MenuOptionDetail {
  id?: number;
  name: string;
  additionalPrice: number;
  sortOrder: number;
}

export interface MenuOptionGroup {
  id?: number;
  name: string;
  isRequired: boolean;
  isMultiple: boolean;
  sortOrder: number;
  optionDetails: MenuOptionDetail[];
}

export interface MenuCategory {
  id: string;
  korName: string;
  engName: string;
  icon?: string;
  sortOrder: number;
}

// Form 관련 타입
export interface MenuFormData {
  korName: string;
  engName: string;
  description: string;
  price: number;
  categoryId: string;
  images: File[];
  isAvailable: boolean;
  optionGroups: MenuOptionGroup[];
}
