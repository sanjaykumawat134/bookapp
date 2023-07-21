const { BAD_REQUEST, SUCCESS_STATUS } = require("../../../helper/statusCode");
const bcrypt = require("bcrypt");
const process = require("process");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Book = require("../book/bookModel");
const Author = require("../book/authorModel");
const User = require("../auth/auth.model/authModel");
const Review = require("../book/reviewsModel");
const book = {};

book.getBooks = async (req, res) => {
  try {
    const { title, author, genre, page, limit } = req.query;
    // Building the query based on the provided search parameters
    const query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (genre) {
      query.genres = { $regex: genre, $options: "i" };
    }

    if (author) {
      const authorQuery = { name: { $regex: author, $options: "i" } };
      const authors = await Author.find(authorQuery);
      const authorIds = authors.map((author) => author._id);
      query.authors = { $in: authorIds };
    }

    // Pagination options
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    const books = await Book.find(query)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate("authors", "name")
      .populate("genres", "name");

    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / pageSize);

    res.json({
      totalBooks,
      totalPages,
      currentPage: pageNumber,
      books,
    });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "An error occurred while fetching books." });
  }
};

book.addBookToCollection = async (req, res) => {
  try {
    const { userId } = req.body;
    const { bookId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    // Add the book to the user's collection
    if (!user.books.includes(bookId)) {
      user.books.push(bookId);
      await user.save();
      res.json({
        message: "Book added to the user's collection successfully.",
      });
    } else {
      res.json({ message: "Book already exists in the user's collection." });
    }
  } catch (err) {
    console.error("Error adding book to the user's collection:", err);
    res.status(500).json({
      error: "An error occurred while adding the book to the collection.",
    });
  }
};

book.addReview = async (req, res) => {
  try {
    const { bookId } = req.query;
    const { rating, reviewText } = req.body;

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    //   const user = await User.findById(userId);
    //   if (!user) {
    //     return res.status(404).json({ error: "User not found." });
    //   }

    // Create the review
    const newReview = new Review({
      book: bookId,
      user: userId,
      rating,
      reviewText,
    });

    // Save the review to the database
    await newReview.save();

    res.json({ message: "Review added successfully." });
  } catch (err) {
    console.error("Error leaving review:", err);
    res
      .status(500)
      .json({ error: "An error occurred while leaving the review." });
  }
};

book.getBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Check if the book exists
    const book = await Book.findById(bookId)
      .populate("authors", "name")
      .populate("genres", "name");

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    res.json(book);
  } catch (err) {
    console.error("Error browsing book:", err);
    res
      .status(500)
      .json({ error: "An error occurred while browsing the book." });
  }
};

book.removeBookFromCollection = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bookIds } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Remove books from the user's collection
    user.books = user.books.filter((bookId) => !bookIds.includes(bookId));
    await user.save();

    res.json({
      message: "Books removed from the user's collection successfully.",
    });
  } catch (err) {
    console.error("Error removing books from the user's collection:", err);
    res.status(500).json({
      error:
        "An error occurred while removing books from the user's collection.",
    });
  }
};

book.updatedReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;

    // Check if the review exists
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    // Update the review properties
    if (rating !== undefined) {
      review.rating = rating;
    }
    if (reviewText !== undefined) {
      review.reviewText = reviewText;
    }

    await review.save();

    res.json({
      message: "Review updated successfully.",
      updatedReview: review,
    });
  } catch (err) {
    console.error("Error updating review:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the review." });
  }
};
