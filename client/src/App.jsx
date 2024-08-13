import Projects from './components/Projects';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Principal from './components/Principal';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/main"
          element={<PrivateRoute />}
        >
          <Route path="/main" element={<Principal />} />
        </Route>
        <Route
          path="/proyectos"
          element={<PrivateRoute />}
        >
          <Route path="/proyectos" element={<Projects />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
