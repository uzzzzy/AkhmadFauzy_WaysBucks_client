import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import { api, setAuthToken } from './config/api'
import { getCartCount } from './functions'

import Modal from './components/Modal'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

import Landing from './pages/Landing'
import Product from './pages/customer/Product'
import Dashboard from './pages/admin/Dashboard'
import AddOrUpdateItem from './pages/admin/AddOrUpdateItem'
import Cart from './pages/customer/Cart'

import './styles/App.css'
import './styles/Layout.css'

export default function App() {
    const [modal, setModal] = useState()
    const [token, setToken] = useState()
    const [cartCounter, setCartCounter] = useState()
    const [user, setUser] = useState()

    useEffect(() => {
        // setModal()
        if (token || localStorage.token) {
            if (!token) setToken(localStorage.token)
            setAuthToken(localStorage.token)
            api.post('/verify')
                .then((res) => {
                    setUser(res.data.data.user)
                })
                .catch((err) => {
                    setToken()
                    localStorage.removeItem('token')
                })
        } else {
            setCartCounter()
            setUser()
            setAuthToken()
        }

        if ((modal?.action === 'updatecart' || !cartCounter) && token) {
            getCartCount(setCartCounter)
        }
    }, [token, cartCounter, modal])

    return (
        <Router>
            <div className="container">
                <Navbar token={token} user={user} setToken={setToken} setModal={setModal} Link={Link} cartCounter={cartCounter} />
                <main>
                    <Switch>
                        <Route exact path="/">
                            {user?.status === 'admin' ? <Dashboard /> : <Landing token={token} user={user} setModal={setModal} />}
                        </Route>
                        <PrivateRoute role="admin" path="/:mod-:item/:id?" user={user} component={AddOrUpdateItem} setModal={setModal} />
                        <PrivateRoute path="/product/:id" user={user} component={Product} setModal={setModal} />
                        <PrivateRoute path="/cart" user={user} component={Cart} userP={user} setModal={setModal} setCartCounter={setCartCounter} />
                        <Route>
                            <div className="lottie-container">
                                <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_lwuTiS.json" background="transparent" speed="1" loop autoplay />
                            </div>
                        </Route>
                    </Switch>
                </main>
            </div>
            {modal?.modal ? <Modal modalOpt={modal.modalOpt} modalMessage={modal.modalMessage} setModal={setModal} setToken={setToken} /> : null}
        </Router>
    )
}
