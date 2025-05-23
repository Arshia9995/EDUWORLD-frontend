// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import './index.css'
import App from './App.tsx'
import {GoogleOAuthProvider} from "@react-oauth/google"
import { SocketProvider } from './context/SocketContext.tsx'

console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
      <Provider store={store}>
      
    <BrowserRouter>
    <SocketProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>
    </SocketProvider>
    </BrowserRouter>
    
    </Provider>
  //  </StrictMode>
);
