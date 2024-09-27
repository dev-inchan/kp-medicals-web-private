'use client';
import { useState, useEffect } from 'react';
import style from './form.module.scss';
import { useRouter } from 'next/navigation';
import { checkUserIdAvailability, sendVerificationCode, registerUser, verifyPhoneNumberCode } from '@/service/register';
import { validateForm } from './validation';
import {
  validateUserId,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validatePhone,
  validateVerificationCode,
  validateBirthDate,
  validateBirthSex,
  validateUserIdForCheck,
  validatePhoneNumber,
  validateVerificationCodeInput,
} from './validation';
import { error } from 'console';

export default function Form() {
  const router = useRouter();

  // 입력필드 state
  const [formData, setFormData] = useState({
    userid: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    verificationCode: '',
    birthDate: '',
    birthSex: '',
  });

  // 중복확인 검사 state

  const [isIdChecking, setIsIdChecking] = useState(false);
  const [checkedId, setCheckedId] = useState('');
  const [isTelChecking, setIsTelChecking] = useState(false);
  const [인증번호체크한핸드폰번호, set인증번호체크한핸드폰번호] = useState('');
  // 인증번호 토큰
  const [telToken, setTelToken] = useState('');

  // 에러문구 state
  const [IdEro, setIdEro] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState('');
  const [PawEro, setPawEro] = useState('');
  const [ConfirmPawEro, setConfirmPawEro] = useState('');
  const [NameEro, setNameEro] = useState('');
  const [TelEro, setTelEro] = useState('');

  const [verifyEro, setVerifyEro] = useState('');
  const [DobEro, setDobEro] = useState('');
  const [SexEro, setSexEro] = useState('');

  // 입력필드 업데이트
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 입력 필드에서 포커스가 나갔을 때 유효성 검사
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'userid') {
      setIdEro(validateUserId(value));
    } else if (name === 'password') {
      setPawEro(validatePassword(value));
    } else if (name === 'confirmPassword') {
      setConfirmPawEro(validateConfirmPassword(formData.password, value));
    } else if (name === 'name') {
      setNameEro(validateName(value));
    } else if (name === 'phone') {
      setTelEro(validatePhone(value));
    } else if (name === 'verificationCode') {
      setVerifyEro(validateVerificationCode(value));
    } else if (name === 'birthDate') {
      setDobEro(validateBirthDate(value));
    } else if (name === 'birthSex') {
      setSexEro(validateBirthSex(value));
    }
  };

  // 제출
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationState = {
      formData,
      isIdChecking,
      checkedId,
      isTelChecking,
      인증번호체크한핸드폰번호,
    };

    const { errors } = validateForm(validationState);

    // 오류 메시지를 상태에 설정
    setIdEro(errors.userid || '');
    setPawEro(errors.password || '');
    setConfirmPawEro(errors.confirmPassword || '');
    setNameEro(errors.name || '');
    setTelEro(errors.phone || '');
    setVerifyEro(errors.verificationCode || '');
    setDobEro(errors.birthDate || '');
    setSexEro(errors.birthSex || '');

    console.log('제출');

    if (Object.keys(errors).length > 0) {
      console.log('errors :', errors);
      return;
    }
    //return;
    try {
      const result = await registerUser({
        userid: formData.userid.trim(),
        password: formData.password.trim(),
        phone: formData.phone.trim(),
        name: formData.name.trim(),
        birthDate: formData.birthDate.trim(),
        birthSex: formData.birthSex.trim(),
      });

      if (result.status === 201) {
        // 회원가입 완료
        router.replace('/');
      } else {
        alert(`회원가입에 실패하였습니다.`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 아이디 중복확인
  const handleCheckUserId = async () => {
    const userIdError = validateUserIdForCheck(formData.userid);

    if (userIdError) {
      setIdEro(userIdError);
      console.log('비어있음.');
      return;
    }

    try {
      const result = await checkUserIdAvailability(formData.userid.trim());
      const { status } = result;
      console.log(result);
      if (status == 200) {
        setIsIdChecking(true);
        setCheckedId(formData.userid.trim()); // 중복확인 검사를 한 아이디 저장
        setIdEro('');
        alert('사용할 수 있는 아이디입니다.');
      } else {
        setIdEro('사용할 수 없는 아이디입니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsIdChecking(false);
    }
  };

  // 인증번호 전송
  const handleSendVerificationCode = async () => {
    const phoneError = validatePhoneNumber(formData.phone);

    if (phoneError) {
      console.log(phoneError);
      setTelEro(phoneError);
      return;
    }

    try {
      const result = await sendVerificationCode(formData.phone.trim());
      const { status, data } = result;
      console.log('result:', result);
      if (status == 200) {
        setTelToken(data.verify_token);
        alert('인증번호가 전송되었습니다.');
        // setTelEro();
        console.log(data.verify_token);
      } else {
        setTelToken('');
        alert('인증번호 전송에 실패하였습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('인증번호 전송에 실패하였습니다.');
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    const verificationError = validateVerificationCodeInput(formData.verificationCode, telToken);

    if (verificationError) {
      setVerifyEro('verificationError');
      set인증번호체크한핸드폰번호('');
    }

    try {
      const result = await verifyPhoneNumberCode(formData.phone, formData.verificationCode, telToken);
      const { status } = result;
      if (status == 200) {
        setIsTelChecking(true);
        set인증번호체크한핸드폰번호(formData.phone);
        setVerifyEro('');
        alert('인증번호가 확인되었습니다.');
      } else {
        setIsTelChecking(false);
        set인증번호체크한핸드폰번호('');
        alert('인증번호가 일치하지 않습니다.');
      }
    } catch (error) {
      setIsTelChecking(false);
      setVerifyEro('인증번호 확인에 실패했습니다.');
      set인증번호체크한핸드폰번호('');
    }
  };

  return (
    <form action='' className={style.form} onSubmit={handleSubmit}>
      <div className={style.inputContainer}>
        <label htmlFor='userid' className={style.inputLabel}>
          아이디
        </label>
        <div className={style.flex}>
          <input
            type='text'
            name='userid'
            className={style.input}
            value={formData.userid}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder='한글 특수문자 금지, 6자 이상'
          ></input>
          <button type='button' className={style.subSend} onClick={handleCheckUserId}>
            <div>
              <span>중복확인</span>
            </div>
          </button>
        </div>

        {IdEro && (
          <div className={style.eroWrapper}>
            <p className={style.eroText}>{IdEro}</p>
          </div>
        )}
        {isUsernameAvailable && (
          <div className={style.eroWrapper}>
            <p className={style.eroText}>{isUsernameAvailable}</p>
          </div>
        )}
      </div>
      {/* <button onClick={test}>테스트</button> */}
      <div className={style.inputContainer}>
        <label htmlFor='password' className={style.inputLabel}>
          비밀번호
        </label>
        <div>
          <input
            type='password'
            name='password'
            className={style.input}
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder='8자 이상 영문,숫자,특수문자 사용'
          ></input>
        </div>
        {PawEro && (
          <div className={style.eroWrapper}>
            <p className={style.eroText}>{PawEro}</p>
          </div>
        )}
      </div>
      <div className={style.inputContainer}>
        <label htmlFor='confirmPassword' className={style.inputLabel}>
          비밀번호 확인
        </label>
        <div>
          <input
            type='password'
            name='confirmPassword'
            className={style.input}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          ></input>
        </div>
        {ConfirmPawEro && (
          <div className={style.eroWrapper}>
            <p className={style.eroText}>{ConfirmPawEro}</p>
          </div>
        )}
      </div>
      <div className={style.inputContainer}>
        <label htmlFor='name' className={style.inputLabel}>
          이름
        </label>
        <div>
          <input
            type='text'
            name='name'
            className={style.input}
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            maxLength={10}
            minLength={2}
          ></input>
        </div>
        {NameEro && (
          <div className={style.eroWrapper}>
            <p className={style.eroText}>{NameEro}</p>
          </div>
        )}
      </div>
      <div className={style.inputContainer}>
        <label htmlFor='phone' className={style.inputLabel}>
          휴대전화번호
        </label>
        <div className={style.flex}>
          <input
            type='tel'
            name='phone'
            className={style.input}
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder=''
            maxLength={11}
          ></input>
          <button type='button' className={style.subSend} onClick={handleSendVerificationCode}>
            <div>
              <span>인증번호</span>
            </div>
          </button>
        </div>
        {TelEro && (
          <div className={style.eroWrapper}>
            <p className={style.eroText}>{TelEro}</p>
          </div>
        )}
      </div>
      <div className={style.inputContainer}>
        <label htmlFor='verificationCode' className={style.inputLabel}>
          인증번호
        </label>
        <div className={style.flex}>
          <input
            type='text'
            name='verificationCode'
            className={style.input}
            value={formData.verificationCode}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          ></input>
          <button type='button' className={style.subSend} onClick={handleVerifyCode}>
            <div>
              <span>인증확인</span>
            </div>
          </button>
        </div>
        {verifyEro && (
          <div className={style.eroWrapper}>
            <p className={style.eroText}>{verifyEro}</p>
          </div>
        )}
      </div>
      <div className={style.inputContainer}>
        <label htmlFor='birthDate' className={style.inputLabel}>
          생년월일
        </label>
        <div className={style.flex}>
          <div>
            <input
              type='text'
              name='birthDate'
              className={style.input}
              value={formData.birthDate}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder='생년월일 8자리'
              maxLength={8}
            ></input>
          </div>
          <div className={style.inputText}>
            <span> - </span>
          </div>
          <div>
            <input
              type='password'
              name='birthSex'
              className={style.intputSex}
              value={formData.birthSex}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              pattern='[0-9]*'
              maxLength={1}
            ></input>
          </div>
          <div className={style.inputText}>
            <span>******</span>
          </div>
        </div>
        {DobEro && (
          <div className={style.eroWrapper}>
            <p className={style.eroText}>{DobEro}</p>
          </div>
        )}
        {SexEro && (
          <div className={style.eroWrapper}>
            <p className={style.eroText}>{SexEro}</p>
          </div>
        )}
      </div>
      <button type='submit' className={style.register}>
        <div>
          <span>가입하기</span>
        </div>
      </button>
    </form>
  );
}
