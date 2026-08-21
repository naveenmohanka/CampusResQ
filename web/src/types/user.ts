export type UserRole = 'reporter' | 'responder' | 'admin' | 'student' | 'mentor';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export type ResponderApprovalStatus = 'not_requested' | 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  responderApprovalStatus?: ResponderApprovalStatus;
  responderRequestedAt?: string;
  responderApprovedAt?: string;
  responderApprovedBy?: string;
  responderApprovedByName?: string;
  responderRejectionReason?: string;
  phoneNumber?: string;
  department?: string;
  hostelBlock?: string;
  roomNumber?: string;
  avatarUrl?: string;
  status?: UserStatus;
  createdAt: string;
  updatedAt?: string;
  lastActiveAt?: string;
}

export type User = UserProfile;

export interface UserFilters {
  role?: UserRole | 'all';
  responderApprovalStatus?: ResponderApprovalStatus | 'all';
  searchQuery?: string;
  department?: string;
  status?: UserStatus | 'all';
}
