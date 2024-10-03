'use client';
import Image from 'next/image';
import style from './searchSection.module.scss';
import HomeMain from '@/../public/main.png';
import search_img from '@/../public/search.png';
import map_img from '@/../public/map.png';
import SearchBtn from './searchBtn';
import SelectDepartment from '@/components/selectDepartment/selectDepartment';
import { OptionType } from '@/types/selectDoctor';
import { ChangeEvent, FormEvent, useState } from 'react';

interface Props {
  handleChange: (option: OptionType | null) => void;
}

export default function SearchSection() {
  const [searchWord, setSearchWord] = useState<string>(''); //  입력한 검색어
  const [selectDepart, setSelectDepart] = useState<OptionType | null>(null); // 진료과목

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(event.target.value);
  };

  const handleChange = (option: OptionType | null) => {
    setSelectDepart(option);
    console.log('선택한 옵션 :', option);
  };

  return (
    <section className={`${style.rs_container} home_blueBg`}>
      <div className={style.rs_item_center}>
        <div className={style.rs_item_container}>
          <h1 className={style.rs_item_title}>
            가장 가까운 곳에서 <br />
            간편하게 예약하세요
          </h1>

          <form className={style.search_container}>
            <div style={{ display: 'flex' }}>
              <Image src='/main.png' alt='HomeMain_' className={style.full_image} width={500} height={300} />

              <div className={style.input_con}>
                <div className={style.flex}>
                  <div className={style.flex}>
                    <div className={style.center}>
                      <Image src={search_img} alt='search_img' className={style.search_img} />
                      {/* <input className={style.search_input} placeholder='Select doctor...'></input> */}
                      <div style={{ width: '100%', maxWidth: '640px' }}>
                        <SelectDepartment handleChange={handleChange} />
                      </div>
                    </div>
                  </div>
                  <div className={style.flex}>
                    <div className={style.center}>
                      <Image src={map_img} alt='map_img' className={style.search_img} />
                      <input
                        className={style.search_input}
                        placeholder='지역을 입력하세요'
                        value={searchWord}
                        onChange={handleInputChange}
                      ></input>
                    </div>
                  </div>
                  <div className={style.flex2}>
                    <SearchBtn
                      additionalClass={style.serarch_btn_mobileToTable}
                      searchWord={searchWord}
                      selectDepart={selectDepart}
                    />
                  </div>
                </div>
              </div>
              <SearchBtn additionalClass={style.search_btn} searchWord={searchWord} selectDepart={selectDepart} />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
