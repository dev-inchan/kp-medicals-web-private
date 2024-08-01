'use client';

import style from './index.module.scss';
import { useTextAnimation } from '@/hooks/login/useTextAnimation';
import Title from './title';
import Form from './form';

const texts = [
  '편리한 예약, 신뢰할 수 있는 병원에서 건강을 챙기세요',
  '손쉬운 예약, 내 주변 병원에서 시작하세요',
  '건강한 일상을 위한 첫 걸음, 내 지역 병원 예약',
  '나의 건강 파트너, 믿을 수 있는 병원',
];

export default function Login() {
  const [currentIndex, nextIndex] = useTextAnimation(texts);

  return (
    <main className={style.main}>
      <div className={style['container']}>
        {/* dom을 참조못한다.  */}
        {/* <Title /> */}
        <div className={style['text-container']}>
          <h2 className={style['text-title']}>회원가입</h2>
          <div className={style['text-anim-wrapper']}>
            <div className={style['text-anim']}>
              <span className={style.text}>{texts[currentIndex]}</span>
              <span className={style.text}>{texts[nextIndex]}</span>
            </div>
          </div>
        </div>
        <Form />
      </div>
    </main>
  );
}
