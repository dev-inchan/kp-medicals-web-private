// hooks/useReservationLogic.ts
import { useState, useEffect } from 'react';
import { isDayOff, generateTimeSlots } from '@/utils/timeUtils';
import { Doctor } from '@/types/reservation';
import { formatDate } from '@/utils/timeUtils';
import { getDoctorReservation } from '@/service/reserve';
import { getToken } from '@/utils/token';

type DateInfo = {
  dayOfWeek: string;
  date: number;
  fullDate: Date;
};

type UseReservationLogicParams = {
  selectedDoctor: Doctor | null;
};

export const useReservationLogic = ({ selectedDoctor }: UseReservationLogicParams) => {
  const [dates, setDates] = useState<DateInfo[]>([]); // 예약 가능한 날짜 목록을 관리
  const [selectedDate, setSelectedDate] = useState<number | null>(null); // 사용자가 선택한 날짜를 관리
  const [isSelectDate, setIsSelectDate] = useState<Boolean>(false); // 시간 선택 유무
  const [morningSlots, setMorningSlots] = useState<string[]>([]); // 오전 예약 가능 시간
  const [afternoonSlots, setAfternoonSlots] = useState<string[]>([]); // 오후 예약 가능 시간
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // 선택한 예약 시간 관리
  const [todayString, setTodayString] = useState<string>(''); //오늘 날짜
  const [interval, setInterval] = useState<string | null>(null); // 예약시간 간격
  const [selectedDateFormat, setSelectedDateFormat] = useState<string | null>(null); // 선택한 날짜를 포맷하여 관리 (예 : 2024-09-01)
  //  const [reservedTimes, setReservedTimes] = useState<string[]>([]); // 이미 예약된 시간
  const [reservedTimes, setReservedTimes] = useState<Record<string, number>>({});
  //14일 간의 날짜 목록을 생성
  useEffect(() => {
    const today = new Date(); // 오늘 날짜 생성
    // 오늘부터 14일 후까지의 날짜를 생성후 저장
    const generatedDates = Array.from({ length: 14 }, (_, i) => {
      const newDate = new Date(today);
      newDate.setDate(today.getDate() + i);
      return {
        dayOfWeek: newDate.toLocaleDateString('ko-KR', { weekday: 'short' }), // 요일
        date: newDate.getDate(), // 일
        fullDate: newDate, // 전체 날짜
      };
    });
    setDates(generatedDates);

    // 오늘 날짜를 포맷하여 저장.
    setTodayString(
      today.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }),
    );
  }, []);

  // 날짜 클릭시 예약 가능한 시간대 표시.
  const handleDateClick = async (clickedDate: Date) => {
    if (!selectedDoctor) return;
    console.log('clickedDate :', clickedDate);
    console.log('selectedDoctor :', selectedDoctor);

    const selectedDayOfWeek = clickedDate.getDay(); // 클릭된 날짜의 요일을 가져옴
    console.log('selectedDayOfWeek :', selectedDayOfWeek);
    const schedule = selectedDoctor.main_schedules[0]; // 기본 스케줄
    const getInterval = schedule.time_slot || '0'; // 예약간격

    setSelectedTime(null); // 시간 초기화
    setInterval(getInterval);

    // 휴일이면 예약 가능시간을 비워둠.
    if (isDayOff(schedule.dayoff, selectedDayOfWeek)) {
      setMorningSlots([]);
      setAfternoonSlots([]);
      setSelectedDateFormat(null);
      setSelectedDate(clickedDate.getDate());
      setIsSelectDate(false);
      return;
    }

    // 오전과 오후의 예약 가능한 시간 슬롯을 생성
    const morningSlots = generateTimeSlots(schedule.start_time1, schedule.end_time1, parseInt(schedule.time_slot));
    const afternoonSlots = generateTimeSlots(schedule.start_time2, schedule.end_time2, parseInt(schedule.time_slot));
    const getDateFormat = formatDate(clickedDate);
    console.log('getDateFormat :', getDateFormat);

    const data = await getDoctorReservation(getToken(), getDateFormat, String(selectedDoctor.staff_id));
    // console.log('data :', data);
    // console.log('morningSlots :', morningSlots);
    // console.log('afternoonSlots :', afternoonSlots);
    // // reservations가 있는지 확인 후 처리
    // const reservedTimes: string[] =
    //   data && data.reservations ? data.reservations.map((reservation: { time: string }) => reservation.time) : [];

    //    console.log(reservedTimes);

    // 예약된 시간을 시간별로 그룹화하고, 예약 수를 계산
    const reservationCount: Record<string, number> = {};
    if (data && data.reservations) {
      data.reservations.forEach((reservation: { time: string }) => {
        reservationCount[reservation.time] = (reservationCount[reservation.time] || 0) + 1;
      });
    }
    // 임의의 값을 추가하여 테스트
    // reservationCount['09:00'] = 1;
    // reservationCount['16:00'] = 1;
    // console.log('reservationCount :', JSON.stringify(reservationCount, null, 2));

    setReservedTimes(reservationCount); // 예약된 시간의 카운트 설정
    // 예약된 시간을 설정하고, 오전/오후 슬롯 설정
    //setReservedTimes(reservedTimes);
    setSelectedDateFormat(getDateFormat);
    setSelectedDate(clickedDate.getDate());
    setMorningSlots(morningSlots);
    setAfternoonSlots(afternoonSlots);
  };

  const timeClick = (slot: string) => {
    setSelectedTime(slot); // 클릭된 시간(slot)을 저장
    setIsSelectDate(true); // 예약 시간을 선택한 상태로 저장.
  };

  // 특정 시간이 예약이 꽉찼으면 true 아니면 false
  const isSlotReserved = (slot: string) => {
    const schedule = selectedDoctor?.main_schedules[0];
    if (!schedule) return false;

    const maxReservation = schedule.max_reservation;
    // console.log('maxReservation :', maxReservation);
    // console.log('reservedTimes[slot] :', reservedTimes[slot]);
    console.log('reservedTimes :', reservedTimes);
    return (reservedTimes[slot] || 0) >= maxReservation; // 예약된 시간이 max_reservation 이상인지 확인
  };
  return {
    dates,
    selectedDate,
    morningSlots,
    afternoonSlots,
    selectedTime,
    todayString,
    isSelectDate,
    reservedTimes,
    interval,
    selectedDateFormat,
    isSlotReserved,
    handleDateClick,
    timeClick,
  };
};
