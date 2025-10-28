# 🖥️ Make Me Known (Server)

The **Make Me Known Server** is the backend API built with **Express.js** and **MongoDB**.  
It powers the Make Me Known mobile app by handling user requests, managing data, and ensuring smooth communication between the client and database.

This backend is designed for speed, scalability, and ease of integration with the React Native (Expo) frontend.

---

## 🚀 Features

- Built with **Express.js** (Node.js framework)
- Uses **MongoDB** as the primary database
- RESTful API design
- Cross-Origin Resource Sharing (CORS) support for client access
- Environment-based configuration
- Secure and modular code structure

---

## 🧩 Tech Stack

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB (via Mongoose)  
- **Language:** JavaScript (ES6+)  
- **Environment Variables:** dotenv  
- **Package Manager:** npm  

---

## ⚙️ Setup Instructions

Follow the steps below to set up and run the backend server locally.

---

### 1. Clone the Repository

```bash
git clone https://github.com/ElijahChileshe/make_me_known_server
```

### 2. Navigate into the Project Folder

```bash
cd make_me_known_server
```

### 3. Install Dependencies

```bash
npm i
```

#### And run:

```
npm i nodemon
```

### 4. Configure Environment Variables

#### reate a .env file in the root directory of the project and add your environment settings:

```bash
touch .env
```
#### Example .env file:
  
  ```bash
  PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/make_me_known

```

### 5. Start the Server

```bash
nodemon server.js
```
#### You should see a message in the terminal confirming that the server is running and connected to MongoDB.

