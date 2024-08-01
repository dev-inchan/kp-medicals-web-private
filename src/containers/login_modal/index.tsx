'use client';

import { useState } from 'react';
import style from './index.module.scss';
import { saveToken } from '@/utils/token';
import { useRouter } from 'next/navigation';
import { loginApi } from '@/service/auth';

type Props = {
  handleLoginModal: () => void;
};

export default function LoginModal({ handleLoginModal }: Props) {
  // const router = useRouter();

  const [formData, setFormData] = useState({
    userid: '',
    password: '',
  });

  const [isFormValid, setIsFormValid] = useState(true); // 모든 입력필드 입력유무

  // 입력필드 업데이트
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 로그인 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 모든 필드를 입력했는지 검사
    if (!Object.values(formData).every((value) => value.trim() !== '')) {
      // console.log('1');
      setIsFormValid(false);
      return;
    }

    try {
      //  const a = await loginApi(formData.userid,formData.password)

      const result = await loginApi(formData.userid, formData.password);
      // console.log('Success:', result);
      const { status, data } = result;
      if (status === 201) {
        // console.log('로그인 성공');
        saveToken(data.access_token); // 토큰저장
        handleLoginModal();
        window.location.reload(); // 현재 페이지 새로고침
      } else {
        // console.log('로그인 실패 ');
      }

      // Handle success (e.g., navigate to another page, show success message)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className={style.containerModal}>
      <form action='' className={style.inputWrapperModal} onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='아이디'
          className={style.inputIdModal}
          name='userid'
          value={formData.userid}
          onChange={handleInputChange}
        />
        <div className={style.pawWrapperModal}>
          <input
            type='password'
            className={`${style.inputPawModal}`}
            placeholder='비밀번호'
            name='password'
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button className={style.loginBtnModal}>로그인</button>
      </form>
      {isFormValid || (
        <div className={style.eroWrapper}>
          <p className={style.eroText}>{'모든 필드를 입력해주세요'}</p>
        </div>
      )}
    </div>
  );
}