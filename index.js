const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//midleware

app.use(cors());
app.use(express.json());

app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jef9reo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client
            .db('emaJohn').collection('product');

        app.get('/product', async (req, res) => {
            console.log('qurey', req.query)
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const qurey = {};
            const cursor = productCollection.find(qurey);
            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }
            res.send(products)
        })

        app.get('/productCount', async (req, res) => {
            // const qurey = {};
            // const cursor = productCollection.find(qurey);
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count })
        })

        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id))
            const query = { _id: { $in: ids } }
            const cursor = productCollection.find(query)
            const products = await cursor.toArray()
            console.log(keys)
            res.send(products)
        })
    }
    finally {

    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("John is runing wating for Ema")
})

app.listen(port, () => {
    console.log("john is runing on port", port)
})