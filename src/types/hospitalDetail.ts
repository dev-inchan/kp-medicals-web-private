export interface HospitalDetailResponse {
  status: number;
  success: string;
  message: string;
  data: ResponseData;
}

export interface ResponseData {
  hospital: Hospital;
  doctors: Doctor[];
  error_code: number;
  error_stack: string;
}

export interface Hospital {
  hospital_id: number;
  hospital_name: string;
  location: string;
  x: number;
  y: number;
  department_id: string[];
  img_url: string[];
  marked: number;
  phone: string;
}

interface Doctor {
  staff_id: number;
  name: string;
  icon: string;
  department_id: string[];
  main_schedules: Schedule[];
  sub_schedules: Schedule[];
}
interface Schedule {
  schedule_id: number;
  hospital_id: number;
  staff_id: number;
  start_date?: string;
  end_date?: string;
  start_time1: string;
  end_time1: string;
  start_time2: string;
  end_time2: string;
  time_slot: string;
  max_reservation: number;
  dayoff: string;
  date?: string;
  name: string;
}
