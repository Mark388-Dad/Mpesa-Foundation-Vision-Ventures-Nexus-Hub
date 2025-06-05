
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
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  admissionNumber?: string;
  phoneNumber?: string;
  role: UserRole;
  enterpriseId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enterprise {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  ownerId: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  category?: EnterpriseCategory;
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
  videoUrl?: string;
  fileUrl?: string;
  stickerUrl?: string;
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

export interface OrderCode {
  id: string;
  bookingId: string;
  code: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
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
  video?: File;
  file?: File;
  sticker?: File;
  categoryId: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  studentId: string;
  productId: string;
  enterpriseId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  createdAt: string;
  read: boolean;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}
