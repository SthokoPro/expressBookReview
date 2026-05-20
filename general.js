const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); 


public_users.post("/register", (req,res) => {
  //Write your code here
  //Task 6

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({
      message: "Unable to register user."
    });
  }

  if (!isValid(username)) {
    return res.status(404).json({
      message: "User already exists!"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });

});

// Get the book list available in the shop

public_users.get('/',function (req, res) {
  //Write your code here
  //Task 1
  res.send(JSON.stringify(books,null,4));
});

public_users.get('/asyncbooks', async function (req, res) {
  //Task 10
  try {

    const response = await axios.get('http://localhost:5000/');

    return res.status(200).json({
      books: response.data
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error fetching books"
    });

  }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //Task 2  
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn], null, 4));
 });

public_users.get('/async/isbn/:isbn', async function (req, res) {
  //Task 11
  try {

    const isbn = req.params.isbn;

    const response = await axios.get(
      `http://localhost:5000/isbn/${isbn}`
    );

    return res.status(200).json({
      book: response.data
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error fetching book details"
    });

  }

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //Task 3
  const author = req.params.author;

  let filteredBooks = {};

  const bookKeys = Object.keys(books);

  bookKeys.forEach(key => {

    if (books[key].author === author) {
      filteredBooks[key] = books[key];
    }

  });

  res.send(JSON.stringify(filteredBooks, null, 4));
});

public_users.get('/async/author/:author', async function (req, res) {
  //Task 12
  try {

    const author = req.params.author;

    const response = await axios.get(
      `http://localhost:5000/author/${author}`
    );

    return res.status(200).json({
      books: response.data
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error fetching books by author"
    });

  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //Task 4

  const title = req.params.title;

  let filteredBooks = {};

  const bookKeys = Object.keys(books);

  bookKeys.forEach(key => {

    if (books[key].title === title) {
      filteredBooks[key] = books[key];
    }

  });

  res.send(JSON.stringify(filteredBooks, null, 4));
});

public_users.get('/async/title/:title', async function (req, res) {
  //Task 13
  const title = req.params.title;

  try {

    const response = await axios.get('http://localhost:5000/');

    const books = response.data;

    let filteredBooks = {};

    const bookKeys = Object.keys(books);

    bookKeys.forEach(key => {

      if (books[key].title === title) {
        filteredBooks[key] = books[key];
      }

    });

    return res.status(200).json(filteredBooks);

  } catch (error) {

    return res.status(500).json({
      message: "Error retrieving books by title"
    });

  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //Task 5

  const isbn = req.params.isbn;

  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
