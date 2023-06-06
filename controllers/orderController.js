const Order = require("../models/order")
const Product = require("../models/product")
const Cart = require("../models/cart")
const User = require("../models/users")
const Category = require("../models/category")

module.exports = {

    checkout: async (req, res) => {
        try {
            const userId = req.user.id
            const addressIndex = req.body.addressIndex
            const user = await User.findById(userId)
            const couponDiscount = req.session.coupon?.discount
            const couponCode = req.session.coupon?.code
            const couponId = req.session.coupon?.id
            if (!addressIndex) {
                user.address.unshift({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    house: req.body.house,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    pincode: req.body.pincode,
                    phone: req.body.phone
                })
                await user.save()
            }
            const cart = await Cart.findOne({ userId: userId })
            const paymentType = req.body.paymentType
            const deliveryAddress = addressIndex ? user.address[addressIndex] : user.address[0]

            const newOrder = new Order({
                userId: userId,
                deliveryAddress: deliveryAddress,
                products: cart.products,
                quantity: cart.quantity,
                subTotal: cart.subTotal,
                total: cart.total,
                paymentType: paymentType
            })
           
            if (paymentType == "razorpay") {
                newOrder.razorpayOrderId = req.body.orderId
                newOrder.razorpayPaymentId = req.body.paymentId
            }

            //adding coupon details if applied
            if (req.session.coupon) {
                newOrder.total = cart.total - couponDiscount
                newOrder.coupon.code = couponCode
                newOrder.coupon.discount = couponDiscount

                //adding coupon to  user coupon list
                user.redeemedCoupons.push(couponId)
                await user.save()
            }

            await cart.remove()
            await newOrder.save()
            res.sendStatus(201)

        } catch (err) {
            console.log(err)
            res.sendStatus(500)

        }
    },