1 = To-Do Management:

POST /create_todo: Create a new to-do item.
PUT /edit_todo/:id: Update a specific to-do item.
DELETE /delete_todo/:id: Delete a specific to-do item.
DELETE /delete_all_todo: Delete all to-do items.
GET /get_all_todo: Retrieve all to-do items.
GET /get_todo/:id: Retrieve a specific to-do item.
2 = Product Management ( list of product objects (containing name, price, and quality) and returns the total value of all products in the list):

POST /product_create: Create a new product.
GET /total_value_of_product: Retrieve the total product value.


To interact with the API at Culturelinkr API, you can use the provided endpoints with appropriate HTTP methods, headers, and body formats as follows:

3 = Create To-Do:

POST /create_todo
Headers: Content-Type: application/json
Body: { "id": "<UUID>", "todo": "<description>" }
Edit To-Do:

PUT /edit_todo/:id
Headers: Content-Type: application/json
Body: { "todo": "<updated task>" }
Delete To-Do:

DELETE /delete_todo/:id
Delete All To-Dos:

DELETE /delete_all_todo
Get All To-Dos:

GET /get_all_todo
Get Specific To-Do:

GET /get_todo/:id
Create Product:

POST /product_create
Get Total Product Value:

GET /total_value_of_product

4 = All API paths

Create To-Do:

POST https://culturelinkr-todo-product-api-backend.onrender.com/create_todo
Edit To-Do:

PUT https://culturelinkr-todo-product-api-backend.onrender.com/edit_todo/:id
Delete To-Do:

DELETE https://culturelinkr-todo-product-api-backend.onrender.com/delete_todo/:id
Delete All To-Dos:

DELETE https://culturelinkr-todo-product-api-backend.onrender.com/delete_all_todo
Get All To-Dos:

GET https://culturelinkr-todo-product-api-backend.onrender.com/get_all_todo
Get Specific To-Do:

GET https://culturelinkr-todo-product-api-backend.onrender.com/get_todo/:id
Create Product:

POST https://culturelinkr-todo-product-api-backend.onrender.com/product_create
Get Total Product Value:

GET https://culturelinkr-todo-product-api-backend.onrender.com/total_value_of_product
Replace :id with the actual ID when testing these endpoints.



