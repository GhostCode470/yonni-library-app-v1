import React, { useState } from "react";
import Button from "react-bootstrap/Button";

const AddBook = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    rating: 0,
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3002/add-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Le livre a été ajouté avec succès, mets à jour la liste des livres dans le composant parent
        onUpdate();
        console.log("Livre ajouté avec succès !");
      } else {
        const errorMessage = await response.text();
        console.error("Erreur lors de l'ajout du livre:", errorMessage);
        setError("Erreur lors de l'ajout du livre. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la requête POST :", error);
      setError("Erreur lors de la requête POST. Veuillez réessayer.");
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
      <h3>Ajouter un Livre</h3>

      <form onSubmit={handleSubmit} className="addBook">
        <label htmlFor="title">Titre:</label>
        <input
          className="inputStyle"
          type="text"
          id="title"
          name="title"
          onChange={handleChange}
          required
        />

        <label htmlFor="author">Auteur:</label>
        <input
          className="inputStyle"
          type="text"
          id="author"
          name="author"
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
          onChange={handleChange}
          required
        />

        <Button className="BtnA" type="submit">
          Ajouter
        </Button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AddBook;
