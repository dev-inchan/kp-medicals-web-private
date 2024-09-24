'use client';
import { getHospitalDetail } from '@/service/hospitalDetail';
import style from './HospitalDetailModal.module.scss';
import { useQuery } from '@tanstack/react-query';
import NaverMap from './naverMap';
import { Hospital } from '@/types/hospital';
import departmentData from '@/containers/home/Data/department';

type Props = {
  hospital: Hospital;
  hospital_id: number;
  handleHospitalDetailModal: () => void;
};

const ERROR_MSG = '병원 정보를 가져올 수 없습니다.';

export default function HospitalDetailModal({ hospital, hospital_id, handleHospitalDetailModal }: Props) {
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
  console.log('renderDepartment', renderDepartments());
  console.log(hospital);
  console.log(data);

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
                  {hospital?.start_time} ~ {hospital?.end_time}
                </p>
              </div>
              <div className={style.break_time}>
                <h2 className={style.break_title}>휴게시간</h2>
                <p className={style.break_content}>{renderBreakTime()}</p>
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
        </section>
      </section>
    </>
  );
}

// 'use client';
// import { getHospitalDetail } from '@/service/hospitalDetail';
// import style from './HospitalDetailModal.module.scss';
// import { useQuery } from '@tanstack/react-query';
// import NaverMap from './naverMap';

// type Props = {
//   hospital_id: number;
//   handleHospitalDetailModal: () => void;
// };

// const ERROR_MSG = '병원 정보를 가져올 수 없습니다.';

// export default function HospitalDetailModal({ hospital_id, handleHospitalDetailModal }: Props) {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ['hospitalDetail', hospital_id],
//     queryFn: () => getHospitalDetail(hospital_id),
//     staleTime: 60000,
//   });

//   if (isError) {
//     return <div>{ERROR_MSG}</div>;
//   }

//   const hospitalDetail = data?.data?.hospital ?? null;
//   const mainSchedules = data?.data?.doctors[0]?.main_schedules[0] ?? null;

//   const renderSchedule = (dayIndex: number) => {
//     if (!mainSchedules) return '10:00 ~ 18:00'; // 기본 시간 설정

//     const isDayOff = mainSchedules.dayoff[dayIndex] === '1'; // dayoff 값 확인
//     return isDayOff ? '휴무' : `${mainSchedules.start_time1} ~ ${mainSchedules.end_time2}`;
//   };
//   return (
//     <>
//       <section className={style.hospital_modal}>
//         <div className={style.hospital_header}>
//           <img className={style.hospital_img} src={hospitalDetail?.img_url[0]} alt='Hospital'></img>
//           <h2 className={style.hospital_name}>{hospitalDetail?.hospital_name}</h2>
//         </div>
//         <div className={style.hospital_hours}>
//           <h1 className={style.hospital_hours_title}>진료시간 {}</h1>
//           <div className={style.schedule_grid}>
//             <div></div>
//             {/* <div className={style.day}>월</div>
//             <div className={style.time}>{renderSchedule(0)}</div>

//             <div className={style.day}>화</div>
//             <div className={style.time}>{renderSchedule(1)}</div>

//             <div className={style.day}>수</div>
//             <div className={style.time}>{renderSchedule(2)}</div>

//             <div className={style.day}>목</div>
//             <div className={style.time}>{renderSchedule(3)}</div>

//             <div className={style.day}>금</div>
//             <div className={style.time}>{renderSchedule(4)}</div>

//             <div className={style.day}>토</div>
//             <div className={style.time}>{renderSchedule(5)}</div>

//             <div className={style.day}>일</div>
//             <div className={style.time}>{renderSchedule(6)}</div> */}
//           </div>
//         </div>
//         <div className={style.hospital_phone}>
//           <h1 className={style.phone_title}>전화번호 </h1>
//           <p>{hospitalDetail?.phone}</p>
//         </div>
//         <div className={style.hospital_location}>
//           <h1 className={style.location_title}>위치</h1>
//           <p>{hospitalDetail?.location}</p>
//           <NaverMap x={hospitalDetail?.x ?? null} y={hospitalDetail?.y ?? null} />
//         </div>
//       </section>
//     </>
//   );
// }
