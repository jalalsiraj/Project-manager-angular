# Project Manager Frontend (Angular + Material)

A frontend application for managing projects, tenants, users, and roles.  
Built with **Angular**, **Angular Material**, and **Flex Layout**.  

---

## 📌 Features
- User authentication with JWT  
- Role-based access control (RBAC)  
- Multi-tenant support  
- Project CRUD UI  
- Angular Reactive Forms with validation  
- Material dialogs (confirmation, input, edit forms)  
- Responsive layout with Flex Layout  

---

## 🛠️ Tech Stack
- **Framework:** Angular 17+  
- **UI Library:** Angular Material + Flex Layout  
- **State Management:** Reactive Forms, Services  
- **Routing & Guards:** Angular Router with Auth Guards  
- **HTTP Client:** Angular HttpClient for API calls  

---

## 📂 Project Structure

project-manager-frontend/  
│-- src/  
│   │-- app/  
│   │   │-- components/ # Reusable UI components (dialogs, tables, forms)  
│   │   │-- pages/ # Feature pages (login, dashboard, projects, tenants)  
│   │   │-- services/ # API & business logic  
│   │   │-- guards/ # Auth & role guards  
│   │   │-- app-routing.module.ts # Routing setup  
│   │   │-- app.module.ts # Root module  
│   │-- assets/ # Static assets (icons, styles)  
│   │-- environments/ # Environment configs  
│-- angular.json # Angular configuration  
│-- package.json # Dependencies & scripts  

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/Project-manager-frontend.git
cd Project-manager-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Update the API URL in `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000'
};
```

### 4. Run the application
```bash
ng serve
```
App will run on: **http://localhost:4200**

---

## 🚀 Core Functionalities

### 🔑 Authentication
- Login with email & password  
- JWT stored in `localStorage`  
- Guards to prevent unauthorized access  

### 📂 Projects
- List all projects with Material Table  
- Add/Edit/Delete projects using Material Dialogs  
- Assign managers to projects  

### 👤 Users
- Manage tenant-specific users  
- Assign roles (Admin, Manager, User)  
- Form validation with Angular Reactive Forms  

### 🏢 Tenants
- Tenant registration & selection  
- Scoped data based on tenant  

---

## 🔒 Guards & Security
- **AuthGuard:** Prevents access if not logged in  
- **LoginGuard:** Prevents navigating back to login if already authenticated  

---

## 🧪 Development Commands
```bash
# Run the dev server
ng serve

# Build for production
ng build --prod

# Run unit tests
ng test

# Run end-to-end tests
ng e2e
```

---

## 📝 License
This project is licensed under the MIT License.  

---
