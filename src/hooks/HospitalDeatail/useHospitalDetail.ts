// // hooks/useHospitalDetail.ts
// import { useState, useEffect } from 'react';
// import { getHospitalDetail } from '@/service/hospitalDetail';
// import { HospitalDetailResponse, Hospital } from '@/types/hospitalDetail';

// export const useHospitalDetail = (hospital_id: number) => {
//   const [hospitalDetail, setHospitalDetail] = useState<Hospital | null>(null);
//   const [mainSchedules, setMainSchedules] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchHospitalDetail = async () => {
//       try {
//         const response = await getHospitalDetail(hospital_id);
//         const { status, data } = response;
//         if (status === 200) {
//           setHospitalDetail(data.hospital);
//           setMainSchedules(data.doctors[0].main_schedules[0]);
//         }
//       } catch (error) {
//         setError('Failed to fetch hospital details');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHospitalDetail();
//   }, [hospital_id]);

//   const renderSchedule = (dayIndex: number) => {
//     if (!mainSchedules) return '10:00 ~ 18:00'; // 기본 시간 설정
//     const isDayOff = mainSchedules.dayoff[dayIndex] === '1'; // dayoff 값 확인
//     return isDayOff ? '휴무' : `${mainSchedules.start_time1} ~ ${mainSchedules.end_time2}`;
//   };

//   return { hospitalDetail, renderSchedule, loading, error };
// };
