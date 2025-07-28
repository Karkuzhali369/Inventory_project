import mongoose from "mongoose";

const logsSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    isAdded: {
        type: Boolean,
        required: true
    },
    dateAndTime: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

logsSchema.index({ dateAndTime: -1 });

const Logs = mongoose.model('Logs', logsSchema);

export default Logs;