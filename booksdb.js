js
// Task 1: GET /  -> All books

public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Output:
 {
   "1": {
     "author": "Chinua Achebe",
     "title": "Things Fall Apart",
     "reviews": {}
  }
 }

// ===============================================================================================
js
// Task 2: GET /isbn/:isbn -> Book by ISBN

public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;
    
    return res.status(200).json(books[isbn]);

});

// Example:
 GET /isbn/1
// Output:
 {
  "author": "Chinua Achebe",
   "title": "Things Fall Apart",
   "reviews": {}
 }

// ===============================================================================================
js
// Task 3: GET /author/:author -> Books by author

public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    const filteredBooks = Object.values(books).filter(
        (book) => book.author === author
    );

    return res.status(200).json(filteredBooks);

});

// Example:
GET /author/Chinua Achebe
// Output:
 [
   {
     "author": "Chinua Achebe",
      "title": "Things Fall Apart",
      "reviews": {}
  }
 ]

// ===============================================================================================
// Task 4: GET /title/:title -> Books by title

public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    const filteredBooks = Object.values(books).filter(
        (book) => book.title === title
    );

    return res.status(200).json(filteredBooks);

});

// Example:
 GET /title/Things Fall Apart

// ===============================================================================================
// Task 5: GET /review/:isbn -> Book review


public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn].reviews);

});

// Example:
 GET /review/1

// ===============================================================================================
// Task 6: POST /register -> Register user


public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {

        let userExists = users.find(
            (user) => user.username === username
        );

        if (!userExists) {

            users.push({
                username: username,
                password: password
            });

            return res.status(200).json({
                message: "User successfully registered"
            });

        }

        return res.status(404).json({
            message: "User already exists!"
        });
    }

    return res.status(404).json({
        message: "Unable to register user."
    });

});
// ===============================================================================================
// Task 7: POST /customer/login -> Login user

registered_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({
            message: "Error logging in"
        });
    }

    let authenticatedUser = users.find(
        (user) =>
            user.username === username &&
            user.password === password
    );

    if (authenticatedUser) {

        let accessToken = jwt.sign(
            {
                data: password
            },
            'access',
            {
                expiresIn: 60 * 60
            }
        );

        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).send("User successfully logged in");

    }

    return res.status(208).json({
        message: "Invalid Login. Check username and password"
    });

});

// ===============================================================================================
// Task 8: PUT /customer/auth/review/:isbn
// Add or modify review

registered_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    const review = req.query.review;

    const username = req.session.authorization.username;

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review successfully added/modified."
    });

});

// ===============================================================================================
// Task 9: DELETE /customer/auth/review/:isbn
// Delete review

registered_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    const username = req.session.authorization.username;

    if (books[isbn].reviews[username]) {

        delete books[isbn].reviews[username];

    }

    return res.status(200).json({
        message: "Review successfully deleted."
    });

});

// ===============================================================================================
// Task 10: Get all books using async callback
const axios = require("axios");

async function getAllBooks() {
  const response = await axios.get("http://localhost:5000/");
  console.log(response.data);
}

getAllBooks();

// ===============================================================================================
// Task 11: Search by ISBN using Promises
const axios = require("axios");

function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:5000/isbn/${isbn}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

getBookByISBN(1).then(console.log).catch(console.error);

// ===============================================================================================
// Task 12: Search by Author
const axios = require("axios");

async function getBooksByAuthor(author) {
  const response = await axios.get(`http://localhost:5000/author/${author}`);
  console.log(response.data);
}

getBooksByAuthor("Chinua Achebe");

// ===============================================================================================
// Task 13: Search by Title
const axios = require("axios");

async function getBooksByTitle(title) {
  const response = await axios.get(`http://localhost:5000/title/${title}`);
  console.log(response.data);
}

getBooksByTitle("Things Fall Apart");
