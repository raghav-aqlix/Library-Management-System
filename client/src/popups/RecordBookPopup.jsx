import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  recordBorrowBook,
  fetchAllBorrowedBooks,
  fetchUserBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import { toggleRecordBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";

const RecordBookPopup = ({ bookId }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const { message, error } = useSelector((state) => state.borrow);

  const lastMessage = useRef(null);
  const lastError = useRef(null);

  useEffect(() => {
    if (message && message !== lastMessage.current) {
      toast.success(message, { toastId: "borrow-success" });
      lastMessage.current = message;

      dispatch(fetchAllBorrowedBooks());
      dispatch(fetchUserBorrowedBooks());
      setEmail("");
      dispatch(toggleRecordBookPopup());

      setTimeout(() => {
        dispatch(resetBorrowSlice());
        lastMessage.current = null;
      }, 2000);
    }

    if (error && error !== lastError.current) {
      toast.error(error, { toastId: "borrow-error" });
      lastError.current = error;

      setTimeout(() => {
        dispatch(resetBorrowSlice());
        lastError.current = null;
      }, 2000);
    }
  }, [message, error, dispatch]);

  const handleRecordBook = (e) => {
    e.preventDefault();
    dispatch(recordBorrowBook(email, bookId));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Borrow Book</h3>
          <form onSubmit={handleRecordBook}>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                User Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Borrower's Email"
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                type="button"
                onClick={() => dispatch(toggleRecordBookPopup())}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecordBookPopup;
