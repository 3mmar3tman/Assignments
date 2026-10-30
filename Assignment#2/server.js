const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

  // =========================
  // POST /user
  // =========================
  if (req.method === "POST" && req.url === "/user") {
    
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const newUser = JSON.parse(body);

      const data = fs.readFileSync("users.json", "utf8");

      const users = JSON.parse(data);

      const emailExists = users.some(
        (user) => user.email === newUser.email
      );

      if (emailExists) {
        res.writeHead(409, {
          "Content-Type": "application/json"
        });

        return res.end(
          JSON.stringify({
            message: "Email already exists."
          })
        );
      }

      newUser.id = Date.now();

      users.push(newUser);

      fs.writeFileSync(
        "users.json",
        JSON.stringify(users, null, 2)
      );

      res.writeHead(201, {
        "Content-Type": "application/json"
      });

      res.end(
        JSON.stringify({
          message: "User added successfully."
        })
      );
    });

    return;
  }


  // =========================
  // PATCH /user/id
  // =========================
  if (req.method === "PATCH" && req.url.startsWith("/user/")) {

    // Get ID from URL
    const id = req.url.split("/")[2];

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {

      // Read users.json
      const data = fs.readFileSync("users.json", "utf8");

      const users = JSON.parse(data);

      // Find user by ID
      const user = users.find(
        (user) => user.id == id
      );

      // User not found
      if (!user) {
        res.writeHead(404, {
          "Content-Type": "application/json"
        });

        return res.end(
          JSON.stringify({
            message: "User not found."
          })
        );
      }

      // Convert body from JSON string to object
      const updatedData = JSON.parse(body);

      // Update name
      if (updatedData.name !== undefined) {
        user.name = updatedData.name;
      }

      // Update age
      if (updatedData.age !== undefined) {
        user.age = updatedData.age;
      }

      // Update email
      if (updatedData.email !== undefined) {
        user.email = updatedData.email;
      }

      // Save changes to users.json
      fs.writeFileSync(
        "users.json",
        JSON.stringify(users, null, 2)
      );

      res.writeHead(200, {
        "Content-Type": "application/json"
      });

      res.end(
        JSON.stringify({
          message: "User updated successfully.",
          user: user
        })
      );
    });

    return;
  }
  // =========================
  // Delete /user
  // =========================
  

  if (req.method === "DELETE" && req.url.startsWith("/user/")) {
  const id = req.url.split("/")[2];

  const data = fs.readFileSync("users.json", "utf8");

  const users = JSON.parse(data);

  const userIndex = users.findIndex(
    (user) => user.id == id
  );

  if (userIndex === -1) {
    res.writeHead(404, {
      "Content-Type": "application/json"
    });

    return res.end(
      JSON.stringify({
        message: "User not found."
      })
    );
  }

  users.splice(userIndex, 1);

  fs.writeFileSync(
    "users.json",
    JSON.stringify(users, null, 2)
  );

  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  return res.end(
    JSON.stringify({
      message: "User deleted successfully."
    })
  );
}

  // =========================
  // GET /users
  // =========================
  if (req.method === "GET" && req.url === "/user") {

  fs.readFile("users.json", "utf8", (err, data) => {

    if (err) {
      res.writeHead(500, {
        "Content-Type": "application/json"
      });

      return res.end(
        JSON.stringify({
          message: "Error reading users file"
        })
      );
    }

    const users = JSON.parse(data);

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    return res.end(JSON.stringify(users));
  });

  return;
}

});


server.listen(3000, () => {
  console.log("Server running on port 3000");
}); 