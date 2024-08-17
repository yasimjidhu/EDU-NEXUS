import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import {store,persistor} from './components/redux/store/store.ts'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { SocketProvider } from './contexts/SocketContext.tsx'

const publishable_key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
const stripePromise = loadStripe(publishable_key);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer/>
          <Elements stripe={stripePromise}>
            <SocketProvider>
              <App />
            </SocketProvider>
          </Elements>
        </PersistGate>
    </Provider>
)
