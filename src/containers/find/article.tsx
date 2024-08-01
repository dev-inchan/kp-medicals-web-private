'use client';
import style from './article.module.scss';
import Image from 'next/image';
import testDoctor from '@/../public/testDoctor.png';
import { Hospital } from '@/types/hospital';
import { useState } from 'react';
import { fa } from '@faker-js/faker';
import Modal from '@/components/modal';
import ReserveModal from './modal/ReserveModal';

interface Props {
  hospital: Hospital;
}

export default function Article({ hospital }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReserveModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <article className={style.article}>
      <div className={style.contentWrapper}>
        <div className={style.content1}>
          <div className={style['content1-div']}>
            <div className={style['content1-div']}>
              <div className={style['content1-picture-div']}>
                <picture>
                  {/* <Image src={testDoctor} alt='testDoctor' className={style.doctorImg}></Image> */}
                  <img src={hospital.icon} alt='testDoctor' className={style.doctorImg}></img>
                </picture>
              </div>
            </div>
            <div className={style['content1-text-div']}>
              <div className={style['content1-text-div-div']}>
                <div className={style['content1-h3-text']}>
                  <h3>
                    <span>{hospital.hospital_name}</span>
                    <span>Dr.</span>
                    <span>Phuong</span>
                  </h3>
                </div>
                <div className={style['content1-department']}>
                  <h3>
                    <span>정신의학과</span>
                  </h3>
                </div>
                <div className={style['content1-department']}>
                  <h3>
                    <span>
                      Hours: {hospital.start_time} - {hospital.end_time}
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.content2}>
          <div className={style['content2-div']}>
            <div className={style['content2-div-div']}>
              <button
                className={style['content2-div-div-btn']}
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <h3>온라인 예약</h3>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} width='360px' height='600px'>
        <ReserveModal handleReserveModal={handleReserveModal} hospitalId={47} />
      </Modal>
    </article>
  );
}
