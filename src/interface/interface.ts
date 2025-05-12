// para la respuesta que viene del conseguir usuario
export interface UserResp {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    reputation: number;
    roleName: string;
    typeDocumentId: number;
    typeDocumentName: string;
    documentNumber: string;
    phoneNumber: string;
    isGoogle: boolean;
    isActive: boolean;
    companyId: number;
    companyName: string;
    activeCompany: boolean;
    password: string;
    activeRole: boolean;
  }