import { useEffect, useState } from 'react'

import { api } from '../../config/api'
import { delayTime, numberToPrice } from '../../functions'

import Invoice from '../../assets/invoice.svg'
import Delete from '../../assets/delete.svg'

import '../../styles/pages/customer/Cart.css'

export default function Cart({ userP: user, setCartCounter }) {
    const [cart, setCart] = useState()
    const [total, setTotal] = useState({
        subtotal: 0,
        qty: 0,
        total: 0,
    })

    useEffect(() => {
        if (!cart) {
            setTimeout(() => {
                api.get('/cart')
                    .then((res) => {
                        setCart(res.data.data.carts)
                        setTotal({
                            subtotal: res.data.subtotal,
                            qty: res.data.count,
                            total: res.data.total,
                        })
                    })
                    .catch((err) => err)
            }, delayTime * 1000)
        }
    }, [cart, total, setCartCounter])

    const handleDelete = (id, subtotal, qty) => {
        let filteredArray = cart.filter((item) => item.id !== id)
        setCart(filteredArray)
        setTotal({
            subtotal: total.subtotal - subtotal * qty,
            qty: total.qty - qty,
            total: total.total - (subtotal * qty + subtotal * qty * 0.1),
        })
        api.delete('/cart/' + id)
            .then((res) => res)
            .catch((err) => err)

        setCartCounter()
    }

    const handleOnChange = () => {}
    const payTarnsaction = () => {}

    return cart?.length > 0 ? (
        <div className="cart-container">
            <h2>My Cart</h2>
            <h3>Review Your Order</h3>
            <form className="row">
                <div className="cart-list">
                    <hr />
                    <div className="cart-order">
                        {cart?.map((item, i) => (
                            <CartItem key={i} item={item} setCart={setCart} total={total} setTotal={setTotal} handleDelete={handleDelete} />
                        ))}
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col">
                            <hr />
                            <div className="row">
                                <div className="col">
                                    <h4>Subtotal</h4>
                                    <h4>Qty</h4>
                                </div>
                                <div className="col align-right">
                                    <h4>{numberToPrice(total?.subtotal)}</h4>
                                    <h4>{total?.qty}</h4>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col">
                                    <h4 className="bold">Total</h4>
                                </div>
                                <div className="col align-right">
                                    <h4 className="bold">{numberToPrice(total?.total)}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="attachment-section">
                                <div className="attachment-group">
                                    <div className="attachment-image">
                                        <img src={Invoice} alt="attachment" />
                                    </div>
                                    <span>Attache of Transaction</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col cart-form">
                    <input name="fullname" onChange={handleOnChange} className="form-control" placeholder="Name" value={user.fullName} />
                    <input name="email" onChange={handleOnChange} className="form-control" placeholder="Email" value={user.email} />
                    <input name="phone" onChange={handleOnChange} className="form-control" placeholder="Phone" />
                    <input name="poscode" onChange={handleOnChange} className="form-control" placeholder="Pos code" />
                    <textarea name="address" onChange={handleOnChange} className="form-control" placeholder="Address" />
                    <button className="btn btn-primary" onClick={payTarnsaction}>
                        Pay
                    </button>
                </div>
            </form>
        </div>
    ) : Array.isArray(cart) ? (
        <div className="lottie-container">
            <div className="text-center">
                <h2>No Item in Your Cart</h2>
                <lottie-player src="https://assets5.lottiefiles.com/packages/lf20_sxhmqgbs.json" background="transparent" speed="1" loop autoplay />
            </div>
        </div>
    ) : (
        <div className="lottie-container">
            <lottie-player src="https://assets5.lottiefiles.com/packages/lf20_YMim6w.json" background="transparent" speed="1" loop autoplay />
        </div>
    )
}

function CartItem({ item, handleDelete }) {
    return (
        <div key={item.id} className="cart-item">
            <div className="cart-img">
                <img src={item.product.image} alt={item.product.title} />
            </div>
            <div className="col cart-detail w-100">
                <ul>
                    <li>{item.product.title}</li>
                    <li>
                        {item.topping.length > 0
                            ? item?.topping?.map((tpItem, i) => (
                                  <div key={tpItem.id} className="tooltip">
                                      <img src={tpItem.image} alt={tpItem.title} />
                                      <span className="tooltiptext">{tpItem.title}</span>
                                  </div>
                              ))
                            : 'No Topping'}
                    </li>
                </ul>
                <ul>
                    <li>
                        {numberToPrice(item.subtotal)} x{item.qty}
                    </li>
                    <li>
                        <img id={item.orderitemId} className="delete-button" src={Delete} alt={item.id} onClick={() => handleDelete(item.id, item.subtotal, item.qty)} />
                    </li>
                </ul>
            </div>
        </div>
    )
}
