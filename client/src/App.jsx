
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

import Home from './pages/Home';
import ProductListingPage from './pages/ProductsListingPage';
import StockManagementPage from './pages/StockManagementPage';
import ProductManagementPage from './pages/ProductManagementPage';
import StatisticsPage from './pages/StatisticsPage';
import AdminPanel from './pages/adminpanel/Adminpanel';

import ProtectedRoute from './routes/ProtectedRoute';
import Mainlayout from './layout/Mainlayout';

function App() {
    const isAdmin = localStorage.getItem('Role') === 'ADMIN';

    return (
        <Routes>
            <Route element={<ProtectedRoute />}>    
                <Route element={<Mainlayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path='/view' element={<ProductListingPage />} />
                    <Route path='/stock-management' element={<StockManagementPage />} />
                    <Route path="/product-management" element={<ProductManagementPage />} />
                    <Route path='/statistics' element={<StatisticsPage />} />
                    {isAdmin && (
                        <Route path="/admin-panel" element={<AdminPanel />} />
                    )}
                </Route>
            </Route>
            

            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );

}

export default App;
