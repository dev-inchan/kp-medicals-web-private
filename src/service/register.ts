/**
 * 회원 가입 api
 */
import { RegisterUserResponse } from '@/types/register';

export const checkUserIdAvailability = async (userid: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/medical-wallet/users/${userid}/check`);
    if (response.ok) {
      const result = await response.json();
      return result; // API 호출 결과 반환
    } else {
      throw new Error('Failed to check user ID');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error; // 에러를 상위 함수로 전달
  }
};

export const sendVerificationCode = async (phone: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/medical-wallet/mobile?mobile=${phone}`);
    if (response.ok) {
      const result = await response.json();
      return result; // API 호출 결과 반환
    } else {
      throw new Error('Failed to send verification code');
    }
  } catch (error) {
    console.error('Error in sendVerificationCode:', error);
    throw error; // 에러를 상위 함수로 전달
  }
};

export const verifyPhoneNumberCode = async (phone: string, verificationCode: string, telToken: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}api/medical-wallet/mobile/check?mobile=${phone}&mobile_code=${verificationCode}&verify_token=${telToken}`,
    );
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error('Failed to verify phone number code');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const registerUser = async (userData: {
  userid: string;
  password: string;
  phone: string;
  name: string;
  birthDate: string;
  birthSex: string;
}): Promise<RegisterUserResponse> => {
  try {
    const response = await fetch('https://kp-medicals.com/api/medical-wallet/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account: userData.userid,
        password: userData.password,
        mobile: userData.phone,
        name: userData.name,
        dob: userData.birthDate,
        sex_code: userData.birthSex,
      }),
    });

    if (response.ok) {
      const result: RegisterUserResponse = await response.json();
      return result; // API 호출 결과 반환
    } else {
      throw new Error('Registration failed');
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
};
