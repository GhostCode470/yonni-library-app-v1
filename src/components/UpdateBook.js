import React, { useState } from "react";
import Button from "react-bootstrap/Button";

const UpdateBook = ({ book, onUpdate }) => {
  console.log("onUpdate in UpdateBook:", onUpdate);
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    rating: book.rating,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("onUpdate:", onUpdate);
      const response = await fetch(
        `http://localhost:3002/update-book/${book._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        onUpdate(); // Rafraîchit la liste des livres après la mise à jour
        console.log("Livre mis à jour avec succès !");
      } else {
        const errorMessage = await response.text();
        console.error("Erreur lors de la mise à jour du livre :", errorMessage);
      }
    } catch (error) {
      console.error("Erreur lors de la requête PUT :", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h3>Mettre à jour le Livre</h3>
      <form onSubmit={handleSubmit} className="addBook">
        <label htmlFor="title">Titre:</label>
        <input
          className="inputStyle"
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="author">Auteur:</label>
        <input
          className="inputStyle"
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />

        <label htmlFor="rating">Note:</label>
        <input
          className="inputStyle"
          type="number"
          id="rating"
          name="rating"
          min="0"
          max="5"
          step="0.1"
          value={formData.rating}
          onChange={handleChange}
          required
        />

        <Button className="BtnB" type="submit">
          Mettre à jour
        </Button>
      </form>
    </div>
  );
};

export default UpdateBook;
