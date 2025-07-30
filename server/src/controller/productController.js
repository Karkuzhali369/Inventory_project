import { response } from "../utils/response.js";

import { addProductService, updateProductService, deleteProductService, getProductsService, getCategoryService } from "../service/productService.js";

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