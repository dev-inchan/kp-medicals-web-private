import { PatientReservationResponse } from '@/types/bookManage';

const API_URL = process.env.NEXT_PUBLIC_URL;
const UID = process.env.NEXT_PUBLIC_UID;

// 환자 예약정보 조회
export const getPatientReservation = async (accessToken: string | null): Promise<PatientReservationResponse> => {
  if (!accessToken) {
    throw new Error('Access token is required');
  }
  console.log('환자 예약정보 조회 ');
  const url = `${API_URL}api/medical-wallet/hospitals/reservations/list?access_token=${encodeURIComponent(accessToken)}&uid=${encodeURIComponent(`${UID}`)}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`getPatientReservation () HTTP Error : ${response.status}`);
    }

    const data = await response.json();
    console.log('data :', data);
    return data;
  } catch (error) {
    console.error('Error fetching patient reservations:', error);
    throw new Error('Failed to fetch patient reservations. Please try again later.');
  }
};
