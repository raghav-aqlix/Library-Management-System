import React, { useEffect, useState } from "react";
import { BookA, NotebookPen, Pencil } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
  toggleEditBookPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";
import EditBookPopup from "../popups/EditBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();
  const { books, message, error } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup, editBookPopup } =
    useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");
  const [editBook, setEditBook] = useState(null);
  const [titleKeyword, setTitleKeyword] = useState("");
  const [authorKeyword, setAuthorKeyword] = useState("");

  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  const openEditBookPopup = (book) => {
    setEditBook(book);
    dispatch(toggleEditBookPopup());
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(resetBookSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBookSlice());
    }
  }, [dispatch, message, error]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAllBooks());
      if (user?.role === "Admin") {
        dispatch(fetchAllBorrowedBooks());
      }
    }
  }, [dispatch, isAuthenticated, user]);

  const searchedBooks = Array.isArray(books)
    ? books.filter(
        (book) =>
          book.title.toLowerCase().includes(titleKeyword.toLowerCase()) &&
          book.author.toLowerCase().includes(authorKeyword.toLowerCase())
      )
    : [];

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            {user && user.role === "Admin" ? "Book Management" : "Books"}
          </h2>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            {isAuthenticated && user?.role === "Admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800"
              >
                <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">
                  +
                </span>
                Add Book
              </button>
            )}
            <input
              type="text"
              placeholder="Search by Book Name..."
              className="w-full sm:w-52 border p-2 border-gray-300 rounded-md"
              value={titleKeyword}
              onChange={(e) => setTitleKeyword(e.target.value)}
            />

            <input
              type="text"
              placeholder="Search by author..."
              className="w-full sm:w-52 border p-2 border-gray-300 rounded-md"
              value={authorKeyword}
              onChange={(e) => setAuthorKeyword(e.target.value)}
            />
          </div>
        </header>

        {searchedBooks && searchedBooks.length > 0 ? (
          <>
            <div className="hidden xl:block mt-6 overflow-auto bg-white rounded-md shadow-lg">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Book Name</th>
                    <th className="px-4 py-2 text-left">Author</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-2 text-left">Quantity</th>
                    )}
                    <th className="px-4 py-2 text-left">Borrow Price</th>
                    <th className="px-4 py-2 text-left">Availability</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-2 text-center">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {searchedBooks.map((book, index) => (
                    <tr
                      key={book._id}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 whitespace-normal break-words">
                        {book.title}
                      </td>
                      <td className="px-4 py-2 whitespace-normal break-words">
                        {book.author}
                      </td>
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-2">{book.quantity}</td>
                      )}
                      <td className="px-4 py-2">{`Rs.${book.price}`}</td>
                      <td className="px-4 py-2">
                        {book.quantity > 0 ? "Available" : "Unavailable"}
                      </td>
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-2 flex space-x-3 justify-center">
                          <Pencil
                            className="cursor-pointer"
                            onClick={() => openEditBookPopup(book)}
                          />
                          <BookA
                            className="cursor-pointer"
                            onClick={() => openReadPopup(book._id)}
                          />
                          <NotebookPen
                            className="cursor-pointer"
                            onClick={() => openRecordBookPopup(book._id)}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="block xl:hidden mt-6 space-y-4">
              {searchedBooks.map((book, index) => (
                <div
                  key={book._id}
                  className="bg-white p-4 rounded-md shadow-md border"
                >
                  <p>
                    <strong>ID:</strong> {index + 1}
                  </p>
                  <p className="break-words">
                    <strong>Book Name:</strong> {book.title}
                  </p>
                  <p className="break-words">
                    <strong>Author:</strong> {book.author}
                  </p>
                  {isAuthenticated && user?.role === "Admin" && (
                    <p>
                      <strong>Quantity:</strong> {book.quantity}
                    </p>
                  )}
                  <p>
                    <strong>Price:</strong> Rs.{book.price}
                  </p>
                  <p>
                    <strong>Availability:</strong>{" "}
                    {book.quantity > 0 ? "Available" : "Unavailable"}
                  </p>
                  {isAuthenticated && user?.role === "Admin" && (
                    <div className="flex gap-3 mt-2">
                      <Pencil
                        className="cursor-pointer"
                        onClick={() => openEditBookPopup(book)}
                      />
                      <BookA
                        className="cursor-pointer"
                        onClick={() => openReadPopup(book._id)}
                      />
                      <NotebookPen
                        className="cursor-pointer"
                        onClick={() => openRecordBookPopup(book._id)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            No books found in library!
          </h3>
        )}
      </main>

      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
      {editBookPopup && <EditBookPopup book={editBook} />}
    </>
  );
};

export default BookManagement;
