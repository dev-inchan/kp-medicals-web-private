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
import LoginModal from '@/containers/login_modal';
import { getToken, deleteToken } from '@/utils/token';

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
    if (token !== null) {
      setIsToken(token);
    }
  }, []);

  return (
    <header>
      <div className={`${style.header_container} home_blueBg`}>
        <nav className={style.nav_container}>
          <ul>
            <li>
              <Link href='/'>
                <div className={style.logoWrapper}>
                  <Image src={Logo} alt='logo' layout='fill' />
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
  const logout = () => {
    deleteToken();
    window.location.reload(); // 현재 페이지 새로고침
  };

  return (
    <>
      <li className={style.ulItem} onClick={logout}>
        로그아웃
      </li>
    </>
  );
};