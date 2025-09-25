# MG's Tailoring Website Tailoring Website 🛍️

A feature-rich e-commerce website for a local tailoring business, built as a college field project for my mom's shop. The site is fully responsive, interactive, and demonstrates a complete user journey from browsing to checkout.

---

## 📸 Screenshots

![Homepage Screenshot](https://github.com/user-attachments/assets/f8f0fa47-2c18-4fba-911e-c278a1ca1c99)

---

## ✨ Features

This project is a fully functional demo and includes:

* **Professional UI/UX:** A custom, elegant design system with professional fonts and a sophisticated color palette.
* **Dynamic Content:** An API-driven hero carousel and product galleries that load content from a mock database.
* **Full E-commerce Flow:**
    * User Registration & Login
    * Session Management (Login/Logout state)
    * Product Listing & Category Pages
    * "Quick View" Product Modal
    * Shopping Cart & Wishlist (using Local Storage)
    * Multi-Step Checkout Process
    * Simulated Payment Gateway (Razorpay)
    * Order Confirmation & Order History Pages
* **Interactive Modules:**
    * An interactive "Discover Your Style" Quiz.
    * A full-screen "Explore Showroom" Lookbook.
    * A map-based Order Tracking simulation.
* **Polished Experience:** Smooth fade transitions between pages and an "active link" indicator in the navigation.

---

## 🛠️ Tech Stack

* **Front-End:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Back-End (Mock):** `json-server`
* **Libraries:**
    * Swiper.js (for carousels)
    * Leaflet.js (for the tracking map)
* **Deployment:** Vercel

---

## 🚀 Getting Started (Running Locally)

To run this project on your local machine, follow these steps.

### Prerequisites

You need to have **Node.js** and **npm** installed on your computer.
* [Node.js](https://nodejs.org/)

### Installation & Setup

1.  **Clone the repository** (or download the ZIP).
    ```sh
    git clone [https://github.com/Vikrant-kun/MG-Tailors.git](https://github.com/Vikrant-kun/MG-Tailors.git)
    ```
2.  **Navigate into the project directory.**
    ```sh
    cd MG-Tailors/Field-Project
    ```
3.  **Start the mock backend server.**
    ```sh
    npx json-server --watch db.json
    ```
4.  **Start the front-end server.**
    * Open the `Field Project` folder in VS Code.
    * Click the **"Go Live"** button in the bottom-right corner.

Your website will open at `http://127.0.0.1:5500`, and all features will be fully functional.
