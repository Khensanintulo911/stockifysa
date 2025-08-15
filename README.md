🇿🇦 StockTracker SA — Inventory Management System

A modern inventory management web app tailored for South African businesses
Track products 📦 | Manage stock 📊 | Process sales 💰 | Generate reports 📑

🌍 Overview

StockTracker SA is a web-based inventory management system designed specifically for South African small-to-medium businesses.
It helps you:

Keep track of stock levels in real time

Record sales in South African Rand (R)

Get low stock alerts and generate detailed reports

Sample data includes authentic South African products like biltong, rooibos tea, Springbok jerseys, Amarula, and traditional crafts.

✨ Key Features

📊 Dashboard – Real-time metrics, sales overview, and low stock alerts

🛍 Product Management – CRUD operations with SKU validation

📦 Inventory Tracking – Automated low stock detection and updates

💵 Sales Processing – Instant stock updates, prices in ZAR (R)

📑 Reports – Exportable sales and inventory summaries

📱 Responsive Design – Mobile-first and tablet-friendly

🌐 Localization – Rand currency & South African product examples

🏗 System Architecture

Frontend

Django Templates + Bootstrap 5 for responsive UI

Bootstrap Icons + Vanilla JavaScript for interactivity

Backend

Django 5.2.5 (Python)

SQLite (dev) — upgradeable to PostgreSQL

Django ORM for database management

Django Admin for quick data edits

Database

Tables: Products, Sales, Stock Movements

UUID primary keys, timestamps, foreign key relationships

📡 API Structure

RESTful endpoints

Consistent JSON responses

Input validation

Real-time UI updates with automatic query invalidation

🛠 Tech Stack & Dependencies

Backend

Django 5.2.5

SQLite / PostgreSQL

Frontend & Styling

Bootstrap 5

Bootstrap Icons

TailwindCSS (optional styling enhancements)

Utilities

date-fns — date handling

nanoid — unique IDs

clsx — conditional classes

🚀 Getting Started
1️⃣ Clone the repo
