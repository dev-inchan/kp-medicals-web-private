'use client';
import style from './article.module.scss';
import Image from 'next/image';
import testDoctor from '@/../public/testDoctor.png';
import { Hospital } from '@/types/hospital';
import { useEffect, useState } from 'react';
import { fa } from '@faker-js/faker';
import Modal from '@/components/modal';
import ReserveModal from './modal/ReserveModal';
import LoginModal from '@/containers/login_modal';
import { getToken } from '@/utils/token';
import HospitalDetailModal from './modal/HospitalDetailModal';
import { getDepartmentName } from '@/utils/getDepartmentName';

interface Props {
  hospital: Hospital;
}

export default function Article({ hospital }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isHospitalDetailModal, setIsHospitalDetailModal] = useState(false);
  const [departmentName, setDeapartmentName] = useState<string[] | null>(null);

  useEffect(() => {
    if (!departmentName) {
      const getNames = getDepartmentName(hospital.department_id);
      setDeapartmentName(getNames);
    }
  }, []);

  const handleLoginModal = () => {
    setIsLoginModalOpen(!isModalOpen);
  };
  const handleReserveModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleHospitalDetailModal = () => {
    setIsHospitalDetailModal(!isHospitalDetailModal);
  };

  const OnlineReservationClick = () => {
    if (getToken()) {
      setIsModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  console.log(hospital);
  return (
    <article className={style.article}>
      <div className={style.contentWrapper}>
        <div className={style.content1}>
          <div className={style['content1-div']}>
            <div className={style['content1-div']}>
              <div className={style['content1-picture-div']}>
                <picture>
                  {/* <Image src={testDoctor} alt='testDoctor' className={style.doctorImg}></Image> */}
                  <img
                    src={hospital.icon}
                    alt='testDoctor'
                    className={style.doctorImg}
                    onClick={() => setIsHospitalDetailModal(true)}
                  ></img>
                </picture>
              </div>
            </div>
            <div className={style['content1-text-div']}>
              <div className={style['content1-text-div-div']}>
                <div className={style['content1-h3-text']}>
                  <h3>
                    <span>{hospital.hospital_name}</span>
                    {/* <span>Dr.</span>
                    <span>Phuong</span> */}
                  </h3>
                </div>
                <div className={style['content1-department']}>
                  <h3>{departmentName?.map((name, index) => <span key={name + index}>{name}</span>)}</h3>
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
              <button className={style['content2-div-div-btn']} onClick={OnlineReservationClick}>
                <h3>온라인 예약</h3>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} width='360px' height='600px'>
        <ReserveModal handleReserveModal={handleReserveModal} hospitalId={hospital.hospital_id} />
      </Modal>
      <Modal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <LoginModal handleLoginModal={handleLoginModal} />
      </Modal>
      <Modal open={isHospitalDetailModal} onClose={() => setIsHospitalDetailModal(false)}>
        <HospitalDetailModal hospital_id={hospital.hospital_id} handleHospitalDetailModal={handleHospitalDetailModal} />
      </Modal>
    </article>
  );
}
