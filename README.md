# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# ATS AI Screener – Frontend

This is the React frontend for the ATS AI Screener project.

---

## 🚀 Development Setup

### **Prerequisites**

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/) (for cloning the repository)

---

### **Installation**

Clone the repository and navigate to the frontend directory:

git clone <your-repo-url>
cd frontend


Install all dependencies:

npm install


> **Note:** The following key libraries are used in this project:
>
> - [Material UI](https://mui.com/):  
>   `@mui/material @mui/icons-material @mui/lab @emotion/react @emotion/styled`
> - [Axios](https://axios-http.com/):  
>   For API requests.
> - [React Icons](https://react-icons.github.io/react-icons/):  
>   For iconography.
> - [notistack](https://iamhosseindhv.com/notistack):  
>   For notifications/snackbars.
> - [@tanstack/react-table](https://tanstack.com/table):  
>   For advanced tables.
> - [@vitejs/plugin-react](https://vitejs.dev/guide/#react):  
>   For Vite + React integration.

If you need to install any dependency individually, use:

npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/lab @tanstack/react-table notistack axios react-icons @vitejs/plugin-react

---

### **Running the App**

To start the development server:


The app will be available at [http://localhost:5173](http://localhost:5173) by default.

---

## 🛠️ Project Structure

frontend/
├─ public/
├─ src/
│ ├─ components/
│ ├─ views/
│ ├─ utils/
│ ├─ hooks/
│ ├─ constants/
│ └─ App.js
├─ tests/
├─ package.json
└─ ...


---

## 📦 Useful Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## 🤝 Contributing

Pull requests and issues are welcome!  
For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📅 Last updated

May 16, 2025

# ATS AI Screener – Frontend

This is the React frontend for the ATS AI Screener project.

## Development

npm install
npm run dev


## Build for Production

npm run build


## Environment Variables

Create a `.env` file if needed for API URLs, etc.



