'use client';
import style from './check.module.scss';
import { createHospitalReservation } from '@/service/reserve';
import { useMutation } from '@tanstack/react-query';
import { ReservationRequest, ReservationResponse } from '@/types/reservation';
import { getToken } from '@/utils/token';

type Props = {
  handleCheckModal: () => void;
  selectedTime: string;
  date: string;
  timeSlot: string;
  staffId: number | null;
  hospitalId: number;
};

// 08:00 AM , 3:00 PM 시간을 HH:mm 형식으로 변환
const convertTo24HourFormat = (time: string) => {
  // 시간 문자열을 'AM' 또는 'PM'을 기준으로 나눕
  const [timePart, modifier] = time.split(/(am|pm)/i);

  // 시간을 ':'을 기준으로 나누어 시간과 분을 숫자로 변환
  let [hours, minutes] = timePart.split(':').map(Number);

  // 만약 'PM'이고 시간이 12시보다 작다면, 12를 더하여 24시간 형식으로 변환
  if (modifier.toLowerCase() === 'pm' && hours < 12) {
    hours += 12;
  }

  // 만약 'AM'이고 시간이 12시라면, 0시로 변환
  if (modifier.toLowerCase() === 'am' && hours === 12) {
    hours = 0;
  }

  // 시간과 분을 두 자리 숫자로 포맷하여 'HH:mm' 형식의 문자열로 반환
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export default function CheckModal({ handleCheckModal, selectedTime, date, timeSlot, staffId, hospitalId }: Props) {
  // console.log(selectedTime, staffId, hospitalId);
  if (staffId === null) {
    return <div>의사 정보가 없습니다.</div>; // staffId가 없을 때 처리
  }
  const mutation = useMutation<ReservationResponse, Error, ReservationRequest>({
    mutationFn: createHospitalReservation,
    onSuccess: (data) => {
      // console.log('Reservation successful:', data);
      handleCheckModal(); // 예약 성공 후 모달 닫기
    },
    onError: (error) => {
      console.error('Reservation failed:', error);
      alert('예약에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleReservation = () => {
    const accessToken = getToken();
    const uid = process.env.NEXT_PUBLIC_UID;
    const purpose = '';
    const convertedTime = convertTo24HourFormat(selectedTime);

    if (!accessToken) {
      alert('로그인을 해주세요.');
      return;
    }

    mutation.mutate({
      accessToken,
      uid,
      hospitalId,
      staffId,
      date,
      time: convertedTime,
      purpose,
      timeSlot,
    });
  };
  return (
    <>
      <div className={style.modal}>
        <h2 className={style.title}>
          {date} {selectedTime}에 예약 하시겠습니까?
        </h2>
        <div>
          <div className={style.buttonWrapper}>
            <button className={style.buttonYes} onClick={handleReservation}>
              네
            </button>
          </div>
          <div className={style.buttonWrapper}>
            <button className={style.buttonNo}>아니요</button>
          </div>
        </div>
      </div>
    </>
  );
}
