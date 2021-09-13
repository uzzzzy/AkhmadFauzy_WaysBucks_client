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
import Profile from './pages/customer/Profile'
import AddOrUpdateItem from './pages/admin/AddOrUpdateItem'
import Cart from './pages/customer/Cart'

import './styles/App.css'
import './styles/Layout.css'
import Menu from './pages/Menu'
import NotFound from './pages/NotFound'

export default function App() {
    const [modal, setModal] = useState()
    const [token, setToken] = useState()
    const [data, setData] = useState()
    const [cartCounter, setCartCounter] = useState()
    const [user, setUser] = useState()

    useEffect(() => {
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
                            {user?.status === 'admin' ? <Dashboard setModal={setModal} data={data} setData={setData} /> : <Landing token={token} user={user} setModal={setModal} />}
                        </Route>

                        <Route path="/menu">{user?.status !== 'admin' ? <Menu /> : <NotFound />}</Route>
                        <PrivateRoute role="admin" path="/:mod-:item/:id?" user={user} component={AddOrUpdateItem} setModal={setModal} />
                        <PrivateRoute path="/product/:id" user={user} component={Product} setModal={setModal} />
                        <PrivateRoute path="/cart" user={user} component={Cart} setModal={setModal} setCartCounter={setCartCounter} />
                        <PrivateRoute path="/profile" user={user} setUser={setUser} setModal={setModal} component={Profile} />
                        <Route>
                            <NotFound />
                        </Route>
                    </Switch>
                </main>
            </div>
            {modal?.modal ? <Modal modal={modal} setModal={setModal} setToken={setToken} setData={setData} /> : null}
        </Router>
    )
}
