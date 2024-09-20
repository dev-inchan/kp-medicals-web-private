// Reservation 타입 정의
interface PatientReservation {
  reservation_id: number;
  hospital_id: number;
  hospital_name: string;
  icon: string;
  staff_id: number;
  staff_name: string;
  department_id: string[]; // department_id는 배열로 이루어진 문자열
  patient_name: string;
  date: string;
  time: string;
}

// API 응답 타입 정의
export interface PatientReservationResponse {
  status: number;
  success: string;
  message: string;
  data: {
    access_token: string;
    reservations: PatientReservation[]; // 여러 개의 예약 정보가 배열로 포함됨
    error_code: number;
    error_stack: string;
  };
}
