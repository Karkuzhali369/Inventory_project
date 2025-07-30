import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import ProductManagementPage from './pages/ProductManagementPage';
import ProductListingPage from './pages/ProductsListingPage';

import ProtectedRoute from './routes/ProtectedRoute';
import Mainlayout from './layout/Mainlayout';

function App() {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>    
                <Route element={<Mainlayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path='/view' element={<ProductListingPage />} />
                    <Route path="/product-management" element={<ProductManagementPage />} />
                </Route>
            </Route>
            

            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;
