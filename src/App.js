import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/YonniBookLogo.png";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import BookList from "./components/BookList";
import AddBook from "./components/AddBook";
import DeleteBook from "./components/DeleteBook";

function App() {
  const [books, setBooks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const checkAuthentication = async () => {
      try {
        if (token) {
          const response = await fetch("http://localhost:3002/verify-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            setIsAuthenticated(true);
            updateBookList();
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du jeton:", error);
      }
    };

    checkAuthentication();
  }, []);

  const updateBookList = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await fetch("http://localhost:3002/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          const booksResponse = await fetch("http://localhost:3002/get-books", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (booksResponse.ok) {
            const data = await booksResponse.json();
            setBooks(data);
          } else {
            console.error(
              "Erreur lors de la récupération des livres:",
              await booksResponse.json()
            );
          }
        } else if (response.status === 401) {
          const newTokenResponse = await fetch(
            "http://localhost:3002/refresh-token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token }),
            }
          );

          if (newTokenResponse.ok) {
            const newData = await newTokenResponse.json();
            localStorage.setItem("token", newData.token);
            updateBookList(); // Mets à jour la liste après le renouvellement du jeton
          } else {
            console.error(
              "Erreur lors du renouvellement du jeton:",
              await newTokenResponse.json()
            );
          }
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des livres après renouvellement du jeton:",
        error
      );
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3002/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        updateBookList();
      } else {
        console.error("Échec de la connexion");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:3002/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log("Inscription réussie");
        setIsAuthenticated(true);
        updateBookList();
      } else {
        console.error("Échec de l'inscription");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
    }
  };
  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3002/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token"); // Suppression du jeton du stockage local
        setIsAuthenticated(false); // Mise à jour de l'état d'authentification
      } else {
        console.error("Erreur lors de la déconnexion");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div className="background">
          <h1 className="flex">
            <img src={logo} alt="logo" className="YonniLogo" />
            Yonni's Books - Your favorite personal library
          </h1>
          <h2 className="flex">Ma Bibliothèque Personnelle</h2>
          <br />
          <BookList books={books} onUpdate={updateBookList} />
          <AddBook onUpdate={updateBookList} />
          <DeleteBook books={books} onUpdate={updateBookList} /> <br />
          <div className="flex">
            <Button variant="danger" onClick={handleLogout}>
              Déconnexion
            </Button>{" "}
          </div>
        </div>
      ) : (
        <div className="background1 flexColumn">
          <h1 className="mainTitle">
            <img src={logo} alt="logo" className="YonniLogo" />
            Yonni's Books - Your favorite personal library
          </h1>
          <h2>Connectez-vous pour accéder à votre bibliothèque</h2>
          <form>
            <FloatingLabel
              controlId="floatingInput"
              label="Nom d'utilisateur"
              className="mb-3 labelColor"
            >
              <Form.Control
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FloatingLabel>
            <br />
            <FloatingLabel
              className="labelColor"
              controlId="floatingPassword"
              label="Mot de passe"
            >
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FloatingLabel>
            <br />
            <Button className="BtnA" onClick={handleLogin}>
              Se connecter
            </Button>{" "}
            <Button className="BtnA" onClick={handleRegister}>
              S'inscrire
            </Button>{" "}
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
