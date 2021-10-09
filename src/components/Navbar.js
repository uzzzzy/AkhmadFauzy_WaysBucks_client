import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Logo from '../assets/logo.svg'
import IconUser from '../assets/user-icon.svg'
import IconProduct from '../assets/add-product.svg'
import IconTopping from '../assets/add-topping.svg'
import IconLogout from '../assets/logout.svg'

import '../styles/components/Navbar.css'

export default function Navbar({ modal, token, user, setToken, setModal, cartCounter }) {
    const [dropdown, setDropdown] = useState(false)
    let history = useHistory()

    useEffect(() => {
        if (token) {
            setDropdown(false)
        }
    }, [token, modal])

    const handleBtn = (btn) => {
        setDropdown(false)
        switch (btn) {
            case 'login':
                setModal({
                    modal: true,
                    modalOpt: 'login',
                })
                break
            case 'register':
                setModal({
                    modal: true,
                    modalOpt: 'register',
                })
                break
            case 'logo':
                history.push('/')
                break
            case 'cart':
                history.push('/cart')
                break
            case 'image':
                setDropdown(!dropdown)
                break
            case 'profile':
                history.push('/profile')
                break
            case 'product':
                history.push('/add-product')
                break
            case 'topping':
                history.push('/add-topping')
                break
            case 'logout':
                history.push('/')
                setToken()
                localStorage.removeItem('token')
                break
            default:
                break
        }
    }

    return (
        <nav>
            <img className="nav-icon" src={Logo} alt="navbar-icon" onClick={() => handleBtn('logo')} />
            <ul>
                {!token ? (
                    <>
                        <li>
                            <button className="btn" onClick={() => handleBtn('login')}>
                                Login
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-primary" onClick={() => handleBtn('register')}>
                                Register
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        {user?.status === 'customer' ? (
                            <li>
                                <div id="cart" className="cart" onClick={() => handleBtn('cart')}>
                                    {cartCounter > 0 && <p className="cart-number">{cartCounter}</p>}
                                </div>
                            </li>
                        ) : null}

                        <li>
                            <img id="image" onClick={() => handleBtn('image')} src={user?.image} className="user-pic" alt={user?.fullName} />
                            {dropdown ? (
                                <div id="dropdown" className="dropdown">
                                    <ul>
                                        {user?.status === 'admin' ? (
                                            <>
                                                <li onClick={() => handleBtn('product')}>
                                                    <img src={IconProduct} className="dropdown-icon" alt="Add Product" />
                                                    <span>Add Product</span>
                                                </li>
                                                <li onClick={() => handleBtn('topping')}>
                                                    <img src={IconTopping} className="dropdown-icon" alt="Add Toping" />
                                                    <span>Add Toping</span>
                                                </li>
                                            </>
                                        ) : (
                                            <li onClick={() => handleBtn('profile')}>
                                                <img src={IconUser} className="dropdown-icon" alt="Add Product" />
                                                <span>My Profile</span>
                                            </li>
                                        )}

                                        <hr />
                                        <li onClick={() => handleBtn('logout')}>
                                            <img src={IconLogout} className="dropdown-icon" alt="Logout" />
                                            <span>Logout</span>
                                        </li>
                                    </ul>
                                </div>
                            ) : null}
                        </li>
                    </>
                )}
            </ul>
        </nav>
    )
}
