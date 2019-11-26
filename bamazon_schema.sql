DROP DATABASE IF EXISTS bamazonDb;

CREATE DATABASE bamazonDb;

USE bamazonDb;

CREATE TABLE products(
    item_id int AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30),
    dept_name VARCHAR(30),
    price DECIMAL(10, 2),
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

insert into products (product_name, dept_name, price, stock_quantity)
    values  ("iPhone 11", "phone", 699, 30),
            ("iPhone 11 Pro", "phone", 1199, 20),
            ("iPhone 11 case", "phone", 28.95, 100),
            ("iPhone screen replacement", "hardware", 45.80, 90),
            ("iPhone screen tools", "hardware", 8.29, 14),
            ("2013 Macbook Air", "computer", 579, 100),
            ("2017 Macbook Air", "computer", 879, 100),
            ("2017 Macbook Pro 13in", "computer", 1099, 60),
            ("2017 Macbook Pro 15in", "computer", 1799, 20),
            ("2019 Macbook Pro 16in", "computer", 2499, 200),
            ("2019 Macbook Pro 13in", "computer", 1399, 80),
            ("Notebook Carrying Case", "luggage", 149, 10),
            ("Earpods", "music", 149, 100),
			("Homepod", "music", 279, 10);
select * from products;


