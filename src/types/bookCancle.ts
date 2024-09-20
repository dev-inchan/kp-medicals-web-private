export type CancelReservationResponse = {
  status: number;
  success: string;
  message: string;
  data: {
    access_token: string;
    reservation_id: number;
    error_code: number;
    error_stack: string;
  };
};

export type CancleReservationRequest = {
  access_token: string;
  uid: string | undefined;
  reservation_id: number | null;
};
