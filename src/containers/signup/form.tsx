'use client';
import { useState, useEffect } from 'react';
import style from './form.module.scss';
import { useRouter } from 'next/navigation';

const useridEroM = '아이디를 확인해주세요';
const checkidEroM = '아이디 중복검사 해주세요';
const passwordroM = '비밀번호를 확인해주세요';
const confirmPasswordEroM = '비밀번호가 일치하지 않습니다.';
const namEroM = '이름을 입력해주세요';
const phonEroM = '전화번호를 입력해주세요';
const isphoneVerifyEroM = '인증번호를 다시 확인해주세요';
const birthDateEroM = '생년월일 8자리를 입력해주세요';
const sexEroM = '성별을 입력해주세요';

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
  const [isFormValid, setIsFormValid] = useState(true);
  const [isIdChecking, setIsIdChecking] = useState(false);
  const [checkedId, setCheckedId] = useState('');
  const [isTelChecking, setIsTelChecking] = useState(false);

  // 인증번호 토큰
  const [telToken, setTelToken] = useState('');

  // 에러문구 state
  const [IdEro, setIdEro] = useState('');
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

    if (name == 'userid') {
      const isValid = /^[a-zA-Z0-9]{6,30}$/.test(formData.userid.trim());
      if (!isValid) {
        setIdEro(useridEroM);
      } else {
        setIdEro('');
      }

      return;
    }
    if (name == 'password') {
      const isValid = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/.test(formData.password.trim());
      if (!isValid) {
        setPawEro(passwordroM);
        // return;
      } else {
        setPawEro('');
      }
      return;
    }
    if (name == 'confirmPassword') {
      // 비밀번호 재확인 검사

      if (formData.password.trim() !== formData.confirmPassword.trim()) {
        setConfirmPawEro(confirmPasswordEroM);
      } else {
        setConfirmPawEro('');
      }
      return;
    }
    if (name == 'name') {
      // 이름 입력검사
      if (value.trim() === '') {
        setNameEro(namEroM);
      } else {
        setNameEro('');
      }
      return;
    }
    if (name == 'phone') {
      // 전화번호 입력검사

      if (value.trim() == '') {
        setTelEro(phonEroM);
        // return;
      } else {
        setTelEro('');
      }
      return;
    }
    if (name == 'birthDate') {
      // 생년월일 입력검사

      if (value.trim() === '') {
        setDobEro(birthDateEroM);
      } else {
        setDobEro('');
      }
      return;
    }
    if (name == 'birthSex') {
      // 성별 입력검사

      if (value.trim() === '') {
        setSexEro(sexEroM);
      } else {
        setSexEro('');
      }
      return;
    }
  };

  // 제출
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 모든 필드를 입력했는지 검사
    if (!Object.values(formData).every((value) => value.trim() !== '')) {
      console.log('1');
      setIsFormValid(false);
      return;
    }
    // 중복확인 검사
    if (!isIdChecking) {
      console.log('아이디중복확인');
      return;
    }
    // 중복확인한 아이디와 입력한 아이디가 같은지 검사.
    if (checkedId !== formData.userid.trim()) {
      setIdEro(useridEroM);

      console.log('2');
      return;
    }
    // 비밀번호 확인 검사
    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      setConfirmPawEro(confirmPasswordEroM);
      console.log('2');
      return;
    }
    // 인증번호 확인했는지 검사.
    if (!isTelChecking) {
      console.log('3');
      return;
    }

    console.log('제출');
    // return;

    try {
      const response = await fetch('https://kp-medicals.com/api/medical-wallet/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: formData.userid.trim(),
          password: formData.password.trim(),
          mobile: formData.phone.trim(),
          name: formData.name.trim(),
          dob: formData.birthDate.trim(),
          sex_code: formData.birthSex.trim(),
        }),
      });
      if (response.ok) {
        const { status } = await response.json();
        if (status == 201) {
          //  회원가입 완료
          router.replace('/');
        }
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 아이디 중복확인 api
  const handleCheckUserId = async () => {
    if (formData.userid.trim() === '') {
      console.log('비어있음.');
      return;
    }
    try {
      const response = await fetch(`https://kp-medicals.com/api/medical-wallet/users/${formData.userid}/check`);
      if (response.ok) {
        const result = await response.json();
        const { status } = result;
        console.log(result);
        if (status == 200) {
          setIsIdChecking(true);
          // alert('사용할 수 있는 아이디입니다.');
          setCheckedId(formData.userid.trim());
        } else {
          setIdEro('사용할 수 없는 아이디입니다.');
        }
      } else {
        setIsIdChecking(false);
      }
    } catch (error) {
      console.error('Error:', error);
      // setCheckResult('An error occurred while checking the userid');
      setIsIdChecking(false);
    }
  };
  // 인증번호 전송
  const handleSendVerificationCode = async () => {
    if (formData.phone.trim() === '') {
      console.log('전화번호를 입력해주세요.');
      return;
    }
    try {
      const response = await fetch(`https://kp-medicals.com/api/medical-wallet/mobile?mobile=${formData.phone}`);
      if (response.ok) {
        const result = await response.json();
        const { status, data } = result;
        console.log('result : ', result);
        if (status == 200) {
          setTelToken(data.verify_token);
          console.log(data.verify_token);
        } else {
          setTelToken('');
        }
      } else {
        // 응답 오류
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (formData.verificationCode.trim() === '') {
      // console.log('인증번호를 입력해주세요.');
      setVerifyEro('인증번호를 입력해주세요');
      return;
    }
    console.log();
    if (telToken === '') {
      // console.log('인증번호 전송을 먼저 해주세요.');
      setVerifyEro('인증번호 전송을 먼저 해주세요');
      return;
    }
    try {
      const response = await fetch(
        `https://kp-medicals.com/api/medical-wallet/mobile/check?mobile=${formData.phone}&mobile_code=${formData.verificationCode}&verify_token=${telToken}`,
      );
      if (response.ok) {
        const result = await response.json();
        const { status } = result;
        if (status == 200) {
          setIsTelChecking(true);
          alert('인증번호가 확인되었습니다.');
        } else {
          alert('인증번호가 일치하지 않습니다.');
          setIsTelChecking(false);
        }
      } else {
        alert('인증번호 확인에 실패했습니다.');
        setIsTelChecking(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsTelChecking(false);
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
        {!IdEro && isIdChecking && (
          <div className={style.eroWrapper}>
            <p className={style.idcheckText}>{'사용할 수 있는 아이디입니다.'}</p>
          </div>
        )}
      </div>
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
            ></input>
          </div>
          <div className={style.inputText}>
            <span> - </span>
          </div>
          <div>
            <input
              type='text'
              name='birthSex'
              className={style.intputSex}
              value={formData.birthSex}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
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
      {isFormValid || (
        <div className={style.eroWrapper}>
          <p className={style.eroText}>{'모든 필드를 입력해주세요'}</p>
        </div>
      )}
      <button type='submit' className={style.register}>
        <div>
          <span>가입하기</span>
        </div>
      </button>
    </form>
  );
}
