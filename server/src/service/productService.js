import crypto from 'crypto';
import Product from '../model/productModel.js'
import Logs from '../model/logs.js';

export const addProductService = async ({ code, productName, size=null, category, material=null, make=null, currentQuantity, unit, price, minQuantity }) => {
    try {
        const product = new Product({
            code,
            productName,
            size,
            category,
            material,
            make,
            currentQuantity,
            unit,
            price,
            minQuantity
        });
        await product.save();
        return { status: 201, message: 'Product created successfully.', product: product };
    }
    catch(err) {
        return { status: 500, message: err.message };
    }
}

export const updateProductService = async ({ productId, code, productName, size, category, material, make, currentQuantity, unit, price, minQuantity }) => {
    try {
        const updateFields = {};

        if (code !== undefined) updateFields.code = code;
        if (productName !== undefined) updateFields.productName = productName;
        if (size !== undefined) updateFields.size = size;
        if (category !== undefined) updateFields.category = category;
        if (material !== undefined) updateFields.material = material;
        if (make !== undefined) updateFields.make = make;
        if (currentQuantity !== undefined) updateFields.currentQuantity = currentQuantity;
        if (unit !== undefined) updateFields.unit = unit;
        if (price !== undefined) updateFields.price = price;
        if (minQuantity !== undefined) updateFields.minQuantity = minQuantity;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).exec();

        if (!updatedProduct) {
            return { status: 404, message: "Product not found." };
        }

        return { status: 200, message: "Product updated successfully.", product: updatedProduct };
    } catch (err) {
        return { status: 500, message: err.message };
    }
};


export const deleteProductService = async (productId) => {
    try {
        const product = await Product.deleteOne({ _id: productId });
        if(product.deletedCount === 0) {
            return { status: 404, message: 'Product not found.' };
        }
        else {
            console.log(product)
            return { status: 200, message: 'Product deleted successfully.' };
        }
    }
    catch (err) {
        return { status: 500, message: err.message };
    }
}

export const getProductsService = async ({ page = 1, limit = 30, search = "", category, sortBy = "createdAt", order = "desc" }) => {
    try {
        const query = {};

        // Search by product name
        if (search) {
            query.productName = { $regex: search, $options: "i" }; // Case-insensitive search
        }

        // Filter by category
        if (category && category != 'ALL') {
            query.category = category;
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Sorting
        const sortOrder = order === "asc" ? 1 : -1;

        const products = await Product.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .exec();

        const total = await Product.countDocuments(query);

        return {
            status: 200,
            data: products,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        };
    }
    catch (err) {
        return { status: 500, message: err.message };
    }
};

export const getCategoryService = async () => {
    const categories = await Product.distinct("category");
    return { status: 200, message: 'Category received.', categories: categories };
}

export const stockAdditionService = async (userId, { stocks }) => {
    if (!stocks?.length) return { status: 400, message: 'No stock items provided.' };

    const now = new Date();
    const reference = crypto.randomUUID();

    try {
        for (const stock of stocks) {
            const product = await Product.findById(stock.productId);
            if (!product) {
                console.warn(`Product not found for ID: ${stock.productId}`);
                continue;
            }

            const valueToAdd = Number(stock.value);
            if (isNaN(valueToAdd)) {
                console.warn(`Invalid stock value: ${stock.value}`);
                continue;
            }

            product.currentQuantity = (Number(product.currentQuantity) || 0) + valueToAdd;
            product.lastModified = now;

            await Logs.create({
                productId: product._id,
                userId,
                reference,
                quantity: valueToAdd,
                isAdded: true,
                dateAndTime: now
            });

            await product.save();
        }

        return { status: 200, message: 'Stock successfully added.' };
    }
    catch (err) {
        return { status: 500, message: err.message };
    }
};

 
export const stockEntryService = async (userId, { stocks }) => {
    if (!stocks?.length) return { status: 400, message: 'No stock items provided.' };

    const now = new Date();
    const reference = crypto.randomUUID();
    const warning = [];

    try {
        for (const stock of stocks) {
            const product = await Product.findById(stock.productId);
            if (!product) {
                console.warn(`Product not found for ID: ${stock.productId}`);
                continue;
            }

            const valueToSub = Number(stock.value);
            if (isNaN(valueToSub)) {
                console.warn(`Invalid stock value: ${stock.value}`);
                continue;
            }

            product.currentQuantity = Number(product.currentQuantity) || 0;

            if (product.currentQuantity < valueToSub) {
                warning.push({
                    productName: product.productName,
                    productId: product._id,
                    currentQuantity: product.currentQuantity,
                    entry: valueToSub
                });
                continue;
            }

            product.currentQuantity -= valueToSub;
            product.lastModified = now;

            await Logs.create({
                productId: product._id,
                userId,
                reference,
                quantity: valueToSub,
                isAdded: false,
                dateAndTime: now
            });

            await product.save();
        }

        return { status: 200, message: 'Stock successfully entered.', warning };
    }
    catch (err) {
        return { status: 500, message: err.message };
    }
};
