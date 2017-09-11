var mysql = require("mysql");
var inquirer = require("inquirer");

var console_table = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazonDB"
});


connection.connect(function(err) {
  if (err) throw err;
  
  startpage();
  
});

function startpage() {
  connection.query("SELECT * FROM products", function(err, res) {
    console.log("WELCOME TO BAMAZON!  AVAILABLE PRODUCTS LISTED BELOW");
    for (var i = 0; i < res.length; i++) {
      
      console.log("ID: " + res[i].item_id + "    Department: " +  res[i].department_name + "    Product: " + res[i].product_name + "    Price: " + res[i].price + "    Stock: " + res[i].stock_quantity);
      

}
      order();
})};
 

function order() {
  inquirer
    .prompt([{
      name: "item",
      type: "input",
      message: "What is the ID of the item that you would like to buy?",
      
    },
    {
      name: "quantity",
      type: "input",
      message: "How many would you like to buy?",
    }

    ])
    .then(function(answer){
      //console.log(answer.item);
      //console.log(answer.quantity);
      console.log("Checking stock levels of requested item")
      var query = "SELECT stock_quantity FROM products WHERE ?";
      connection.query(query, { item_id: answer.item }, function(err, res) {
       for (var i = 0; i < res.length; i++) {
          if (res[i].stock_quantity >= answer.quantity)
            {console.log("SUCCESS!  Your item is in stock and has been placed!  You can now place another order!");
            var newstock = (res[i].stock_quantity - answer.quantity);
            //console.log(newstock);
            updateQuantity();
            startpage();
            function updateQuantity(){

      var query = connection.query(
      "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newstock
              },
              {
                item_id: answer.item

              }
           ],
           function (err, res) {
            ;
          }
     );

  }
            }

          else
            {console.log("There are not enough items in stock for your requested quantity." + 
              "  You requested: " + answer.quantity +"     In Stock Quantity: " + res[i].stock_quantity);
              console.log("Please adjust your order to continue")
          order();

            }
       
            };

      })})};




    


