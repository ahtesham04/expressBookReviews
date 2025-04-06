const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(400).send("Book not found with given isbn");
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const authorName = req.params.author.toLowerCase();

  // Filter books by author
  const filteredBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === authorName
  );

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }

  return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const titleName = req.params.title.toLowerCase();

  // Filter books by title
  const filteredBooks = Object.values(books).filter(
    (book) => book.title.toLowerCase() === titleName
  );

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: "No books found for this title" });
  }

  return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const rIsbn = req.params.isbn;

  // Filter books by title
  const filteredBooks = Object.values(books).filter(
    (book) => book.reviews.isbn === rIsbn
  );

  if (filteredBooks.length === 0) {
    return res
      .status(404)
      .json({ message: "No books found for this review isbn" });
  }

  return res.status(200).json(filteredBooks);
});

module.exports.general = public_users;
