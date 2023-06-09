import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'


import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import About from './components/About'

import Home from './components/Home'
import ProductDetails from './components/product/ProductDetails'

// Cart Imports
import Cart from './components/cart/Cart'
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'


// Order Imports
import ListOrders from './components/order/ListOrders'
// import OrderDetails from './components/order/OrderDetails'

// Auth/User imports
import Login from './components/user/Login'
import Register from './components/user/Register'
import Profile from './components/user/Profile'
import UpdateProfile from './components/user/UpdateProfile'
import UpdatePassword from './components/user/UpdatePassword'
import ForgotPassword from './components/user/ForgotPassword'
import NewPassword from './components/user/NewPassword'

// Admin Imports
import Dashboard from './components/admin/Dashboard'
import ProductList from './components/admin/ProductsList'
import NewProduct from './components/admin/NewProduct'

import ProtectedRoute from './components/route/ProtectedRoute'
import { loadUser } from './actions/userActions'
import { useSelector } from 'react-redux'
import store from './store'
import axios from 'axios'

// Payment
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
//import { userReducer } from './reducers/userReducers'

function App() {

  const [stripeApiKey, setStripeApiKey] = useState('')

  useEffect(() => {
    store.dispatch(loadUser())

    async function getStripeApiKey() {
      const { data } = await axios.get('api/v1/stripeapi')

      console.log(JSON.stringify(data) + " data")
      console.log(data.stripeApiKey + "keyyyyyyyyyyy")
      setStripeApiKey(data.stripeApiKey)
    }

    getStripeApiKey()
  }, [])

  const { user, isAuthenticated, loading } = useSelector(state => state.auth)

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route exact path="/" component={Home} />
          <Route path="/search/:keyword" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/product/:id" component={ProductDetails} />

          <Route exact path="/cart" component={Cart} />
          <ProtectedRoute exact path="/shipping" component={Shipping} />
          <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />


          <ProtectedRoute path="/success" component={OrderSuccess} />


          {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} />
            </Elements>
          }

          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route exact path="/password/forgot" component={ForgotPassword} />
          <Route exact path="/password/reset/:token" component={NewPassword} />
          <ProtectedRoute exact path="/me" component={Profile} />
          <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
          <ProtectedRoute exact path="/password/update" component={UpdatePassword} />


          <ProtectedRoute path="/orders/me" component={ListOrders} exact />
          {/*<ProtectedRoute path="/order/:id" component={OrderDetails} exact />*/}

        </div>
        <ProtectedRoute exact path="/dashboard" isAdmin={true} component={Dashboard} />
        <ProtectedRoute exact path="/admin/products" isAdmin={true} component={ProductList} />
        <ProtectedRoute exact path="/admin/product" isAdmin={true} component={NewProduct} />

        {!loading && (!isAuthenticated || user.role !== 'admin') && (
          <Footer />
        )}

      </div>
    </Router>
  );
}

export default App;


// "proxy": "http://127.0.0.1:4000/" --openssl-legacy-provider SKIP_PREFLIGHT_CHECK=true
