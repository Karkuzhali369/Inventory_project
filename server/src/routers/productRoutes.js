import express from 'express';

import { verifyToken } from '../middleware/authMiddleware.js';

import { addProduct, modifyProduct, deleteProduct, getProduct, getCategory, stockAddition, stockEntry, getLowStockCount, getStatistics, getEntryLogs } from '../controller/productController.js';

const router = express.Router();
router.use(verifyToken);

router.post('/add-product', addProduct);
router.put('/modify-product', modifyProduct);
router.delete('/delete-product', deleteProduct);
router.get('/get-product', getProduct);

router.get('/get-category', getCategory);

router.post('/stock-addition', stockAddition);
router.post('/stock-entry', stockEntry);

router.get('/get-lowstock-count', getLowStockCount);
router.get('/get-statistics', getStatistics);

router.get('/get-entry-logs', getEntryLogs);

export default router;