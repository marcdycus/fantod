const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table3");
var selectQuant;


const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazonDb"
});

db.connect(function (err) {
    if (err) throw err;
    console.log("connected as id: " + db.threadId);
    action();
});

function action() {
    inquirer
        .prompt([{
            name: "choose",
            type: "rawlist",
            message: "Choose your operation: ",
            choices:
                ["View All Products",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product"]
        }]).then(function (res) {
            switch (res.choose) {
                case 'View All Products':
                    showItems();
                    break;

                case 'View Low Inventory':
                    lowInventory();
                    break;

                case 'Add to Existing Inventory':
                    addTo();
                    break;

                case 'Add New Product':
                    addNew();
                    break;
            }
        })
}

function showItems() {
    db.query("SELECT * FROM products", function (err, res) {
        var table = new Table({
            head: ["Item ID", "Product", "Department", "Price", "Quantity"],
            chars: {
                'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
                , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
                , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
                , 'right': '║', 'right-mid': '╢', 'middle': '│'
            }
        });
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].dept_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        action();
    })
}

function lowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity<=10";
    db.query(query, function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ["Item ID", "Product", "Department", "Price", "Quantity"]
        });
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].dept_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        action();
    })
}

function addTo() {
    inquirer
        .prompt([{
            name: "inputID",
            type: "number",
            message: "Type in the PRODUCT ID that you would like to add to: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            name: "inputAmount",
            type: "number",
            message: "Type in the AMOUNT that you would like to add: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            name: "verify",
            type: "rawlist",
            message: 'Are you sure? By confirming "yes", inventory will be updated: ',
            choices: ["yes", "no"]
        }
        ]).then(function (res) {
            if (res.verify === "no") {
                console.log("You've cancelled this action.");
                return setTimeout(action, 2000);
            }
            var query = "UPDATE products SET stock_quantity = stock_quantity+? WHERE item_id=?"
            db.query(query, [res.inputAmount, res.inputID], function(err, response) {
                console.log(`Inventory has been updated. The amount of ${res.inputAmount} has been added to the Product ID ${res.inputID}`);
                setTimeout(action, 2000);
            })
        })
}

function addNew() {
    inquirer
        .prompt([{
            name: "inputName",
            type: "input",
            message: "Type in the NAME of the PRODUCT that you would like to add: ",
        },
        {
            name: "inputDept",
            type: "input",
            message: "Type in the DEPARTMENT that it will belong to: ",
        },
        {
            name: "inputPrice",
            type: "number",
            message: "Type in the PRICE that it will be sold at: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            name: "inputStock",
            type: "number",
            message: "Type in the STOCK AMOUNT that you would like to add: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            name: "verify",
            type: "rawlist",
            message: 'Are you sure? By confirming "yes", inventory will be updated: ',
            choices: ["yes", "no"]
        }
    ]).then(function(ans) {
        if (ans.verify === "no") {
            console.log("You've cancelled this action.");
            return setTimeout(action, 2000);
        }
        db.query("INSERT INTO products SET ?", 
        {
            product_name: ans.inputName, 
            dept_name: ans.inputDept, 
            price: ans.inputPrice, 
            stock_quantity: ans.inputStock
        },
        function(err) {
            if (err) throw err;
            console.log("Inventory has been updated.");
            setTimeout(action, 1000);
        }
        )
    })
}

