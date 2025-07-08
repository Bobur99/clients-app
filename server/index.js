require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/clients', router);

const clientPromise = MongoClient.connect(process.env.DB_URL || 'DB_URL = mongodb+srv://bobur:bobur123@cluster-1.hsove6g.mongodb.net/Clients_db?retryWrites=true&w=majority&appName=Cluster-1', {
    useUnifiedTopology: true,
    maxPoolSize: 10
});

router.use(async (req, res, next) => {
    try {
        const client = await clientPromise;
        req.db = client.db('Clients_db');

        next();
    } catch (error) {
        next(error);
    }
})

async function getNextClientId(db) {
    const result = await db.collection('counters').findOneAndUpdate(
        { _id: "clientId" },
        { $inc: { seq: 1 } },
        { returnDocument: "after", upsert: true }
    );
    return result.value.seq;
}

const port = process.env.PORT || 3000;

router.get('/', async (req, res) => {
    try {
        const db = req.db;
        const clients = await db.collection('clients').find().toArray();

        if (req.query.search) {
            const search = req.query.search.trim().toLowerCase();

            const clientsList = clients.filter(client => [
                client.name,
                client.surname,
                client.lastName,
                ...client.contacts.map(({ value }) => value)
            ].some(str => str.toLowerCase().includes(search))
            );

            res.send(clientsList);
            return;
        }

        res.send(clients);
    } catch (error) {
        console.log(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const db = req.db;

        const nextId = await getNextClientId(db);
        data.clientId = nextId;

        data.createdAt = new Date().toISOString();
        data.updatedAt = new Date().toISOString();

        const { insertedId } = await db.collection('clients').insertOne(data);
        const client = await db.collection('clients').findOne({ _id: ObjectId(insertedId) });

        res.send(client);
    } catch (error) {
        console.log(error);
        res.status(500).send("Ошибка при создании клиента");
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { name, lastName, surname, contacts } = req.body;
        const db = req.db;

        await db.collection("clients").updateOne(
            { _id: ObjectId(req.params.id) },
            {
            $set: {
                name,
                surname,
                lastName,
                contacts,
                updatedAt: new Date().toISOString()
            },
            }
        );

        const client = await db.collection('clients').findOne({ _id: ObjectId(req.params.id) });
        res.send(client);
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:id', async (req, send) => {
    try {
        const db = req.db;

        db.collection('clients').deleteOne({ _id: ObjectId(req.params.id) });
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(` Listening on http://localhost:${port}`);
});