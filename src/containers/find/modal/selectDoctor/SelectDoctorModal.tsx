'use client';
import { useState } from 'react';
import style from './SelectDoctorModal.module.scss';
import { getHospitalDetail } from '@/service/hospitalDetail';
import { useQuery } from '@tanstack/react-query';
import { getDepartmentName } from '@/utils/getDepartmentName';
import { Doctor, Schedule } from '@/types/reservation';

type Props = {
  selectDoctor: (doctor: Doctor) => void;
  hospital_id: number;
  goToNextModal: () => void;
};

const ERROR_MSG = '의사 정보를 가져올 수 없습니다.';

export default function SelectDoctorModal({ selectDoctor, hospital_id, goToNextModal }: Props) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null); // 선택된 의사의 ID를 저장
  const { data, isLoading, isError } = useQuery({
    queryKey: ['hospitalDetail', hospital_id],
    queryFn: () => getHospitalDetail(hospital_id),
    staleTime: 60000,
  });

  if (isError) {
    return <div>{ERROR_MSG}</div>;
  }

  const doctors = data?.data?.doctors ?? [];
  console.log('doctors :', doctors);

  const doctorClick = (doctor: Doctor) => {
    selectDoctor(doctor); // 부모 컴포넌트로 의사 선택 전달
    setSelectedDoctorId(doctor.staff_id);
  };

  const nextClick = () => {
    if (!selectedDoctorId) {
      alert('의사를 선택해주세요.');
      return;
    }
    goToNextModal();
  };
  return (
    <section className={style.section}>
      <h2 className={style.title}>누구에게 예약하실건가요?</h2>
      <p className={style.doctor_title}>의사를 선택학세요</p>
      <ul className={style.doctor_list}>
        {doctors.map((doctor, index) => {
          const departmentNames = getDepartmentName(doctor.department_id);

          return (
            <li
              key={`${doctor.staff_id}-${index}`}
              className={`${style.doctor_item} ${selectedDoctorId === doctor.staff_id ? style.item_selected : ''} `}
              onClick={() => {
                doctorClick(doctor as Doctor);
              }}
            >
              <div className={style.item_img_wrapper}>
                <img className={style.img} src={doctor.icon} alt='' />
              </div>
              <div>
                <div className={style.doctor_name_wrapper}>
                  <p>{doctor.name} 의사</p>
                </div>
                <div className={style.departmentName_wrapper}>
                  {departmentNames.map((name, idx) => (
                    <p key={`${name}-${idx}`} className={style.departmentName}>
                      {name}
                    </p>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={style.next_wrapper}>
        <div className={style.next_line}></div>
        <div className={style.next_button_wrapper}>
          <button
            className={style.next_button}
            onClick={() => {
              nextClick();
            }}
          >
            다음
          </button>
        </div>
      </div>
    </section>
  );
}
