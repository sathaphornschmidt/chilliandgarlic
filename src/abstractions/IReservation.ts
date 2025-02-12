export enum ReservationStatus {
  BOOKED = "booked",
  CANCELLED = "canceled",
}

export interface IReservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  number_of_guests: number;
  status: ReservationStatus;
  canceled_by?: string | null;
  canceled_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}
