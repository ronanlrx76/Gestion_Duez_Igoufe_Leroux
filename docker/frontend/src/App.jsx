import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Book from './pages/Book';
import Infos from './pages/Infos';
import LivreDetail from './pages/BookDetail';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route element={<Header />}>
            <Route path="/" element={<Home />} />
            <Route path="/Accueil" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Livres" element={<Book />} />
            <Route path="/Livres/:id" element={<LivreDetail/>} />
            <Route path="/Informations" element={<Infos />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
