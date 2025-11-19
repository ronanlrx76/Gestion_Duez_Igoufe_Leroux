import React from 'react';
import './Header.css'; // pour le style, on créera ce fichier ensuite

const Header = () => {
  return (
    <header className="header">
      <h1>Gestion de Bibliothèque</h1>
      <nav>
        <ul className="nav-links">
          <li><a href="/">Accueil</a></li>
          <li><a href="/livres">Livres</a></li>
          <li><a href="/auteurs">Auteurs</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
