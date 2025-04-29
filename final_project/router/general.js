const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  console.log(req.body);
  // Check for missing username or password
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }
  // Check if the username already exists
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({
      message: "Username already exists. Please choose another one.",
    });
  }
  // Register the new user
  users.push({ username, password });
  return res.status(201).json({
    message: "User registered successfully",
    user: { username },
  });
});

// Get the book list available in the shop
//public_users.get("/", function (req, res) {
//Write your code here
// return res.status(200).json(books);
//});

// Task 10: Get all books using Axios and async/await
public_users.get("/books-promise", (req, res) => {
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books not found");
    }
  });

  getBooks
    .then((bookList) => res.status(200).json(bookList))
    .catch((err) => res.status(500).json({ message: err }));
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   if (book) {
//     res.status(200).json(book);
//   } else {
//     res.status(400).send("Book not found with given isbn");
//   }
// });
public_users.get("/isbn-promise/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const getBookByIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    });
  };

  try {
    const book = await getBookByIsbn(isbn);
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   const authorName = req.params.author.toLowerCase();

//   // Filter books by author
//   const filteredBooks = Object.values(books).filter(
//     (book) => book.author.toLowerCase() === authorName
//   );

//   if (filteredBooks.length === 0) {
//     return res.status(404).json({ message: "No books found for this author" });
//   }

//   return res.status(200).json(filteredBooks);
// });
public_users.get("/author-promise/:author", (req, res) => {
  const author = req.params.author.toLowerCase();

  const getBooksByAuthor = new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author
    );
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found for this author");
    }
  });

  getBooksByAuthor
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   //Write your code here
//   const titleName = req.params.title.toLowerCase();

//   // Filter books by title
//   const filteredBooks = Object.values(books).filter(
//     (book) => book.title.toLowerCase() === titleName
//   );

//   if (filteredBooks.length === 0) {
//     return res.status(404).json({ message: "No books found for this title" });
//   }

//   return res.status(200).json(filteredBooks);
// });
public_users.get("/title-promise/:title", async (req, res) => {
  const title = req.params.title.toLowerCase();

  const getBooksByTitle = () => {
    return new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(
        (book) => book.title.toLowerCase() === title
      );
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("No books found for this title");
      }
    });
  };

  try {
    const books = await getBooksByTitle();
    res.status(200).json(books);
  } catch (err) {
    res.status(404).json({ message: err });
  }
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
