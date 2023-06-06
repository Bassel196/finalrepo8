const Cart = require("../models/cart");
const Category = require("../models/category")
const User = require("../models/users")
const Product = require("../models/product")

module.exports = {
    addToCart: async (req, res) => {
        const productId = req.params.id
        const { name, price, quantity, offerPrice } = req.body;
        const userId = req.user.id
        try {

            //updating stock
            const findProduct = await Product.findById(productId)
            if (findProduct.quantity >= quantity) {
                findProduct.quantity -= quantity

                let itemTotal
                let cart = await Cart.findOne({ userId });
                if (cart) {
                    //cart exists for user
                    let itemIndex = cart.products.findIndex(product => product.productId == productId);
                    if (itemIndex != -1) {
                        //product exists in the cart, update the quantity
                        let productItem = cart.products[itemIndex];
                        productItem.quantity += quantity
                        // cart.products[itemIndex] = productItem;
                        itemTotal = offerPrice ? offerPrice * productItem.quantity : price * productItem.quantity
                    } else {
                        //product does not exists in cart, add new item
                        cart.products.push({ productId, quantity, name, price, offerPrice });
                        itemTotal = offerPrice ? offerPrice * quantity : price * quantity
                    }
                    cart.subTotal = cart.products.reduce((acc, curr) => {
                        return acc + (curr.quantity * curr.price);
                    }, 0)
                    cart.total = cart.products.reduce((acc, curr) => {
                        return acc + curr.quantity * (curr.offerPrice || curr.price);
                    }, 0)

                    await findProduct.save()
                    await cart.save();
                } else {
                    //no cart for user, create new cart
                    const subTotal = (quantity * price)
                    const total = offerPrice ? (quantity * offerPrice) : subTotal
                    cart = await Cart.create({
                        userId,
                        products: [{ productId, quantity, name, price, offerPrice }],
                        subTotal: subTotal,
                        total: total
                    });
                    await findProduct.save()
                    itemTotal = offerPrice ? offerPrice * quantity : price * quantity
                }
                //removing coupon from session if exist
                req.session.coupon = null
                return res.status(201).json({
                    message: "cart updated",
                    itemTotal: itemTotal.toFixed(2)
                })
            }
            else {
                return res.status(200).json({ message: "item not available" })
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({ err })
        }
    },

}