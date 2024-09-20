import { HospitalDetail, ReservationRequest, ReservationResponse } from '@/types/reservation';

const API_URL = process.env.NEXT_PUBLIC_URL;
const UID = process.env.NEXT_PUBLIC_UID;

/**
 * 병원 예약 상세 정보 요청 API
 */
export const getHospitalDetail = async (accessToken: string | null, hospitalId: number): Promise<HospitalDetail> => {
  console.log('getHospitalDetail');

  if (!accessToken) {
    throw new Error('Access token is required');
  }

  const today = new Date().toISOString().split('T')[0]; // 오늘 날짜를 yyyy-mm-dd 형식으로 변환

  try {
    const response = await fetch(
      `${API_URL}api/medical-wallet/hospitals/detail?access_token=${encodeURIComponent(accessToken)}&uid=${encodeURIComponent(`${UID}`)}&hospital_id=${hospitalId}&date=${encodeURIComponent(today)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorMessage = await response.text(); // 서버로부터 받은 에러 메시지 추출
      throw new Error(errorMessage || 'Network response was not ok');
    }

    const result: HospitalDetail = await response.json();
    return result;
  } catch (error: any) {
    console.error('Error fetching hospital details:', error.message);
    throw new Error(`Failed to fetch hospital details: ${error.message}`);
  }
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
    throw new Error('Access token and UID are required');
  }

  try {
    const response = await fetch(`${API_URL}api/medical-wallet/hospitals/reservations`, {
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

    if (!response.ok) {
      const errorMessage = await response.text(); // 서버로부터 받은 에러 메시지 추출
      throw new Error(errorMessage || 'Network response was not ok');
    }

    const result: ReservationResponse = await response.json();
    return result;
  } catch (error: any) {
    console.error('Error creating hospital reservation:', error.message);
    throw new Error(`Failed to create hospital reservation: ${error.message}`);
  }
};
