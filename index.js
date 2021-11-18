const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 8080;
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

// This is a sample test API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


// MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fd87t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("WorldCactus");
        const itemsTable = database.collection("Items");
        const ordersTable = database.collection("Orders");
        const reviewsTable = database.collection("Reviews");
        const usersTable = database.collection("Users");


        // --------------// GET  // ------------------------------

        // Get all items
        app.get('/items', async (req, res) => {
            const cursor = itemsTable.find({});
            const items = await cursor.toArray();
            res.send({ items: items });
        })

        // Get all orders 
        app.get('/orders', async (req, res) => {
            const cursor = ordersTable.find({});
            const orders = await cursor.toArray();
            res.send({ orders });
        })

        // Get all reviews 
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsTable.find({});
            const reviews = await cursor.toArray();
            res.send({ reviews });
        })

        // Check and get admin email
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersTable.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // --------------// POST  // ------------------------------
        // Item post
        app.post('/items/create', async (req, res) => {
            const event = req.body;
            const result = await itemsTable.insertOne(event);
            res.json(result)
        })

        // Order post
        app.post('/orders/create', async (req, res) => {
            const order = req.body;
            const result = await ordersTable.insertOne(order);
            res.json(result)
        })

        // Reviews post
        app.post('/reviews/create', async (req, res) => {
            const reviews = req.body;
            const result = await reviewsTable.insertOne(reviews);
            res.json(result)
        })

        // Create User
        app.post('/users/create', async (req, res) => {
            const user = req.body;
            const result = await usersTable.insertOne(user);
            res.json(result);
        });

        // --------------// UPDATE // ------------------------------
        // Item update
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemsTable.findOne(query);
            res.send(result)
        })
        app.put('/items/:id', async (req, res) => {
            const id = req.params.id;
            const updateItem = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    itemName: updateItem.itemName,
                    image: updateItem.image,
                    price: updateItem.price,
                    description: updateItem.description,
                    origin: updateItem.origin,
                }
            };
            const result = await itemsTable.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        // Order update
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersTable.findOne(query);
            res.send(result)
        })
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    userName: updateOrder.userName,
                    userEmail: updateOrder.userEmail,
                    userPhone: updateOrder.userPhone,
                    userAddress: updateOrder.userAddress,
                }
            };
            const result = await ordersTable.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        // Order status update
        app.put('/orders/status/:id', async (req, res) => {
            const id = req.params.id;
            const updateSchedule = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    deliveryStatus: (updateSchedule.deliveryStatus === "pending") ? "shipped" : "pending"
                }
            };
            const result = await ordersTable.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        //Update User by google sign in / sign up
        app.put('/users/create', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersTable.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        // make a user an  admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersTable.updateOne(filter, updateDoc);
            res.json(result);
        })


        // --------------// DELETE // ------------------------------
        // Item delete
        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemsTable.deleteOne(query);
            res.json(result)
        })
        // Order delete
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersTable.deleteOne(query);
            res.json(result)
        })


        // ````````````````````User part```````````````````````````````````````

        // Get user email and check is admin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersTable.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // Add a user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersTable.insertOne(user);
            res.json(result);
        });

        // Add a user by google login
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersTable.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // Assign admin role to a user
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersTable.updateOne(filter, updateDoc);
            res.json(result);
        })

        // Stripe Payment
        app.post('/create-payment-intent', async (req, res) => {
            const paymentInfo = req.body;
            const amount = paymentInfo.totalAmount * 100;

            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                currency: 'bdt',
                amount: amount,
                payment_method_types: ['card']
            });

            res.send({ clientSecret: paymentIntent.client_secret });
        });


        //UpdatePayment Status
        app.put('/orders/successpayment/:id', async (req, res) => {
            const id = req.params.id;
            const paymentTime = req.body.paymentTime;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    paymentStatus: "paid",
                    paymentTime: paymentTime
                }
            };
            const result = await ordersTable.updateOne(filter, updateDoc, options);
            res.send(result)
        })
    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Explore The Server!!!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})