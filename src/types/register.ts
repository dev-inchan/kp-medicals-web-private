export interface RegisterUserResponse {
  status: number;
  success: string;
  message: string;
  data: number;
}

interface FormData {
  userid: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  verificationCode: string;
  birthDate: string;
  birthSex: string;
}

export interface ValidationState {
  formData: FormData;
  isIdChecking: boolean;
  checkedId: string;
  isTelChecking: boolean;
  인증번호체크한핸드폰번호: string;
}
