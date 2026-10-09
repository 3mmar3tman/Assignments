const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || "store_db";

/*
====================================================
1. CREATE DATABASE
====================================================
*/

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  // Database name comes from .env
  // Backticks are used for the database identifier.
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``
  );

  await connection.end();

  console.log(`Database "${DB_NAME}" is ready`);
}

/*
====================================================
2. MYSQL CONNECTION POOL
====================================================
*/

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/*
====================================================
3. CREATE TABLES
====================================================
*/

async function createTables() {
  // Suppliers table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Suppliers (
      SupplierID INT AUTO_INCREMENT PRIMARY KEY,
      SupplierName VARCHAR(255),
      ContactNumber VARCHAR(50)
    )
  `);

  // Products table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Products (
      ProductID INT AUTO_INCREMENT PRIMARY KEY,
      ProductName VARCHAR(255),
      Price DECIMAL(10,2),
      StockQuantity INT,
      SupplierID INT,

      FOREIGN KEY (SupplierID)
      REFERENCES Suppliers(SupplierID)
    )
  `);

  // Sales table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Sales (
      SaleID INT AUTO_INCREMENT PRIMARY KEY,
      ProductID INT,
      QuantitySold INT,
      SaleDate DATE,

      FOREIGN KEY (ProductID)
      REFERENCES Products(ProductID)
    )
  `);

  console.log("Tables created successfully");
}

/*
====================================================
HOME
====================================================
*/

app.get("/", (req, res) => {
  res.json({
    message: "Store Management REST API",
    status: "Running",
  });
});

/*
====================================================
PART 3 - QUESTION 2
PRODUCTS CRUD
====================================================
*/

/*
----------------------------------------------------
Create Product
POST /products
----------------------------------------------------
*/

app.post("/products", async (req, res) => {
  try {
    const {
      ProductName,
      Price,
      StockQuantity,
      SupplierID,
    } = req.body;

    if (
      ProductName === undefined ||
      Price === undefined ||
      StockQuantity === undefined ||
      SupplierID === undefined
    ) {
      return res.status(400).json({
        message:
          "ProductName, Price, StockQuantity and SupplierID are required",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO Products
      (ProductName, Price, StockQuantity, SupplierID)
      VALUES (?, ?, ?, ?)
      `,
      [
        ProductName,
        Price,
        StockQuantity,
        SupplierID,
      ]
    );

    res.status(201).json({
      message: "Product created successfully",
      ProductID: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});


//Get All Products
//GET /products


app.get("/products", async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT *
      FROM Products
    `);

    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});


//Get Product By ID
//GET /products/:id

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.query(
      `
      SELECT *
      FROM Products
      WHERE ProductID = ?
      `,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(products[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

//Update Product
//PUT /products/:id

app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      ProductName,
      Price,
      StockQuantity,
      SupplierID,
    } = req.body;

    const [result] = await pool.query(
      `
      UPDATE Products
      SET
        ProductName = ?,
        Price = ?,
        StockQuantity = ?,
        SupplierID = ?
      WHERE ProductID = ?
      `,
      [
        ProductName,
        Price,
        StockQuantity,
        SupplierID,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});


//Delete Product
//DELETE /products/:id
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `
      DELETE FROM Products
      WHERE ProductID = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Cannot delete product. It may have related sales records.",
      error: error.message,
    });
  }
});

/*
====================================================
PART 3 - QUESTION 3
SUPPLIERS CRUD
====================================================
*/

//Create Supplier
//POST /suppliers


app.post("/suppliers", async (req, res) => {
  try {
    const {
      SupplierName,
      ContactNumber,
    } = req.body;

    if (
      SupplierName === undefined ||
      ContactNumber === undefined
    ) {
      return res.status(400).json({
        message:
          "SupplierName and ContactNumber are required",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO Suppliers
      (SupplierName, ContactNumber)
      VALUES (?, ?)
      `,
      [
        SupplierName,
        ContactNumber,
      ]
    );

    res.status(201).json({
      message: "Supplier created successfully",
      SupplierID: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

//Get All Suppliers
//GET /suppliers

app.get("/suppliers", async (req, res) => {
  try {
    const [suppliers] = await pool.query(`
      SELECT *
      FROM Suppliers
    `);

    res.json(suppliers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

//Update Supplier
//PUT /suppliers/:id

app.put("/suppliers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      SupplierName,
      ContactNumber,
    } = req.body;

    const [result] = await pool.query(
      `
      UPDATE Suppliers
      SET
        SupplierName = ?,
        ContactNumber = ?
      WHERE SupplierID = ?
      `,
      [
        SupplierName,
        ContactNumber,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json({
      message: "Supplier updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

//Delete Supplier
//DELETE /suppliers/:id


app.delete("/suppliers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `
      DELETE FROM Suppliers
      WHERE SupplierID = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Cannot delete supplier. It may have related products.",
      error: error.message,
    });
  }
});

/*
====================================================
PART 3 - QUESTION 4
SALES
====================================================
*/

//Record Sale
//POST /sales

app.post("/sales", async (req, res) => {
  try {
    const {
      ProductID,
      QuantitySold,
      SaleDate,
    } = req.body;

    if (
      ProductID === undefined ||
      QuantitySold === undefined ||
      SaleDate === undefined
    ) {
      return res.status(400).json({
        message:
          "ProductID, QuantitySold and SaleDate are required",
      });
    }

    // Check product exists
    const [products] = await pool.query(
      `
      SELECT *
      FROM Products
      WHERE ProductID = ?
      `,
      [ProductID]
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO Sales
      (ProductID, QuantitySold, SaleDate)
      VALUES (?, ?, ?)
      `,
      [
        ProductID,
        QuantitySold,
        SaleDate,
      ]
    );

    res.status(201).json({
      message: "Sale recorded successfully",
      SaleID: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

//Get All Sales
//GET /sales

app.get("/sales", async (req, res) => {
  try {
    const [sales] = await pool.query(`
      SELECT *
      FROM Sales
    `);

    res.json(sales);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});


//Get Sales For Specific Product
//GET /sales/product/:productId


app.get(
  "/sales/product/:productId",
  async (req, res) => {
    try {
      const { productId } = req.params;

      const [sales] = await pool.query(
        `
        SELECT *
        FROM Sales
        WHERE ProductID = ?
        `,
        [productId]
      );

      res.json(sales);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/*
====================================================
QUESTION 5
DATABASE MODIFICATIONS
====================================================
*/

//Add Category Column
//POST /database/add-category


app.post(
  "/database/add-category",
  async (req, res) => {
    try {
      // Check if Category already exists
      const [columns] = await pool.query(
        `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'Products'
        AND COLUMN_NAME = 'Category'
        `,
        [DB_NAME]
      );

      if (columns.length > 0) {
        return res.json({
          message: "Category column already exists",
        });
      }

      await pool.query(`
        ALTER TABLE Products
        ADD COLUMN Category VARCHAR(100)
      `);

      res.json({
        message: "Category column added successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

//Remove Category Column
//DELETE /database/remove-category

app.delete(
  "/database/remove-category",
  async (req, res) => {
    try {
      const [columns] = await pool.query(
        `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'Products'
        AND COLUMN_NAME = 'Category'
        `,
        [DB_NAME]
      );

      if (columns.length === 0) {
        return res.json({
          message: "Category column does not exist",
        });
      }

      await pool.query(`
        ALTER TABLE Products
        DROP COLUMN Category
      `);

      res.json({
        message: "Category column removed successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

//Change ContactNumber to VARCHAR(15)
//PUT /database/contact-number

app.put(
  "/database/contact-number",
  async (req, res) => {
    try {
      await pool.query(`
        ALTER TABLE Suppliers
        MODIFY COLUMN ContactNumber VARCHAR(15)
      `);

      res.json({
        message:
          "ContactNumber changed to VARCHAR(15)",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

//Add NOT NULL to ProductName
//PUT /database/product-name-not-null


app.put(
  "/database/product-name-not-null",
  async (req, res) => {
    try {
      await pool.query(`
        ALTER TABLE Products
        MODIFY COLUMN ProductName VARCHAR(255) NOT NULL
      `);

      res.json({
        message:
          "ProductName is now NOT NULL",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/*
====================================================
QUESTION 6
INSERT REQUIRED DATA
====================================================
*/


//POST /seed


app.post("/seed", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();


    //Create / Find FreshFoods
    

    let [suppliers] = await connection.query(
      `
      SELECT SupplierID
      FROM Suppliers
      WHERE SupplierName = ?
      LIMIT 1
      `,
      ["FreshFoods"]
    );

    let supplierId;

    if (suppliers.length === 0) {
      const [supplierResult] =
        await connection.query(
          `
          INSERT INTO Suppliers
          (SupplierName, ContactNumber)
          VALUES (?, ?)
          `,
          [
            "FreshFoods",
            "01001234567",
          ]
        );

      supplierId = supplierResult.insertId;
    } else {
      supplierId = suppliers[0].SupplierID;
    }

   //Insert Products
    
    const products = [
      ["Milk", 15.00, 50],
      ["Bread", 10.00, 30],
      ["Eggs", 20.00, 40],
    ];

    for (const product of products) {
      const [existingProduct] =
        await connection.query(
          `
          SELECT ProductID
          FROM Products
          WHERE ProductName = ?
          AND SupplierID = ?
          LIMIT 1
          `,
          [
            product[0],
            supplierId,
          ]
        );

      if (existingProduct.length === 0) {
        await connection.query(
          `
          INSERT INTO Products
          (ProductName, Price, StockQuantity, SupplierID)
          VALUES (?, ?, ?, ?)
          `,
          [
            product[0],
            product[1],
            product[2],
            supplierId,
          ]
        );
      }
    }

    
   //Get Milk ID
    

    const [milk] =
      await connection.query(
        `
        SELECT ProductID
        FROM Products
        WHERE ProductName = 'Milk'
        AND SupplierID = ?
        LIMIT 1
        `,
        [supplierId]
      );

   //Add Milk Sale
    

    if (milk.length > 0) {
      const [existingSale] =
        await connection.query(
          `
          SELECT SaleID
          FROM Sales
          WHERE ProductID = ?
          AND QuantitySold = 2
          AND SaleDate = '2025-05-20'
          LIMIT 1
          `,
          [milk[0].ProductID]
        );

      if (existingSale.length === 0) {
        await connection.query(
          `
          INSERT INTO Sales
          (ProductID, QuantitySold, SaleDate)
          VALUES (?, ?, ?)
          `,
          [
            milk[0].ProductID,
            2,
            "2025-05-20",
          ]
        );
      }
    }

    await connection.commit();

    res.json({
      message:
        "Required assignment data inserted successfully",
    });
  } catch (error) {
    await connection.rollback();

    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  } finally {
    connection.release();
  }
});

/*
====================================================
QUESTION 7
UPDATE BREAD PRICE
====================================================
*/


//PUT /products/bread-price


app.put(
  "/products/bread-price",
  async (req, res) => {
    try {
      const [result] = await pool.query(`
        UPDATE Products
        SET Price = 25.00
        WHERE ProductName = 'Bread'
      `);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Bread not found",
        });
      }

      res.json({
        message:
          "Bread price updated to 25.00",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/*
====================================================
QUESTION 8
DELETE EGGS
====================================================
*/


//DELETE /products/eggs


app.delete(
  "/products/eggs",
  async (req, res) => {
    try {
      const [result] = await pool.query(`
        DELETE FROM Products
        WHERE ProductName = 'Eggs'
      `);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Eggs not found",
        });
      }

      res.json({
        message: "Eggs deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/*
====================================================
QUESTION 9
TOTAL QUANTITY SOLD FOR EACH PRODUCT
====================================================
*/

/*
GET /reports/total-sold
*/

app.get(
  "/reports/total-sold",
  async (req, res) => {
    try {
      const [result] = await pool.query(`
        SELECT
          p.ProductID,
          p.ProductName,
          COALESCE(
            SUM(s.QuantitySold),
            0
          ) AS TotalQuantitySold
        FROM Products p
        LEFT JOIN Sales s
          ON p.ProductID = s.ProductID
        GROUP BY
          p.ProductID,
          p.ProductName
        ORDER BY
          TotalQuantitySold DESC
      `);

      res.json(result);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/*
====================================================
QUESTION 10
PRODUCT WITH HIGHEST STOCK
====================================================
*/

/*
GET /reports/highest-stock
*/

app.get(
  "/reports/highest-stock",
  async (req, res) => {
    try {
      const [result] = await pool.query(`
        SELECT *
        FROM Products
        ORDER BY StockQuantity DESC
        LIMIT 1
      `);

      res.json(result);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/*
====================================================
QUESTION 11
SUPPLIERS STARTING WITH F
====================================================
*/

/*
GET /reports/suppliers-start-f
*/

app.get(
  "/reports/suppliers-start-f",
  async (req, res) => {
    try {
      const [result] = await pool.query(`
        SELECT *
        FROM Suppliers
        WHERE SupplierName LIKE 'F%'
      `);

      res.json(result);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/*
====================================================
QUESTION 12
PRODUCTS THAT HAVE NEVER BEEN SOLD
====================================================
*/

/*
GET /reports/never-sold
*/

app.get(
  "/reports/never-sold",
  async (req, res) => {
    try {
      const [result] = await pool.query(`
        SELECT
          p.*
        FROM Products p
        LEFT JOIN Sales s
          ON p.ProductID = s.ProductID
        WHERE s.SaleID IS NULL
      `);

      res.json(result);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/*
====================================================
QUESTION 13
SALES WITH PRODUCT NAME
====================================================
*/

/*
GET /reports/sales-details
*/

app.get(
  "/reports/sales-details",
  async (req, res) => {
    try {
      const [result] = await pool.query(`
        SELECT
          p.ProductName,
          s.QuantitySold,
          s.SaleDate
        FROM Sales s
        INNER JOIN Products p
          ON s.ProductID = p.ProductID
        ORDER BY s.SaleDate
      `);

      res.json(result);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/*
====================================================
QUESTION 14, 15, 16
MYSQL USER PERMISSIONS
====================================================

These are intentionally NOT implemented as public
REST endpoints because creating/granting/revoking
database users is an administrative operation.

Use admin.sql.
====================================================
*/

/*
====================================================
START SERVER
====================================================
*/

async function startServer() {
  try {
    await initializeDatabase();

    await createTables();

    // Test database connection
    const connection = await pool.getConnection();

    console.log("MySQL connection successful");

    connection.release();

    app.listen(PORT, () => {
      console.log(
        `Server is running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:"
    );

    console.error(error);
  }
}

startServer();