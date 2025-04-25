import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import './index.css'
import App from './App.tsx'
import {GoogleOAuthProvider} from "@react-oauth/google"

console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
    <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>
    </BrowserRouter>
    </Provider>
  </StrictMode>
);
