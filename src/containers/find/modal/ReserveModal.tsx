'use client';

import { useQuery } from '@tanstack/react-query';
import { getHospitalDetail } from '@/service/reserve';
import { getToken } from '@/utils/token';
import { useState } from 'react';
import { format, addMinutes, eachDayOfInterval, parseISO } from 'date-fns';
import style from './ReserveModal.module.scss';
import CheckModal from './checkModal';
import Modal from '@/components/modal';

type Props = {
  handleReserveModal: () => void;
  hospitalId: number; // 병원 ID를 Props로 받아옴
};

const NO_DATA = '예약할 수 있는 정보가 없습니다.';
const NO_SCHEDULE = '예약할 수 있는 스케줄 정보가 없습니다.';

// 시간 슬롯을 포맷팅하는 함수
function formatTimeSlots(startTime: string, endTime: string, slot: number) {
  console.log('startTime :', startTime);
  console.log('endTime :', endTime);
  const start = parseISO(`1970-01-01T${startTime}:00`);
  const end = parseISO(`1970-01-01T${endTime}:00`);
  const slots = [];
  let current = start;

  // 시작 시간부터 종료 시간까지 주어진 슬롯 간격으로 시간을 생성
  while (current < end) {
    slots.push(format(current, 'h:mm a')); //  현재 시간을 hh:mmaaa 형식으로 포맷하여 slots 배열에 추가
    current = addMinutes(current, slot); // 현재 시간에 `slot` 분 만큼 증가
  }

  return slots;
}

export default function ReserveModal({ handleReserveModal, hospitalId }: Props) {
  const [visibleDays, setVisibleDays] = useState(3); // 초기에는 3일만 표시
  const [visibleTimes, setVisibleTimes] = useState<Record<string, number>>({});
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // 선택한 시간
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // 선택한 날짜
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckModalOpen, setCheckIsModalOpen] = useState(false); // CheckModal 상태 관리

  // 병원 예약 정보를 가져오는 쿼리
  const { data, error, isLoading } = useQuery({
    queryKey: ['reservation', hospitalId], // 병원 ID를 쿼리 키에 포함
    queryFn: () => getHospitalDetail(getToken(), hospitalId),
    enabled: !!getToken() && !!hospitalId, // 토큰과 병원 ID가 있을 때만 쿼리 실행
  });
  console.log('data :', data);
  // 로딩 상태 처리
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 에러 상태 처리
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // 데이터가 없을 경우 처리
  if (!data || !data.data || !data.data.doctors) {
    return <div>{NO_DATA}</div>;
  }

  // const schedules = data.data.doctors[0].main_schedules;
  // const doctorName = data.data.doctors[0].name;
  // const staffId = data.data.doctors[0].staff_id;
  // const timeSlot = schedules[0].time_slot; // 시간 슬롯 간격
  const doctor = data.data.doctors[0];
  const schedules = doctor?.main_schedules || []; // schedules가 없으면 빈 배열로 처리
  const doctorName = doctor?.name || 'Unknown'; // 의사 이름이 없을 경우 기본값 설정
  const staffId = doctor?.staff_id || null; // staff_id가 없을 경우 null 처리

  if (schedules.length === 0) {
    return <div>{NO_SCHEDULE}</div>; // 스케줄이 없으면 메시지 출력
  }

  const timeSlot = schedules[0]?.time_slot || '0'; // time_slot이 없을 경우 기본값 설정

  // 더 많은 날짜를 표시하는 함수
  const handleShowMoreDays = () => {
    setVisibleDays((prev) => prev + 3); // 더보기 클릭 시 3일 더 표시
  };

  // 특정 날짜의 더 많은 시간을 표시하는 함수
  const handleShowMoreTimes = (date: string) => {
    setVisibleTimes((prev) => ({
      ...prev,
      [date]: (prev[date] || 11) + 11, // 날짜별로 11개의 시간을 추가로 표시
    }));
  };

  // 시간 클릭 시 모달을 여는 함수
  const handleTimeClick = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    // setIsModalOpen(true);
    setCheckIsModalOpen(true);
  };

  // CheckModal 상태를 토글하는 함수
  const handleCheckModal = () => {
    console.log(isCheckModalOpen);
    setCheckIsModalOpen(!isCheckModalOpen);
  };

  // 각 날짜를 생성하는 함수
  const dates = eachDayOfInterval({
    start: parseISO(schedules[0].start_date),
    end: parseISO(schedules[0].end_date),
  });

  return (
    <>
      <div className={style.title}>Book with Dr. {doctorName}</div>
      <div className={style.container}>
        {dates.slice(0, visibleDays).map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const times = [
            ...formatTimeSlots(schedules[0].start_time1, schedules[0].end_time1, parseInt(timeSlot)),
            ...formatTimeSlots(schedules[0].start_time2, schedules[0].end_time2, parseInt(timeSlot)),
          ];

          return (
            <div key={dateStr} className={style.daySection}>
              <h4 className={style.dayText}>{dateStr}</h4>
              <div className={style.timeWrapper}>
                {times.slice(0, visibleTimes[dateStr] || 11).map((time, index) => (
                  <span key={index} className={style.time_button} onClick={() => handleTimeClick(dateStr, time)}>
                    {time}
                  </span>
                ))}
                {(visibleTimes[dateStr] || 11) < times.length && (
                  <div className={style.time_button} onClick={() => handleShowMoreTimes(dateStr)}>
                    {times.length - (visibleTimes[dateStr] || 11)} 더보기
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {visibleDays < dates.length && (
          <button className={style.showMoreButton} onClick={handleShowMoreDays}>
            날짜 더보기
          </button>
        )}
      </div>

      {selectedTime && selectedDate && (
        <Modal open={isCheckModalOpen} onClose={() => setCheckIsModalOpen(false)} width='300px' height='230px'>
          <CheckModal
            handleCheckModal={handleCheckModal}
            selectedTime={selectedTime}
            date={selectedDate}
            timeSlot={timeSlot}
            staffId={staffId}
            hospitalId={hospitalId}
          />
        </Modal>
      )}
    </>
  );
}
