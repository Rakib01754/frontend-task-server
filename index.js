const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()


// middleware 

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n58ahyf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)

async function run() {
    try {
        const registredUserCollection = client.db("ultimate").collection("registredUser");

    }

    finally {
        //   await client.close();
    }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Attendance project server running')
});

app.listen(port, () => {
    console.log(`project server running on port ${port}`)
})