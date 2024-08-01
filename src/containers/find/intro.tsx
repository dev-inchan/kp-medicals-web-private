import Image from 'next/image';
import style from './intro.module.scss';
import leftHand from '@/../public/find-leftarm.png';
import rightHand from '@/../public/find-rightarm.png';

const h1Text = 'Book an in-network doctor near you';
const h2Text = 'Find, compare and book with highly-rated, in-network doctors';

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
