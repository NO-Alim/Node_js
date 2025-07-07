- ✅ **Day 8: REST API Fundamentals**
    
    ### 🎯 Objective:
    
    - Understand what REST is and how to structure RESTful endpoints.
    
    ### 📚 Topics:
    
    - What is REST?
        
        At its core, **REST** stands for **REpresentational State Transfer**. Don't let the fancy name intimidate you; it's a set of architectural principles for designing networked applications. Think of it as a set of guidelines that make web services more scalable, flexible, and easy to use.
        
        The two most important concepts within REST are:
        
        1. **Stateless:** This means that each request from a client to a server must contain all the information needed to understand the request. The server should not store any client context between requests. Imagine you're talking to someone, and every time you speak, you have to introduce yourself and provide all the necessary background information. That's how statelessness works. This makes the server simpler, more scalable, and more reliable because it doesn't have to remember past interactions.
        2. **Resource-based:** In REST, everything is a "resource." A resource is essentially any information that can be named and addressed. For example, a blog post is a resource, a user is a resource, or a product is a resource. Each resource has a unique identifier (a URL), and you interact with these resources using standard HTTP methods.
        
        ### HTTP Methods: Your API's Verbs
        
        HTTP methods, often called verbs, tell the server what action you want to perform on a resource. These are crucial for building RESTful APIs.
        
        - **GET:** Used to **retrieve** data from the server. It's safe and idempotent (making the same GET request multiple times will have the same result).
            - *Example:* Getting a list of all blog posts or a specific blog post.
        - **POST:** Used to **create** new resources on the server.
            - *Example:* Creating a new blog post.
        - **PUT:** Used to **fully update** an existing resource. When you use PUT, you typically send the *entire* updated resource to the server. If the resource doesn't exist, PUT can sometimes create it, but its primary purpose is full replacement.
            - *Example:* Updating all fields of an existing blog post.
        - **PATCH:** Used to **partially update** an existing resource. With PATCH, you only send the specific fields you want to change, not the entire resource.
            - *Example:* Updating only the title of a blog post, leaving the content as is.
        - **DELETE:** Used to **remove** a resource from the server.
            - *Example:* Deleting a specific blog post.
    - Status Codes: The Server's Response Language
        
        When you make an HTTP request, the server responds with a status code. These codes tell you whether your request was successful, if there was an error, or if something else happened. Understanding them is vital for debugging and building robust applications.
        
        Here are some common ones you'll encounter:
        
        - **200 OK:** The request was successful, and the server has returned the requested data (e.g., a GET request was successful).
        - **201 Created:** The request was successful, and a new resource has been created (e.g., a POST request successfully created a new blog post).
        - **400 Bad Request:** The server cannot process the request due to a client error (e.g., malformed syntax, invalid request parameters).
        - **401 Unauthorized:** The client is not authenticated and needs to provide valid credentials to access the resource.
        - **404 Not Found:** The requested resource could not be found on the server.
        - **500 Internal Server Error:** A generic error message indicating an unexpected condition on the server that prevented it from fulfilling the request. This usually means something went wrong on the server's side.
    - REST naming conventions and resource structures
        
        The beauty of REST lies in its predictability. By following consistent naming conventions, your API becomes intuitive and easy for other developers (and your future self!) to understand.
        
        - **Use Nouns for Resources:** Always use nouns (plural) to represent your resources. Avoid verbs in your URLs.
            - *Good:* `/posts`, `/users`, `/products`
            - *Bad:* `/getAllPosts`, `/createUser`, `/deleteProduct`
        - **Use Plural Nouns:** Conventionally, use plural nouns for collections of resources.
            - *Good:* `/posts` (represents a collection of blog posts)
            - *Bad:* `/post` (might represent a single post, but `posts` is clearer for the collection)
        - **Hierarchical Structure:** Organize your URLs to reflect relationships between resources.
            - *Example:* To get comments for a specific post: `/posts/:postId/comments`
        - **Resource Identification:** Use unique identifiers (usually `:id` in the URL path) to refer to a specific instance of a resource.
            - *Example:* `/posts/123` refers to the blog post with ID 123.
    - How to structure routes in Express (resource-centric)
        
        Express.js is a popular Node.js web application framework. It makes defining routes incredibly straightforward. When structuring routes in Express for a RESTful API, we follow the resource-centric approach we just discussed.
        
        Let's look at how you'd define routes for our "Blog Post" API:
        
        ```jsx
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
        ```
        
        **Explanation of the Express Routes:**
        
        - `app.get('/posts', ...)`: This handles **GET** requests to the `/posts` endpoint. It's designed to return a list of all blog posts.
        - `app.get('/posts/:id', ...)`: This handles **GET** requests for a *specific* post. The `:id` is a route parameter that captures the ID from the URL (e.g., `123` in `/posts/123`). We can access this using `req.params.id`.
        - `app.post('/posts', ...)`: This handles **POST** requests to `/posts`. It's used to create a *new* blog post. The data for the new post is sent in the request body, which we access via `req.body` (thanks to `app.use(express.json())`).
        - `app.put('/posts/:id', ...)`: This handles **PUT** requests to `/posts/:id`. It's for *fully updating* an existing post. Again, the updated data comes from `req.body`.
        - `app.delete('/posts/:id', ...)`: This handles **DELETE** requests to `/posts/:id`. It's used to *remove* a specific post.
    
    ### 💻 Task:
    
    - Design routes for a "Blog Post" API:
        - `GET /posts`
        - `GET /posts/:id`
        - `POST /posts`
        - `PUT /posts/:id`
        - `DELETE /posts/:id`
        
        task have done in ‘How to structure routes in Express (resource-centric)’ section
        
    
    ### 🔁 Assignment:
    
    - Create a mock route structure in Express for a `products` API (no DB yet).