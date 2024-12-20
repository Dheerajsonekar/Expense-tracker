const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");
const Payment = require("../models/Payment");
const sequilize = require("../util/database");

const razorpay = new Razorpay({
  key_id: process.env.razorPay_key_id,
  key_secret: process.env.razorPay_key_secret,
});

exports.createOrder = async (req, res) => {
  try {
    const amount = 100;
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
    });

    return res.status(200).json({
      orderId: order.id,
      key: process.env.razorPay_key_id,
    });
  } catch (err) {
    console.error("failed to create razorpay order", err);
    return res.status(500).json({ message: "failed to create order!" });
  }
};

exports.verifyPayment = async (req, res) => {
  const t = await Sequelize.transaction();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.razorPay_key_secret)
      .update(body)
      .digest("hex");

      if(expectedSignature != razorpay_signature){
        return res.status(400).json({message:"Payment verification failed"})
      }

      const userId = req.user.id;
      await User.update({isPremium: true}, {where:{id: userId}})
     

      await Payment.create({
        id: razorpay_order_id,
        userId,
        amount: 100,
        status: "success"
      },{transaction: t})

      await t.commit();

      return res.status(200).json({message: "Payment verification successfull"});


  } catch (err) {

    await t.rollback();
    console.error('Error in verifying payment', err)
    return res.status(500).json({message: "Payment verification failed"})
  }
};
