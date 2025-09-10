import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
    logId: { type: mongoose.Schema.Types.ObjectId, ref: "Log", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    code: { type: Number, required: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    lastModified: { type: Date, default: Date.now }
}, { timestamps: true });

const Record = mongoose.model("Record", recordSchema);
export default Record;
