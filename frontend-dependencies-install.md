### 📄 **Markdown (.md) Content**


# Frontend Dependencies – Installation Guide

This document outlines the required npm packages to set up the frontend for the ATS AI Screener project, built using React, Vite, and Material UI.

---

## Essential Libraries

### UI Frameworks and Components

Install Material UI core and icons:


```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
````

Install Material UI lab components and other advanced utilities:

```bash
npm install @mui/lab
```

Install icon libraries:

```bash
npm install react-icons
```

---

## HTTP Requests

Install Axios for handling API requests:

```bash
npm install axios
```

---

## Table Rendering

Install `@tanstack/react-table` for efficient data grid and table management:

```bash
npm install @tanstack/react-table
```

---

## Toast Notifications

Install Notistack for customizable snackbars (toasts):

```bash
npm install notistack
```

---

## Vite Plugin

Install React plugin for Vite:

```bash
npm install @vitejs/plugin-react
```

---

## Combined Installation (Optional)

If you prefer installing everything at once:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/lab @tanstack/react-table notistack react-icons axios @vitejs/plugin-react
```

---

## Notes

* Ensure your project was initialized with `npm create vite@latest` or equivalent before adding these dependencies.
* These packages are compatible with modern React setups as of May 2025.

---

*Last updated: May 16, 2025*
