const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cron = require('node-cron');
const axios = require('axios');

// ১. CORS কনফিগারেশন
app.use(cors({
    origin: '*', // প্রোডাকশনে আপনার ফ্রন্টএন্ড লিঙ্ক দিন
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// ২. COOP & COEP হেডার (আপনার সমস্যার মূল সমাধান)
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
});

const uri = "mongodb+srv://petroliumDb:FlBgQ7b2SaAmBZtv@cluster0.co3ydzz.mongodb.net/petroliumDB?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // একবার কানেক্ট করলেই পুরো অ্যাপে কাজ করবে
        await client.connect();
        console.log("Connected to MongoDB");

        const petroliumDB = client.db("petroliumDB");
        const usersCollection = petroliumDB.collection("users");
        const tripsCollection = petroliumDB.collection("trips");
        const chalansCollection = petroliumDB.collection("chalans");
        const loryWorkCollection = petroliumDB.collection("loryWork");
        // ১. লরীর ডকুমেন্ট কালেকশন ডিক্লেয়ার করুন

    
        
        // উদাহরণ: ইউজার API (connectDB সরিয়ে দেওয়া হয়েছে কারণ কানেকশন উপরেই হয়েছে)
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const existingUser = await usersCollection.findOne(filter);
            
            const updateDoc = {
                $set: {
                    name: user.name,
                    email: user.email,
                    photo: user.photo,
                },
            };

            if (!existingUser) {
                updateDoc.$set.role = 'user';
            }

            const result = await usersCollection.updateOne(filter, updateDoc, { upsert: true });
            res.send(result);
        });

        // বাকি সব API...      


// ইউজারের রোল চেক করার API
        app.get('/user/role/:email', async (req, res) => {
            const email = req.params.email;
            const user = await usersCollection.findOne({ email: email });
            res.send({ role: user?.role || 'user' });
        });


        // ১. লরীর কাজ (Maintenance/Work) সেভ করার API
        app.post('/save-lory-work', async (req, res) => {
            try {
                const workData = req.body;
                // ডাটাবেজে ইনসার্ট করার আগে নিশ্চিত হয়ে নিন workData খালি না
                if (!workData.lorryNo) {
                    return res.status(400).send({ message: "লরী নম্বর প্রয়োজন" });
                }

                const result = await loryWorkCollection.insertOne(workData);
                res.status(201).send(result);
            } catch (error) {
                console.error("MongoDB Error:", error);
                res.status(500).send({ message: "সার্ভারে সমস্যা", error: error.message });
            }
        });


        // সব লরীর কাজের তালিকা পাওয়ার API
        app.get('/all-lory-works', async (req, res) => {
            try {
                // নতুন ডাটাগুলো আগে দেখানোর জন্য sort({ _id: -1 }) ব্যবহার করা হয়েছে
                const result = await loryWorkCollection.find().sort({ _id: -1 }).toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "ডাটা আনতে সমস্যা হয়েছে", error });
            }
        });


        // ২. নির্দিষ্ট লরীর সব কাজের হিস্টোরি দেখার API
        app.get('/lory-work/:lorryNo', async (req, res) => {
            const lorryNo = req.params.lorryNo;
            try {
                const result = await loryWorkCollection.find({ lorryNo: lorryNo }).sort({ date: -1 }).toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "হিস্টোরি আনতে সমস্যা হয়েছে", error });
            }
        });

        // ১. ডাটা সেভ করার জন্য POST API
        app.post('/save-trips', async (req, res) => {
            const data = req.body;
            const result = await tripsCollection.insertOne(data);
            res.send(result);
        });

        // ২. তারিখ বা গাড়ী নং দিয়ে ডাটা ফিল্টার করার জন্য GET APInpde
        app.get('/trips', async (req, res) => {
            const { date, lorryNo } = req.query;
            let query = {};

            if (date) query.date = date;
            // যদি নেস্টেড রো-এর ভেতর গাড়ী নং খুঁজতে চান:
            if (lorryNo) query["rows.lorryNo"] = lorryNo;

            const result = await tripsCollection.find(query).toArray();
            res.send(result);
        });

        // ৩. নির্দিষ্ট গাড়ীর সাম্প্রতিক ট্রিপ দেখার API
        app.get('/trips/:lorryNo', async (req, res) => {
            const lorryNo = req.params.lorryNo;
            try {
                // এই কুয়েরিটি ওই গাড়ীর সব ট্রিপ খুঁজে বের করবে
                const result = await tripsCollection.find({ "rows.lorryNo": lorryNo }).sort({ date: -1 }).limit(5).toArray();

                // শুধু ওই নির্দিষ্ট গাড়ির রো-গুলো আলাদা করা
                const recentTrips = result.flatMap(trip =>
                    trip.rows.filter(row => row.lorryNo === lorryNo).map(row => ({
                        date: trip.date,
                        dipoName: trip.dipoName,
                        driverName: row.driverName,
                        totalAmount: row.totalAmount
                    }))
                );

                res.send(recentTrips);
            } catch (error) {
                res.status(500).send({ message: "Error fetching recent trips", error });
            }
        });

        // ১. নতুন চালান সেভ বা আপডেট করার API
        app.post('/chalans', async (req, res) => {
            const { date, companyName, entries } = req.body;
            try {
                // একই তারিখের ডাটা থাকলে সেটা আপডেট হবে, না থাকলে নতুন তৈরি হবে (Upsert)
                const filter = { date: date };
                const updateDoc = {
                    $set: {
                        date,
                        companyName,
                        entries
                    },
                };
                const options = { upsert: true };
                const result = await chalansCollection.updateOne(filter, updateDoc, options);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "চালান সেভ করতে সমস্যা হয়েছে", error });
            }
        });

        // ২. নির্দিষ্ট তারিখের চালান খুঁজে বের করার API
        app.get('/chalans/:date', async (req, res) => {
            const date = req.params.date;
            try {
                const query = { date: date };
                const result = await chalansCollection.findOne(query);
                if (result) {
                    res.send(result);
                } else {
                    res.send({ entries: [], companyName: 'মেসার্স ফাতেমা নাজ পেট্রোলিয়াম' });
                }
            } catch (error) {
                res.status(500).send({ message: "ডাটা আনতে সমস্যা হয়েছে", error });
            }
        });

        // Ping Check
        await client.db("admin").command({ ping: 1 });
    } catch (error) {
        console.error("Connection Error:", error);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Petrolium Server is running...');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



