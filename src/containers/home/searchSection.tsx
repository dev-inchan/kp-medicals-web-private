import Image from 'next/image';
import style from './searchSection.module.scss';
import HomeMain from '@/../public/main.png';
import search_img from '@/../public/search.png';
import map_img from '@/../public/map.png';

import SearchBtn from './searchBtn';

export default function SearchSection() {
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
              <Image src={HomeMain} alt='HomeMain_' className={style.full_image} />

              <div className={style.input_con}>
                <div className={style.flex}>
                  <div className={style.flex}>
                    <div className={style.center}>
                      <Image src={search_img} alt='search_img' className={style.search_img} />
                      <input className={style.search_input} placeholder='Select doctor...'></input>
                    </div>
                  </div>
                  <div className={style.flex}>
                    <div className={style.center}>
                      <Image src={map_img} alt='map_img' className={style.search_img} />
                      <input className={style.search_input} placeholder='Select location...'></input>
                    </div>
                  </div>
                  <div className={style.flex2}>
                    <SearchBtn additionalClass={style.serarch_btn_mobileToTable} />
                  </div>
                </div>
              </div>
              <SearchBtn additionalClass={style.search_btn} />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
