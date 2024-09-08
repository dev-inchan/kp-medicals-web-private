'use client';

import Image from 'next/image';
import style from './form.module.scss';
import search_img from '@/../public/search.png';
import map_img from '@/../public/map.png';
import { ChangeEvent, FormEvent, useState } from 'react';
import SelectDepartment from '@/components/selectDepartment/selectDepartment';
import { OptionType } from '@/types/selectDoctor';

interface Props {
  keyword: string;
  setKeyword: (keyword: string) => void;
  handleChange: (option: OptionType | null) => void;
  handleSearch: () => void;
  selectDepart: OptionType | null;
}

export default function Form({ keyword, setKeyword, handleChange, handleSearch, selectDepart }: Props) {
  const [localKeyword, setLocalKeyword] = useState<string>(''); //  입력한 검색어
  // setLocalKeyword(keyword);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalKeyword(event.target.value);
    setKeyword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (localKeyword && selectDepart) {
      setKeyword(localKeyword);
      handleSearch();
    } else {
      alert('입력해주세요');
    }
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className={style['form-Sc-Wrapper']}>
        <div className={style['form-Sc']}>
          <div className={style['form-Sc-flex']}>
            <div className={style['flex-row']}>
              <Image src={search_img} alt='map_img' className={style.formImgSc} />
              <div style={{ width: '100%', maxWidth: '640px' }}>
                <SelectDepartment handleChange={handleChange} />
              </div>
            </div>
            <div className={style['flex-row']}>
              <Image src={map_img} alt='map_img' className={style.formImgMap} />
              <input
                className={style.formInput}
                placeholder='지역을 입력하세요.'
                value={keyword}
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
