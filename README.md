# CivicCase: AI-Powered Local Issue Tracker

A full-stack web application designed for municipalities to help residents report, track, and resolve local community issues using AI-driven insights.

## 👥 Team 7
* **Frontend Architecture & UI/UX:** Xuan Tri Nguyen
* **Backend Data & API:** Tam
* **AI Integrations & Core Logic:** Uypheng

## 🚀 Tech Stack
* **Frontend:** React 19, Vite, Apollo Client, Tailwind CSS
* **Backend:** Node.js, Express, Apollo Server (GraphQL), MongoDB
* **AI Integration:** LangGraph, Google Gemini API

---

## 🛠️ How to Run the Project Locally
### Step 1: Start the Backend (`civiccase-backend`)

1. Open your first terminal window and navigate to the backend folder:
   cd civiccase-backend
   npm install
   
2.   Create a .env file in the civiccase-backend folder with the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
3. npm run dev
4. cd civiccase-frontend
5. npm install
6. npm run dev
