# 🕹️ Multiplayer Web Project

Welcome to the **Multiplayer Web Project** — a full-stack real-time web application that enables users to engage in multiplayer games like **TicTacToe** and **PingPong** across devices. Whether you're looking to learn, build, or expand on multiplayer concepts, this project gives you a scalable and interactive playground.

Here is a link for the demo of execution https://youtu.be/BpLrOnSdVWM
---

## 🚀 Features

- 🎮 Real-time multiplayer interaction (Socket.IO)
- 💻 Responsive and user-friendly EJS interface
- 🔒 Secure user authentication using JWT
- 🌍 Cross-device gameplay (play from different systems!)
- 🧠 Built-in games: TicTacToe & PingPong

---

## 🧰 Tech Stack

- **Frontend:** HTML, CSS, JavaScript, EJS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Communication:** Socket.IO
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment-Ready:** Docker, Kubernetes _(optional)_

---

## 📦 Getting Started

### ✅ Prerequisites

Make sure the following are installed on your system:

- [Node.js](https://nodejs.org/)
- npm (comes with Node.js)
- [MongoDB](https://www.mongodb.com/)

---

### 📥 Installation

1. **Clone the repository:**

```bash
   git clone https://github.com/MoteVinay/web_multiplayer
   cd web_multiplayer
```

Install dependencies:

```bash
npm install
```

Set up MongoDB connection URI and define server IP as Common IP:

2. **Create a .env file.**

Add your MongoDB URI and CommonIP (the server’s IP for client-server communication).

```env
MONGO_URI=mongodb://localhost:27017/your-db-name
COMMON_IP=http://your-server-ip:3000
```

3. **🏁 How to Run Locally**
   Navigate to the project directory:

```bash

cd web_multiplayer

```

Start the server:

```bash
npm start
```

Open your browser and go to:

```bash
 http://localhost:3000
```

Or use your server's IP:

```cpp
http://<server-ip>:3000
```

🤝 Contributing
We welcome contributions! Want to fix a bug, add a feature, or enhance performance?

Fork the repository

Create a new branch

```bash
git checkout -b feature-name
Commit your changes
```

```bash
git commit -m "Add feature: description"

```

Push to GitHub

```bash
git push origin feature-name
```

Submit a pull request

### 📄 License

This project is licensed under the MIT License.
Feel free to use, fork, and build upon it!

## ⭐ Show Your Support

If you found this project helpful or inspiring:

⭐ Star the repo

🐛 Report issues

🚀 Share with friends

Happy Hacking! 💻🎯
