const mongoose = require("mongoose");
const User = require("../app/auth/auth.model/authModel");
const Book = require("../app/book/bookModel");
const Author = require("../app/book/authorModel");
const Genre = require("../app/book/genersModel");
const Review = require("../app/book/reviewsModel");
const uri = "mongodb://0.0.0.0:27017/bookapp"; // Replace with your database name

const usersData = [
  {
    first_name: "user1",
    last_name: "user1",
    phone: 988888888,
    username: "user1",
    email: "user1@example.com",
    password: "password1",
  },
  {
    first_name: "user2",
    last_name: "user2",
    phone: 988888888,
    username: "user2",
    email: "user2@example.com",
    password: "password2",
  },
];

// Sample data for authors
const authorsData = [
  {
    name: "Author 1",
    birthdate: new Date("1990-01-01"),
    biography: "Author 1 biography...",
  },
  {
    name: "Author 2",
    birthdate: new Date("1985-03-15"),
    biography: "Author 2 biography...",
  },
];

const genresData = [
  {
    name: "Fiction",
  },
  {
    name: "Fantasy",
  },
];

// Sample data for books
const booksData = [
  {
    title: "Book 1",
    publicationYear: 2010,
    ISBN: "978-1234567890",
    description: "Book 1 description...",
    coverImageURL: "https://example.com/book1.jpg",
    authors: [],
    genres: [],
  },
  {
    title: "Book 2",
    publicationYear: 2015,
    ISBN: "978-0987654321",
    description: "Book 2 description...",
    coverImageURL: "https://example.com/book2.jpg",
    authors: [],
    genres: [],
  },
  // Add more books as needed
];

// Sample data for reviews
const reviewsData = [
  {
    book: "",
    user: "",
    rating: 4,
    reviewText: "This book is great!",
  },
  {
    book: "",
    user: "",
    rating: 5,
    reviewText: "Amazing book, highly recommended!",
  },
  // Add more reviews as needed
];

async function seedDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Insert users data
    const insertedUsers = await User.insertMany(usersData);

    // Insert authors data
    const insertedAuthors = await Author.insertMany(authorsData);

    // Insert genres data
    const insertedGenres = await Genre.insertMany(genresData);

    // Populate books' authors and genres fields with ObjectIds
    const populatedBooksData = booksData.map((book) => ({
      ...book,
      authors: insertedAuthors.map((author) => author._id),
      genres: insertedGenres.map((genre) => genre._id),
    }));
    const insertedBooks = await Book.insertMany(populatedBooksData);

    // Populate reviews' book and user fields with ObjectIds
    const populatedReviewsData = reviewsData.map((review) => ({
      ...review,
      book: insertedBooks[0]._id,
      user: insertedUsers[0]._id,
    }));
    await Review.insertMany(populatedReviewsData);

    console.log("Database seeding completed!");
  } catch (err) {
    console.error("Error seeding the database:", err);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();
