import mongoose from "mongoose";

const logSchema = mongoose.Schema({
    author: { type: String, required: true },
    isAdded: { type: Boolean, required: true },
    profit: { type: Number },
    totalProducts: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    dateAndTime: { type: Date, default: Date.now, required: true }    
}, { timestamps: true });

logSchema.index({ dateAndTime: -1 });

const Log = mongoose.model('Log', logSchema);

export default Log;