'useclient';
import { useState } from 'react';
import { getPatientReservation } from '@/service/bookManage';
import { getToken } from '@/utils/token';
import { useQueries, useQuery } from '@tanstack/react-query';
import style from './BookingManageModal.module.scss';
import BookingCancleModal from '../BookingCancleModal';
import Modal from '@/components/modal';

type Props = {
  closeBookingManageModal: () => void;
};
const ERROR_MSG = '예약정보를 가져올 수 없습니다.';
const NO_DATA = '예약정보가 없습니다.';

export default function BookingManageModal({ closeBookingManageModal }: Props) {
  const [isCancleModalOpen, setIsCancleModalOpen] = useState(false);
  const [reservation_id, setReservation_id] = useState<number | null>(null);

  // 예약 정보를 가져오는 useQuery
  const { data, isLoading, isError } = useQuery({
    queryKey: ['bookingManage'],
    queryFn: () => getPatientReservation(getToken()),
  });

  if (isError) {
    return <>{ERROR_MSG}</>;
  }

  const reservations = data?.data?.reservations;

  if (!reservations || reservations.length <= 0) {
    return <div className={style.no_data}> {NO_DATA}</div>;
  }

  // 모달 열기 및 예약 ID 설정
  const openCancleModal = (reservationId: number) => {
    setReservation_id(reservationId);
    setIsCancleModalOpen(true); // 모달 열기
  };

  // 모달 닫기
  const closeCancleModal = () => {
    setReservation_id(null); // 모달을 닫을 때 예약 ID 초기화
    setIsCancleModalOpen(false); // 모달 닫기
  };

  return (
    <section className={style.section}>
      <h2 className={style.title}>예약을 관리해보세요</h2>
      <p className={style.reserve_title}>예약을 선택하세요</p>
      <ul className={style.reserve_list}>
        {reservations?.map((reservation, index) => {
          return (
            <li
              key={`${reservation.hospital_id}+${reservation.time}`}
              className={style.reserve_item}
              onClick={() => {
                openCancleModal(reservation.reservation_id);
              }}
            >
              <div className={style.item_img_wrapper}>
                <img className={style.img} src={reservation.icon} alt={`${reservation.hospital_name} img`} />
              </div>
              <div className={style.ddd}>
                <div className={style.doctor_name_wrapper}>
                  <p>의사: {reservation.staff_name}</p>
                </div>
                <div className={style.reservation_date_wrapper}>
                  <h3>예약날짜 : </h3>
                  <p>{`${reservation.date} ${reservation.time}`}</p>
                </div>
                <div className={style.reservation_name_wrapper}>
                  <h3>예약자: </h3>
                  <div>
                    <span className={style.reservation_name}>{`${reservation.patient_name}`}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <Modal open={isCancleModalOpen} onClose={() => setIsCancleModalOpen(false)} width='300px' height='250px'>
        <BookingCancleModal
          closeCancleModal={closeCancleModal}
          reservation_id={reservation_id}
          closeBookingManageModal={closeBookingManageModal}
        />
      </Modal>
    </section>
  );
}
