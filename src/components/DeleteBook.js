import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

const DeleteBook = ({ books, onUpdate }) => {
  const [selectedBook, setSelectedBook] = useState("");

  useEffect(() => {
    if (books.length > 0) {
      setSelectedBook(books[0]._id);
    }
  }, [books]);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/delete-book/${selectedBook}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Livre supprimé avec succès !");
        onUpdate(); // Rafraîchit la liste des livres après la suppression en utilisant la fonction onUpdate
      } else {
        console.error("Erreur lors de la suppression du livre");
      }
    } catch (error) {
      console.error("Erreur lors de la requête DELETE :", error);
    }
  };

  return (
    <div>
      <h3>Supprimer un Livre</h3>
      <label htmlFor="selectBook">Sélectionnez un livre :</label>
      <select
        className="inputStyle "
        id="selectBook"
        onChange={(e) => setSelectedBook(e.target.value)}
        value={selectedBook}
      >
        {books.map((book) => (
          <option key={book._id} value={book._id}>
            {book.title} - {book.author}
          </option>
        ))}
      </select>
      <Button className="BtnA" onClick={handleDelete}>
        Supprimer
      </Button>
    </div>
  );
};

export default DeleteBook;
