import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model('File', fileSchema);