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

// jwt 
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n58ahyf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const registredUserCollection = client.db("ultimate").collection("registredUser");
        const loggedInUserCollection = client.db("ultimate").collection("loggedInUser");

        // sign jwt 
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            res.send({ token })
        })

        //send registred user data from client
        app.post('/signup', async (req, res) => {
            const data = req.body;
            const result = await registredUserCollection.insertOne(data)
            res.send(result)
        });

        //send login user data
        app.post('/login', async (req, res) => {
            const data = req.body;
            const result = await loggedInUserCollection.insertOne(data)
            res.send(result)
        });

        // get all users data 
        app.get('/test', verifyJWT, async (req, res) => {
            const query = {}
            const users = await registredUserCollection.find(query).toArray()
            res.send(users)
        })

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