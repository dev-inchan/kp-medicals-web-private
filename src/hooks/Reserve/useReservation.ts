// hooks/useReservationLogic.ts
import { useState, useEffect } from 'react';
import { isDayOff, generateTimeSlots } from '@/utils/timeUtils';
import { Doctor } from '@/types/reservation';
import { formatDate } from '@/utils/timeUtils';
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

  const handleDateClick = (clickedDate: Date) => {
    if (!selectedDoctor) return;
    console.log('clickedDate :', clickedDate);
    const selectedDayOfWeek = clickedDate.getDay(); // 클릭된 날짜의 요일을 가져옴
    const schedule = selectedDoctor.main_schedules[0]; // 기본 스케줄
    const getInterval = schedule.time_slot || '0'; // 예약간격
    // console.log(getInterval);
    setSelectedTime(null); // 시간 초기화
    setInterval(getInterval);
    // 영업일인지 확인.
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
    setSelectedDateFormat(getDateFormat);
    setSelectedDate(clickedDate.getDate());
    setMorningSlots(morningSlots);
    setAfternoonSlots(afternoonSlots);
  };

  const timeClick = (slot: string) => {
    setSelectedTime(slot); // 클릭된 시간(slot)을 저장
    setIsSelectDate(true); // 예약 시간을 선택한 상태로 저장.
  };

  return {
    dates,
    selectedDate,
    morningSlots,
    afternoonSlots,
    selectedTime,
    todayString,
    isSelectDate,
    interval,
    selectedDateFormat,
    handleDateClick,
    timeClick,
  };
};
