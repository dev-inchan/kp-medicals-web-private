'use client';
import style from './title.module.scss';
import { useTextAnimation } from '@/hooks/login/useTextAnimation';

const texts = ['111111111111111', '222222222222222', '333333333333333', '444444444444444', '555555555555555'];

export default function Title() {
  const [currentIndex, nextIndex] = useTextAnimation(texts);
  return (
    <div className={style['text-container']}>
      <h2 className={style['text-title']}>회원가입</h2>
      <div className={style['text-anim-wrapper']}>
        <div className={style['text-anim']}>
          <span className={style.text}>{texts[currentIndex]}</span>
          <span className={style.text}>{texts[nextIndex]}</span>
        </div>
      </div>
    </div>
  );
}
