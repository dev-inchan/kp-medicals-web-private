export interface Hospital {
  hospital_id: number;
  hospital_name: string;
  icon: string;
  location: string;
  department_id: string[];
  start_time: string;
  end_time: string;
}

export interface HospitalResponse {
  status: number;
  success: string;
  message: string;
  data: {
    hospitals: Hospital[];
    error_code: number;
    error_stack: string;
  };
}
