DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE employee (
    id INT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id VARCHAR(25),
    manager_id VARCHAR(25)
)
CREATE TABLE roles (
    id INT PRIMARY KEY,
    role_title VARCHAR(30) NULL,
    salary DECIMAL (10,4) NULL,
    dept_id INT NULL
   
);

CREATE TABLE department (
    id INT PRIMARY KEY,
    dept_name VARCHAR(30)
   
);