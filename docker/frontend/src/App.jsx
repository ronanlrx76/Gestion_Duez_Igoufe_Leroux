import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Book from './pages/Book';
import Infos from './pages/Infos';
import LivreDetail from './pages/BookDetail';
import Header from './components/Header';
import MesEmprunts from './pages/emprunt.jsx';
import Reservation from './pages/reservation.jsx';
import HistoriqueEmprunts from './pages/historique.jsx';

import HomeAdmin from './pages/admin/HomeAdmin.jsx';
import AdminAdd from './pages/admin/ajouterEntite.jsx';
import ExemplairesManager from './pages/admin/exemplairesManager.jsx';
import AdminActions from './pages/admin/actionsEntite.jsx';

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
            <Route path="/mes-emprunts" element={<MesEmprunts />} />
            <Route path="/historique-emprunts" element={<HistoriqueEmprunts />} />
            <Route path="/reservation/:id_livre" element={<Reservation />} />
            <Route path="/informations" element={<Infos />} />
            <Route path="/admin/dashboard" element={<HomeAdmin />} />
            <Route path="/admin/ajouter" element={<AdminAdd />} />
            <Route path="/admin/exemplaires" element={<ExemplairesManager />} />
            <Route path="/admin/actions" element={<AdminActions />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
