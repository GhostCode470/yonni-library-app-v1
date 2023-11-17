import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Book = ({ title, author, rating }) => {
  return (
    <div>
      <h4>{title}</h4>
      <p>Auteur: {author}</p>
      <p>Note: {rating}</p>
    </div>
  );
};

export default Book;
