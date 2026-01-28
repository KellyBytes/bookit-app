'use client';
import { toast } from 'react-toastify';
import cancelBooking from '@/app/actions/cancelBooking';

const CancelBookingButton = ({ bookingId }) => {
  const handleCancel = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking?',
    );

    if (confirmed) {
      try {
        const response = await cancelBooking(bookingId);
        toast.success('Booking cancelled successfully!');
      } catch (err) {
        console.log('Failed to cancel booking:', err);
        toast.error('Failed to cancel booking');
      }
    }
  };

  return (
    <button
      onClick={handleCancel}
      className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700"
    >
      Cancel Booking
    </button>
  );
};
export default CancelBookingButton;
