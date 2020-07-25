-- Multi-Table Query Practice

-- Display the ProductName and CategoryName for all products in the database. Shows 77 records.
SELECT p.id as [ProductID], p.productName, c.categoryName
FROM product as p
JOIN category as c
ON p.CategoryId = c.id
ORDER BY p.ProductName;

-- Display the order Id and shipper CompanyName for all orders placed before August 9 2012. Shows 429 records.
SELECT o.id as [OrderID], s.CompanyName
FROM [order] as o
JOIN Shipper as s
ON o.shipvia=s.id
WHERE o.orderDate < "2012-08-09";

-- Display the name and quantity of the products ordered in order with Id 10251. Sort by ProductName. Shows 3 records.
SELECT p.productName as ProductName, od.quantity as Quantity 
FROM [orderDetail] as od
JOIN [order] as o
ON o.id = od.orderID
JOIN product as p
on p.id=od.productID
where o.id = 10251
ORDER BY  p.productName;

-- Display the OrderID, Customer's Company Name and the employee's LastName for every order. All columns should be labeled clearly. Displays 16,789 records.
SELECT o.id as 'Order ID', c.companyName as 'Company Name', e.lastName as 'Employee Last Name'
FROM [order] as o
JOIN [employee] as e
ON o.employeeId = e.id
JOIN [customer] as c
ON o.customerId= c.id;

--Stretch Problems
--Displays CategoryName and a new column called Count that shows how many products are in each category. Shows 8 records.
SELECT c.categoryName, count(p.productName) as 'Number of products'
FROM categories as c
JOIN products as p
ON p.categoryID= c.categoryID
GROUP BY c.categoryName
ORDER BY c.categoryName;

--Display OrderID and a column called ItemCount that shows the total number of products placed on the order. Shows 196 records.
SELECT o.orderID, count(p.productID) as 'Item Count'
from products as p
join orderDetails as od
on p.productID=od.productID
join orders as o
on o.orderID=od.orderID
group by o.orderID
order by o.orderID;


