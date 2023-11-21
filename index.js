const express = require("express");
const model = require("./model");
const Blog = require("./blogmodel");
const db = require("mongoose");
const { body, validationResult } = require('express-validator');

const connectDB = require("./mongo");
const app =express();
app.use(express.json());
connectDB();
const PORT = 8003;
app.get("/",async(req,res)=>{
  res.send("Hello World");
});

const validateRegistration = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
  ];


app.post("/createlogin",validateRegistration,async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await model.findOne({ email, password });
      if (user) {
            res.status(200).json({ message: 'User Exists' });
      } else {
            const { email, password } = req.body;
            try {
            const user = new model({ email, password });
            await user.save();
            res.status(201).json({ message: 'User registered successfully' });
            } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await model.findOne({ email, password });
      
      if (user) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
app.post("/createBlog/:email",async(req,res)=>{ 
    const { email } = req.params;
    const modifiedEmail = email.replace(':', '');
    const user = await model.findOne({ 'email': modifiedEmail});
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }
    try { 
      const newBlog = new Blog({ id: modifiedEmail, title: req.body.title, description: req.body.description });
      await newBlog.save();
  
      res.status(201).json({ message: 'Blog created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
    
});

app.get('/blogs/:blogId', async (req, res) => {
    const { blogId } = req.params; 
    const modifiedEmail = blogId.replace(':','');
    const blog = await Blog.find({'id':modifiedEmail});
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    try {
    
      res.status(200).json(blog);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.put('/blog/:blogId', async (req, res) => {
    const { blogId } = req.params; 
    const modifiedEmail = blogId.replace(':', '');
    try {
      const blog = await Blog.updateOne({'_id':modifiedEmail},{$set:{'title':req.body.title,'description':req.body.description}});
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not updated' });
      }
      res.status(200).json(blog);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  app.get('/blogdelete/:blogId', async (req, res) => {
    const { blogId } = req.params;
    const modified = blogId.replace(':', '');

    try {
      const blog = await Blog.deleteOne({'_id':modified});
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not deleted!' });
      }
      res.status(200).json(blog);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  


app.listen(PORT,(req,error)=>{
    if(error) throw error
    console.log(`Server Run on localhost:.${PORT}`)
});