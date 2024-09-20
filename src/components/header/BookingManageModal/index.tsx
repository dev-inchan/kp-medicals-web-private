import { useQueries, useQuery } from '@tanstack/react-query';
import style from './index.module.scss';
import { getPatientReservation } from '@/service/bookManage';
import { getToken } from '@/utils/token';
import { useState } from 'react';
import BookingCancleModal from '../BookingCancleModal';
import Modal from '@/components/modal';

const ERROR_MSG = '예약정보를 가져올 수 없습니다.';
const NO_DATA = '예약정보가 없습니다.';

type Props = {
  closeBookingManageModal: () => void;
};

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
    return <> {NO_DATA}</>;
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
  console.log('booking: ', data);
  console.log(reservations);

  return (
    <>
      {reservations?.map((reservation, index) => {
        return (
          <article
            className={style.hospital_wrapper}
            onClick={() => {
              openCancleModal(reservation.reservation_id);
            }}
          >
            <section className={style.hospital_information}>
              <header>
                <h2 className={style.hospital_name}>{`${reservation.hospital_name}`}</h2>
              </header>
              <div className={style.reservation_date_wrapper}>
                <h3>예약날짜</h3>
                <p>{`${reservation.date} ${reservation.time}`}</p>
              </div>
              <div className={style.reservation_name_wrapper}>
                <h3>예약자 이름</h3>
                <div>
                  <span className={style.reservation_name}>{`${reservation.patient_name}`}</span>
                </div>
              </div>
            </section>
            <figure>
              <img className={style.hospital_img} src={`${reservation.icon}`}></img>
            </figure>
          </article>
        );
      })}
      <Modal open={isCancleModalOpen} onClose={() => setIsCancleModalOpen(false)} width='300px' height='250px'>
        <BookingCancleModal
          closeCancleModal={closeCancleModal}
          reservation_id={reservation_id}
          closeBookingManageModal={closeBookingManageModal}
        />
      </Modal>
    </>
  );
}
