import style from './footer.module.scss';
import Image from 'next/image';
import footer from '@/../public/footer.webp';

const EMAIL = 'knpuniverse@gmail.com';
const BUSINEESE_NUM = '607-45-72039';
export default function Footer() {
  return (
    <footer className={style.footer_container}>
      <div className={style.footer_frame}>
        <div className={style.footer_brand}>
          <p>Developed by</p>
          <Image className={style.footer_img} alt='footer-logo' src={footer}></Image>
        </div>
        <div className={style.businees_info}>
          <p>사업자번호 : {BUSINEESE_NUM}</p>
          <p>이메일 : {EMAIL}</p>
        </div>
      </div>
    </footer>
  );
}
