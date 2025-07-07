const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// --- Blog Post API Routes ---

//Retrieve a list of all blog posts
app.get('/posts', (req, res) => {
    // In a real application, you would fetch posts from a database here.
    const posts = [
        { id: 1, title: 'My First Blog Post', content: 'This is the content of my first post.' },
        { id: 2, title: 'Learning REST APIs', content: 'A guide to understanding REST principles.' }
    ];
    res.status(200).json(posts); // 200 OK
});

//Retrieve a specific blog post by its ID
app.get('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id); // Get ID from URL parameter
    // In a real application, you would fetch the post from a database.
    const post = { id: postId, title: `Blog Post ${postId}`, content: `Content of post ${postId}` };

    if (post.id === postId) { // Simplified check, in real app, check if post exists in DB
        res.status(200).json(post); // 200 OK
    } else {
        res.status(404).send('Post not found'); // 404 Not Found
    }
});

//Create a new blog post
app.post('/posts', (req, res) => {
    const newPost = req.body; // Data for the new post comes from the request body
    // In a real application, you would save this newPost to a database.
    console.log('New post created:', newPost);
    // Assign a new ID (in a real app, this would be handled by the database)
    newPost.id = Math.floor(Math.random() * 1000) + 3; // Mock ID generation
    res.status(201).json({ message: 'Post created successfully', post: newPost }); // 201 Created
});

// 4. PUT /posts/:id
// Objective: Fully update an existing blog post
app.put('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const updatedPostData = req.body; // New data for the post
    
    console.log(`Updating post ${postId} with data:`, updatedPostData);
    res.status(200).json({ message: `Post ${postId} updated successfully`, updatedData: updatedPostData }); // 200 OK
});

//Delete a specific blog post
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    console.log(`Deleting post with ID: ${postId}`);
    // Assume deletion was successful
    res.status(200).send(`Post ${postId} deleted successfully`); // 200 OK
    // Or res.status(204).send() for no content response
});

app.listen(port, () => {
    console.log(`Blog Post API listening at http://localhost:${port}`);
});