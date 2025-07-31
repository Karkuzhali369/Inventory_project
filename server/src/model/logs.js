import mongoose from "mongoose";

const logsSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reference: {
        type: String,
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
        type: String,
        required: true
    }
}, { timestamps: true });

logsSchema.index({ dateAndTime: -1 });

const Logs = mongoose.model('Logs', logsSchema);

export default Logs;