import { response } from "../utils/response.js";

import { addProductService, updateProductService, deleteProductService, getProductsService, getCategoryService, stockAdditionService, stockEntryService, getLowStockCountService, getStatisticsService } from "../service/productService.js";

export const addProduct = async (req, res) => {
    const { role } = req.user;

    if(role !== 'ADMIN' && role !== 'MODERATOR') {
        return res.status(403).send(response('FAILED', 'You dont have enough perimission.', null));
    }
    try {
        const result = await addProductService(req.body);
        if(result.status === 201) {
            return res.status(201).send(response('SUCCESS', result.message, { product: result.product }));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const modifyProduct = async (req, res) => {
    const { role } = req.user;
    if(role !== 'ADMIN' && role !== 'MODERATOR') {
        return res.status(403).send(response('FAILED', 'You dont have enough perimission.', null));
    }
    try {
        const result = await updateProductService(req.body);
        if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, { product: result.product }));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const deleteProduct = async (req, res) => {
    const { role } = req.user;
    if(role !== 'ADMIN' && role !== 'MODERATOR') {
        return res.status(403).send(response('FAILED', 'You dont have enough perimission.', null));
    }
    const { productId } = req.body;
    try {
        const result = await deleteProductService(productId);
        if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, null));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const getProduct = async (req, res) => {
    try {
        const result = await getProductsService(req.query);
        if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, { products: result.data, paging: result.pagination }));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const getCategory = async (req, res) => {
    try {
        const result = await getCategoryService(req.query);
        if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, { categories: result.categories }));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const stockAddition = async (req, res) => {
    try {
        const result = await stockAdditionService(req.user.userId, req.body);
        if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, null));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const stockEntry = async (req, res) => {
    try {
        const result = await stockEntryService(req.user.userId, req.body);
        if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, { warning: result.warning}));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const getLowStockCount = async (req, res) => {
    try {
        const result = await getLowStockCountService();
        if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, {
                lowStockCount: result.lowStockCount
            }));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }  
}

export const getStatistics = async (req, res) => {
    try {
        const result = await getStatisticsService();
        if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, {
                overviewStats: result.overviewStats,
                stockByCategory: result.stockByCategory,
                lastThreeMonthData: result.lastThreeMonthData,
                lastEightWeekSale: result.lastEightWeekSale
            }));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }   
}