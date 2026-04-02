const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cron = require('node-cron');
const axios = require('axios');

// ১. CORS কনফিগারেশন
// app.use(cors({
//     origin: '*', // প্রোডাকশনে আপনার ফ্রন্টএন্ড লিঙ্ক দিন
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
// }));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://www.ashrafulenterprise.com",
    "https://ashrafulenterprise.com",
    "https://admin.ashrafulenterprise.com"
  ],
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
// const uri = "mongodb+srv://fatemaimamDB:1VU433bh8NCG8Vro@cluster0.co3ydzz.mongodb.net/?appName=Cluster0";


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

require('dotenv').config(); // অবশ্যই এটি যোগ করবেন

async function run() {
    try {
        // একবার কানেক্ট করলেই পুরো অ্যাপে কাজ করবে
        await client.connect();
        console.log("Connected to MongoDB");

        const petroliumDB = client.db("petroliumDB");
        const usersFatemaCollection = petroliumDB.collection("users");
        const tripsFatemaCollection = petroliumDB.collection("trips");
        const tripsImamCollection = petroliumDB.collection("tripsImam");
        const tripsSahenaCollection = petroliumDB.collection("tripsSahena");
        const chalansFatemaCollection = petroliumDB.collection("chalans");
        const chalansImamCollection = petroliumDB.collection("chalansImam");
        const chalansSahenaCollection = petroliumDB.collection("chalansSahena");
        const loryWorkFatemaCollection = petroliumDB.collection("loryWork");
        const loryWorkImamCollection = petroliumDB.collection("loryWorkImam");
        const loryWorkSahenaCollection = petroliumDB.collection("loryWorkSahena");
        const loryDetailsCollection = petroliumDB.collection("loryDetails");
        const loryDetailsImamCollection = petroliumDB.collection("loryDetailsImam");
        const loryDetailsSahenaCollection = petroliumDB.collection("loryDetailsSahena");

        const settingsCollection = petroliumDB.collection("settings");



// ২. ডিলিট রাউটটি এভাবে আপডেট করুন
app.delete('/delete-lory-work/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // আইডি চেক
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ success: false, message: "ভুল আইডি ফরম্যাট" });
        }

        const query = { _id: new ObjectId(id) };
        
        // আপনার ব্যাকএন্ডে ডিফাইন করা সঠিক কালেকশন ভেরিয়েবল ব্যবহার করুন
        const result = await loryWorkFatemaCollection.deleteOne(query);
        
        if (result.deletedCount === 1) {
            res.send({ success: true, message: "রেকর্ডটি সফলভাবে ডিলিট হয়েছে" });
        } else {
            res.status(404).send({ success: false, message: "কোনো রেকর্ড পাওয়া যায়নি" });
        }
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).send({ success: false, message: "সার্ভারে ইন্টারনাল এরর" });
    }
});



// ২. ডিলিট রাউটটি এভাবে আপডেট করুন imam
app.delete('/delete-lory-work-imam/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // আইডি চেক
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ success: false, message: "ভুল আইডি ফরম্যাট" });
        }

        const query = { _id: new ObjectId(id) };
        
        // আপনার ব্যাকএন্ডে ডিফাইন করা সঠিক কালেকশন ভেরিয়েবল ব্যবহার করুন
        const result = await loryWorkImamCollection.deleteOne(query);
        
        if (result.deletedCount === 1) {
            res.send({ success: true, message: "রেকর্ডটি সফলভাবে ডিলিট হয়েছে" });
        } else {
            res.status(404).send({ success: false, message: "কোনো রেকর্ড পাওয়া যায়নি" });
        }
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).send({ success: false, message: "সার্ভারে ইন্টারনাল এরর" });
    }
});






// ২. ডিলিট রাউটটি এভাবে আপডেট করুন sahena
app.delete('/delete-lory-work-sahena/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // আইডি চেক
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ success: false, message: "ভুল আইডি ফরম্যাট" });
        }

        const query = { _id: new ObjectId(id) };
        
        // আপনার ব্যাকএন্ডে ডিফাইন করা সঠিক কালেকশন ভেরিয়েবল ব্যবহার করুন
        const result = await loryWorkSahenaCollection.deleteOne(query);
        
        if (result.deletedCount === 1) {
            res.send({ success: true, message: "রেকর্ডটি সফলভাবে ডিলিট হয়েছে" });
        } else {
            res.status(404).send({ success: false, message: "কোনো রেকর্ড পাওয়া যায়নি" });
        }
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).send({ success: false, message: "সার্ভারে ইন্টারনাল এরর" });
    }
});








        // --- ১. নির্দিষ্ট লরীর বর্তমান ডাটা ফেচ করার API ---
app.get('/lory-details/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // এখানে id বলতে লরী নম্বরকে বোঝানো হচ্ছে
        const query = { loryNumber: id };
        const result = await loryDetailsCollection.findOne(query);
        
        if (result) {
            res.send(result);
        } else {
            // যদি ডাটা না থাকে তবে খালি অবজেক্ট পাঠানো হচ্ছে যাতে ফ্রন্টএন্ড এরর না খায়
            res.send({
                taxToken: '',
                fitness: '',
                routePermit: '',
                registration: '',
                calibration: '',
                exclusive: ''
            });
        }
    } catch (error) {
        res.status(500).send({ message: "ডাটা আনতে সমস্যা হয়েছে", error });
    }
});



        // --- ১. নির্দিষ্ট লরীর বর্তমান ডাটা ফেচ করার API --- Imam
app.get('/lory-details-imam/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // এখানে id বলতে লরী নম্বরকে বোঝানো হচ্ছে
        const query = { loryNumber: id };
        const result = await loryDetailsImamCollection.findOne(query);
        
        if (result) {
            res.send(result);
        } else {
            // যদি ডাটা না থাকে তবে খালি অবজেক্ট পাঠানো হচ্ছে যাতে ফ্রন্টএন্ড এরর না খায়
            res.send({
                taxToken: '',
                fitness: '',
                routePermit: '',
                registration: '',
                calibration: '',
                exclusive: ''
            });
        }
    } catch (error) {
        res.status(500).send({ message: "ডাটা আনতে সমস্যা হয়েছে", error });
    }
});




 // --- ১. নির্দিষ্ট লরীর বর্তমান ডাটা ফেচ করার API --- sahena
app.get('/lory-details-sahena/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // এখানে id বলতে লরী নম্বরকে বোঝানো হচ্ছে
        const query = { loryNumber: id };
        const result = await loryDetailsSahenaCollection.findOne(query);
        
        if (result) {
            res.send(result);
        } else {
            // যদি ডাটা না থাকে তবে খালি অবজেক্ট পাঠানো হচ্ছে যাতে ফ্রন্টএন্ড এরর না খায়
            res.send({
                taxToken: '',
                fitness: '',
                routePermit: '',
                registration: '',
                calibration: '',
                exclusive: ''
            });
        }
    } catch (error) {
        res.status(500).send({ message: "ডাটা আনতে সমস্যা হয়েছে", error });
    }
});





// --- ২. লরীর ডাটা আপডেট বা সেভ করার API ---
app.put('/edit-lory/:id', async (req, res) => {
    const id = req.params.id; // এটি লরী নম্বর
    const updatedData = req.body;

    try {
        const filter = { loryNumber: id }; // loryNumber দিয়ে খোঁজা হচ্ছে
        const updateDoc = {
            $set: updatedData, // সরাসরি বডি সেট করা হচ্ছে
        };

        const result = await loryDetailsCollection.updateOne(filter, updateDoc, { upsert: true });
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Server Error", error });
    }
});



// --- ২. লরীর ডাটা আপডেট বা সেভ করার API --- Imam
app.put('/edit-lory-imam/:id', async (req, res) => {
    const id = req.params.id; // এটি লরী নম্বর
    const updatedData = req.body;

    try {
        const filter = { loryNumber: id }; // loryNumber দিয়ে খোঁজা হচ্ছে
        const updateDoc = {
            $set: updatedData, // সরাসরি বডি সেট করা হচ্ছে
        };

        const result = await loryDetailsImamCollection.updateOne(filter, updateDoc, { upsert: true });
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Server Error", error });
    }
});




// --- ২. লরীর ডাটা আপডেট বা সেভ করার API --- sahena
app.put('/edit-lory-sahena/:id', async (req, res) => {
    const id = req.params.id; // এটি লরী নম্বর
    const updatedData = req.body;

    try {
        const filter = { loryNumber: id }; // loryNumber দিয়ে খোঁজা হচ্ছে
        const updateDoc = {
            $set: updatedData, // সরাসরি বডি সেট করা হচ্ছে
        };

        const result = await loryDetailsSahenaCollection.updateOne(filter, updateDoc, { upsert: true });
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Server Error", error });
    }
});





        // ১. মাস্টার পাসওয়ার্ড আপডেট করার API (Admin Only)
app.post('/api/admin/update-master-password', async (req, res) => {
    const { newPassword, adminEmail } = req.body;

    try {
        // রিকোয়েস্টকারী অ্যাডমিন কি না তা যাচাই করা
        const admin = await usersFatemaCollection.findOne({ email: adminEmail });
        if (admin?.role !== 'admin') {
            return res.status(403).send({ message: "অ্যাক্সেস নিষিদ্ধ! আপনি অ্যাডমিন নন।" });
        }

        const filter = { key: "master_password" };
        const updateDoc = { $set: { value: newPassword } };
        const options = { upsert: true };

        const result = await settingsCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে" });
    }
});





// ২. মাস্টার পাসওয়ার্ড ভেরিফাই করার API
app.post('/api/verify-master-password', async (req, res) => {
    const { password } = req.body;

    try {
        const config = await settingsCollection.findOne({ key: "master_password" });
        
        // যদি ডাটাবেজে পাসওয়ার্ড থাকে এবং ইনপুট পাসওয়ার্ডের সাথে মিলে যায়
        if (config && config.value === password) {
            res.send({ success: true });
        } else {
            res.send({ success: false, message: "ভুল পাসওয়ার্ড!" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "ভেরিফিকেশন ব্যর্থ হয়েছে" });
    }
});








        // ১. লরীর ডকুমেন্ট কালেকশন ডিক্লেয়ার করুন

    
        
        // উদাহরণ: ইউজার API (connectDB সরিয়ে দেওয়া হয়েছে কারণ কানেকশন উপরেই হয়েছে)
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const existingUser = await usersFatemaCollection.findOne(filter);
            
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

            const result = await usersFatemaCollection.updateOne(filter, updateDoc, { upsert: true });
            res.send(result);
        });

        // বাকি সব API...      


// ইউজারের রোল চেক করার API
        app.get('/user/role/:email', async (req, res) => {
            const email = req.params.email;
            const user = await usersFatemaCollection.findOne({ email: email });
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

                const result = await loryWorkFatemaCollection.insertOne(workData);
                res.status(201).send(result);
            } catch (error) {
                console.error("MongoDB Error:", error);
                res.status(500).send({ message: "সার্ভারে সমস্যা", error: error.message });
            }
        });


        // ১. লরীর কাজ (Maintenance/Work) সেভ করার API Imam
        app.post('/save-lory-work-imam', async (req, res) => {
            try {
                const workData = req.body;
                // ডাটাবেজে ইনসার্ট করার আগে নিশ্চিত হয়ে নিন workData খালি না
                if (!workData.lorryNo) {
                    return res.status(400).send({ message: "লরী নম্বর প্রয়োজন" });
                }

                const result = await loryWorkImamCollection.insertOne(workData);
                res.status(201).send(result);
            } catch (error) {
                console.error("MongoDB Error:", error);
                res.status(500).send({ message: "সার্ভারে সমস্যা", error: error.message });
            }
        });



        // ১. লরীর কাজ (Maintenance/Work) সেভ করার API Saena
        app.post('/save-lory-work-sahena', async (req, res) => {
            try {
                const workData = req.body;
                // ডাটাবেজে ইনসার্ট করার আগে নিশ্চিত হয়ে নিন workData খালি না
                if (!workData.lorryNo) {
                    return res.status(400).send({ message: "লরী নম্বর প্রয়োজন" });
                }

                const result = await loryWorkSahenaCollection.insertOne(workData);
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
                const result = await loryWorkFatemaCollection.find().sort({ _id: -1 }).toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "ডাটা আনতে সমস্যা হয়েছে", error });
            }
        });

        // সব লরীর কাজের তালিকা পাওয়ার API Imam
app.get('/all-lory-works-imam', async (req, res) => {
    try {
        // নতুন ডাটাগুলো আগে দেখানোর জন্য sort({ _id: -1 }) ব্যবহার করা হয়েছে
        const result = await loryWorkImamCollection.find().sort({ _id: -1 }).toArray();
        res.send(result);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).send({ message: "ডাটা আনতে সমস্যা হয়েছে", error });
    }
});

// সব লরীর কাজের তালিকা পাওয়ার API Sahena (যদি প্রয়োজন হয়)
app.get('/all-lory-works-sahena', async (req, res) => {
    try {
        const result = await loryWorkSahenaCollection.find().sort({ _id: -1 }).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "ডাটা আনতে সমস্যা হয়েছে", error });
    }
});





        // ২. নির্দিষ্ট লরীর সব কাজের হিস্টোরি দেখার API
        app.get('/lory-work/:lorryNo', async (req, res) => {
            const lorryNo = req.params.lorryNo;
            try {
                const result = await loryWorkFatemaCollection.find({ lorryNo: lorryNo }).sort({ date: -1 }).toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "হিস্টোরি আনতে সমস্যা হয়েছে", error });
            }
        });


        
        // ২. নির্দিষ্ট লরীর সব কাজের হিস্টোরি দেখার API Imam
        app.get('/lory-work-imam/:lorryNo', async (req, res) => {
            const lorryNo = req.params.lorryNo;
            try {
                const result = await loryWorkImamCollection.find({ lorryNo: lorryNo }).sort({ date: -1 }).toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "হিস্টোরি আনতে সমস্যা হয়েছে", error });
            }
        });




        // ২. নির্দিষ্ট লরীর সব কাজের হিস্টোরি দেখার API Sahena
        app.get('/lory-work-sahena/:lorryNo', async (req, res) => {
            const lorryNo = req.params.lorryNo;
            try {
                const result = await loryWorkSahenaCollection.find({ lorryNo: lorryNo }).sort({ date: -1 }).toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "হিস্টোরি আনতে সমস্যা হয়েছে", error });
            }
        });





        // ১. ডাটা সেভ করার জন্য POST API Fatema
        app.post('/save-trips', async (req, res) => {
            const data = req.body;
            const result = await tripsFatemaCollection.insertOne(data);
            res.send(result);
        });

         // ১. ডাটা সেভ করার জন্য POST API Imam Hossen
        app.post('/save-trips-imam', async (req, res) => {
            const data = req.body;
            const result = await tripsImamCollection.insertOne(data);
            res.send(result);
        });

        // ১. ডাটা সেভ করার জন্য POST API Sahena
        app.post('/save-trips-sahena', async (req, res) => {
            const data = req.body;
            const result = await tripsSahenaCollection.insertOne(data);
            res.send(result);
        });


        // ২. তারিখ বা গাড়ী নং দিয়ে ডাটা ফিল্টার করার জন্য GET APInpde
        app.get('/trips', async (req, res) => {
            const { date, lorryNo } = req.query;
            let query = {};

            if (date) query.date = date;
            // যদি নেস্টেড রো-এর ভেতর গাড়ী নং খুঁজতে চান:
            if (lorryNo) query["rows.lorryNo"] = lorryNo;

            const result = await tripsFatemaCollection.find(query).toArray();
            res.send(result);
        });

        // ২. তারিখ বা গাড়ী নং দিয়ে ডাটা ফিল্টার করার জন্য GET APInpde Imam Hossen 
        app.get('/trips-imam', async (req, res) => {
            const { date, lorryNo } = req.query;
            let query = {};

            if (date) query.date = date;
            // যদি নেস্টেড রো-এর ভেতর গাড়ী নং খুঁজতে চান:
            if (lorryNo) query["rows.lorryNo"] = lorryNo;

            const result = await tripsImamCollection.find(query).toArray();
            res.send(result);
        });

          // ২. তারিখ বা গাড়ী নং দিয়ে ডাটা ফিল্টার করার জন্য GET APInpde
        app.get('/trips-sahena', async (req, res) => {
            const { date, lorryNo } = req.query;
            let query = {};

            if (date) query.date = date;
            // যদি নেস্টেড রো-এর ভেতর গাড়ী নং খুঁজতে চান:
            if (lorryNo) query["rows.lorryNo"] = lorryNo;

            const result = await tripsSahenaCollection.find(query).toArray();
            res.send(result);
        });




        // ৩. নির্দিষ্ট গাড়ীর সাম্প্রতিক ট্রিপ দেখার API
        app.get('/trips/:lorryNo', async (req, res) => {
            const lorryNo = req.params.lorryNo;
            try {
                // এই কুয়েরিটি ওই গাড়ীর সব ট্রিপ খুঁজে বের করবে
                const result = await tripsFatemaCollection.find({ "rows.lorryNo": lorryNo }).sort({ date: -1 }).limit(5).toArray();

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

        // ৩. নির্দিষ্ট গাড়ীর সাম্প্রতিক ট্রিপ দেখার API
        app.get('/trips-imam/:lorryNo', async (req, res) => {
            const lorryNo = req.params.lorryNo;
            try {
                // এই কুয়েরিটি ওই গাড়ীর সব ট্রিপ খুঁজে বের করবে
                const result = await tripsImamCollection.find({ "rows.lorryNo": lorryNo }).sort({ date: -1 }).limit(5).toArray();

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

// ৩. নির্দিষ্ট গাড়ীর সাম্প্রতিক ট্রিপ দেখার API
        app.get('/trips-sahena/:lorryNo', async (req, res) => {
            const lorryNo = req.params.lorryNo;
            try {
                // এই কুয়েরিটি ওই গাড়ীর সব ট্রিপ খুঁজে বের করবে
                const result = await tripsSahenaCollection.find({ "rows.lorryNo": lorryNo }).sort({ date: -1 }).limit(5).toArray();

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
                const result = await chalansFatemaCollection.updateOne(filter, updateDoc, options);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "চালান সেভ করতে সমস্যা হয়েছে", error });
            }
        });


         // ১. নতুন চালান সেভ বা আপডেট করার API Imam Hossen
        app.post('/chalans-imam', async (req, res) => {
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
                const result = await chalansImamCollection.updateOne(filter, updateDoc, options);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "চালান সেভ করতে সমস্যা হয়েছে", error });
            }
        });



        // ১. নতুন চালান সেভ বা আপডেট করার API Sahena
        app.post('/chalans-sahena', async (req, res) => {
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
                const result = await chalansSahenaCollection.updateOne(filter, updateDoc, options);
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
                const result = await chalansFatemaCollection.findOne(query);
                if (result) {
                    res.send(result);
                } else {
                    res.send({ entries: [], companyName: 'মেসার্স ফাতেমা নাজ পেট্রোলিয়াম' });
                }
            } catch (error) {
                res.status(500).send({ message: "ডাটা আনতে সমস্যা হয়েছে", error });
            }
        });



        
        // ২. নির্দিষ্ট তারিখের চালান খুঁজে বের করার API Imam
        app.get('/chalans-imam/:date', async (req, res) => {
            const date = req.params.date;
            try {
                const query = { date: date };
                const result = await chalansImamCollection.findOne(query);
                if (result) {
                    res.send(result);
                } else {
                    res.send({ entries: [], companyName: 'মেসার্স ফাতেমা নাজ পেট্রোলিয়াম' });
                }
            } catch (error) {
                res.status(500).send({ message: "ডাটা আনতে সমস্যা হয়েছে", error });
            }
        });



        // ২. নির্দিষ্ট তারিখের চালান খুঁজে বের করার API sahena
        app.get('/chalans-sahena/:date', async (req, res) => {
            const date = req.params.date;
            try {
                const query = { date: date };
                const result = await chalansSahenaCollection.findOne(query);
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



