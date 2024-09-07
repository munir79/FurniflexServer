const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors=require('cors');
const app = express();

const stripe = require("stripe")('sk_test_51PNufw2KHGlFTrJGaslRJeHI8QXuQG6drZHmHa3bf7lCOTyxFKTJboRH4ghOPulBboFXN8ppKnmujCMeeZLpHJZx00OK0i4Xkv');
const port = process.env.PORT ||5000;





//furniflex
//EfbyrPs4M2jlQj6f


//Middelware
app.use(cors());
app.use(express.json() );



const uri = "mongodb+srv://furniflex:EfbyrPs4M2jlQj6f@cluster0.semifcf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    const database = client.db("Furniflex");
    const ChairCollection = database.collection("allcahir");
    const CartCollection = database.collection("carts");
    const PaymentCollection = database.collection("payments");


    app.post('/carts',async(req,res)=>{
        const Carts=req.body;
        const result= await CartCollection.insertOne(Carts);
        res.send(result);
      })
    

      app.get('/carts',async(req,res)=>{
        const email=req.query.email;
        const query={email:email};
        const result= await CartCollection.find(query).toArray();
        res.send(result);
      })
  
      app.delete('/carts/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)};
        const result= await CartCollection.deleteOne(query);
        res.send(result);
      })


    app.get('/chair',async(req,res)=>{
      const page=parseInt(req.query.page);
      const size=parseInt(req.query.size);
      console.log("pagination Query:", page,size);
        const result= await ChairCollection.find()
        .skip(page*size)
        .limit(size)
        .toArray();
        
        res.send(result);
      })
  
     
  

      //pagination

      app.get('/chair', async (req, res) => {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;
    
        const cursor = ChairCollection.find().skip(skip).limit(limit);
        const result = await cursor.toArray();
    
        const totalChairs = await ChairCollection.countDocuments(); // Get the total count of chairs
    
        res.send({
            chairs: result,
            totalChairs: totalChairs,
            currentPage: page,
            totalPages: Math.ceil(totalChairs / limit)
        });
    });


    
  
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send(" simple crud is running");
})


app.listen(port ,()=>{
    console.log(`simple crud running on ,${port}`);
} )
