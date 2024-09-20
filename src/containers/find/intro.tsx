import Image from 'next/image';
import style from './intro.module.scss';
import leftHand from '@/../public/find-leftarm.png';
import rightHand from '@/../public/find-rightarm.png';

const h1Text = '가까운 병원에서 진료 예약하기';
const h2Text = '';

export default function Intro() {
  return (
    <>
      <Image src={leftHand} alt='leftHand' className={style.leftHand}></Image>
      <Image src={rightHand} alt='leftHand' className={style.rightHand}></Image>
      <div className={style.scText}>
        <h1>{h1Text}</h1>
        <h2>{h2Text}</h2>
      </div>
    </>
  );
}
