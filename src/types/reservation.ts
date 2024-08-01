export interface Hospital {
  hospital_id: number;
  hospital_name: string;
  location: string;
  x: number;
  y: number;
  phone: string;
  department_id: string[];
  img_url: string[];
  marked: number;
}

export interface Schedule {
  schedule_id: number;
  hospital_id: number;
  schedule_name: string;
  staff_id: number;
  start_date: string;
  end_date: string;
  start_time1: string;
  end_time1: string;
  start_time2: string;
  end_time2: string;
  time_slot: string;
  max_reservation: number;
  dayoff: string;
  name: string;
}

export interface Doctor {
  staff_id: number;
  name: string;
  icon: string;
  department_id: string[];
  main_schedules: Schedule[];
  sub_schedules: any[];
}

export interface HospitalDetail {
  status: number;
  success: string;
  message: string;
  data: {
    hospital: Hospital;
    doctors: Doctor[];
    error_code: number;
    error_stack: string;
  };
}
export interface ReservationRequest {
  accessToken: string | null;
  uid: string | undefined;
  hospitalId: number;
  staffId: number;
  date: string;
  time: string;
  purpose: string;
  timeSlot: string;
}
export interface ReservationResponse {
  status: number;
  success: string;
  message: string;
  data: {
    access_token: string;
    reservation_id: number;
    error_code: number;
    error_stack: string;
  };
}
