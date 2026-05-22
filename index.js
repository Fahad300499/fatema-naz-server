const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();


app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://www.ashrafulenterprise.com",
    "https://ashrafulenterprise.com",
    "https://admin.ashrafulenterprise.com",
    "https://fatema-naz-client-m6nl.vercel.app",
    "https://fatema-naz-client-m7nl.vercel.app",


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

const uri = process.env.MONGODB_URI;
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
        const tripsDibaCollection = petroliumDB.collection("tripsDiba");
        const chalansFatemaCollection = petroliumDB.collection("chalans");
        const chalansImamCollection = petroliumDB.collection("chalansImam");
        const chalansSahenaCollection = petroliumDB.collection("chalansSahena");
        const chalansDibaCollection = petroliumDB.collection("chalansDiba");

        const shortsFatemaCollection = petroliumDB.collection("shorts");
        const shortsImamCollection = petroliumDB.collection("shortsImam");
        const shortsSahenaCollection = petroliumDB.collection("shortsSahena");
        const shortsDibaCollection = petroliumDB.collection("shortsDiba");


        const loryWorkFatemaCollection = petroliumDB.collection("loryWork");
        const loryWorkImamCollection = petroliumDB.collection("loryWorkImam");
        const loryWorkSahenaCollection = petroliumDB.collection("loryWorkSahena");
        const loryWorkDibaCollection = petroliumDB.collection("loryWorkDiba");
        const loryDetailsCollection = petroliumDB.collection("loryDetails");
        const loryDetailsImamCollection = petroliumDB.collection("loryDetailsImam");
        const loryDetailsSahenaCollection = petroliumDB.collection("loryDetailsSahena");
        const loryDetailsDibaCollection = petroliumDB.collection("loryDetailsDiba");

        const settingsCollection = petroliumDB.collection("settings");






        app.get('/users', async (req, res) => {
    try {
        const result = await usersFatemaCollection.find().toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "ইউজার তালিকা আনতে সমস্যা হয়েছে" });
    }
});

// ২. রোল পরিবর্তন করার API 
app.put('/users/role/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { role } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: { role: role } };
        const result = await usersFatemaCollection.updateOne(filter, updateDoc);
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "রোল পরিবর্তন করা সম্ভব হয়নি" });
    }
});

// ৩. ইউজার ডিলিট করার API 
app.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await usersFatemaCollection.deleteOne(query);
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "ইউজার ডিলিট করা সম্ভব হয়নি" });
    }
});






             app.get('/all-lories', async (req, res) => {
    try {
        // শুধু loryNumber ফিল্ডটি প্রোজেকশন করে নিয়ে আসা হচ্ছে
        const result = await loryDetailsCollection.find({}, { projection: { loryNumber: 1, _id: 0 } }).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching lories:", error);
        res.status(500).send({ message: "গাড়ির তালিকা আনতে সমস্যা হয়েছে" });
    }
});

// --- ২. নতুন গাড়ি যুক্ত করার API (Diba) ---
app.post('/add-lory', async (req, res) => {
    try {
        const { loryNumber } = req.body;
        
        if (!loryNumber) {
            return res.status(400).send({ success: false, message: "গাড়ির নম্বর প্রয়োজন" });
        }

        // চেক করা হচ্ছে গাড়িটি আগে থেকেই আছে কিনা
        const exists = await loryDetailsCollection.findOne({ loryNumber });
        if (exists) {
            return res.status(400).send({ success: false, message: "এই গাড়িটি আগেই যুক্ত করা হয়েছে" });
        }

        const newLory = {
            loryNumber,
            taxToken: '',
            fitness: '',
            routePermit: '',
            registration: '',
            calibration: '',
            exclusive: '',
            createdAt: new Date()
        };

        const result = await loryDetailsCollection.insertOne(newLory);
        if (result.insertedId) {
            res.send({ success: true, message: "গাড়িটি সফলভাবে যুক্ত হয়েছে" });
        }
    } catch (error) {
        console.error("Error adding lory:", error);
        res.status(500).send({ success: false, message: "সার্ভারে সমস্যা হয়েছে" });
    }
});




// ৪. নির্দিষ্ট গাড়ি ডিলিট করার API (Imam)
app.delete('/delete-lory/:number', async (req, res) => {
    try {
        const loryNumber = req.params.number;
        console.log("Attempting to delete lory:", loryNumber); // এটি দিয়ে চেক করুন সার্ভারে রিকোয়েস্ট আসছে কি না

        const query = { loryNumber: loryNumber };
        const result = await loryDetailsCollection.deleteOne(query);
        
        if (result.deletedCount === 1) {
            res.send({ success: true, message: "গাড়িটি সফলভাবে ডিলিট হয়েছে" });
        } else {
            console.log("No document found with number:", loryNumber);
            res.status(404).send({ success: false, message: "গাড়িটি ডাটাবেজে পাওয়া যায়নি" });
        }
    } catch (error) {
        console.error("Lory Delete Error:", error);
        res.status(500).send({ success: false, message: "সার্ভারে সমস্যা হয়েছে" });
    }
});









            app.get('/all-lories-imam', async (req, res) => {
    try {
        // শুধু loryNumber ফিল্ডটি প্রোজেকশন করে নিয়ে আসা হচ্ছে
        const result = await loryDetailsImamCollection.find({}, { projection: { loryNumber: 1, _id: 0 } }).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching lories:", error);
        res.status(500).send({ message: "গাড়ির তালিকা আনতে সমস্যা হয়েছে" });
    }
});

// --- ২. নতুন গাড়ি যুক্ত করার API (Diba) ---
app.post('/add-lory-imam', async (req, res) => {
    try {
        const { loryNumber } = req.body;
        
        if (!loryNumber) {
            return res.status(400).send({ success: false, message: "গাড়ির নম্বর প্রয়োজন" });
        }

        // চেক করা হচ্ছে গাড়িটি আগে থেকেই আছে কিনা
        const exists = await loryDetailsImamCollection.findOne({ loryNumber });
        if (exists) {
            return res.status(400).send({ success: false, message: "এই গাড়িটি আগেই যুক্ত করা হয়েছে" });
        }

        const newLory = {
            loryNumber,
            taxToken: '',
            fitness: '',
            routePermit: '',
            registration: '',
            calibration: '',
            exclusive: '',
            createdAt: new Date()
        };

        const result = await loryDetailsImamCollection.insertOne(newLory);
        if (result.insertedId) {
            res.send({ success: true, message: "গাড়িটি সফলভাবে যুক্ত হয়েছে" });
        }
    } catch (error) {
        console.error("Error adding lory:", error);
        res.status(500).send({ success: false, message: "সার্ভারে সমস্যা হয়েছে" });
    }
});




// ৪. নির্দিষ্ট গাড়ি ডিলিট করার API (Imam)
app.delete('/delete-lory-imam/:number', async (req, res) => {
    try {
        const loryNumber = req.params.number;
        const query = { loryNumber: loryNumber };
        
        const result = await loryDetailsImamCollection.deleteOne(query);
        
        if (result.deletedCount === 1) {
            res.send({ success: true, message: "গাড়িটি সফলভাবে ডিলিট হয়েছে" });
        } else {
            res.status(404).send({ success: false, message: "গাড়িটি পাওয়া যায়নি" });
        }
    } catch (error) {
        console.error("Lory Delete Error:", error);
        res.status(500).send({ success: false, message: "সার্ভারে সমস্যা হয়েছে" });
    }
});











        app.get('/all-lories-sahena', async (req, res) => {
    try {
        // শুধু loryNumber ফিল্ডটি প্রোজেকশন করে নিয়ে আসা হচ্ছে
        const result = await loryDetailsSahenaCollection.find({}, { projection: { loryNumber: 1, _id: 0 } }).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching lories:", error);
        res.status(500).send({ message: "গাড়ির তালিকা আনতে সমস্যা হয়েছে" });
    }
});

// --- ২. নতুন গাড়ি যুক্ত করার API (Diba) ---
app.post('/add-lory-sahena', async (req, res) => {
    try {
        const { loryNumber } = req.body;
        
        if (!loryNumber) {
            return res.status(400).send({ success: false, message: "গাড়ির নম্বর প্রয়োজন" });
        }

        // চেক করা হচ্ছে গাড়িটি আগে থেকেই আছে কিনা
        const exists = await loryDetailsSahenaCollection.findOne({ loryNumber });
        if (exists) {
            return res.status(400).send({ success: false, message: "এই গাড়িটি আগেই যুক্ত করা হয়েছে" });
        }

        const newLory = {
            loryNumber,
            taxToken: '',
            fitness: '',
            routePermit: '',
            registration: '',
            calibration: '',
            exclusive: '',
            createdAt: new Date()
        };

        const result = await loryDetailsSahenaCollection.insertOne(newLory);
        if (result.insertedId) {
            res.send({ success: true, message: "গাড়িটি সফলভাবে যুক্ত হয়েছে" });
        }
    } catch (error) {
        console.error("Error adding lory:", error);
        res.status(500).send({ success: false, message: "সার্ভারে সমস্যা হয়েছে" });
    }
});




// ৪. নির্দিষ্ট গাড়ি ডিলিট করার API (Diba)
app.delete('/delete-lory-sahena/:number', async (req, res) => {
    try {
        const loryNumber = req.params.number;
        const query = { loryNumber: loryNumber };
        
        const result = await loryDetailsSahenaCollection.deleteOne(query);
        
        if (result.deletedCount === 1) {
            res.send({ success: true, message: "গাড়িটি সফলভাবে ডিলিট হয়েছে" });
        } else {
            res.status(404).send({ success: false, message: "গাড়িটি পাওয়া যায়নি" });
        }
    } catch (error) {
        console.error("Lory Delete Error:", error);
        res.status(500).send({ success: false, message: "সার্ভারে সমস্যা হয়েছে" });
    }
});














        // --- ১. সব গাড়ির লিস্ট নিয়ে আসার API (Diba) ---
app.get('/all-lories-diba', async (req, res) => {
    try {
        // শুধু loryNumber ফিল্ডটি প্রোজেকশন করে নিয়ে আসা হচ্ছে
        const result = await loryDetailsDibaCollection.find({}, { projection: { loryNumber: 1, _id: 0 } }).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching lories:", error);
        res.status(500).send({ message: "গাড়ির তালিকা আনতে সমস্যা হয়েছে" });
    }
});

// --- ২. নতুন গাড়ি যুক্ত করার API (Diba) ---
app.post('/add-lory-diba', async (req, res) => {
    try {
        const { loryNumber } = req.body;
        
        if (!loryNumber) {
            return res.status(400).send({ success: false, message: "গাড়ির নম্বর প্রয়োজন" });
        }

        // চেক করা হচ্ছে গাড়িটি আগে থেকেই আছে কিনা
        const exists = await loryDetailsDibaCollection.findOne({ loryNumber });
        if (exists) {
            return res.status(400).send({ success: false, message: "এই গাড়িটি আগেই যুক্ত করা হয়েছে" });
        }

        const newLory = {
            loryNumber,
            taxToken: '',
            fitness: '',
            routePermit: '',
            registration: '',
            calibration: '',
            exclusive: '',
            createdAt: new Date()
        };

        const result = await loryDetailsDibaCollection.insertOne(newLory);
        if (result.insertedId) {
            res.send({ success: true, message: "গাড়িটি সফলভাবে যুক্ত হয়েছে" });
        }
    } catch (error) {
        console.error("Error adding lory:", error);
        res.status(500).send({ success: false, message: "সার্ভারে সমস্যা হয়েছে" });
    }
});




// ৪. নির্দিষ্ট গাড়ি ডিলিট করার API (Diba)
app.delete('/delete-lory-diba/:number', async (req, res) => {
    try {
        const loryNumber = req.params.number;
        const query = { loryNumber: loryNumber };
        
        const result = await loryDetailsDibaCollection.deleteOne(query);
        
        if (result.deletedCount === 1) {
            res.send({ success: true, message: "গাড়িটি সফলভাবে ডিলিট হয়েছে" });
        } else {
            res.status(404).send({ success: false, message: "গাড়িটি পাওয়া যায়নি" });
        }
    } catch (error) {
        console.error("Lory Delete Error:", error);
        res.status(500).send({ success: false, message: "সার্ভারে সমস্যা হয়েছে" });
    }
});












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




// ২. ডিলিট রাউটটি এভাবে আপডেট করুন Diba
app.delete('/delete-lory-work-diba/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // আইডি চেক
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ success: false, message: "ভুল আইডি ফরম্যাট" });
        }

        const query = { _id: new ObjectId(id) };
        
        // আপনার ব্যাকএন্ডে ডিফাইন করা সঠিক কালেকশন ভেরিয়েবল ব্যবহার করুন
        const result = await loryWorkDibaCollection.deleteOne(query);
        
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



// --- ১. নির্দিষ্ট লরীর বর্তমান ডাটা ফেচ করার API --- diba
app.get('/lory-details-diba/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // এখানে id বলতে লরী নম্বরকে বোঝানো হচ্ছে
        const query = { loryNumber: id };
        const result = await loryDetailsDibaCollection.findOne(query);
        
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





// --- ২. লরীর ডাটা আপডেট বা সেভ করার API --- Diba
app.put('/edit-lory-diba/:id', async (req, res) => {
    const id = req.params.id; // এটি লরী নম্বর
    const updatedData = req.body;

    try {
        const filter = { loryNumber: id }; // loryNumber দিয়ে খোঁজা হচ্ছে
        const updateDoc = {
            $set: updatedData, // সরাসরি বডি সেট করা হচ্ছে
        };

        const result = await loryDetailsDibaCollection.updateOne(filter, updateDoc, { upsert: true });
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






        // ১. লরীর কাজ (Maintenance/Work) সেভ করার API diba
        app.post('/save-lory-work-diba', async (req, res) => {
            try {
                const workData = req.body;
                // ডাটাবেজে ইনসার্ট করার আগে নিশ্চিত হয়ে নিন workData খালি না
                if (!workData.lorryNo) {
                    return res.status(400).send({ message: "লরী নম্বর প্রয়োজন" });
                }

                const result = await loryWorkDibaCollection.insertOne(workData);
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





// সব লরীর কাজের তালিকা পাওয়ার API Diba (যদি প্রয়োজন হয়)
app.get('/all-lory-works-diba', async (req, res) => {
    try {
        const result = await loryWorkDibaCollection.find().sort({ _id: -1 }).toArray();
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





        // ২. নির্দিষ্ট লরীর সব কাজের হিস্টোরি দেখার API diba
        app.get('/lory-work-diba/:lorryNo', async (req, res) => {
            const lorryNo = req.params.lorryNo;
            try {
                const result = await loryWorkDibaCollection.find({ lorryNo: lorryNo }).sort({ date: -1 }).toArray();
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




        // ১. ডাটা সেভ করার জন্য POST API Diba
        app.post('/save-trips-diba', async (req, res) => {
            const data = req.body;
            const result = await tripsDibaCollection.insertOne(data);
            res.send(result);
        });




        // ২. তারিখ বা গাড়ী নং দিয়ে ডাটা ফিল্টার করার জন্য GET APInpde

app.get('/trips', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        // তারিখ ফিল্টার লজিক
        if (startDate && endDate) {
            query.date = { 
                $gte: startDate, 
                $lte: endDate 
            };
        } else if (startDate) {
            query.date = startDate;
        }

        // ভুল সংশোধন: অবশ্যই .toArray() যোগ করতে হবে
        const trips = await tripsFatemaCollection
            .find(query)
            .sort({ date: -1 })
            .toArray(); 
        
        console.log(`Found ${trips.length} trips for query:`, query); // ডিবাগিং এর জন্য
        res.status(200).json(trips);
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});






const { ObjectId } = require('mongodb'); // যদি অলরেডি ইম্পোর্ট করা না থাকে



app.delete('/trips/:tripId/row/:rowId', async (req, res) => {
    try {
        const { tripId, rowId } = req.params;
        let updateQuery = {};

        // যদি ফ্রন্টএন্ড থেকে আইডি না পেয়ে ইনডেক্স (যেমন: idx-0) পাঠানো হয়
        if (rowId.startsWith('idx-')) {
            const rowIndex = parseInt(rowId.split('-')[1], 10);
            
            // নির্দিষ্ট ইনডেক্সের উপাদানটি বাদ দিতে প্রথমে সেট এবং তারপর পুল করতে হয়
            // অথবা পজিশনাল ডিলিটের জন্য নিচের কুয়েরি সবচেয়ে নিরাপদ ও সহজ:
            updateQuery = { 
                $unset: { [`rows.${rowIndex}`]: 1 } 
            };
            
            // প্রথমে ঐ ইনডেক্সটিকে null করে দেওয়া
            await tripsFatemaCollection.updateOne(
                { _id: new ObjectId(tripId) }, 
                updateQuery
            );

            // এরপর null উপাদানটিকে অ্যারে থেকে পুরোপুরি pull (রিমুভ) করে দেওয়া
            const result = await tripsFatemaCollection.updateOne(
                { _id: new ObjectId(tripId) },
                { $pull: { rows: null } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "ইনডেক্স অনুযায়ী রো ডিলিট করা যায়নি।" });
            }

            return res.status(200).json({ success: true, message: "ইনডেক্স অনুযায়ী সফলভাবে ডিলিট করা হয়েছে।" });
        } 
        
        // আর যদি রিয়েল আইডি থাকে (MongoDB ObjectId অথবা নিজস্ব স্ট্রিং আইডি)
        else {
            let matchId;
            try {
                // প্রথমে চেষ্টা করব আইডিটিকে ObjectId-তে রূপান্তর করতে
                matchId = new ObjectId(rowId);
            } catch (e) {
                // যদি আইডিটি কাস্টম স্ট্রিং আইডি হয়, তবে স্ট্রিং হিসেবেই থাকবে
                matchId = rowId;
            }

            const result = await tripsFatemaCollection.updateOne(
                { _id: new ObjectId(tripId) }, 
                { $pull: { rows: { _id: matchId } } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "আইডি খুঁজে পাওয়া যায়নি বা অলরেডি ডিলিট হয়েছে।" });
            }

            return res.status(200).json({ success: true, message: "আইডি অনুযায়ী সফলভাবে ডিলিট করা হয়েছে।" });
        }

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "সার্ভারে সমস্যা হয়েছে।" });
    }
});









        


        // ২. তারিখ বা গাড়ী নং দিয়ে ডাটা ফিল্টার করার জন্য GET APInpde Imam Hossen 
       app.get('/trips-imam', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        // তারিখ ফিল্টার লজিক
        if (startDate && endDate) {
            query.date = { 
                $gte: startDate, 
                $lte: endDate 
            };
        } else if (startDate) {
            query.date = startDate;
        }

        // ভুল সংশোধন: অবশ্যই .toArray() যোগ করতে হবে
        const trips = await tripsImamCollection
            .find(query)
            .sort({ date: -1 })
            .toArray(); 
        
        console.log(`Found ${trips.length} trips for query:`, query); // ডিবাগিং এর জন্য
        res.status(200).json(trips);
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});





        app.delete('/trips-imam/:tripId/row/:rowId', async (req, res) => {
    try {
        const { tripId, rowId } = req.params;
        let updateQuery = {};

        // যদি ফ্রন্টএন্ড থেকে আইডি না পেয়ে ইনডেক্স (যেমন: idx-0) পাঠানো হয়
        if (rowId.startsWith('idx-')) {
            const rowIndex = parseInt(rowId.split('-')[1], 10);
            
            // নির্দিষ্ট ইনডেক্সের উপাদানটি বাদ দিতে প্রথমে সেট এবং তারপর পুল করতে হয়
            // অথবা পজিশনাল ডিলিটের জন্য নিচের কুয়েরি সবচেয়ে নিরাপদ ও সহজ:
            updateQuery = { 
                $unset: { [`rows.${rowIndex}`]: 1 } 
            };
            
            // প্রথমে ঐ ইনডেক্সটিকে null করে দেওয়া
            await tripsImamCollection.updateOne(
                { _id: new ObjectId(tripId) }, 
                updateQuery
            );

            // এরপর null উপাদানটিকে অ্যারে থেকে পুরোপুরি pull (রিমুভ) করে দেওয়া
            const result = await tripsImamCollection.updateOne(
                { _id: new ObjectId(tripId) },
                { $pull: { rows: null } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "ইনডেক্স অনুযায়ী রো ডিলিট করা যায়নি।" });
            }

            return res.status(200).json({ success: true, message: "ইনডেক্স অনুযায়ী সফলভাবে ডিলিট করা হয়েছে।" });
        } 
        
        // আর যদি রিয়েল আইডি থাকে (MongoDB ObjectId অথবা নিজস্ব স্ট্রিং আইডি)
        else {
            let matchId;
            try {
                // প্রথমে চেষ্টা করব আইডিটিকে ObjectId-তে রূপান্তর করতে
                matchId = new ObjectId(rowId);
            } catch (e) {
                // যদি আইডিটি কাস্টম স্ট্রিং আইডি হয়, তবে স্ট্রিং হিসেবেই থাকবে
                matchId = rowId;
            }

            const result = await tripsImamCollection.updateOne(
                { _id: new ObjectId(tripId) }, 
                { $pull: { rows: { _id: matchId } } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "আইডি খুঁজে পাওয়া যায়নি বা অলরেডি ডিলিট হয়েছে।" });
            }

            return res.status(200).json({ success: true, message: "আইডি অনুযায়ী সফলভাবে ডিলিট করা হয়েছে।" });
        }

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "সার্ভারে সমস্যা হয়েছে।" });
    }
});























          // ২. তারিখ বা গাড়ী নং দিয়ে ডাটা ফিল্টার করার জন্য GET APInpde
          app.get('/trips-sahena', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        // তারিখ ফিল্টার লজিক
        if (startDate && endDate) {
            query.date = { 
                $gte: startDate, 
                $lte: endDate 
            };
        } else if (startDate) {
            query.date = startDate;
        }

        // ভুল সংশোধন: অবশ্যই .toArray() যোগ করতে হবে
        const trips = await tripsSahenaCollection
            .find(query)
            .sort({ date: -1 })
            .toArray(); 
        
        console.log(`Found ${trips.length} trips for query:`, query); // ডিবাগিং এর জন্য
        res.status(200).json(trips);
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});






        app.delete('/trips-sahena/:tripId/row/:rowId', async (req, res) => {
    try {
        const { tripId, rowId } = req.params;
        let updateQuery = {};

        // যদি ফ্রন্টএন্ড থেকে আইডি না পেয়ে ইনডেক্স (যেমন: idx-0) পাঠানো হয়
        if (rowId.startsWith('idx-')) {
            const rowIndex = parseInt(rowId.split('-')[1], 10);
            
            // নির্দিষ্ট ইনডেক্সের উপাদানটি বাদ দিতে প্রথমে সেট এবং তারপর পুল করতে হয়
            // অথবা পজিশনাল ডিলিটের জন্য নিচের কুয়েরি সবচেয়ে নিরাপদ ও সহজ:
            updateQuery = { 
                $unset: { [`rows.${rowIndex}`]: 1 } 
            };
            
            // প্রথমে ঐ ইনডেক্সটিকে null করে দেওয়া
            await tripsSahenaCollection.updateOne(
                { _id: new ObjectId(tripId) }, 
                updateQuery
            );

            // এরপর null উপাদানটিকে অ্যারে থেকে পুরোপুরি pull (রিমুভ) করে দেওয়া
            const result = await tripsSahenaCollection.updateOne(
                { _id: new ObjectId(tripId) },
                { $pull: { rows: null } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "ইনডেক্স অনুযায়ী রো ডিলিট করা যায়নি।" });
            }

            return res.status(200).json({ success: true, message: "ইনডেক্স অনুযায়ী সফলভাবে ডিলিট করা হয়েছে।" });
        } 
        
        // আর যদি রিয়েল আইডি থাকে (MongoDB ObjectId অথবা নিজস্ব স্ট্রিং আইডি)
        else {
            let matchId;
            try {
                // প্রথমে চেষ্টা করব আইডিটিকে ObjectId-তে রূপান্তর করতে
                matchId = new ObjectId(rowId);
            } catch (e) {
                // যদি আইডিটি কাস্টম স্ট্রিং আইডি হয়, তবে স্ট্রিং হিসেবেই থাকবে
                matchId = rowId;
            }

            const result = await tripsSahenaCollection.updateOne(
                { _id: new ObjectId(tripId) }, 
                { $pull: { rows: { _id: matchId } } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "আইডি খুঁজে পাওয়া যায়নি বা অলরেডি ডিলিট হয়েছে।" });
            }

            return res.status(200).json({ success: true, message: "আইডি অনুযায়ী সফলভাবে ডিলিট করা হয়েছে।" });
        }

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "সার্ভারে সমস্যা হয়েছে।" });
    }
});















        
          // ২. তারিখ বা গাড়ী নং দিয়ে ডাটা ফিল্টার করার জন্য GET APInpde
           app.get('/trips-diba', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        // তারিখ ফিল্টার লজিক
        if (startDate && endDate) {
            query.date = { 
                $gte: startDate, 
                $lte: endDate 
            };
        } else if (startDate) {
            query.date = startDate;
        }

        // ভুল সংশোধন: অবশ্যই .toArray() যোগ করতে হবে
        const trips = await tripsDibaCollection
            .find(query)
            .sort({ date: -1 })
            .toArray(); 
        
        console.log(`Found ${trips.length} trips for query:`, query); // ডিবাগিং এর জন্য
        res.status(200).json(trips);
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});





        app.delete('/trips-diba/:tripId/row/:rowId', async (req, res) => {
    try {
        const { tripId, rowId } = req.params;
        let updateQuery = {};

        // যদি ফ্রন্টএন্ড থেকে আইডি না পেয়ে ইনডেক্স (যেমন: idx-0) পাঠানো হয়
        if (rowId.startsWith('idx-')) {
            const rowIndex = parseInt(rowId.split('-')[1], 10);
            
            // নির্দিষ্ট ইনডেক্সের উপাদানটি বাদ দিতে প্রথমে সেট এবং তারপর পুল করতে হয়
            // অথবা পজিশনাল ডিলিটের জন্য নিচের কুয়েরি সবচেয়ে নিরাপদ ও সহজ:
            updateQuery = { 
                $unset: { [`rows.${rowIndex}`]: 1 } 
            };
            
            // প্রথমে ঐ ইনডেক্সটিকে null করে দেওয়া
            await tripsDibaCollection.updateOne(
                { _id: new ObjectId(tripId) }, 
                updateQuery
            );

            // এরপর null উপাদানটিকে অ্যারে থেকে পুরোপুরি pull (রিমুভ) করে দেওয়া
            const result = await tripsDibaCollection.updateOne(
                { _id: new ObjectId(tripId) },
                { $pull: { rows: null } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "ইনডেক্স অনুযায়ী রো ডিলিট করা যায়নি।" });
            }

            return res.status(200).json({ success: true, message: "ইনডেক্স অনুযায়ী সফলভাবে ডিলিট করা হয়েছে।" });
        } 
        
        // আর যদি রিয়েল আইডি থাকে (MongoDB ObjectId অথবা নিজস্ব স্ট্রিং আইডি)
        else {
            let matchId;
            try {
                // প্রথমে চেষ্টা করব আইডিটিকে ObjectId-তে রূপান্তর করতে
                matchId = new ObjectId(rowId);
            } catch (e) {
                // যদি আইডিটি কাস্টম স্ট্রিং আইডি হয়, তবে স্ট্রিং হিসেবেই থাকবে
                matchId = rowId;
            }

            const result = await tripsDibaCollection.updateOne(
                { _id: new ObjectId(tripId) }, 
                { $pull: { rows: { _id: matchId } } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "আইডি খুঁজে পাওয়া যায়নি বা অলরেডি ডিলিট হয়েছে।" });
            }

            return res.status(200).json({ success: true, message: "আইডি অনুযায়ী সফলভাবে ডিলিট করা হয়েছে।" });
        }

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "সার্ভারে সমস্যা হয়েছে।" });
    }
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





        // ৩. নির্দিষ্ট গাড়ীর সাম্প্রতিক ট্রিপ দেখার API
        app.get('/trips-diba/:lorryNo', async (req, res) => {
            const lorryNo = req.params.lorryNo;
            try {
                // এই কুয়েরিটি ওই গাড়ীর সব ট্রিপ খুঁজে বের করবে
                const result = await tripsDibaCollection.find({ "rows.lorryNo": lorryNo }).sort({ date: -1 }).limit(5).toArray();

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




        
        // ১. নতুন চালান সেভ বা আপডেট করার API Diba
        app.post('/chalans-diba', async (req, res) => {
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
                const result = await chalansDibaCollection.updateOne(filter, updateDoc, options);
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




        
        // ২. নির্দিষ্ট তারিখের চালান খুঁজে বের করার API diba
        app.get('/chalans-diba/:date', async (req, res) => {
            const date = req.params.date;
            try {
                const query = { date: date };
                const result = await chalansDibaCollection.findOne(query);
                if (result) {
                    res.send(result);
                } else {
                    res.send({ entries: [], companyName: 'মেসার্স ফাতেমা নাজ পেট্রোলিয়াম' });
                }
            } catch (error) {
                res.status(500).send({ message: "ডাটা আনতে সমস্যা হয়েছে", error });
            }
        });




        // ৩. রিপোর্ট জেনারেট করার জন্য সব ডাটা বা ডেট রেঞ্জ অনুযায়ী ডাটা আনার API
app.get('/chalans-report', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        // যদি startDate এবং endDate থাকে তবে নির্দিষ্ট তারিখের মধ্যে ডাটা খুঁজবে
        if (startDate && endDate) {
            query = {
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            };
        }
        // এখানে আপনি কোন কালেকশন থেকে রিপোর্ট দেখাতে চান সেটা সিলেক্ট করুন
        // উদাহরণ হিসেবে chalansFatemaCollection ব্যবহার করা হয়েছে
        const result = await chalansFatemaCollection.find(query).sort({ date: -1 }).toArray();
        
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "রিপোর্ট ডাটা আনতে সমস্যা হয়েছে", error });
    }
});




app.delete('/delete-chalan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { ObjectId } = require('mongodb'); 
        
        let targetId;
        try {
            // আইডিটিকে ObjectId তে রূপান্তর করার চেষ্টা
            targetId = new ObjectId(id);
        } catch (e) {
            // যদি সাধারণ স্ট্রিং বা কাস্টম আইডি হয়
            targetId = id;
        }

        // ভুল সংশোধন: $pull এর ভেতরের স্ট্রাকচারটি মঙ্গোডিবির নিয়ম অনুযায়ী সহজ করা হলো
        const result = await chalansFatemaCollection.updateOne(
            { 
                $or: [
                    { "entries._id": targetId },
                    { "entries.id": targetId }
                ]
            }, 
            { 
                $pull: { 
                    entries: {
                        // মঙ্গোডিবির $pull অবজেক্টের ভেতর সরাসরি কন্ডিশন এভাবে লিখতে হয়
                        $or: [
                            { _id: targetId },
                            { id: targetId }
                        ]
                    }
                } 
            }
        );

        // যদি কোনো ডকুমেন্ট ম্যাচ না করে অথবা মডিফাই না হয়
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "দুঃখিত, এই চালানের আইডিটি ডাটাবেজে খুঁজে পাওয়া যায়নি!" });
        }

        res.status(200).json({ message: "চালানটি সফলভাবে ডাটাবেজ থেকে মুছে ফেলা হয়েছে" });
    } catch (error) {
        console.error("ডাটা মুছতে সার্ভারে সমস্যা হয়েছে:", error);
        res.status(500).json({ error: "সার্ভারে অভ্যন্তরীণ সমস্যা হয়েছে", details: error.message });
    }
});










app.get('/chalans-report-diba', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        // যদি startDate এবং endDate থাকে তবে নির্দিষ্ট তারিখের মধ্যে ডাটা খুঁজবে
        if (startDate && endDate) {
            query = {
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            };
        }
        // এখানে আপনি কোন কালেকশন থেকে রিপোর্ট দেখাতে চান সেটা সিলেক্ট করুন
        // উদাহরণ হিসেবে chalansFatemaCollection ব্যবহার করা হয়েছে
        const result = await chalansDibaCollection.find(query).sort({ date: -1 }).toArray();
        
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "রিপোর্ট ডাটা আনতে সমস্যা হয়েছে", error });
    }
});



app.delete('/delete-chalan-diba/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { ObjectId } = require('mongodb'); 
        
        let targetId;
        try {
            // আইডিটিকে ObjectId তে রূপান্তর করার চেষ্টা
            targetId = new ObjectId(id);
        } catch (e) {
            // যদি সাধারণ স্ট্রিং বা কাস্টম আইডি হয়
            targetId = id;
        }

        // ভুল সংশোধন: $pull এর ভেতরের স্ট্রাকচারটি মঙ্গোডিবির নিয়ম অনুযায়ী সহজ করা হলো
        const result = await chalansDibaCollection.updateOne(
            { 
                $or: [
                    { "entries._id": targetId },
                    { "entries.id": targetId }
                ]
            }, 
            { 
                $pull: { 
                    entries: {
                        // মঙ্গোডিবির $pull অবজেক্টের ভেতর সরাসরি কন্ডিশন এভাবে লিখতে হয়
                        $or: [
                            { _id: targetId },
                            { id: targetId }
                        ]
                    }
                } 
            }
        );

        // যদি কোনো ডকুমেন্ট ম্যাচ না করে অথবা মডিফাই না হয়
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "দুঃখিত, এই চালানের আইডিটি ডাটাবেজে খুঁজে পাওয়া যায়নি!" });
        }

        res.status(200).json({ message: "চালানটি সফলভাবে ডাটাবেজ থেকে মুছে ফেলা হয়েছে" });
    } catch (error) {
        console.error("ডাটা মুছতে সার্ভারে সমস্যা হয়েছে:", error);
        res.status(500).json({ error: "সার্ভারে অভ্যন্তরীণ সমস্যা হয়েছে", details: error.message });
    }
});













app.get('/chalans-report-imam', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        // যদি startDate এবং endDate থাকে তবে নির্দিষ্ট তারিখের মধ্যে ডাটা খুঁজবে
        if (startDate && endDate) {
            query = {
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            };
        }
        // এখানে আপনি কোন কালেকশন থেকে রিপোর্ট দেখাতে চান সেটা সিলেক্ট করুন
        // উদাহরণ হিসেবে chalansFatemaCollection ব্যবহার করা হয়েছে
        const result = await chalansImamCollection.find(query).sort({ date: -1 }).toArray();
        
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "রিপোর্ট ডাটা আনতে সমস্যা হয়েছে", error });
    }
});




app.delete('/delete-chalan-imam/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { ObjectId } = require('mongodb'); 
        
        let targetId;
        try {
            // আইডিটিকে ObjectId তে রূপান্তর করার চেষ্টা
            targetId = new ObjectId(id);
        } catch (e) {
            // যদি সাধারণ স্ট্রিং বা কাস্টম আইডি হয়
            targetId = id;
        }

        // ভুল সংশোধন: $pull এর ভেতরের স্ট্রাকচারটি মঙ্গোডিবির নিয়ম অনুযায়ী সহজ করা হলো
        const result = await chalansImamCollection.updateOne(
            { 
                $or: [
                    { "entries._id": targetId },
                    { "entries.id": targetId }
                ]
            }, 
            { 
                $pull: { 
                    entries: {
                        // মঙ্গোডিবির $pull অবজেক্টের ভেতর সরাসরি কন্ডিশন এভাবে লিখতে হয়
                        $or: [
                            { _id: targetId },
                            { id: targetId }
                        ]
                    }
                } 
            }
        );

        // যদি কোনো ডকুমেন্ট ম্যাচ না করে অথবা মডিফাই না হয়
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "দুঃখিত, এই চালানের আইডিটি ডাটাবেজে খুঁজে পাওয়া যায়নি!" });
        }

        res.status(200).json({ message: "চালানটি সফলভাবে ডাটাবেজ থেকে মুছে ফেলা হয়েছে" });
    } catch (error) {
        console.error("ডাটা মুছতে সার্ভারে সমস্যা হয়েছে:", error);
        res.status(500).json({ error: "সার্ভারে অভ্যন্তরীণ সমস্যা হয়েছে", details: error.message });
    }
});















app.get('/chalans-report-sahena', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        // যদি startDate এবং endDate থাকে তবে নির্দিষ্ট তারিখের মধ্যে ডাটা খুঁজবে
        if (startDate && endDate) {
            query = {
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            };
        }
        // এখানে আপনি কোন কালেকশন থেকে রিপোর্ট দেখাতে চান সেটা সিলেক্ট করুন
        // উদাহরণ হিসেবে chalansFatemaCollection ব্যবহার করা হয়েছে
        const result = await chalansSahenaCollection.find(query).sort({ date: -1 }).toArray();
        
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "রিপোর্ট ডাটা আনতে সমস্যা হয়েছে", error });
    }
});




app.delete('/delete-chalan-sahena/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { ObjectId } = require('mongodb'); 
        
        let targetId;
        try {
            // আইডিটিকে ObjectId তে রূপান্তর করার চেষ্টা
            targetId = new ObjectId(id);
        } catch (e) {
            // যদি সাধারণ স্ট্রিং বা কাস্টম আইডি হয়
            targetId = id;
        }

        // ভুল সংশোধন: $pull এর ভেতরের স্ট্রাকচারটি মঙ্গোডিবির নিয়ম অনুযায়ী সহজ করা হলো
        const result = await chalansSahenaCollection.updateOne(
            { 
                $or: [
                    { "entries._id": targetId },
                    { "entries.id": targetId }
                ]
            }, 
            { 
                $pull: { 
                    entries: {
                        // মঙ্গোডিবির $pull অবজেক্টের ভেতর সরাসরি কন্ডিশন এভাবে লিখতে হয়
                        $or: [
                            { _id: targetId },
                            { id: targetId }
                        ]
                    }
                } 
            }
        );

        // যদি কোনো ডকুমেন্ট ম্যাচ না করে অথবা মডিফাই না হয়
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "দুঃখিত, এই চালানের আইডিটি ডাটাবেজে খুঁজে পাওয়া যায়নি!" });
        }

        res.status(200).json({ message: "চালানটি সফলভাবে ডাটাবেজ থেকে মুছে ফেলা হয়েছে" });
    } catch (error) {
        console.error("ডাটা মুছতে সার্ভারে সমস্যা হয়েছে:", error);
        res.status(500).json({ error: "সার্ভারে অভ্যন্তরীণ সমস্যা হয়েছে", details: error.message });
    }
});
















    // Short Calculations সেভ করার API Fatema Naz 
app.post('/save-short-calculations', async (req, res) => {
    try {
        const data = req.body;
        // আপনি চাইলে এটি tripsDibaCollection বা নতুন কোনো কালেকশনে সেভ করতে পারেন
        // এখানে আমি উদাহরণ হিসেবে chalansDibaCollection ব্যবহার করছি, 
        // আপনি চাইলে নতুন কালেকশন 'shortCalculations' ও তৈরি করতে পারেন।
        const result = await shortsFatemaCollection.insertOne(data);
        
        res.status(201).send({ 
            success: true, 
            message: "Short Calculation সফলভাবে সেভ হয়েছে", 
            insertedId: result.insertedId 
        });
    } catch (error) {
        console.error("Error saving short calculation:", error);
        res.status(500).send({ success: false, message: "সার্ভারে সমস্যা হয়েছে" });
    }
});








// শর্ট ক্যালকুলেশন হিস্ট্রি পাওয়ার জন্য API

app.get('/short-calculations', async (req, res) => {
    try {
        // এখানে সরাসরি কোনো ডেট কোয়েরি করার প্রয়োজন নেই, 
        // কারণ ফ্রন্টএন্ড অলরেডি `deliverDate` দিয়ে নিখুঁত ফিল্টার করছে।
        let query = { type: "short-calculation" }; 

        // ডাটাবেস থেকে লেটেস্ট ডাটা আগে আসবে
        const result = await shortsFatemaCollection.find(query).sort({ createdAt: -1 }).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching short history:", error);
        res.status(500).send({ message: "সার্ভার থেকে ডাটা আনতে সমস্যা হয়েছে" });
    }
});



// নির্দিষ্ট শিটের (Document) ভেতর থেকে একটি নির্দিষ্ট রো (Row) ডিলিট করার API
app.delete('/short-calculations/:sheetId/row/:rowId', async (req, res) => {
    try {
        const { sheetId, rowId } = req.params;
        const { ObjectId } = require('mongodb'); // যদি ফাইলের শুরুতে ObjectId ইমপোর্ট করা না থাকে

        // ১. মেইন ডকুমেন্ট থেকে নির্দিষ্ট rowId যুক্ত অবজেক্টটি সরিয়ে (Pull) ফেলা
        const updateResult = await shortsFatemaCollection.findOneAndUpdate(
            { _id: new ObjectId(sheetId) },
            { $pull: { rows: { rowId: rowId } } }, // এন্ট্রি দেওয়ার সময় 'rowId' কী (Key) ব্যবহার করা হয়েছে
            { returnDocument: 'after' } // আপডেট হওয়ার পরের নতুন ডাটাটি রিটার্ন করবে
        );

        // ২. যদি আইডি অনুযায়ী কোনো শিট বা ডকুমেন্ট খুঁজে পাওয়া না যায়
        // (MongoDB Native Driver-এ আপডেট করা ডাটা .value বা সরাসরি অবজেক্টে থাকে সংস্কৃতির ওপর ভিত্তি করে)
        const updatedSheet = updateResult.value || updateResult;
        
        if (!updatedSheet) {
            return res.status(404).send({ message: "শিটটি খুঁজে পাওয়া যায়নি!" });
        }

        // ৩. যদি রো ডিলিট করার পর ওই শিটের ভেতর আর কোনো রো না থাকে (খালি হয়ে যায়)
        // তাহলে খালি শিটটি ডাটাবেজে না রেখে সম্পূর্ণ ডকুমেন্টটিই ডিলিট করে দেওয়া ভালো
        if (!updatedSheet.rows || updatedSheet.rows.length === 0) {
            await shortsFatemaCollection.deleteOne({ _id: new ObjectId(sheetId) });
            return res.status(200).send({ 
                success: true, 
                message: "শিটের শেষ রেকর্ডটি ডিলিট হওয়ায় সম্পূর্ণ শিটটি মুছে ফেলা হয়েছে।" 
            });
        }

        // সফলভাবে শুধুমাত্র নির্দিষ্ট রো ডিলিট হলে রেসপন্স
        res.status(200).send({ 
            success: true, 
            message: "রেকর্ডটি সফলভাবে ডিলিট হয়েছে!" 
        });

    } catch (error) {
        console.error("Error deleting short row:", error);
        res.status(500).send({ message: "সার্ভারে সমস্যা হয়েছে, ডিলিট করা যায়নি।" });
    }
});













    // Short Calculations সেভ করার API Imam Hossain 
app.post('/save-short-calculations-imam', async (req, res) => {
    try {
        const data = req.body;
        // আপনি চাইলে এটি tripsDibaCollection বা নতুন কোনো কালেকশনে সেভ করতে পারেন
        // এখানে আমি উদাহরণ হিসেবে chalansDibaCollection ব্যবহার করছি, 
        // আপনি চাইলে নতুন কালেকশন 'shortCalculations' ও তৈরি করতে পারেন।
        const result = await shortsImamCollection.insertOne(data);
        
        res.status(201).send({ 
            success: true, 
            message: "Short Calculation সফলভাবে সেভ হয়েছে", 
            insertedId: result.insertedId 
        });
    } catch (error) {
        console.error("Error saving short calculation:", error);
        res.status(500).send({ success: false, message: "সার্ভারে সমস্যা হয়েছে" });
    }
});




















// শর্ট ক্যালকুলেশন হিস্ট্রি পাওয়ার জন্য API
app.get('/short-calculations-imam', async (req, res) => {
    try {
        // এখানে সরাসরি কোনো ডেট কোয়েরি করার প্রয়োজন নেই, 
        // কারণ ফ্রন্টএন্ড অলরেডি `deliverDate` দিয়ে নিখুঁত ফিল্টার করছে।
        let query = { type: "short-calculation" }; 

        // ডাটাবেস থেকে লেটেস্ট ডাটা আগে আসবে
        const result = await shortsImamCollection.find(query).sort({ createdAt: -1 }).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching short history:", error);
        res.status(500).send({ message: "সার্ভার থেকে ডাটা আনতে সমস্যা হয়েছে" });
    }
});





// নির্দিষ্ট শিটের (Document) ভেতর থেকে একটি নির্দিষ্ট রো (Row) ডিলিট করার API
app.delete('/short-calculations-imam/:sheetId/row/:rowId', async (req, res) => {
    try {
        const { sheetId, rowId } = req.params;
        const { ObjectId } = require('mongodb'); // যদি ফাইলের শুরুতে ObjectId ইমপোর্ট করা না থাকে

        // ১. মেইন ডকুমেন্ট থেকে নির্দিষ্ট rowId যুক্ত অবজেক্টটি সরিয়ে (Pull) ফেলা
        const updateResult = await shortsImamCollection.findOneAndUpdate(
            { _id: new ObjectId(sheetId) },
            { $pull: { rows: { rowId: rowId } } }, // এন্ট্রি দেওয়ার সময় 'rowId' কী (Key) ব্যবহার করা হয়েছে
            { returnDocument: 'after' } // আপডেট হওয়ার পরের নতুন ডাটাটি রিটার্ন করবে
        );

        // ২. যদি আইডি অনুযায়ী কোনো শিট বা ডকুমেন্ট খুঁজে পাওয়া না যায়
        // (MongoDB Native Driver-এ আপডেট করা ডাটা .value বা সরাসরি অবজেক্টে থাকে সংস্কৃতির ওপর ভিত্তি করে)
        const updatedSheet = updateResult.value || updateResult;
        
        if (!updatedSheet) {
            return res.status(404).send({ message: "শিটটি খুঁজে পাওয়া যায়নি!" });
        }

        // ৩. যদি রো ডিলিট করার পর ওই শিটের ভেতর আর কোনো রো না থাকে (খালি হয়ে যায়)
        // তাহলে খালি শিটটি ডাটাবেজে না রেখে সম্পূর্ণ ডকুমেন্টটিই ডিলিট করে দেওয়া ভালো
        if (!updatedSheet.rows || updatedSheet.rows.length === 0) {
            await shortsImamCollection.deleteOne({ _id: new ObjectId(sheetId) });
            return res.status(200).send({ 
                success: true, 
                message: "শিটের শেষ রেকর্ডটি ডিলিট হওয়ায় সম্পূর্ণ শিটটি মুছে ফেলা হয়েছে।" 
            });
        }

        // সফলভাবে শুধুমাত্র নির্দিষ্ট রো ডিলিট হলে রেসপন্স
        res.status(200).send({ 
            success: true, 
            message: "রেকর্ডটি সফলভাবে ডিলিট হয়েছে!" 
        });

    } catch (error) {
        console.error("Error deleting short row:", error);
        res.status(500).send({ message: "সার্ভারে সমস্যা হয়েছে, ডিলিট করা যায়নি।" });
    }
});




















    // Short Calculations সেভ করার API sahena enterprise 
app.post('/save-short-calculations-sahena', async (req, res) => {
    try {
        const data = req.body;
        // আপনি চাইলে এটি tripsDibaCollection বা নতুন কোনো কালেকশনে সেভ করতে পারেন
        // এখানে আমি উদাহরণ হিসেবে chalansDibaCollection ব্যবহার করছি, 
        // আপনি চাইলে নতুন কালেকশন 'shortCalculations' ও তৈরি করতে পারেন।
        const result = await shortsSahenaCollection.insertOne(data);
        
        res.status(201).send({ 
            success: true, 
            message: "Short Calculation সফলভাবে সেভ হয়েছে", 
            insertedId: result.insertedId 
        });
    } catch (error) {
        console.error("Error saving short calculation:", error);
        res.status(500).send({ success: false, message: "সার্ভারে সমস্যা হয়েছে" });
    }
});



// শর্ট ক্যালকুলেশন হিস্ট্রি পাওয়ার জন্য API sahena enterprise 
app.get('/short-calculations-sahena', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = { type: "short-calculation" }; // শুধুমাত্র শর্ট ক্যালকুলেশন ডাটা ফিল্টার করতে

        // তারিখ অনুযায়ী ফিল্টার করার লজিক
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate), // শুরুর তারিখ থেকে বড় বা সমান
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) // শেষ তারিখের শেষ মুহূর্ত পর্যন্ত
            };
        }

        // ডাটাবেস থেকে লেটেস্ট ডাটা আগে আসবে (sort by createdAt: -1)
        const result = await shortsSahenaCollection.find(query).sort({ createdAt: -1 }).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching short history:", error);
        res.status(500).send({ message: "সার্ভার থেকে ডাটা আনতে সমস্যা হয়েছে" });
    }
});




// নির্দিষ্ট শিটের (Document) ভেতর থেকে একটি নির্দিষ্ট রো (Row) ডিলিট করার API
app.delete('/short-calculations-sahena/:sheetId/row/:rowId', async (req, res) => {
    try {
        const { sheetId, rowId } = req.params;
        const { ObjectId } = require('mongodb'); // যদি ফাইলের শুরুতে ObjectId ইমপোর্ট করা না থাকে

        // ১. মেইন ডকুমেন্ট থেকে নির্দিষ্ট rowId যুক্ত অবজেক্টটি সরিয়ে (Pull) ফেলা
        const updateResult = await shortsSahenaCollection.findOneAndUpdate(
            { _id: new ObjectId(sheetId) },
            { $pull: { rows: { rowId: rowId } } }, // এন্ট্রি দেওয়ার সময় 'rowId' কী (Key) ব্যবহার করা হয়েছে
            { returnDocument: 'after' } // আপডেট হওয়ার পরের নতুন ডাটাটি রিটার্ন করবে
        );

        // ২. যদি আইডি অনুযায়ী কোনো শিট বা ডকুমেন্ট খুঁজে পাওয়া না যায়
        // (MongoDB Native Driver-এ আপডেট করা ডাটা .value বা সরাসরি অবজেক্টে থাকে সংস্কৃতির ওপর ভিত্তি করে)
        const updatedSheet = updateResult.value || updateResult;
        
        if (!updatedSheet) {
            return res.status(404).send({ message: "শিটটি খুঁজে পাওয়া যায়নি!" });
        }

        // ৩. যদি রো ডিলিট করার পর ওই শিটের ভেতর আর কোনো রো না থাকে (খালি হয়ে যায়)
        // তাহলে খালি শিটটি ডাটাবেজে না রেখে সম্পূর্ণ ডকুমেন্টটিই ডিলিট করে দেওয়া ভালো
        if (!updatedSheet.rows || updatedSheet.rows.length === 0) {
            await shortsSahenaCollection.deleteOne({ _id: new ObjectId(sheetId) });
            return res.status(200).send({ 
                success: true, 
                message: "শিটের শেষ রেকর্ডটি ডিলিট হওয়ায় সম্পূর্ণ শিটটি মুছে ফেলা হয়েছে।" 
            });
        }

        // সফলভাবে শুধুমাত্র নির্দিষ্ট রো ডিলিট হলে রেসপন্স
        res.status(200).send({ 
            success: true, 
            message: "রেকর্ডটি সফলভাবে ডিলিট হয়েছে!" 
        });

    } catch (error) {
        console.error("Error deleting short row:", error);
        res.status(500).send({ message: "সার্ভারে সমস্যা হয়েছে, ডিলিট করা যায়নি।" });
    }
});








 // Short Calculations সেভ করার API Diba ratri
app.post('/save-short-calculations-diba', async (req, res) => {
    try {
        const data = req.body;
        // আপনি চাইলে এটি tripsDibaCollection বা নতুন কোনো কালেকশনে সেভ করতে পারেন
        // এখানে আমি উদাহরণ হিসেবে chalansDibaCollection ব্যবহার করছি, 
        // আপনি চাইলে নতুন কালেকশন 'shortCalculations' ও তৈরি করতে পারেন।
        const result = await shortsDibaCollection.insertOne(data);
        
        res.status(201).send({ 
            success: true, 
            message: "Short Calculation সফলভাবে সেভ হয়েছে", 
            insertedId: result.insertedId 
        });
    } catch (error) {
        console.error("Error saving short calculation:", error);
        res.status(500).send({ success: false, message: "সার্ভারে সমস্যা হয়েছে" });
    }
});



// শর্ট ক্যালকুলেশন হিস্ট্রি পাওয়ার জন্য API Diba ratri
app.get('/short-calculations-diba', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = { type: "short-calculation" }; // শুধুমাত্র শর্ট ক্যালকুলেশন ডাটা ফিল্টার করতে

        // তারিখ অনুযায়ী ফিল্টার করার লজিক
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate), // শুরুর তারিখ থেকে বড় বা সমান
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) // শেষ তারিখের শেষ মুহূর্ত পর্যন্ত
            };
        }

        // ডাটাবেস থেকে লেটেস্ট ডাটা আগে আসবে (sort by createdAt: -1)
        const result = await shortsDibaCollection.find(query).sort({ createdAt: -1 }).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching short history:", error);
        res.status(500).send({ message: "সার্ভার থেকে ডাটা আনতে সমস্যা হয়েছে" });
    }
});





// নির্দিষ্ট শিটের (Document) ভেতর থেকে একটি নির্দিষ্ট রো (Row) ডিলিট করার API
app.delete('/short-calculations-diba/:sheetId/row/:rowId', async (req, res) => {
    try {
        const { sheetId, rowId } = req.params;
        const { ObjectId } = require('mongodb'); // যদি ফাইলের শুরুতে ObjectId ইমপোর্ট করা না থাকে

        // ১. মেইন ডকুমেন্ট থেকে নির্দিষ্ট rowId যুক্ত অবজেক্টটি সরিয়ে (Pull) ফেলা
        const updateResult = await shortsDibaCollection.findOneAndUpdate(
            { _id: new ObjectId(sheetId) },
            { $pull: { rows: { rowId: rowId } } }, // এন্ট্রি দেওয়ার সময় 'rowId' কী (Key) ব্যবহার করা হয়েছে
            { returnDocument: 'after' } // আপডেট হওয়ার পরের নতুন ডাটাটি রিটার্ন করবে
        );

        // ২. যদি আইডি অনুযায়ী কোনো শিট বা ডকুমেন্ট খুঁজে পাওয়া না যায়
        // (MongoDB Native Driver-এ আপডেট করা ডাটা .value বা সরাসরি অবজেক্টে থাকে সংস্কৃতির ওপর ভিত্তি করে)
        const updatedSheet = updateResult.value || updateResult;
        
        if (!updatedSheet) {
            return res.status(404).send({ message: "শিটটি খুঁজে পাওয়া যায়নি!" });
        }

        // ৩. যদি রো ডিলিট করার পর ওই শিটের ভেতর আর কোনো রো না থাকে (খালি হয়ে যায়)
        // তাহলে খালি শিটটি ডাটাবেজে না রেখে সম্পূর্ণ ডকুমেন্টটিই ডিলিট করে দেওয়া ভালো
        if (!updatedSheet.rows || updatedSheet.rows.length === 0) {
            await shortsDibaCollection.deleteOne({ _id: new ObjectId(sheetId) });
            return res.status(200).send({ 
                success: true, 
                message: "শিটের শেষ রেকর্ডটি ডিলিট হওয়ায় সম্পূর্ণ শিটটি মুছে ফেলা হয়েছে।" 
            });
        }

        // সফলভাবে শুধুমাত্র নির্দিষ্ট রো ডিলিট হলে রেসপন্স
        res.status(200).send({ 
            success: true, 
            message: "রেকর্ডটি সফলভাবে ডিলিট হয়েছে!" 
        });

    } catch (error) {
        console.error("Error deleting short row:", error);
        res.status(500).send({ message: "সার্ভারে সমস্যা হয়েছে, ডিলিট করা যায়নি।" });
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



