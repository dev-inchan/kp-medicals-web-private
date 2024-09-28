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

export default function ReserveModal({ handleReserveModal, hospitalId, selectedDoctor }: Props) {
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
    reservedTimes,
    handleDateClick,
    timeClick,
  } = useReservationLogic({ selectedDoctor });

  const mutation = useMutation<ReservationResponse, Error, ReservationRequest>({
    mutationFn: createHospitalReservation,
    onSuccess: (data) => {
      // handleCheckModal(); // 예약 성공 후 모달 닫기
      handleReserveModal();
      alert('예약이 완료되었습니다');
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
    <>
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
                {/* {morningSlots.length > 0 ? (
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
                )} */}
                {morningSlots.length > 0 ? (
                  morningSlots.map((slot, index) => {
                    const isReserved = reservedTimes.includes(slot);
                    console.log('isReserved :', isReserved);
                    return (
                      <button
                        key={index}
                        className={`${style.time_button} ${selectedTime === slot ? style.time_selected : ''} ${
                          isReserved ? style.time_disabled : ''
                        }`}
                        onClick={() => !isReserved && timeClick(slot)}
                        disabled={isReserved} // 예약된 시간일 경우 버튼 비활성화
                      >
                        {slot}
                      </button>
                    );
                  })
                ) : (
                  <p>예약 가능한 시간이 없습니다.</p>
                )}
              </div>
            </div>
            <div>
              <p className={style.morning_title}>오후</p>
              <div className={style.time_button_wrapper}>
                {/* {afternoonSlots.length > 0 ? (
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
                )} */}
                {afternoonSlots.length > 0 ? (
                  afternoonSlots.map((slot, index) => {
                    const isReserved = reservedTimes.includes(slot);
                    return (
                      <button
                        key={index}
                        className={`${style.time_button} ${selectedTime === slot ? style.time_selected : ''} ${
                          isReserved ? style.time_disabled : ''
                        }`}
                        onClick={() => !isReserved && timeClick(slot)}
                        disabled={isReserved} // 예약된 시간일 경우 버튼 비활성화
                      >
                        {slot}
                      </button>
                    );
                  })
                ) : (
                  <p>예약 가능한 시간이 없습니다.</p>
                )}
              </div>
            </div>
          </ul>
        </div>
      </section>
      <div className={style.next_wrapper}>
        <div className={style.next_line}></div>
        <div className={style.next_button_wrapper}>
          <button className={style.next_button} onClick={nextClick}>
            예약하기
          </button>
        </div>
      </div>
    </>
  );
}
