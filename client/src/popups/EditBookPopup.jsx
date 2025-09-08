import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleEditBookPopup } from "../store/slices/popUpSlice";
import { updateBook } from "../store/slices/bookSlice";

const EditBookPopup = ({ book }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [price, setPrice] = useState(book?.price || "");
  const [quantity, setQuantity] = useState(book?.quantity || "");
  const [description, setDescription] = useState(book?.description || "");

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setPrice(book.price);
      setQuantity(book.quantity);
      setDescription(book.description);
    }
  }, [book]);

  const handleUpdateBook = (e) => {
    e.preventDefault();

    dispatch(
      updateBook({
        id: book._id,
        formData: { title, author, price, quantity, description },
      })
    ).then(() => {
      dispatch(toggleEditBookPopup());
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Edit Book</h3>
          <form onSubmit={handleUpdateBook}>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                Book Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                Book Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                Book Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border-2 border-black rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => dispatch(toggleEditBookPopup())}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookPopup;
