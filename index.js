const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const path = require('path');

//middleware
app.use(cors());
app.use(express.json()); //req.body  

//static files
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {    
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
})


const uri = "mongodb+srv://mer-book-store:VXECunQDVrIh5sZr@cluster0.dihdk56.mongodb.net/"
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
client.connect();

console.log("Connected correctly to server")
const database = client.db("book-store");
const bookCollection = database.collection("books")
app.get('/all-books', async (req, res) => {
    const books = await bookCollection.find({}).toArray();
    res.json(books);
})

app.post('/add-book', async (req, res) => {
    const book = req.body;
    const result = await bookCollection.insertOne(book);
    res.json(result);
})
app.put('/update-book/:id', async (req, res) => {
    const id = req.params.id;
    let updatedBook = req.body;

    // Remove the _id field from the updatedBook object
    delete updatedBook._id;

    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
        $set: updatedBook,
    };

    // Removed the upsert option as it's not needed for a standard update
    const result = await bookCollection.updateOne(filter, updateDoc);
    res.send(result);
});


app.delete('/delete-book/:id', async (req, res) => {
    const id = req.params.id;
    const result = await bookCollection.deleteOne({ _id: new ObjectId(id) });
    res.json(result);
})
client.db("admin").command({ ping: 1 });
console.log("Pinged your deployment. You successfully connected to MongoDB!")

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use (express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
});
