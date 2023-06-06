const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema({
    bannerImagePath: {
        type: String,
        required: true
    },
    title: {
        type: String,
    },
    viewOrder: {
        type: String,
        required: true
    },
    caption: {
        type: String,
    },