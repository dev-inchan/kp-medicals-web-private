import Link from 'next/link';
import style from './topSearched.module.scss';
import PrimaryCare from '@/../public/primaryCare.png';
import Dentist from '@/../public/dentist.png';
import ObGyn from '@/../public/ob-gyn.png';
import Dermatologist from '@/../public/dermatologist.png';
import Psychiatrist from '@/../public/psychiatrist.png';
import EyeDoctor from '@/../public/eye-doctor.png';

import Image from 'next/image';

const PathName = '/find';

export default function TopSearched() {
  return (
    <section className={style.top_sc_container}>
      <div className={style.center_align}>
        <h3 className={style.search}>가장 많이 검색된 분야</h3>
        <div className={style.grid_container}>
          <Link href={{ pathname: PathName, query: { department_id: '23' } }} className={style.top_link}>
            <p className={style.test}>
              <Image src={PrimaryCare} alt='Primary Care' className={style.img} />
            </p>
            <div>가정의학과</div>
          </Link>
          <Link href={{ pathname: PathName, query: { department_id: '31' } }} className={style.top_link}>
            <p className={style.test}>
              <Image src={Dentist} alt='Dentist' className={style.img} />
            </p>
            <div>치과</div>
          </Link>
          <Link href={{ pathname: PathName, query: { department_id: '10' } }} className={style.top_link}>
            <p className={style.test}>
              <Image src={ObGyn} alt='ObGyn' className={style.img} />
            </p>
            <div>산부인과</div>
          </Link>
          <Link href={{ pathname: PathName, query: { department_id: '14' } }} className={style.top_link}>
            <p className={style.test}>
              <Image src={Dermatologist} alt='Dermatologist' className={style.img} />
            </p>
            <div>피부과</div>
          </Link>
          <Link href={{ pathname: PathName, query: { department_id: '3' } }} className={style.top_link}>
            <p className={style.test}>
              <Image src={Psychiatrist} alt='Psychiatrist' className={style.img} />
            </p>
            <div>정신의학과</div>
          </Link>
          <Link href={{ pathname: PathName, query: { department_id: '12' } }} className={style.top_link}>
            <p className={style.test}>
              <Image src={EyeDoctor} alt='EyeDoctor' className={style.img} />
            </p>
            <div>안과</div>
          </Link>
        </div>
      </div>
    </section>
  );
}
