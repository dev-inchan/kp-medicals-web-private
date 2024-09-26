'use client';
import { getHospitalDetail } from '@/service/hospitalDetail';
import style from './HospitalDetailModal.module.scss';
import { useQuery } from '@tanstack/react-query';
import NaverMap from './naverMap';
import { Hospital } from '@/types/hospital';
import departmentData from '@/containers/home/Data/department';
import { getToken } from '@/utils/token';
import { useEffect, useState } from 'react';

type Props = {
  hospital: Hospital;
  hospital_id: number;
  handleHospitalDetailModal: () => void;
  handleModalOpen: () => void;
};

const ERROR_MSG = '병원 정보를 가져올 수 없습니다.';

export default function HospitalDetailModal({
  hospital,
  hospital_id,
  handleHospitalDetailModal,
  handleModalOpen,
}: Props) {
  const [token, setToken] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['hospitalDetail', hospital_id],
    queryFn: () => getHospitalDetail(hospital_id),
    staleTime: 60000,
  });

  if (isError) {
    return <div>{ERROR_MSG}</div>;
  }

  const hospitalDetail = data?.data?.hospital ?? null;
  const mainSchedules = data?.data?.doctors[0]?.main_schedules[0] ?? null;

  const renderBreakTime = () => {
    if (!mainSchedules) {
      return '확인필요'; // 스케줄 데이터가 없을 때
    }

    const { end_time1, start_time2 } = mainSchedules;
    if (end_time1 && start_time2) {
      return `${end_time1} ~ ${start_time2}`;
    }

    return '확인필요'; // 스케줄이 있을 때도 값이 없는 경우
  };

  //const test = [1, 2, 3];
  const renderDepartments = () => {
    return hospital?.department_id.map((departmentId) => {
      const department = departmentData.find((dep) => dep.id === parseInt(departmentId));
      return department ? department.name : '알 수 없음';
    });
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      setToken(token);
    }
  }, []);

  const onClickReserve = () => {
    handleModalOpen(); // 예약모달 오픈
    handleHospitalDetailModal(); // 현재모달 종료
  };

  return (
    <>
      <section className={style.hospital_section}>
        <section>
          <div className={style.hospital_img_wrapper}>
            <img className={style.hospital_img} src={hospitalDetail?.img_url[0]}></img>
          </div>
          <div className={style.hospital_name_wrapper}>
            <div className={style.hospital_name}>{hospitalDetail?.hospital_name}</div>
          </div>
          <div className={style.horizontal_divider}></div>
          <div className={style.time_wrapper}>
            <header className={style.time_header}>
              <h1 className={style.time_text}>진료시간</h1>
            </header>
            <div className={style.today_break_wrapper}>
              <div className={style.today_time}>
                <h2 className={style.today_title}>오늘</h2>
                <p className={style.today_content}>
                  {hospital.start_time === '00:00' && hospital.end_time === '00:00' ? (
                    <div style={{ color: '#FF6B6B' }}>휴무</div>
                  ) : (
                    `${hospital.start_time} ~ ${hospital.end_time}`
                  )}
                </p>
              </div>
              <div className={style.break_time}>
                <h2 className={style.break_title}>휴게시간</h2>
                {hospital.start_time === '00:00' && hospital.end_time === '00:00' ? (
                  <div style={{ color: '#FF6B6B' }}>휴무</div>
                ) : (
                  <p className={style.break_content}>{renderBreakTime()}</p>
                )}
              </div>
            </div>
          </div>
          <div className={style.horizontal_divider}></div>
          <div className={style.department_wrapper}>
            <div className={style.department_title}>
              <h2 className={style.department_title_content}>진료과목</h2>
            </div>
            <ul className={style.department_list}>
              {renderDepartments().map((dep_name, index) => {
                return (
                  <li key={index} className={style.department_list_item}>
                    {dep_name}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={style.horizontal_divider}></div>
          <div className={style.location_wrapper}>
            <div className={style.location_title}>
              <h2 className={style.location_title_content}>병원위치</h2>
            </div>
            <div className={style.address_wrapper}>
              <div>
                <p className={style.address_content}>{hospitalDetail?.location}</p>
              </div>
            </div>
            <div className={style.map_wrapper}>
              <NaverMap x={hospitalDetail?.x ?? null} y={hospitalDetail?.y ?? null} />
            </div>
          </div>

          <div className={style.horizontal_divider}></div>
          <div className={style.tel_title_wrapper}>
            <div className={style.tel_title}>
              <h2 className={style.tel_title_content}>병원번호</h2>
            </div>
            <div className={style.tel_wrapper}>
              <p className={style.tel_content}>{hospitalDetail?.phone}</p>
            </div>
          </div>
          {token && (
            <div className={style.next_wrapper}>
              <div className={style.next_line}></div>
              <div className={style.next_button_wrapper}>
                <button className={style.next_button} onClick={onClickReserve}>
                  예약하기
                </button>
              </div>
            </div>
          )}
        </section>
      </section>
    </>
  );
}
