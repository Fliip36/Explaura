import React from 'react';
import ReactDOM from 'react-dom/client';
import { FirebaseProvider } from './component/FirebaseContext';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";


import App from './App';
import Admin from './component/AdminComponent/Admin';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "Admin",
    element: <Admin />,
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <FirebaseProvider>    
     <RouterProvider router={router} />
  </FirebaseProvider>
  // </React.StrictMode>
);
reportWebVitals();
