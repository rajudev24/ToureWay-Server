const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; 

//Middlewere 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qhwuq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('ToureWay');
        const placesCollection = database.collection('places')
        const imageCollection = database.collection('images')
        const hotelsCollection = database.collection('hotels')

        app.get('/places', async(req, res)=>{
            const cursor = placesCollection.find()
            const place = await cursor.toArray();
            res.send(place)
        })

        app.get('/images', async(req, res)=>{
            const cursor = imageCollection.find();
            const image = await cursor.toArray();
            res.send(image)
        })

        app.get('/hotels', async(req, res)=>{
            const cursor = hotelsCollection.find();
            const hotel = await cursor.toArray();
            res.send(hotel)
        })

        app.get('/hotels/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const hotel = await hotelsCollection.findOne(query);
            res.json(hotel)
        })
    }
    finally{
        // await client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res)=>{
    res.send('Running ToureWay Server');
})

app.listen(port, ()=>{
    console.log('Running Toureway Server on port', port)
})