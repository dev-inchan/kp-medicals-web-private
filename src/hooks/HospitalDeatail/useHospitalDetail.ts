// import { useState, useEffect } from 'react';
// import { HospitalDetailResponse } from '@/types/hospitalDetail';
// import { getHospitalDetail } from '@/service/hospitalDetail';

// type a = {};

// export const useHospitalDetail = () => {
//   const [hospitalDetail, setHospitalDetail] = useState<HospitalDetailResponse | null>(null);
//   const [error, setError] = useState();
//   const [isLoading, setIsLoading] = useState();

//   useEffect(() => {
//     const fetchHospitalDetail = async () => {
//       try {
//         const response = await getHospitalDetail();
//         console.log(response);
//         //setHospitalDetail(response.data)
//       } catch (error) {}
//     };
//     fetchHospitalDetail();
//   }, []);
// };
