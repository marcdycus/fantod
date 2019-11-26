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
    showItems();
});

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
        makePurchase();
    });
};


function makePurchase() {
    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Type the Item ID you would like to purchase",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "quantity",
            type: "input",
            message: "How many would you like to purchase?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "verify",
            type: "rawlist",
            message: 'Are you sure? By confirming "yes", you will be charged and your order will be placed',
            choices: ["yes", "no"]
        }
        ])
        .then(function (ans) {
            selectQuant = ans.quantity;
            if (ans.verify === "no") {
                console.log("-----------------------------------------------------------");
                console.log("You've cancelled your purchase. Hope to see you again soon.");
                console.log("-----------------------------------------------------------");
                return db.end();
            }
            var query = "SELECT * FROM products WHERE item_id=?"
            db.query(query, [ans.id, selectQuant], function (err, res) {
                var total = parseInt(res[0].price) * selectQuant;
                var productName = res[0].product_name;
                if (err) throw err;
                if (!res.length) {
                    console.log("-----------------------------------------------------------");
                    console.log("|              Your selection does not exist.             |")
                    console.log("-----------------------------------------------------------");
                    setTimeout(makePurchase, 1000);
                    return;
                };
                if (selectQuant <= res[0].stock_quantity) {
                    var trans = parseInt(res[0].stock_quantity) - selectQuant;
                    console.log(trans);
                    db.query("UPDATE products SET stock_quantity = ? WHERE item_id=?", [trans, ans.id], function (err, res) {
                        if (err) throw err;

                        console.log("----------------------------------------------------------------");
                        console.log(`Your transaction is complete. Your total for ${selectQuant} ${productName} is $${total}. Thank you for shopping at Bamazon!`);
                        console.log("----------------------------------------------------------------");
                        setTimeout(showItems, 4000);
                    });
                } else {
                    console.log("----------------------------------------------------------------");
                    console.log("|  We're sorry, unfortunately there isn't that many in stock.  |");
                    console.log("----------------------------------------------------------------");
                    setTimeout(makePurchase, 1000);
                }
            });
        });
}
