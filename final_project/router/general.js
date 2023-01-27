const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
 let username = req.body.username
 let password = req.body.password

if(!(username && password)){
  res.json({"message" : "Invalid Username or password"})
}

if(!isValid(username)){
  res.json({"message" : "Username already exists"})
}

users.push({
  "username" : username,
  "password" : password
})

res.status(200).json({"message" : "User Registered Succssfully"})

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  res.status(302).send(books[req.params.isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let resBook
  for (const book in books){

    bookAuthor = req.params.author

    if(books[book].author == bookAuthor){
      resBook = books[book]
      break;
    }
  }

  if(resBook){
    res.status(302).send(resBook)

  }else{

    res.status(404).send(`No book found by author ${bookAuthor}`)
  }

  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res)  {
  let resBook

  for (const book in books){

    bookTitle = req.params.title

    if(books[book].title == bookTitle){
      resBook = books[book]
      break;
      
    }
  }
  if(resBook){
    res.status(302).send(resBook)
  }else{
    res.status(404).send(`No book found by author ${bookTitle}`)
  }

  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbn = req.params.isbn

  res.send(books[isbn].review)
});

module.exports.general = public_users;
