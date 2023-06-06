const Wishlist = require("../models/wishlist")
const Category = require("../models/category")

module.exports = {
    wishlist: async (req, res) => {
        const userId = req.user.id
        const allCategories = await Category.find();
        const findWishlist = await Wishlist.findOne({ userId: userId }).populate({
            path: "myList.productId",
            model: "Product"
        })
        res.render("master/wishlist", {
            allCategories:allCategories,
            findWishlist: findWishlist
        })
    },