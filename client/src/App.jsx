import { Routes, Route, Navigate } from 'react-router-dom';



import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
