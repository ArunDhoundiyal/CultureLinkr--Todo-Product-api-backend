const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3");
const path = require("path");
const { open } = require("sqlite");

const server_instance = express();
const dbPath = path.join(__dirname, "todo.db");
const productDbPath = path.join(__dirname, "product_list.db");
let dataBase = null;
let productDatabase = null;

server_instance.use(cors());
server_instance.use(express.json());

const initialize_DataBase_and_Server = async () => {
  try {
    dataBase = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    productDatabase = await open({
      filename: productDbPath,
      driver: sqlite3.Database,
    });

    server_instance.listen(3001, () => {
      console.log("Server is running on http://localhost:3001");
    });
  } catch (error) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

initialize_DataBase_and_Server();

server_instance.post("/create_todo", async (req, res) => {
  const { id, todo } = req.body;
  if (!id || !todo) {
    res.status(400).send("Id and Todo both are required");
  } else {
    try {
      const createTodo = `INSERT INTO todo (id, todo) VALUES (?, ?);`;
      await dataBase.run(createTodo, [id, todo]);
      res.status(200).send("Todo created successfully");
    } catch (error) {
      res
        .status(500)
        .send(
          `The todo you are trying to create is already created kindly create another one.`
        );
      console.log(`Error while inserting todo: ${error}`);
    }
  }
});

// Edit todo
server_instance.put("/edit_todo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const checkExistTodoQuery = "SELECT * FROM todo WHERE id = ?;";
    const checkExistTodo = await dataBase.get(checkExistTodoQuery, [id]);
    if (!checkExistTodo) {
      return res.status(404).send("Todo is not found.");
    }
    const { todo = checkExistTodo.todo } = req.body;
    const updateTodoQuery = "UPDATE todo SET todo = ? WHERE id = ?;";
    await dataBase.run(updateTodoQuery, [todo, id]);
    res.status(200).send("Todo updated successfully.");
  } catch (error) {
    res.status(500).send("An error occurred while updating the todo");
    console.log(`Error while updating todo: ${error}`);
  }
});

// Delete todo
server_instance.delete("/delete_todo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const checkExistTodoQuery = "SELECT * FROM todo WHERE id = ?;";
    const checkExistTodo = await dataBase.get(checkExistTodoQuery, [id]);
    if (!checkExistTodo) {
      res.status(404).send("Todo is not found.");
    } else {
      const deleteTodoQuery = "DELETE FROM todo WHERE id = ?;";
      await dataBase.run(deleteTodoQuery, [checkExistTodo.id]);
      res
        .status(200)
        .send(`Todo - ${checkExistTodo.todo} deleted successfully`);
    }
  } catch (error) {
    res.status(500).send("An error occurred while deleting the todo");
    console.log(`Error while deleting todo: ${error}`);
  }
});

// Delete all todo
server_instance.delete("/delete_all_todo", async (req, res) => {
  try {
    const deleteAllTodoQuery = "DELETE FROM todo;";
    await dataBase.run(deleteAllTodoQuery);
    res.status(200).send("All todo deleted successfully");
  } catch (error) {
    res.status(500).send("An error occurred while deleting all the todo");
    console.log("Error deleting all todo:", error);
  }
});

// Get all todo
server_instance.get("/get_all_todo", async (req, res) => {
  try {
    const getAllTodoQuery = "SELECT * FROM todo;";
    const response = await dataBase.all(getAllTodoQuery);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send("An error occurred while getting all the todo");
    console.log("Error getting all todo:", error);
  }
});

// Get todo
server_instance.get("/get_todo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getTodoQuery = "SELECT * FROM todo WHERE id = ?;";
    const getTodo = await dataBase.get(getTodoQuery, [id]);
    if (!getTodo) {
      res.status(404).send("Todo is not found.");
    } else {
      res.status(200).send(getTodo);
    }
  } catch (error) {
    res.status(500).send("An error occurred while getting the todo");
    console.log("Error getting the todo:", error);
  }
});

// Task:
// Write an API endpoint that receives a list of product objects (containing name, price, and quality)
// and returns the total value of all products in the list.

// Create Product endpoint
server_instance.post("/product_create", async (req, res) => {
  const { name, price, quantity } = req.body;
  try {
    if (!name || price === undefined || quantity === undefined) {
      return res
        .status(400)
        .send("Product name, price, and quantity are required.");
    }
    if (
      typeof price !== "number" ||
      typeof quantity !== "number" ||
      price < 0 ||
      quantity < 0
    ) {
      return res
        .status(400)
        .send(
          "Invalid product data: price and quantity should be non-negative numbers."
        );
    }

    const createProductQuery =
      "INSERT INTO products (name, price, quantity) VALUES (?, ?, ?);";
    await productDatabase.run(createProductQuery, [name, price, quantity]);
    res.status(201).send("Product created successfully");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Internal server error. Please try again later.");
  }
});

// calculate the total value of products list
server_instance.get("/total_value_of_product", async (req, res) => {
  const getAllProductQuery = "SELECT * FROM products;";
  const getAllProduct = await productDatabase.all(getAllProductQuery);
  console.log(getAllProduct);

  if (!Array.isArray(getAllProduct) || getAllProduct.length === 0) {
    res.status(400).send("A non-empty array of products is required.");
  } else {
    let totalValue = 0;
    for (const product of getAllProduct) {
      const { price, quantity } = product;
      totalValue += price * quantity;
    }

    res.status(200).send({
      total: getAllProduct,
      total_value: totalValue,
    });
  }
});
