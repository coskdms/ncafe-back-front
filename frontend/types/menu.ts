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
  options: MenuOption[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuImage {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface MenuOption {
  id: string;
  name: string;
  type: 'radio' | 'checkbox';
  required: boolean;
  items: OptionItem[];
}

export interface OptionItem {
  id: string;
  name: string;
  priceDelta: number;
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
  options: MenuOption[];
}
