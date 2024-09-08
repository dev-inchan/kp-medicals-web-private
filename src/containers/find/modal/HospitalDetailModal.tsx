'use client';
import { getHospitalDetail } from '@/service/hospitalDetail';
import { useState, useEffect } from 'react';
// import { useHospitalDetail } from '@/hooks/HospitalDeatail/useHospitalDetail';
import { HospitalDetailResponse, ResponseData } from '@/types/hospitalDetail';

type Props = {
  hospital_id: number;
  handleHospitalDetailModal: () => void;
};

export default function HospitalDetailModal({ hospital_id, handleHospitalDetailModal }: Props) {
  // useHospitalDetail();
  const [hospitalDetail, setHospitalDetail] = useState<ResponseData | null>(null);

  useEffect(() => {
    const fetchHospitalDetail = async () => {
      try {
        const response = await getHospitalDetail(hospital_id);
        const { status, success, data } = response;
        console.log(data);
        if (status === 200) {
          setHospitalDetail(data);
        }

        //setHospitalDetail(response.data)
      } catch (error) {}
    };
    fetchHospitalDetail();
  }, []);

  return <>fsdfsdf</>;
}
