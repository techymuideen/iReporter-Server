# **iReporter Backend**

The **iReporter Backend** serves as the server-side logic for the iReporter platform, empowering users to report incidents such as corruption, bad infrastructure, or other societal issues. It handles data storage, user authentication, and API endpoints, ensuring seamless interaction between the frontend and the database.

---

## **Table of Contents**

1. [Features](#1-features)  
2. [Technologies Used](#2-technologies-used)  
3. [Setup Instructions](#3-setup-instructions)  
4. [API Documentation](#4-api-documentation)  
5. [Contributing](#5-contributing)  
6. [License](#6-license)  
7. [Contact](#7-contact)

---

## **1. Features**

1.1 **User Management**  
- Users can sign up, log in, and manage their profiles.  
- Role-based access control (User/Admin).  

1.2 **Incident Reporting**  
- Create, view, update, and delete reports.  
- Reports categorized as *red-flag* or *intervention*.  

1.3 **Admin Privileges**  
- Admins can change the status of reports (e.g., *Under Review*, *Resolved*, or *Rejected*).  

1.4 **RESTful API**  
- Fully featured API for integration with frontend platforms.  

1.5 **Secure Data Handling**  
- Authentication with JWT tokens.  
- User data and passwords securely stored.  

---

## **2. Technologies Used**

- **Node.js** - Backend runtime environment.  
- **Express.js** - Framework for building APIs.  
- **MongoDB** - NoSQL database for storing user and report data.  
- **Mongoose** - ODM for managing MongoDB collections.  
- **JWT (JSON Web Tokens)** - Token-based authentication.  
- **ESLint** and **Prettier** - Code linting and formatting tools.

---

## **3. Setup Instructions**

### **3.1 Prerequisites**

Ensure you have the following installed:
- **Node.js** (v14+)  
- **npm** (v6+)  
- **MongoDB**  

### **3.2 Installation**


1. Clone the repository:

   ```bash
   git clone https://github.com/techymuideen/iReporter-Server.git
   ```

2. Navigate to the project directory:

   ```bash
   cd iReporter-Server
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure environment variables:

   Create a `.env` file in the root directory and set the following variables:

   ```plaintext
   PORT=5000
   MONGO_URI=your-mongodb-uri
   JWT_SECRET=your-jwt-secret
   ```

## Usage

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Access the API at `http://localhost:5000`.

## API Endpoints

Here are the main API endpoints:

- **POST /api/v1/auth/signup** - Register a new user
- **POST /api/v1/auth/login** - Login a user
- **POST /api/v1/reports** - Create a new incident report
- **GET /api/v1/reports** - Fetch all reports
- **GET /api/v1/reports/:id** - Fetch a specific report by ID
- **PUT /api/v1/reports/:id** - Update a report by ID
- **DELETE /api/v1/reports/:id** - Delete a report by ID

## Contributing

We welcome contributions from everyone! Follow these steps to contribute:

1. **Fork the repository.**

2. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes and commit:**
   ```bash
   git commit -m "Add your commit message"
   ```

4. **Push to your forked repository:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a pull request in the main repository.**

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## Contact

- **Author:** Muideen  
- **Email:** your-email@example.com  
- **GitHub:** [@techymuideen](https://github.com/techymuideen)  

Feel free to open an issue or contact me for further questions or suggestions!