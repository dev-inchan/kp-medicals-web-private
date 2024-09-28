import { useMutation } from '@tanstack/react-query';
import style from './index.module.scss';
import { CancleReservation } from '@/service/bookCancle';
import { CancelReservationResponse, CancleReservationRequest } from '@/types/bookCancle';
import { getToken } from '@/utils/token';
type Props = {
  closeCancleModal: () => void;
  reservation_id: number | null;
  closeBookingManageModal: () => void;
};
const UID = process.env.NEXT_PUBLIC_UID;
export default function BookingCancleModal({ closeCancleModal, reservation_id, closeBookingManageModal }: Props) {
  const mutation = useMutation<CancelReservationResponse, Error, CancleReservationRequest>({
    mutationFn: CancleReservation,
    onSuccess: (data) => {
      alert('예약이 취소되었습니다.');
      closeCancleModal(); // 예약취소후 모달 닫기
      closeBookingManageModal();
    },
    onError: () => {},
  });

  const cancleClick = () => {
    const token = getToken();

    if (token && reservation_id) {
      mutation.mutate({
        access_token: token,
        uid: UID, // UID가 undefined일 가능성이 있다면 기본값을 설정
        reservation_id: reservation_id,
      });
    } else {
      console.log('Token or reservation_id is missing');
    }
  };

  return (
    <>
      <div className={style.modal}>
        <h2 className={style.title}>예약을 취소하시겠습니까</h2>
        <div>
          <div className={style.buttonWrapper}>
            <button className={style.buttonYes} onClick={cancleClick}>
              네
            </button>
          </div>
          <div className={style.buttonWrapper}>
            <button className={style.buttonNo} onClick={closeCancleModal}>
              아니요
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
