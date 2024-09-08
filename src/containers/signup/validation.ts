import { ValidationState } from '@/types/register';

interface ValidationResult {
  errors: Record<string, string>;
}

export const validateForm = (state: ValidationState): ValidationResult => {
  const errors: Record<string, string> = {};

  const { formData, isIdChecking, checkedId, isTelChecking, 인증번호체크한핸드폰번호 } = state;

  // 아이디 정규식 검사
  if (!/^[a-zA-Z0-9]{6,30}$/.test(formData.userid.trim())) {
    errors.userid = '아이디를 다시 확인해주세요';
  }

  // 아이디 중복검사 했는지 여부
  if (!isIdChecking) {
    errors.userid = '아이디 중복검사를 해주세요';
  }

  // 중복확인한 아이디와 입력한 아이디가 같은지 검사
  if (checkedId !== formData.userid.trim()) {
    errors.userid = '아이디를 다시 입력해주세요';
  }

  // 비밀번호 정규식 검사
  if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/.test(formData.password.trim())) {
    errors.password = '비밀번호를 다시 확인해주세요';
  }
  if (formData.confirmPassword.trim() === '') {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
  }
  // 입력한 비밀번호가 같은지 확인
  if (formData.password.trim() !== formData.confirmPassword.trim()) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
  }

  // 이름 정규식 검사
  if (formData.name.trim().length < 2 || formData.name.trim().length > 10) {
    errors.name = '이름은 2자 이상 10자 이하로 입력해주세요.';
  }

  // 전화번호 정규식 검사
  if (!/^[0-9]{10,11}$/.test(formData.phone.trim())) {
    errors.phone = '올바른 전화번호를 입력해주세요.';
  }

  // 인증번호 확인했는지 여부를 검사
  if (!isTelChecking) {
    errors.verificationCode = '인증번호를 확인해주세요';
  }

  // 인증번호체크한핸드폰번호와 일치하는지 검사
  if (인증번호체크한핸드폰번호 !== formData.phone.trim()) {
    errors.verificationCode = '인증번호를 다시 입력해주세요';
  }

  // 생년월일 입력검사 (8자리 숫자)
  const isBirthDateValid = /^[0-9]{8}$/.test(formData.birthDate.trim());
  if (!isBirthDateValid) {
    errors.birthDate = '생년월일은 8자리 숫자로 입력해주세요.';
  }

  // 성별 입력검사 (숫자만 허용)
  const isBirthSexValid = /^[0-9]$/.test(formData.birthSex.trim());
  if (!isBirthSexValid) {
    errors.birthSex = '성별은 숫자로 입력해주세요.';
  }

  return { errors };
};

// 유효성 검사 함수들
export const validateUserId = (userid: string): string => {
  const isValid = /^[a-zA-Z0-9]{6,30}$/.test(userid.trim());
  return isValid ? '' : '아이디를 다시 확인해주세요';
};

export const validatePassword = (password: string): string => {
  const isValid = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/.test(password.trim());
  return isValid ? '' : '비밀번호를 확인해주세요';
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  return password.trim() === confirmPassword.trim() ? '' : '비밀번호가 일치하지 않습니다.';
};

export const validateName = (name: string): string => {
  const trimmedName = name.trim();
  if (trimmedName === '') {
    return '이름을 입력해주세요';
  } else if (trimmedName.length < 2 || trimmedName.length > 10) {
    return '이름은 2자 이상 10자 이하로 입력해주세요.';
  }
  return '';
};

export const validatePhone = (phone: string): string => {
  const isValid = /^[0-9]{10,11}$/.test(phone.trim());
  return isValid ? '' : '올바른 전화번호를 입력해주세요.';
};

export const validateVerificationCode = (verificationCode: string): string => {
  return verificationCode.trim() === '' ? '인증번호를 입력해주세요' : '';
};

export const validateBirthDate = (birthDate: string): string => {
  const isValid = /^[0-9]{8}$/.test(birthDate.trim());
  return isValid ? '' : '생년월일은 8자리 숫자로 입력해주세요.';
};

export const validateBirthSex = (birthSex: string): string => {
  const isValid = /^[0-9]$/.test(birthSex.trim());
  return isValid ? '' : '성별은 숫자로 입력해주세요.';
};

// 아이디 유효성 검사
export const validateUserIdForCheck = (userid: string | null): string => {
  if (!userid || userid.trim() === '') {
    // userid가 null이거나 빈 문자열일 때
    return '아이디를 입력해주세요';
  }
  return '';
};

export const validatePhoneNumber = (phone: string): string => {
  if (!phone || phone.trim() === '') {
    return '핸드폰번호를 입력해주세요';
  }
  const isValid = /^[0-9]{10,11}$/.test(phone.trim());
  if (!isValid) {
    return '올바른 전화번호를 입력해주세요';
  }
  return '';
};

// 인증번호 유효성 검사
export const validateVerificationCodeInput = (verificationCode: string, telToken: string): string => {
  if (!verificationCode.trim()) {
    return '인증번호를 입력해주세요';
  }

  const regex = /^[0-9]+$/;
  if (!regex.test(verificationCode.trim())) {
    return '인증번호는 숫자만 입력해주세요';
  }

  if (!telToken) {
    return '인증번호 전송을 먼저 해주세요';
  }

  return '';
};
