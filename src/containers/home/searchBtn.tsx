'use client';
import style from './searcgBtn.module.scss';
import { useRouter } from 'next/navigation';
import search_btn_img from '@/../public/serarch_btn_img.png';
import Image from 'next/image';

interface SearchBtnProps {
  additionalClass?: string;
}

export default function SearchBtn({ additionalClass }: SearchBtnProps) {
  const router = useRouter();

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 기본 동작 방지

    router.replace('/find');
  };

  return (
    <button className={` ${additionalClass}`} onClick={handleSearchClick}>
      <Image src={search_btn_img} alt='search_btn_img' className={style.search_btn_img} />
    </button>
  );
}
