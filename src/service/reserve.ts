import { HospitalDetail, ReservationRequest, ReservationResponse } from '@/types/reservation';

/**
 * 병원 예약 상세 정보 요청 api
 */
export const getHospitalDetail = async (accessToken: string | null, hospitalId: number): Promise<HospitalDetail> => {
  if (!accessToken) {
    throw new Error('Access token is required');
  }

  const today = new Date().toISOString().split('T')[0]; // 오늘 날짜를 yyyy-mm-dd 형식으로 변환

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}api/medical-wallet/hospitals/detail?access_token=${encodeURIComponent(accessToken)}&uid=${encodeURIComponent(`${process.env.NEXT_PUBLIC_UID}`)}&hospital_id=${hospitalId}&date=${encodeURIComponent(today)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const result: HospitalDetail = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Network response was not ok');
  }

  return result;
};

/**
 * 병원 예약 요청 API
 */
export const createHospitalReservation = async ({
  accessToken,
  uid,
  hospitalId,
  staffId,
  date,
  time,
  purpose,
  timeSlot,
}: ReservationRequest): Promise<ReservationResponse> => {
  if (!accessToken || !uid) {
    throw new Error('Access token is required');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/medical-wallet/hospitals/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: accessToken,
      uid: uid,
      hospital_id: hospitalId,
      staff_id: staffId,
      date: date,
      time: time,
      purpose: purpose,
      time_slot: timeSlot,
    }),
  });

  const result: ReservationResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Network response was not ok');
  }

  return result;
};
