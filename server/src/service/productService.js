import crypto from 'crypto';
import Product from '../model/productModel.js';
import User from '../model/userModel.js';
import Log from '../model/log.js';
import moment from 'moment'; // or use native Date
import mongoose from 'mongoose';
import Record from '../model/recordModel.js';

export const addProductService = async ({ code, productName, size=null, category, material=null, make=null, currentQuantity, unit, cp, sp, dealer, minQuantity }) => {
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
            cp,
            sp,
            dealer,
            minQuantity
        });
        await product.save();
        return { status: 201, message: 'Product created successfully.', product: product };
    }
    catch(err) {
        return { status: 500, message: err.message };
    }
}

export const updateProductService = async ({ productId, code, productName, size, category, material, make, currentQuantity, unit, cp, sp, dealer, minQuantity }) => {
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
        if (cp !== undefined) updateFields.cp = cp;
        if (sp !== undefined) updateFields.sp = sp;
        if (dealer !== undefined) updateFields.dealer = dealer;
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

    if (!stocks?.length) {
        return { status: 400, message: 'No stock items provided.' };
    }

    const now = new Date();
    let totalCost = 0;
    for(let i=0; i<stocks.length; i++) {
        totalCost += stocks[i].cost * stocks[i].quantity;
    }

    try {
        const { userName } = await User.findById(new mongoose.Types.ObjectId(userId)).select({userName: 1, _id: 0});
        const log = new Log({
            author: userName,
            isAdded: true,
            totalProducts: stocks.length,
            totalCost: totalCost,
            dateAndTime: now
        });
        await log.save();

        for(let stock of stocks) {
            let product = await Product.findById(stock.productId);

            if (!product) {
                console.warn(`Product not found for ID: ${stock.productId}`);
                continue;
            }
            product.cp = (product.cp * product.currentQuantity + stock.cost * stock.quantity) / (product.currentQuantity+stock.quantity);
            product.currentQuantity = product.currentQuantity + stock.quantity;
            product.lastModified = now;

            const record = new Record({
                logId: log._id,
                productId: new mongoose.Types.ObjectId(stock.productId),
                code: stock.code,
                productName: stock.productName,
                category: product.category,
                quantity: stock.quantity,
                unitPrice: stock.cost
            });
            
            await product.save();
            await record.save();
        }

        return { status: 200, message: 'Stock successfully added.' };
    } catch (err) {
        console.log(err.message)
        return { status: 500, message: err.message };
    }
};


export const stockEntryService = async (userId, { stocks }) => {
    if (!stocks?.length) {
        return { status: 400, message: 'No stock items provided.' };
    }

    const now = new Date();
    const warning = [];

    try {
        const { userName } = await User.findById(new mongoose.Types.ObjectId(userId)).select({userName: 1, _id: 0});
        const log = new Log({
            author: userName,
            isAdded: false,
            totalProducts: 0,
            totalCost: 0,
            dateAndTime: now
        });

        let totalProducts = 0;
        let totalCost = 0;
        let profit = 0;

        for (const stock of stocks) {
            const product = await Product.findById(stock.productId);
            if (!product) {
                console.warn(`Product not found for ID: ${stock.productId}`);
                continue;
            }

            product.currentQuantity = Number(product.currentQuantity) || 0; // Don't know why this line exist


            if (product.currentQuantity < stock.quantity) {
                warning.push({
                    productName: product.productName,
                    productId: product._id,
                    currentQuantity: product.currentQuantity,
                    entry: stock.quantity
                });
                continue;
            }
            product.currentQuantity -= stock.quantity;
            product.lastModified = now;

            const record = new Record({
                logId: log._id,
                productId: new mongoose.Types.ObjectId(stock.productId),
                code: stock.code,
                productName: stock.productName,
                category: product.category,
                quantity: stock.quantity,
                unitPrice: product.sp
            });
            totalProducts += 1;
            totalCost += stock.quantity * product.sp;
            profit += (product.sp - product.cp) * stock.quantity;

            await record.save();
            await product.save();
        }
        log.totalProducts = totalProducts;
        log.totalCost = totalCost;
        log.profit = profit;

        log.save();

        return { status: 200, message: 'Stock successfully entered.', warning };
    }
    catch (err) {
        console.log(err.message)
        return { status: 500, message: err.message };
    }
};

export const getLowStockCountService = async () => {
    try {
        let lowStockCount = await Product.countDocuments({
            $expr: { $lte: ["$currentQuantity", "$minQuantity"] }
        });
        return { status: 200, message: 'Get the low stock count.', lowStockCount: lowStockCount}
    }
    catch(err) {
        return { status: 500, message: err.message };
    }
}


export const getStatisticsService = async () => {
    try {
        let overviewStats = {}
        overviewStats.totalProducts = await Product.countDocuments();
        overviewStats.totalCategories = (await Product.distinct("category")).length;
        const totalWorth = await Product.aggregate([{ $group: { _id: null, totalNetWorth: {
            $sum: { $multiply: ["$currentQuantity", "$price"] } }}}]);

        overviewStats.totalNetWorth = totalWorth[0]?.totalNetWorth || 0;
        overviewStats.lowStockCount = await Product.countDocuments({
            $expr: { $lte: ["$currentQuantity", "$minQuantity"] }
        });

        const stockByCategory = await Product.aggregate([{$group: { _id: "$category", totalQuantity: { $sum: "$currentQuantity" }}},
        { $project: { _id: 0, category: "$_id", totalQuantity: 1 }
        },
        { $sort: { category: 1 } } ]);

        const lastThreeMonthData = await getLastThreeMonthsSales();
        const lastEightWeekSale = await getLastEightWeeksSales();

        return { status: 200, message: 'Statistics data received.', overviewStats: overviewStats, stockByCategory: stockByCategory, lastThreeMonthData: lastThreeMonthData, lastEightWeekSale: lastEightWeekSale };
    }
    catch(err) {
        return { status: 500, message: err.message };
    }
}


export const getLastEightWeeksSales = async () => {
  const startDate = moment().startOf('isoWeek').subtract(7, 'weeks').toDate(); // 8 weeks back
  const endDate = moment().endOf('isoWeek').toDate();

  const logs = await Logs.aggregate([
    {
      $match: {
        isAdded: false,
        dateAndTime: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $addFields: {
        isoWeek: { $isoWeek: '$dateAndTime' },
        isoYear: { $isoWeekYear: '$dateAndTime' }, // Needed in case of year boundary
        totalPrice: { $multiply: ['$quantity', '$product.price'] }
      }
    },
    {
      $group: {
        _id: { week: '$isoWeek', year: '$isoYear' },
        total: { $sum: '$totalPrice' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.week': 1 }
    }
  ]);

  // Format result like: [{ week: 'Week 1', price: 320 }, ...]
  const weekMap = new Map();
  for (let i = 7; i >= 0; i--) {
    const date = moment().startOf('isoWeek').subtract(i, 'weeks');
    const weekLabel = `Week ${8 - i}`;
    weekMap.set(`${date.isoWeek()}-${date.isoWeekYear()}`, { week: weekLabel, price: 0 });
  }

  logs.forEach(log => {
    const key = `${log._id.week}-${log._id.year}`;
    if (weekMap.has(key)) {
      weekMap.get(key).price = log.total;
    }
  });

  return Array.from(weekMap.values());
};



export const getLastThreeMonthsSales = async () => {
  const categories = await Product.distinct("category");

  const startDate = moment().startOf('month').subtract(2, 'months').toDate(); // Start of 3 months ago

  const logs = await Logs.aggregate([
    {
      $match: {
        isAdded: false,
        dateAndTime: { $gte: startDate }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $addFields: {
        monthKey: { $dateToString: { format: '%Y-%m', date: '$dateAndTime' } }, // e.g., '2025-05'
        category: '$product.category'
      }
    },
    {
      $group: {
        _id: { monthKey: '$monthKey', category: '$category' },
        total: { $sum: '$quantity' }
      }
    }
  ]);

  // Build mapping: { 'YYYY-MM' -> { category -> total } }
  const salesMap = {};
  logs.forEach(({ _id: { monthKey, category }, total }) => {
    if (!salesMap[monthKey]) salesMap[monthKey] = {};
    salesMap[monthKey][category] = total;
  });

  // Final formatting: array of { month: 'May', [category]: total }
  const result = [];
  for (let i = 2; i >= 0; i--) {
    const date = moment().startOf('month').subtract(i, 'months');
    const monthKey = date.format('YYYY-MM');
    const readableMonth = date.format('MMMM'); // e.g., "May"

    const entry = { month: readableMonth };
    for (const category of categories) {
      entry[category] = salesMap[monthKey]?.[category] || 0;
    }
    result.push(entry);
  }

  return result;
};

