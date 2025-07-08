- ✅ **Day 9: MongoDB Recap & Mongoose Introduction**
    
    ### 🎯 Objective:
    
    - Connect Node.js to MongoDB and understand the role of Mongoose.
    
    ### 📚 Topics:
    
    - Install & set up MongoDB locally or use MongoDB Atlas (cloud)
        
        Before we can connect to MongoDB, we need a MongoDB database to connect to! You have two primary options:
        
        - **MongoDB Locally:** This involves downloading and installing MongoDB Community Server on your own machine. It's great for development as you don't need an internet connection.
            - **How to:** You would typically go to the MongoDB website, download the appropriate version for your OS, and follow their installation instructions. For this class, we won't go through the manual installation steps in detail, but it's good to know it's an option.
        - **MongoDB Atlas (Cloud):** This is the recommended approach for most modern applications, especially when starting out. MongoDB Atlas is a cloud-hosted MongoDB service that handles all the server management for you. It offers a free tier (M0 cluster) which is perfect for learning and small projects.
            - **Why recommended?** It simplifies setup, provides high availability, and you don't have to worry about managing the database server yourself.
            - **How to:**
                1. Go to the MongoDB Atlas website ([cloud.mongodb.com](https://cloud.mongodb.com/)).
                2. Sign up for a new account (it's free).
                3. Create a new "Shared Cluster" (the M0 Free Tier).
                4. Follow the prompts to configure your cluster. You'll need to set up network access (whitelist your IP address or allow access from anywhere for simplicity during learning, though not recommended for production) and create a database user.
                5. Once your cluster is provisioned, you'll get a connection string. This is crucial for connecting your Node.js application. It will look something like this (with placeholders for your credentials and cluster details):
                `mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority`
    - Connecting to MongoDB with Mongoose
        
        Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward, schema-based solution to model your application data. It sits on top of the official MongoDB Node.js driver and makes interacting with MongoDB much easier and more structured.
        
        Think of Mongoose as a translator and organizer. MongoDB itself is "schemaless," meaning you can store documents with different structures in the same collection. While flexible, this can lead to inconsistencies. Mongoose brings structure by allowing you to define a **schema**, which is like a blueprint for your documents.
        
        To connect using Mongoose, you'll first need to install it in your Node.js project:
        
        ```jsx
        npm install mongoose
        ```
        
        Then, in your Node.js code, you'll use the `mongoose.connect()` method:
        
        ```jsx
        // Import Mongoose
        const mongoose = require('mongoose');
        
        // Your MongoDB Atlas connection string
        // Remember to replace <username>, <password>, <cluster-url>, and <database-name>
        const mongoURI = 'mongodb+srv://your_username:your_password@your_cluster_url/your_database_name?retryWrites=true&w=majority';
        
        // Connect to MongoDB
        mongoose.connect(mongoURI)
          .then(() => console.log('MongoDB connected successfully!'))
          .catch(err => console.error('MongoDB connection error:', err));
        ```
        
    - Mongoose Schema & Model basics
        
        This is where Mongoose truly shines!
        
        - **Schema:** A Mongoose schema defines the structure of the documents within a collection. It defines the fields, their data types, default values, validators, and other properties. It's like defining a table structure in a relational database, but for your MongoDB document.
            
            ```jsx
            const mongoose = require('mongoose');
            
            const bookSchema = new mongoose.Schema({
              title: String,
              author: String,
              year: Number,
              // You can also add more complex configurations
              // pages: { type: Number, required: true, min: 1 },
              // publishedDate: { type: Date, default: Date.now }
            });
            ```
            
        - **Model:** A Mongoose model is a class that represents a collection in MongoDB. It's compiled from a schema and allows you to interact with the database (e.g., query, create, update, delete documents). When you create a model, Mongoose automatically pluralizes the model name to find the corresponding collection in MongoDB (e.g., `Book` model will look for the `books` collection).
            
            ```jsx
            const Book = mongoose.model('Book', bookSchema);
            // Now 'Book' is your model, ready to interact with the 'books' collection
            ```
            
    - Data types in schema
        
        Mongoose supports various schema data types, which are similar to JavaScript primitive types:
        
        - `String`
        - `Number`
        - `Boolean`
        - `Date`
        - `Buffer` (for storing binary data)
        - `Mixed` (a flexible type for anything, but generally discouraged for structured data as it loses the benefits of schema)
        - `ObjectId` (for referencing other documents, used for relationships)
        - `Array` (for arrays of specific types or mixed types)
        - `Decimal128` (for high-precision decimal numbers)
        - `Map` (for key-value pairs)
        
        You can define them simply as `String`, `Number`, etc., or as objects for more options:
        
        ```jsx
        const exampleSchema = new mongoose.Schema({
          name: String, // Simple String type
          age: { type: Number, min: 0, max: 120 }, // Number with validation options
          isActive: Boolean,
          createdAt: { type: Date, default: Date.now }, // Date with a default value
          tags: [String], // Array of Strings
          metadata: mongoose.Schema.Types.Mixed // Using Mixed type (use with caution!)
        });
        ```
        
    
    - Creating documents using `.create()` and `.save()`
        
        Once you have a model, you can create new documents (records) in your MongoDB collection.
        
        - **`.create()`:** This is a static method on the model that creates and saves one or more documents in a single step. It's often preferred for its conciseness.
            
            ```jsx
            // Assuming 'Book' model is already defined
            async function createNewBook() {
              try {
                const newBook = await Book.create({
                  title: 'The Hobbit',
                  author: 'J.R.R. Tolkien',
                  year: 1937
                });
                console.log('Book created:', newBook);
              } catch (err) {
                console.error('Error creating book:', err);
              }
            }
            
            createNewBook();
            ```
            
        - **`.save()`:** This is an instance method. You first create an instance of your model, set its properties, and then call `.save()` on that instance. This is useful when you want to perform some operations on the document before saving it or for updating existing documents.
            
            ```jsx
            // Assuming 'Book' model is already defined
            async function createAndSaveBook() {
              const anotherBook = new Book({
                title: 'Pride and Prejudice',
                author: 'Jane Austen',
                year: 1813
              });
            
              try {
                const savedBook = await anotherBook.save();
                console.log('Another book saved:', savedBook);
              } catch (err) {
                console.error('Error saving another book:', err);
              }
            }
            
            createAndSaveBook();
            ```
            
    
    ### 💻 Task:
    
    - Connect to MongoDB Atlas
        
        **Ensure MongoDB Atlas Setup:** Make sure you have a MongoDB Atlas account, a free tier cluster running, and you've noted down your connection string (with your actual username and password).
        
        - **Ensure MongoDB Atlas Setup:** Make sure you have a MongoDB Atlas account, a free tier cluster running, and you've noted down your connection string (with your actual username and password).
        - **Create a Node.js Project:**
            - Create a new folder for your project (e.g., `mongoose-demo`).
            - Initialize a new Node.js project: `npm init -y`
            - Install Mongoose: `npm install mongoose`
            - Create a connect Service in service/mongo.js
            - Run this connect function/service into your app.js or index.js any where in root level.
        
        Note: I have use Our Existing Project.
        
    - Create a Mongoose schema for `Book`:
        
        Book.js
        
        ```jsx
        // Schema Only
        const mongoose = require('mongoose');
        const bookSchema = new mongoose.Schema({
            title: { type: String, required: true },
            author: { type: String, required: true },
            year: { type: Number, required: true }
          });
          
        ```
        
    
    ### 🔁 Assignment:
    
    - Create a Mongoose model for `User` with validation (e.g., `required` fields)
    Try Yourself.
    I have simply solve this in models/User.js