import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();
  const { returnBookPopup } = useSelector((state) => state.popup);
  const { loading, error, allBorrowedBooks, message } = useSelector(
    (state) => state.borrow
  );

  const [filter, setFilter] = useState("borrowed");
  const [emailKeyword, setEmailKeyword] = useState("");
  const [bookKeyword, setBookKeyword] = useState("");
  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");

  const openReturnBookPopup = (bookId, email) => {
    setBorrowedBookId(bookId);
    setEmail(email);
    dispatch(toggleReturnBookPopup());
  };

  const formatDateAndTime = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
  };

  const currentDate = new Date();
  const borrowedBooks = allBorrowedBooks?.filter(
    (book) => new Date(book.dueDate) > currentDate
  );
  const overdueBooks = allBorrowedBooks?.filter(
    (book) => new Date(book.dueDate) <= currentDate
  );

  const booksToDisplay = (
    filter === "borrowed" ? borrowedBooks : overdueBooks
  )?.filter(
    (book) =>
      book.user.email.toLowerCase().includes(emailKeyword.toLowerCase()) &&
      book.book.title.toLowerCase().includes(bookKeyword.toLowerCase())
  );

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
      dispatch(toggleReturnBookPopup());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, message]);

  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <div className="flex gap-3 flex-wrap">
            <button
              className={`px-4 py-2 font-semibold rounded-md border ${
                filter === "borrowed"
                  ? "bg-black text-white border-black"
                  : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("borrowed")}
            >
              Borrowed Books
            </button>
            <button
              className={`px-4 py-2 font-semibold rounded-md border ${
                filter === "overdue"
                  ? "bg-black text-white border-black"
                  : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("overdue")}
            >
              Overdue Borrowers
            </button>
          </div>

          <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0 flex-wrap">
            <input
              type="text"
              placeholder="Search by email..."
              value={emailKeyword}
              onChange={(e) => setEmailKeyword(e.target.value)}
              className="w-full sm:w-52 border p-2 border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Search by Book Name..."
              value={bookKeyword}
              onChange={(e) => setBookKeyword(e.target.value)}
              className="w-full sm:w-52 border p-2 border-gray-300 rounded-md"
            />
          </div>
        </header>

        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="mt-6">
            <div className="hidden min-[1255px]:block overflow-auto bg-white rounded-md shadow-lg">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Borrower's Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Book Name</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Due Date</th>
                    <th className="px-4 py-2 text-left">Date & Time</th>
                    <th className="px-4 py-2 text-center">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {booksToDisplay.map((book, index) => (
                    <tr
                      key={index}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{book?.user.name}</td>
                      <td className="px-4 py-2 break-words">
                        {book?.user.email}
                      </td>
                      <td className="px-4 py-2">{book.book.title}</td>
                      <td className="px-4 py-2">{book?.price}</td>
                      <td className="px-4 py-2">{formatDate(book.dueDate)}</td>
                      <td className="px-4 py-2">
                        {formatDateAndTime(book.createdAt)}
                      </td>
                      <td className="px-4 py-2 flex justify-center">
                        {book.returnDate ? (
                          <FaSquareCheck className="w-6 h-6 text-green-600" />
                        ) : (
                          <PiKeyReturnBold
                            onClick={() =>
                              openReturnBookPopup(
                                book.book._id,
                                book?.user.email
                              )
                            }
                            className="w-6 h-6 cursor-pointer text-blue-600"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 min-[1255px]:hidden">
              {booksToDisplay.map((book, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow bg-white"
                >
                  <p>
                    <span className="font-medium">ID:</span> {index + 1}
                  </p>
                  <p>
                    <span className="font-medium">Borrower's Name:</span>{" "}
                    {book?.user.name}
                  </p>
                  <p className="break-words">
                    <span className="font-medium">Email:</span>{" "}
                    {book?.user.email}
                  </p>
                  <p>
                    <span className="font-medium">Book Name:</span>{" "}
                    {book.book.title}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> {book?.price}
                  </p>
                  <p>
                    <span className="font-medium">Due Date:</span>{" "}
                    {formatDate(book.dueDate)}
                  </p>
                  <p>
                    <span className="font-medium">Date & Time:</span>{" "}
                    {formatDateAndTime(book.createdAt)}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Return:</span>
                    {book.returnDate ? (
                      <FaSquareCheck className="w-6 h-6 text-green-600" />
                    ) : (
                      <PiKeyReturnBold
                        onClick={() =>
                          openReturnBookPopup(book.book._id, book?.user.email)
                        }
                        className="w-6 h-6 cursor-pointer text-blue-600"
                      />
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            No {filter === "borrowed" ? "borrowed" : "overdue"} books found!!
          </h3>
        )}
      </main>

      {returnBookPopup && (
        <ReturnBookPopup bookId={borrowedBookId} email={email} />
      )}
    </>
  );
};

export default Catalog;
