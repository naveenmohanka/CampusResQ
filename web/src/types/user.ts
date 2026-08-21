export type UserRole = 'student' | 'mentor' | 'admin';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  department?: string;
  avatarUrl?: string;
  status?: UserStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface UserFilters {
  role?: UserRole | 'all';
  searchQuery?: string;
  department?: string;
}
