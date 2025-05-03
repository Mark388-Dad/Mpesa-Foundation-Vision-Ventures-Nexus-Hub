
export type UserRole = 'student' | 'enterprise' | 'staff';

export interface User {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  admissionNumber?: string;
  phoneNumber?: string;
  role: UserRole;
  enterpriseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enterprise {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  enterpriseId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  productId: string;
  studentId: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  pickupCode?: string; // QR code data
  createdAt: string;
  updatedAt: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  username?: string;
  admissionNumber?: string;
  fullName?: string;
  phoneNumber?: string;
  enterpriseId?: string;
  role: UserRole;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: File;
  categoryId: string;
}
