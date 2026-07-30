# PhishingGuard

PhishingGuard is a robust, containerized security solution built to protect users from phishing attacks and malicious websites. It leverages a modern React frontend and a powerful Node.js backend to provide real-time URL scanning, threat intelligence, and a comprehensive dashboard for tracking scan histories.

## 🚀 Features

- **Real-Time URL Scanning**: Instantly analyzes URLs against Google Safe Browsing and custom rule-based detection engines.
- **Threat Intelligence**: Modular threat detection pipeline that caches results for optimized performance.
- **Interactive Dashboard**: View statistics, recent scans, and historical data with beautiful, animated charts.
- **User Authentication**: Secure signup and login flow powered by JWT and bcrypt.
- **Admin & Moderation Tools**: Built-in workflows for user reporting and managing URL blacklists.
- **Browser Extension Ready**: Integration APIs available for syncing browser extension data with the backend.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Framer Motion (for animations)
- **UI Components**: shadcn/ui, Radix UI Primitives, Lucide Icons
- **Data Visualization**: Recharts
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: Helmet, JSON Web Tokens (JWT)
- **Testing**: Jest & Supertest

### Infrastructure
- **Containerization**: Docker & Docker Compose

## 📦 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd PhishingGuard-Extension
   ```

2. **Configure Environment Variables:**
   Navigate to the `backend/` directory and create a `.env` file based on `.env.example`:
   ```bash
   cd backend
   cp .env.example .env
   ```
   *Make sure to add your `GOOGLE_SAFE_BROWSING_API_KEY` and set a secure `JWT_SECRET`.*

3. **Run with Docker Compose:**
   From the root of the project, run:
   ```bash
   docker-compose up -d --build
   ```

4. **Access the Application:**
   - **Frontend:** http://localhost (Port 80)
   - **Backend API:** http://localhost:5000
   - **MongoDB:** mongodb://localhost:27017

## 👥 Contributions

| Area | Sanket | Mikhil |
| :--- | :--- | :--- |
| **Frontend** | React setup, UI components, dashboard, auth, & landing page. | |
| **Backend & APIs** | | Profile, history, admin dashboard, & extension APIs. |
| **Security** | | Threat intel, Safe Browsing, & rule-based scanning. |
| **DevOps** | Docker setup, container networking, & app integration. | |
| **Workflows** | | Scan caching, reporting, moderation, & testing. |
| **Documentation** | Wrote project documentation. | |
