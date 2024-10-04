import { CancelReservationResponse, CancleReservationRequest } from '@/types/bookCancle';
const API_URL = process.env.NEXT_PUBLIC_URL;
const UID = process.env.NEXT_PUBLIC_UID;

export const CancleReservation = async ({
  access_token,
  uid,
  reservation_id,
}: CancleReservationRequest): Promise<CancelReservationResponse> => {
  if (!access_token) {
    throw new Error('Access token is required');
  }

  const url = `${API_URL}api/medical-wallet/hospitals/reservations/back`;
  const body = JSON.stringify({
    access_token: access_token,
    uid: uid,
    reservation_id: reservation_id,
  });

  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
      // body: JSON.stringify({
      //   access_token: access_token,
      //   uid: uid,
      //   reservation_id: reservation_id,
      // }),
    });
    if (!response.ok) {
      const errorMessage = await response.text(); // 서버로부터 받은 에러 메시지 추출
      throw new Error(errorMessage || 'Network response was not ok');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`Error cancelling reservation ${error}`);
  }
};
