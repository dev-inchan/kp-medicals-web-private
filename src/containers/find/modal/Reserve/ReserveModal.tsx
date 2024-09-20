'use client';
import { useReservationLogic } from '@/hooks/Reserve/useReservation';
import style from './ReserveModal.module.scss';
import { Doctor } from '@/types/reservation';
import { useMutation } from '@tanstack/react-query';
import { createHospitalReservation } from '@/service/reserve';
import { ReservationRequest, ReservationResponse } from '@/types/reservation';
import { getToken } from '@/utils/token';
import { formatDateToYYYYMMDD } from '@/utils/timeUtils';
type Props = {
  handleReserveModal: () => void;
  hospitalId: number;
  selectedDoctor: Doctor | null;
};

export default function ReserveTest({ handleReserveModal, hospitalId, selectedDoctor }: Props) {
  const {
    dates, // 예약 가능한 날짜 목록 관리
    selectedDate, // 사용자가 선택한 날짜를 관리
    morningSlots, // 오전 예약 가능 시간
    afternoonSlots, // 오후 예약 가능 시간
    selectedTime, // 선택한 예약 시간 관리
    todayString, // 오늘 날짜
    isSelectDate, // 시간 선택 유무
    interval, // 예약시간 간격
    selectedDateFormat, //  선택한 날짜를 포맷하여 관리 (예 : 2024-09-01)
    handleDateClick,
    timeClick,
  } = useReservationLogic({ selectedDoctor });
  const mutation = useMutation<ReservationResponse, Error, ReservationRequest>({
    mutationFn: createHospitalReservation,
    onSuccess: (data) => {
      // console.log('Reservation successful:', data);
      // handleCheckModal(); // 예약 성공 후 모달 닫기
      handleReserveModal();
    },
    onError: (error) => {
      console.error('Reservation failed:', error);
      alert('예약에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const nextClick = () => {
    console.log('selectedDoctor :', selectedDoctor);
    if (!isSelectDate || !selectedTime) {
      alert('예약 시간을 선택해주세요');
      return;
    }
    if (!selectedDoctor) {
      alert('의사가 선택되지 않았습니다.');
      return;
    }
    if (!selectedDate) {
      return;
    }
    console.log('dates :', dates);
    console.log('선택된 날짜:', selectedDate);
    console.log('선택된 시간:', selectedTime);
    const accessToken = getToken();
    const uid = process.env.NEXT_PUBLIC_UID;
    const purpose = '';
    const staffId = selectedDoctor.staff_id;
    if (!accessToken) {
      alert('로그인을 해주세요.');
      return;
    }

    mutation.mutate({
      accessToken,
      uid,
      hospitalId,
      staffId,
      date: selectedDateFormat, // 수정 필요
      time: selectedTime,
      purpose,
      timeSlot: interval,
    });
  };

  return (
    <section className={style.section}>
      <div className={style.div_wrapper}>
        <h2 className={style.h2_title}>언제 방문 하실건가요?</h2>
        <div className={style.day_wrapper}>
          <p className={style.day_content}>{`날짜를 선택하세요`}</p>
          <ul className={style.day_list}>
            {dates.map((date, index) => (
              <li key={index} className={style.day_item}>
                <span>{date.dayOfWeek}</span>
                <button
                  onClick={() => handleDateClick(date.fullDate)}
                  className={selectedDate === date.date ? style.active : ''}
                >
                  {date.date}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={style.time_wrapper}>
        <p className={style.time_title}>{`방문시간을 선택하세요`}</p>
        <ul className={style.time_list}>
          <div>
            <p className={style.morning_title}>오전</p>
            <div className={style.time_button_wrapper}>
              {morningSlots.length > 0 ? (
                morningSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`${style.time_button} ${selectedTime === slot ? style.time_selected : ''}`}
                    onClick={() => timeClick(slot)}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p>예약 가능한 시간이 없습니다.</p>
              )}
            </div>
          </div>
          <div>
            <p className={style.morning_title}>오후</p>
            <div className={style.time_button_wrapper}>
              {afternoonSlots.length > 0 ? (
                afternoonSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`${style.time_button} ${selectedTime === slot ? style.time_selected : ''}`}
                    onClick={() => timeClick(slot)}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p>예약 가능한 시간이 없습니다.</p>
              )}
            </div>
          </div>
        </ul>
      </div>
      <div className={style.next_wrapper}>
        <div className={style.next_line}></div>
        <div className={style.next_button_wrapper}>
          <button className={style.next_button} onClick={nextClick}>
            예약하기
          </button>
        </div>
      </div>
    </section>
  );
}

// 'use client';
// import { useState, useEffect } from 'react';
// import style from './ReserveTest.module.scss';
// import { Doctor } from '@/types/reservation';
// import { createHospitalReservation } from '@/service/reserve';
// import { useMutation } from '@tanstack/react-query';
// import { ReservationRequest, ReservationResponse } from '@/types/reservation';
// import { getToken } from '@/utils/token';
// import { isDayOff, generateTimeSlots } from '@/utils/timeUtils';
// type DateInfo = {
//   dayOfWeek: string;
//   date: number;
//   fullDate: Date; // fullDate 속성을 추가
// };

// type Props = {
//   handleReserveModal: () => void;
//   hospitalId: number;
//   selectedDoctor: Doctor | null;
// };

// const ERROR_MSG = '예약정보를 가져오지 못했습니다.';

// export default function ReserveTest({ handleReserveModal, hospitalId, selectedDoctor }: Props) {
//   const [dates, setDates] = useState<DateInfo[]>([]); // fullDate를 포함하는 배열로 수정
//   const [selectedDate, setSelectedDate] = useState<number | null>(null); // 선택한 날짜
//   const [isSelectDate, setIsSelectDate] = useState<Boolean>(false); // 시간 선택 유무
//   const [todayString, setTodayString] = useState<string>('');
//   const [morningSlots, setMorningSlots] = useState<string[]>([]); // 오전 시간
//   const [afternoonSlots, setAfternoonSlots] = useState<string[]>([]); // 오후 시간
//   const [selectedTime, setSelectedTime] = useState<string | null>(null); // 선택한 시간
//   if (!selectedDoctor) {
//     return <div>{ERROR_MSG}</div>;
//   }

//   const schedules = selectedDoctor?.main_schedules || [];
//   const schedule = schedules[0]; // 하나의 스케줄만 있다고 가정

//   useEffect(() => {
//     const today = new Date();
//     const generatedDates = Array.from({ length: 14 }, (_, i) => {
//       const newDate = new Date(today);
//       newDate.setDate(today.getDate() + i);
//       return {
//         dayOfWeek: newDate.toLocaleDateString('ko-KR', { weekday: 'short' }),
//         date: newDate.getDate(),
//         fullDate: newDate, // fullDate 속성을 추가
//       };
//     });

//     setDates(generatedDates);
//     setTodayString(
//       today.toLocaleDateString('ko-KR', {
//         month: 'long',
//         day: 'numeric',
//         weekday: 'short',
//       }),
//     );
//   }, []);

//   const handleDateClick = (clickedDate: Date) => {
//     const selectedDayOfWeek = clickedDate.getDay(); // 0: 일요일, 6: 토요일

//     setSelectedTime(null); // 선택했던 시간 초기화
//     // 영업하지 않는 날인지 확인
//     if (isDayOff(schedule.dayoff, selectedDayOfWeek)) {
//       //alert('이 날은 영업을 하지 않습니다.');
//       setMorningSlots([]);
//       setAfternoonSlots([]);
//       setSelectedDate(clickedDate.getDate());
//       setIsSelectDate(false);
//       return;
//     }

//     console.log('schedule :', schedule);

//     // 오전과 오후 time_slot을 생성
//     const morningSlots = generateTimeSlots(schedule.start_time1, schedule.end_time1, parseInt(schedule.time_slot));
//     const afternoonSlots = generateTimeSlots(schedule.start_time2, schedule.end_time2, parseInt(schedule.time_slot));

//     setSelectedDate(clickedDate.getDate());
//     setMorningSlots(morningSlots);
//     setAfternoonSlots(afternoonSlots);
//   };

//   const timeClick = (slot: string) => {
//     console.log('선택된 시간 :', slot);
//     setSelectedTime(slot);
//     setIsSelectDate(true);
//   };

//   const nextClick = () => {
//     console.log('selectedDate :', selectedDate);
//     if (!isSelectDate || !selectedTime) {
//       alert('예약 시간을 선택해주세요');
//       return;
//     }
//   };

//   return (
//     <section className={style.section}>
//       <div className={style.div_wrapper}>
//         <h2 className={style.h2_title}>언제 방문 하실건가요?</h2>
//         <div className={style.day_wrapper}>
//           <p className={style.day_content}>{todayString}</p>
//           <ul className={style.day_list}>
//             {dates.map((date, index) => (
//               <li key={index} className={style.day_item}>
//                 <span>{date.dayOfWeek}</span>
//                 <button
//                   onClick={() => handleDateClick(date.fullDate)} // fullDate를 전달
//                   className={selectedDate === date.date ? style.active : ''}
//                 >
//                   {date.date}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <div className={style.time_wrapper}>
//         <p className={style.time_title}>시간</p>
//         <ul className={style.time_list}>
//           <div>
//             <p className={style.morning_title}>오전</p>
//             <div className={style.time_button_wrapper}>
//               {morningSlots.length > 0 ? (
//                 morningSlots.map((slot, index) => (
//                   <button
//                     key={index}
//                     className={${style.time_button} ${selectedTime === slot ? style.time_selected : ''}}
//                     onClick={() => {
//                       timeClick(slot);
//                     }}
//                   >
//                     {slot}
//                   </button>
//                 ))
//               ) : (
//                 <p>예약 가능한 시간이 없습니다.</p>
//               )}
//             </div>
//           </div>
//           <div>
//             <p className={style.morning_title}>오후</p>
//             <div className={style.time_button_wrapper}>
//               {afternoonSlots.length > 0 ? (
//                 afternoonSlots.map((slot, index) => (
//                   <button
//                     key={index}
//                     className={${style.time_button} ${selectedTime === slot ? style.time_selected : ''}}
//                     onClick={() => {
//                       timeClick(slot);
//                     }}
//                   >
//                     {slot}
//                   </button>
//                 ))
//               ) : (
//                 <p>예약 가능한 시간이 없습니다.</p>
//               )}
//             </div>
//           </div>
//         </ul>
//       </div>
//       <div className={style.next_wrapper}>
//         <div className={style.next_line}></div>
//         <div className={style.next_button_wrapper}>
//           <button
//             className={style.next_button}
//             onClick={() => {
//               nextClick();
//             }}
//           >
//             예약하기
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
