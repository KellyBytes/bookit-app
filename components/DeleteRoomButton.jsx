'use client';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import deleteRoom from '@/app/actions/deleteRoom';

const DeleteRoomButton = ({ roomId }) => {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this room?',
    );

    if (confirmed) {
      try {
        const response = await deleteRoom(roomId);
        toast.success('Room deleted successfully!');
      } catch (err) {
        console.log('Failed to delete room:', err);
        toast.error('Failed to delete room');
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex justify-center items-center gap-x-1 bg-red-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto hover:bg-red-700"
    >
      <FaTrash /> Delete
    </button>
  );
};
export default DeleteRoomButton;
