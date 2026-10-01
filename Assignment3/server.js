const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const PORT = 3000;
const FILE_PATH = "./users.json";


function readUsers() {
  const data = fs.readFileSync(FILE_PATH, "utf-8");

  if (!data.trim()) {
    return [];
  }

  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(
    FILE_PATH,
    JSON.stringify(users, null, 2)
  );
}

// 1. Create User
app.post("/user", (req, res) => {
  const { name, age, email } = req.body;

  // Check required fields
  if (!name || !age || !email) {
    return res.status(400).json({
      message: "Name, age and email are required"
    });
  }

  // Read users from JSON file
  const users = readUsers();

  // Check if email already exists
  const existingUser = users.find(
    user => user.email === email
  );

  if (existingUser) {
    return res.status(409).json({
      message: "Email already exists"
    });
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    age,
    email
  };

  // Add user
  users.push(newUser);

  // Save users to JSON file
  writeUsers(users);

  // Send response
  res.status(201).json({
    message: "User added successfully",
    user: newUser
  });
});

// 2. Update User
app.patch("/user/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, email } = req.body;

  // Read users from JSON file
  const users = readUsers();

  // Find user by ID
  const user = users.find(user => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  // Update only the values that were provided
  if (name !== undefined) {
    user.name = name;
  }

  if (age !== undefined) {
    user.age = age;
  }

  if (email !== undefined) {
    user.email = email;
  }

  // Write updated users to JSON file
  writeUsers(users);

  res.status(200).json({
    message: "User updated successfully",
    user: user
  });
});

// 3. Delete User
app.delete("/user/:id", (req, res) => {
  const { id } = req.params;

  // Read users from JSON file
  const users = readUsers();

  // Find user by ID
  const userIndex = users.findIndex(user => user.id === id);

  // User not found
  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  // Save deleted user before removing it
  const deletedUser = users[userIndex];

  // Delete user from array
  users.splice(userIndex, 1);

  // Update JSON file
  writeUsers(users);

  res.status(200).json({
    message: "User deleted successfully",
    user: deletedUser
  });
});


// 4. Get User by Name
app.get("/user/getByName", (req, res) => {

  // Get name from query parameter
  const { name } = req.query;

  // Check if name was provided
  if (!name) {
    return res.status(400).json({
      message: "Name is required"
    });
  }

  // Read users from JSON file
  const users = readUsers();

  // Find user by name
  const user = users.find(
    user => user.name.toLowerCase() === name.toLowerCase()
  );

  // Check if user was not found
  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  // Send user
  res.status(200).json(user);
});


// 5. Get All Users
app.get("/user", (req, res) => {

  // Read users from JSON file
  const users = readUsers();

  // Send all users
  res.status(200).json(users);
});


// 6. Filter Users by Minimum Age
app.get("/user/filter", (req, res) => {

  // Get minimum age from query parameter
  const { minAge } = req.query;

  // Check if minAge was provided
  if (minAge === undefined) {
    return res.status(400).json({
      message: "minAge is required"
    });
  }

  // Convert minAge from string to number
  const minimumAge = Number(minAge);

  // Check if minAge is a valid number
  if (isNaN(minimumAge)) {
    return res.status(400).json({
      message: "minAge must be a number"
    });
  }

  // Read users from JSON file
  const users = readUsers();

  // Filter users by minimum age
  const filteredUsers = users.filter(
    user => Number(user.age) >= minimumAge
  );

  // Send filtered users
  res.status(200).json(filteredUsers);
});

// 7. Get User by ID
app.get("/user/:id", (req, res) => {

  const { id } = req.params;

  // Read users from JSON file
  const users = readUsers();

  // Find user by ID
  const user = users.find(
    user => user.id === id
  );

  // Check if user was not found
  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  // Send user
  res.status(200).json(user);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});