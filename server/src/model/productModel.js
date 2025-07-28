import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    category: { type: String, required: true },
    currentQuantity: { type: Number, required: true },
    unit: { type: String, required: true },
    minQuantity: { type: Number, required: true },
    lastModified: { type: Date, default: Date.now }
}, { timestamps: true });

// Useful indexes
productSchema.index({ productName: 1 });
productSchema.index({ category: 1 });
productSchema.index({ lastModified: -1 });
productSchema.index({ category: 1, productName: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
