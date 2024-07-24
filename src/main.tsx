import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import {store,persistor} from './components/redux/store/store.ts'
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const publishable_key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
const stripePromise = loadStripe(publishable_key);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer/>
          <Elements stripe={stripePromise}>
            <App />
          </Elements>
        </PersistGate>
    </Provider>
  </React.StrictMode>,
)
