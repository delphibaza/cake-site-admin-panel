
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './hooks/useAuth.tsx'
import { PaymentProvider } from './hooks/usePayment.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <PaymentProvider>
        <App />
      </PaymentProvider>
    </AuthProvider>
  </React.StrictMode>,
)
