'use client';
import style from './index.module.scss';
import Logo from '@/../public/logo.png';
import Image from 'next/image';
import '@/styles/globals.scss';
import close_btn from '@/../public/close_btn.png';
import hamburger_icon from '@/../public/hamburger_icon.png';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Modal from '@/components/modal';
import Modalv2 from '@/components/modalv2';
import LoginModal from '@/containers/login_modal';
import { getToken, deleteToken } from '@/utils/token';
import HospitalDetailModal from '@/containers/find/modal/hospitalDetail/HospitalDetailModal';
import BookingManageModal from './BookingManageModal/BookingManageModal';
import { autoLogin } from '@/service/auth';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToken, setIsToken] = useState('');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleLoginModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const token = getToken();
    // const autologin = autoLogin(token);
    // console.log('autoLogin :', autologin);
    // if (token !== null) {
    //   setIsToken(token);
    // }
    const handleAutoLogin = async () => {
      if (token !== null) {
        const autologin = await autoLogin(token); // autoLogin 함수 호출
        console.log('autoLogin :', autologin);

        if (autologin?.status === 200) {
          // // status가 200인 경우 토큰 저장
          setIsToken(autologin.data.access_token);
          console.log('토큰이 저장되었습니다:', autologin.data.access_token);
        } else {
          // status가 200이 아닌 경우 토큰 삭제
          deleteToken(); // 토큰 삭제 함수
          console.log('토큰이 삭제되었습니다');
        }
      }
    };

    handleAutoLogin(); // 비동기 함수 호출
  }, []);

  return (
    <header>
      <div className={`${style.header_container} home_blueBg`}>
        <nav className={style.nav_container}>
          <ul>
            <li>
              <Link href='/'>
                <div className={style.logoWrapper}>
                  <Image src={Logo} alt='logo' width={48} height={48} />
                </div>
              </Link>
            </li>
          </ul>
          {!isToken && (
            <>
              <div className={style.hamburger} onClick={toggleMenu} style={{ display: menuOpen ? 'none' : 'flex' }}>
                <Image src={hamburger_icon} alt='hamburger_icon' className={style.hamburger_svg} />
              </div>
              <div className={style.closeButton} onClick={toggleMenu} style={{ display: menuOpen ? 'flex' : 'none' }}>
                <Image src={close_btn} alt='close_btn' className={style.hamburger_svg}></Image>
              </div>
            </>
          )}

          <ul className={style.nav_links}>
            <li className={style.ulItem}>
              <Link href='/find'>진료예약</Link>
            </li>
            {isToken ? <AfterLoginDesktop /> : <BeforeLoginDesktop setIsModalOpen={setIsModalOpen} />}
          </ul>
        </nav>
      </div>
      <div className={`home_blueBg  ${style.menu} ${menuOpen ? style.menu_open : ''}`}>
        <div className={style.menu_item}>
          <div>
            <Link href='/Signup'>
              <span className={style.singup}>회원가입</span>
            </Link>
            <span
              className={style.login}
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <p>로그인</p>
            </span>
          </div>
        </div>
      </div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LoginModal handleLoginModal={handleLoginModal} />
      </Modal>
    </header>
  );
}

interface BeforeLoginDesktopProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// 로그인 전 텍스트 표시
const BeforeLoginDesktop: React.FC<BeforeLoginDesktopProps> = ({ setIsModalOpen }) => {
  return (
    <>
      <li
        className={style.ulItem}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        로그인
      </li>
      <li className={style.ulItem}>
        <Link href='/Signup'>회원가입</Link>
      </li>
    </>
  );
};

//  로그인 후 텍스트 표시
const AfterLoginDesktop = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const logout = () => {
    deleteToken();
    window.location.reload(); // 현재 페이지 새로고침
  };

  const 예약모달 = () => {
    setIsBookingModalOpen(true);
  };

  const closeBookingManageModal = () => {
    setIsBookingModalOpen(false);
  };
  return (
    <>
      <li className={style.ulItem} onClick={예약모달}>
        예약관리
      </li>
      <li className={style.ulItem} onClick={logout}>
        로그아웃
      </li>
      <Modalv2 open={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} width='360px' height='600px'>
        <BookingManageModal closeBookingManageModal={closeBookingManageModal} />
      </Modalv2>
    </>
  );
};
