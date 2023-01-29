const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const SqlRunner = require("../../common/SqlRunner");
const moment = require("moment");
const Secure = require("../../common/crypto");
const { GenerateSecretKey } = Secure;

// const storeItems = new Map([[1, { priceInCents: 10, name: "cofee" }]]);

exports.payment = async (req, res) => {
  let user = req.user;
  let body = req.body;
  const querry = `INSERT INTO payment_log (user_id, token_key, status, created_at, amount, message) VALUES (?, ?, ?, ?, ?, ?);`;

  try {
    let token = await GenerateSecretKey();
    let current_dateTime = moment().format("YYYY-MM-DD hh:mm:ss ");

    await SqlRunner(querry, [
      user.id,
      token,
      "initiated",
      current_dateTime,
      10,
      "Buy me a coffee",
    ]);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: user.name,
              description: "Buy me a coffee",
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment/${token}/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/${token}/cancel`,
    });
    res.json({
      message: "Payment initiated",
      status: 1,
      url: session.url,
      data: session,
    });
  } catch (e) {
    console.log(e.message);
    res.json({ message: "Soemthing went wrong", status: 0, error: e.message });
  }
};
