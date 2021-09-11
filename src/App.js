import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import { api, setAuthToken } from './config/api'

import Modal from './components/Modal'
import Navbar from './components/Navbar'

import Dashboard from './pages/admin/Dashboard'
import AddOrUpdateItem from './pages/admin/AddOrUpdateItem'

import './styles/App.css'

export default function App() {
    const [modal, setModal] = useState()
    const [token, setToken] = useState()
    const [user, setUser] = useState()

    useEffect(() => {
        setModal()
        if (token || localStorage.token) {
            if (!token) setToken(localStorage.token)
            setAuthToken(localStorage.token)
            api.post('/verify')
                .then((res) => {
                    setUser(res.data.data.user)
                })
                .catch((err) => err)
        } else {
            setUser()
            setAuthToken()
        }
    }, [token])

    return (
        <Router>
            <div className="container">
                <Navbar token={token} user={user} setToken={setToken} setModal={setModal} Link={Link} />
                <main>
                    <Switch>
                        <Route exact path="/">
                            {user?.status === 'admin' ? <Dashboard /> : '<Landing token={token} user={user} setModal={setModal} />'}
                        </Route>
                        <Route path="/:mod-:item/:id?">
                            <AddOrUpdateItem setModal={setModal} />
                        </Route>
                        <Route>Not Found</Route>
                    </Switch>
                </main>
            </div>
            {modal?.modal ? <Modal modalOpt={modal.modalOpt} modalMessage={modal.modalMessage} setModal={setModal} setToken={setToken} /> : null}
        </Router>
    )
}
