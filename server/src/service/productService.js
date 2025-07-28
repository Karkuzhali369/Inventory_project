import Product from '../model/productModel.js'

export const addProductService = async ({ productName, category, currentQuantity, unit, minQuantity }) => {
    try {
        const product = await new Product({
            productName,
            category,
            currentQuantity,
            unit,
            minQuantity
        });
        await product.save();
        return { status: 201, message: 'Product created successfully.', product: product };
    }
    catch(err) {
        return { status: 500, message: err.message };
    }
}

export const updateProductService = async ({ productId, productName, category, unit, minQuantity }) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                $set: { productName, category, unit, minQuantity }
            },
            {
                new: true,
                runValidators: true,
            }
        ).exec();

        if (!updatedProduct) {
            return { status: 404, message: "Product not found." };
        }

        return { status: 200, message: "Product updated successfully.", product: updatedProduct };
    }
    catch (err) {
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