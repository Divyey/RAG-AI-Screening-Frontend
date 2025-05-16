# ATS AI Screener – Frontend

This is the React + Vite frontend for the ATS AI Screener project. It connects to the FastAPI backend and allows users to upload resumes, check AI-based screening scores, and view dashboards.

---

## 🚀 Development Setup

### **Prerequisites**

* [Node.js](https://nodejs.org/) (v16 or newer recommended)
* [npm](https://www.npmjs.com/) (comes with Node.js)
* [Git](https://git-scm.com/) (for cloning the repository)

---

### **Installation**

> 📁 **Place this `frontend/` folder inside your backend root (`rag_ats/`)**

```bash
git clone <your-repo-url>
cd rag_ats/frontend
npm install
```

---

### **Run the App**

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3030](http://localhost:3030) by default.

---

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── api.js                  # Axios instance for API calls
│   ├── App.jsx                 # App wrapper with routing
│   ├── main.jsx                # Entry point
│   ├── index.css               # Global styles
│   ├── theme.js                # MUI theme setup
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── Header.jsx          # App header/navigation
│   │   └── SortableTable.jsx   # Table component
│   └── pages/
│       ├── AiScreener.jsx      # Main resume screener UI
│       ├── AtsScoreChecker.jsx# ATS score visualization page
│       ├── AuthPage.jsx        # Login/register UI
│       └── Dashboard.jsx       # Admin/user dashboard
├── package.json
├── vite.config.js
└── README.md
```

---

## 📦 Dependencies Used

Install all dependencies using:

```bash
npm install
```

Or install selectively:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/lab
npm install @tanstack/react-table notistack axios react-icons @vitejs/plugin-react
```

### Key Libraries:

* **Material UI**: UI components
* **Axios**: API requests
* **React Icons**: Icon set
* **Notistack**: Snackbar notifications
* **TanStack Table**: Advanced tables
* **Vite Plugin React**: React plugin for Vite

---

## ⚙️ Environment Variables

If your app needs backend URLs or tokens, create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Use `import.meta.env.VITE_API_BASE_URL` in code.

---

## 🛠️ Useful Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

---

## 🤝 Contributing

Pull requests and issues are welcome!
For major changes, please open an issue first to discuss.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📅 Last Updated

May 16, 2025
