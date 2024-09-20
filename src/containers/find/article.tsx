'use client';
import style from './article.module.scss';
import { Hospital } from '@/types/hospital';
import { useEffect, useState } from 'react';
import { fa } from '@faker-js/faker';
import Modal from '@/components/modal';
// import ReserveModal from './modal/Reserve/1';
import LoginModal from '@/containers/login_modal';
import { getToken } from '@/utils/token';
import HospitalDetailModal from './modal/hospitalDetail/HospitalDetailModal';
import { getDepartmentName } from '@/utils/getDepartmentName';
// import SelectDoctorModal from './modal/selectDoctor/1';
import { Doctor, Schedule } from '@/types/reservation';
import Modalv2 from '@/components/modalv2';
import ReserveModal from './modal/Reserve/ReserveModal';
import SelectDoctorModal from './modal/selectDoctor/SelectDoctorModal';

interface Props {
  hospital: Hospital;
}

export default function Article({ hospital }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isHospitalDetailModal, setIsHospitalDetailModal] = useState(false);
  const [departmentName, setDeapartmentName] = useState<string[] | null>(null);
  const [modalPage, setModalPage] = useState(1); // 모달 페이지 상태
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

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
    setModalPage(1);
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

  const reservationClose = () => {
    setIsModalOpen(false);
    setModalPage(1);
  };

  // 모달 페이지를 변경하는 함수
  const goToNextModal = () => {
    setModalPage(2); // 다음 페이지로 이동
  };

  const selectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
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
                      진료시간: {hospital.start_time} - {hospital.end_time}
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

      <Modalv2 open={isModalOpen} onClose={() => reservationClose()}>
        {modalPage === 1 ? (
          <SelectDoctorModal
            selectDoctor={selectDoctor}
            hospital_id={hospital.hospital_id}
            goToNextModal={goToNextModal}
          />
        ) : (
          <ReserveModal
            handleReserveModal={handleReserveModal}
            hospitalId={hospital.hospital_id}
            selectedDoctor={selectedDoctor}
          />
        )}
      </Modalv2>
      <Modal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <LoginModal handleLoginModal={handleLoginModal} />
      </Modal>
      <Modalv2 open={isHospitalDetailModal} onClose={() => setIsHospitalDetailModal(false)}>
        <HospitalDetailModal
          hospital={hospital}
          hospital_id={hospital.hospital_id}
          handleHospitalDetailModal={handleHospitalDetailModal}
        />
      </Modalv2>
    </article>
  );
}
