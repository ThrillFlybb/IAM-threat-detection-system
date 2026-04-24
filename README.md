#  IAM Threat Detection System

##  Key Idea

This project is a **behavior-based authentication monitoring system**.

Instead of just allowing users to log in, the system actively observes **login behavior** and detects suspicious activity such as:
- multiple failed login attempts  
- logins at unusual hours  

These events are logged as **security threats** and displayed on a dashboard.

---

##  Problem Statement

Most basic authentication systems only verify credentials.

This system goes beyond that and asks:

> “Is this login behavior safe?”

---

##  Tech Stack

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)

### Frontend
- React  
- Custom CSS  

### Security & Middleware
- JWT Authentication  
- Express Rate Limiting  
- Helmet  
- CORS  

---

##  Approach

### 1. Authentication System
- Users can register and log in  
- Passwords are hashed before storage  
- JWT tokens are used for authentication  

---

### 2. Behavior-Based Threat Detection

Each login triggers internal checks:

####  Brute Force Detection
- Tracks failed login attempts  
- If attempts ≥ 5 → marked as **high severity threat**

####  Off-Hours Login Detection
- Detects login time  
- If login happens at unusual hours → marked as **medium severity threat**

---

### 3. Threat Logging

All suspicious events are stored with:
- type  
- severity  
- timestamp  
- user details  
- IP address  

---

### 4. Dashboard

Displays:
- total threats  
- severity distribution  
- grouped patterns  
- recent activity  

---

### 5. Admin Panel

Admin can:
- view all users  
- unlock locked accounts  
- reset failed attempts  

---

##  Security Features

- Rate limiting to prevent abuse  
- Account lock after repeated failures  
- Threat detection engine  
- Admin recovery system  

---

##  Why this approach?

Because real-world systems don’t just:
> check passwords

They:
> analyze behavior

---

##  What Makes This Project Unique?

- Not just CRUD — includes **security logic**
- Detects **patterns**, not just actions  
- Prevents duplicate threat spam  
- Includes **admin-level control system**  
- Inspired by real-world IAM/SIEM concepts  

---

##  System Flow

The overall flow of the system is:

User Login  
→ Backend Validation  
→ Threat Detection Engine  
→ Threat Stored in Database  
→ Dashboard Updates  

---

###  Explanation

1. **User Login**
   - User enters email and password  
   - Request is sent to backend  

2. **Backend Validation**
   - Credentials are verified  
   - Failed attempts are tracked  

3. **Threat Detection Engine**
   - Checks for:
     - multiple failed attempts (brute force)
     - unusual login time (off-hours)

4. **Database Storage**
   - If suspicious activity is detected  
   - A threat entry is created and stored  

5. **Dashboard Update**
   - Frontend fetches updated threats  
   - Displays them in stats, patterns, and activity logs  

---

## How to Run

### Backend
```bash
cd project
npm install
npm run dev
###Frontend
```bash
cd iam-frontend
npm install
npm start

### NOTE:-
Project is currently under improvement.

Working on:

fixing minor UI bugs
improving responsiveness
handling edge cases
