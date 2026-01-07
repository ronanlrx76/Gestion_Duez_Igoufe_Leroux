import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Book from './pages/Book';
import Infos from './pages/Infos';
import LivreDetail from './pages/BookDetail';
import Header from './components/Header';

import HomeAdmin from './pages/admin/HomeAdmin.jsx';
import AdminAdd from './pages/admin/ajouterLivreAuteur.jsx';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route element={<Header />}>
            <Route path="/" element={<Home />} />
            <Route path="/accueil" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/livres" element={<Book />} />
            <Route path="/livres/:id" element={<LivreDetail/>} />
            <Route path="/informations" element={<Infos />} />
            <Route path="/admin/dashboard" element={<HomeAdmin />} />
            <Route path="/admin/ajouter" element={<AdminAdd />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
