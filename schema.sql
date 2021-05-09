DROP DATABASE IF EXISTS employees_db;

create database employees_db;

use employees_db;

create table department (
    id int auto_increment not null,
    department VARCHAR (30),
    primary key (id)
);

create table role (
    id int auto_increment  not null,
    title VARCHAR(30),
    salary decimal (10,2),
    department_id int,
    primary key (id)
);

create table employee (
    id int auto_increment not null,
    first_name VARCHAR(30) not null,
    last_name VARCHAR(30) not null,
    role_id int,
    manager_id int null,
    primary key (id)
);

INSERT into department (department) VALUES ("Sales");
INSERT into department (department) VALUES ("Engineering");
INSERT into department (department) VALUES ("Finance");
INSERT into department (department) VALUES ("Legal");

INSERT into role (title, salary, department_id) VALUES ("Sales Manager", 100000, 1);
INSERT into role (title, salary, department_id) VALUES ("Salesperson", 80000, 1);
INSERT into role (title, salary, department_id) VALUES ("Lead Engineer", 150000, 2);
INSERT into role (title, salary, department_id) VALUES ("Software Engineer", 120000, 2);
INSERT into role (title, salary, department_id) VALUES ("Accountant", 125000, 3);
INSERT into role (title, salary, department_id) VALUES ("Legal Team Lead", 250000, 4);
INSERT into role (title, salary, department_id) VALUES ("Lawyer", 190000, 4);
INSERT into role (title, salary, department_id) VALUES ("Lead Engineer", 150000, 2);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("John", "Doe", 1, 3);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Mike", "Chan", 2, 1);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Ashley", "Rodriguez", 3, null);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Kevin", "Tupik", 4, 3);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Malia", "Brown", 5, null);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Sarah", "Lourd", 6, null);

