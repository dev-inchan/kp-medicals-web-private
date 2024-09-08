'use client';
import style from './searcgBtn.module.scss';
import { useRouter } from 'next/navigation';
import search_btn_img from '@/../public/serarch_btn_img.png';
import Image from 'next/image';
import { OptionType } from '@/types/selectDoctor';

interface SearchBtnProps {
  additionalClass?: string;
  searchWord: string;
  selectDepart: OptionType | null;
}

export default function SearchBtn({ additionalClass, searchWord, selectDepart }: SearchBtnProps) {
  const router = useRouter();

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 기본 동작 방지

    const queryParams = new URLSearchParams();

    if (searchWord && searchWord.trim() !== '') {
      queryParams.append('keyword', searchWord.trim()); // searchWord가 있다면 추가
    }

    if (selectDepart) {
      queryParams.append('department_id', String(selectDepart.id)); // selectDepart가 있으면 추가
    }

    const queryString = queryParams.toString();
    const targetUrl = queryString ? `/find?${queryString}` : `find`; // 파라미터가 있으면 추가, 없으면 기본 URL
    router.replace(targetUrl);
  };

  return (
    <button className={`${additionalClass}`} onClick={handleSearchClick}>
      <Image src={search_btn_img} alt='search_btn_img' className={style.search_btn_img} />
    </button>
  );
}
