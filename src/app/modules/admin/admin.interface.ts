export interface IAdminFilters {
  searchTerm?: string;
  email?: string;
  contactNo?: string;
}

export interface IAdmin {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  address: string;
  email: string;
  contactNo: string;
  dateOfBirth: string;
  bloodGroup: string;
  createdAt: string;
  updatedAt: string;
}
