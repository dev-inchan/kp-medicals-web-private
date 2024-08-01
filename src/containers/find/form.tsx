'use client';

import Image from 'next/image';
import style from './form.module.scss';
import search_img from '@/../public/search.png';
import map_img from '@/../public/map.png';
import { ChangeEvent, FormEvent, useState } from 'react';

interface Props {
  setKeyword: (keyword: string) => void;
}

export default function Form({ setKeyword }: Props) {
  const [localKeyword, setLocalKeyword] = useState<string>(''); //  입력한 검색어

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalKeyword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setKeyword(localKeyword);
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className={style['form-Sc-Wrapper']}>
        <div className={style['form-Sc']}>
          <div className={style['form-Sc-flex']}>
            <div className={style['flex-row']}>
              <Image src={search_img} alt='map_img' className={style.formImgSc} />
              <input className={style.formInput} placeholder='Select location...' />
            </div>
            <div className={style['flex-row']}>
              <Image src={map_img} alt='map_img' className={style.formImgMap} />
              <input
                className={style.formInput}
                placeholder='Select location...'
                value={localKeyword}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <button type='submit' className={style.scBtn}>
          <Image src={search_img} alt='map_img' />
        </button>
      </div>
    </form>
  );
}
