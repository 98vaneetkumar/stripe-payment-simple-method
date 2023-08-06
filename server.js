// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require('stripe')('sk_test_51NMWBQSAsyEhMcw1lbH2FjfCZ0RWEa45GicKrNltg99749IBs78tukJfgA8sqQjUVx096UvhzlKf0PuhqDyk7apv00kPfHGJiX');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:3000';

app.get('/', async (req, res) => {
  try {
    console.log("This is reqest",req.body)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [ 
        {
          price_data: {
            currency: 'INR',
            product_data: {
              name: 'Payment of AudioGuide',
            },
            unit_amount: 1000, // Replace with the amount in the smallest currency unit (e.g., cents)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // success_url: 'http://localhost:3000/success.html', // Replace with your success URL
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel.html', // Replace with your cancel URL
    });
    const session_id = session.id; // Retrieve the session_id
console.log(session_id,"sessionID");
    res.redirect(session.url);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('An error occurred during checkout.');
  }
});

app.get('/success', async (req, res) => {
  const { session_id } = req.query;

  try {
    // Use the session_id to retrieve the session details from Stripe
    // const session = await stripe.checkout.sessions.retrieve(session_id);
    const session = await stripe.checkout.sessions.retrieve(session_id);
  //  console.log("session",session);
    // Access the session object and perform further actions
    // ...
    const paymentIntentId = session.payment_intent;

    // Retrieve the payment details using the payment_intent ID
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log("Card detail",paymentIntent)
    const paymentMethodId = paymentIntent.payment_method;
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);    
    const cardDetails = {
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
      cardNumber: paymentMethod.card.number,
      // Add any other relevant card details you want to retrieve
    };

    console.log("this is detail address",paymentMethod.billing_details.address);
    console.log("this is detail email",paymentMethod.billing_details.email);
    console.log("this is detail name",paymentMethod.billing_details.name);
    console.log("this is detail phone",paymentMethod.billing_details.phone);
    console.log("this is detail card type",paymentMethod.card.brand);
    console.log("this is detaail address line1",paymentMethod.card.checks.address_line1_check);
    console.log("this is detail pin code",paymentMethod.card.checks.address_postal_code_check);
    console.log("this is detail card last digits only",paymentMethod.card.checks.last4);
    console.log("this is detail brand",paymentMethod.card.brand);
    console.log("THis si carddetails",cardDetails);


    res.send('Payment success'); // Replace with your desired response
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    res.status(500).send('An error occurred during payment retrieval.');
  }
});


app.listen(3000, () => console.log('Running on port 3000'));