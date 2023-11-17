import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import UpdateBook from "./UpdateBook";

const BookList = ({ books, onUpdate }) => {
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterRating, setFilterRating] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let filteredBooks = books;

    if (filterRating !== null) {
      filteredBooks = filteredBooks.filter(
        (book) => book.rating === filterRating
      );
    }

    filteredBooks = filteredBooks.filter((book) =>
      `${book.title} ${book.author}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const sortedBooks = [...filteredBooks].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

    setDisplayedBooks(sortedBooks);
  }, [books, sortOrder, filterRating, searchTerm]);

  const handleUpdateClick = (book) => {
    setSelectedBook(book);
  };

  const handleSortChange = () => {
    // Tri par ordre alphabétique, ascendant et descendant
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  const handleFilterChange = (rating) => {
    // Filtre par notes
    setFilterRating((prevFilterRating) =>
      prevFilterRating === rating ? null : rating
    );
  };

  return (
    <div>
      <h3>Liste des Livres</h3>
      <div>
        <label className="addBook">
          Trier par titre:
          <Button className="BtnA" onClick={handleSortChange}>
            {sortOrder === "asc" ? "Ascendant" : "Descendant"}
          </Button>
        </label>
        <label>
          Filtrer par note:
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              className="BtnA"
              key={rating}
              onClick={() => handleFilterChange(rating)}
              style={{
                fontWeight: filterRating === rating ? "bold" : "normal",
              }}
            >
              {rating}+
            </Button>
          ))}
        </label>
        <label>
          Rechercher:
          <input
            className="inputStyle"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>
      <ul className="addBook">
        {displayedBooks.map((book) => (
          <li key={book._id}>
            {book.title} - {book.author} - Note: {book.rating} - Dernière
            modification: {new Date(book.updatedAt).toLocaleString()}
            <Button className="BtnA" onClick={() => handleUpdateClick(book)}>
              Mettre à jour
            </Button>
            {selectedBook === book && (
              <UpdateBook book={book} onUpdate={onUpdate} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
