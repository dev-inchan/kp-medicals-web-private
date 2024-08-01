import Link from 'next/link';
import style from './topSearched.module.scss';
import PrimaryCare from '@/../public/primaryCare.png';
import Dentist from '@/../public/dentist.png';
import ObGyn from '@/../public/ob-gyn.png';
import Dermatologist from '@/../public/dermatologist.png';
import Psychiatrist from '@/../public/psychiatrist.png';
import EyeDoctor from '@/../public/eye-doctor.png';

import Image from 'next/image';

export default function TopSearched() {
  return (
    <section className={style.top_sc_container}>
      <div className={style.center_align}>
        <h3 className={style.search}>Top-searched specialites</h3>
        <div className={style.grid_container}>
          <Link href='/find' className={style.top_link}>
            <p className={style.test}>
              <Image src={PrimaryCare} alt='Primary Care' className={style.img} />
            </p>
            <div>Primary Care</div>
          </Link>
          <Link href='/find' className={style.top_link}>
            <p className={style.test}>
              <Image src={Dentist} alt='Dentist' className={style.img} />
            </p>
            <div>dentist</div>
          </Link>
          <Link href='/find' className={style.top_link}>
            <p className={style.test}>
              <Image src={ObGyn} alt='ObGyn' className={style.img} />
            </p>
            <div>OB-GYN</div>
          </Link>
          <Link href='/find' className={style.top_link}>
            <p className={style.test}>
              <Image src={Dermatologist} alt='Dermatologist' className={style.img} />
            </p>
            <div>Dermatologist</div>
          </Link>
          <Link href='/find' className={style.top_link}>
            <p className={style.test}>
              <Image src={Psychiatrist} alt='Psychiatrist' className={style.img} />
            </p>
            <div>Psychiatrist</div>
          </Link>
          <Link href='/find' className={style.top_link}>
            <p className={style.test}>
              <Image src={EyeDoctor} alt='EyeDoctor' className={style.img} />
            </p>
            <div>Eye Doctor</div>
          </Link>
        </div>
      </div>
    </section>
  );
}
