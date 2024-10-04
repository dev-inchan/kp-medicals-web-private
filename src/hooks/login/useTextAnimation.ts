import { useState, useEffect } from 'react';
// import style from '@/containers/signup/index.module.scss';
import style from '../../containers/signup/index.module.scss';

export const useTextAnimation = (texts: string[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const animElement: HTMLElement | null = document.querySelector(`.${style['text-anim']}`);

    if (animElement != null) {
      const handleAnimationEnd = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);

        // 클래스 제거
        animElement.classList.remove(style['text-anim']);

        // 강제로 리플로우 트리거
        void animElement.offsetWidth;
        animElement.classList.add(style['text-anim']);
      };

      animElement.addEventListener('animationend', handleAnimationEnd);

      return () => {
        animElement.removeEventListener('animationend', handleAnimationEnd);
      };
    }
  }, []);

  const nextIndex = (currentIndex + 1) % texts.length;

  return [currentIndex, nextIndex];
};
