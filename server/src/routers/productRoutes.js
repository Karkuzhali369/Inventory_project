import express from 'express';

import { verifyToken } from '../middleware/authMiddleware.js';

import { addProduct, modifyProduct, deleteProduct, getProduct } from '../controller/productController.js';

const router = express.Router();
router.use(verifyToken);

router.post('/add-product', addProduct);
router.put('/modify-product', modifyProduct);
router.delete('/delete-product', deleteProduct);
router.get('/get-product', getProduct);

export default router;


// GET /api/products?page=2&limit=25&search=milk&category=dairy&sortBy=productName&order=asc