const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
users.forEach((user) => {
  if(user.username == username){
    return false;
  }
})
return true
}

const authenticatedUser = (username,password)=>{

if(!(username && password)) return false

 foundUser =  users.find(user => user.username == username)

 if( foundUser.password == password) return true

 return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  username = req.body.username
  password = req.body.password

  if(!(username && password)) return res.status(404).json({"meassage" : "User Not Found"})

  if(authenticatedUser(username,password)){
    accessToken =  jwt.sign({user: username}, 'secret' , {expiresIn : '1h'})
   req.session.authorization = {
    accessToken,username
}

  return res.status(200).json({"meassage" : "User Logged In"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  isbn = req.params.isbn
  review = req.query.review

  username=req.session.authorization.username

  let originalReview = users[isbn].reviews

  console.log(originalReview)
  console.log(typeof( originalReview))



  users[isbn].review.push({username:review})

  return res.json({"message":"review updated sucessfully"})



});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
