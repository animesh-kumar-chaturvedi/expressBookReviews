const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let BookPromise = new Promise((resolve,reject) => {
  setTimeout(() => {
    resolve(books)
  },10000)})

  let bookById = (isbn) =>{

    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        resolve(books[isbn])
      }),10000
    })

  }

  let bookByAuthor = (author) =>{
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        for (const book in books){
          if(books[book].author == author){
           resolve(books[book])
          }
        }
        reject("Book Not Found")
      }),10000
    })}


    let bookByTitle = (title) =>{
      return new Promise((resolve,reject)=>{
        setTimeout(()=>{
          for (const book in books){
            if(books[book].title == title){
             resolve(books[book])
            }
          }
          reject("Book Not Found")
        }),10000
      })}


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

  BookPromise.then((data) => {
    return res.status(200).json(data)
  }).catch((err)=>{
    return res.status(204).json({"message": "Error getting available books"})
  })



  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {


  isbn = req.params.isbn

  return bookById(isbn).then(data => {
    console.log(data)
    return res.status(200).json(data)
  }).catch((err)=>{
    return res.status(204).json({"message": "Error getting available books"})
  })




 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  bookByAuthor(req.params.author)
  .then((data)=>{
    return res.status(200).json(data)
  }).catch(err =>{
    return res.send(err)
  })

  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res)  {
  bookByTitle(req.params.title)
  .then((data)=>{
    return res.status(200).json(data)
  }).catch(err =>{
    return res.send(err)
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbn = req.params.isbn

  res.send(books[isbn].review)
});

module.exports.general = public_users;
