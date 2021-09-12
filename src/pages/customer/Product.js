import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { api } from '../../config/api'
import { numberToPrice } from '../../functions'

import '../../styles/pages/customer/Product.css'

export default function Product({ setModal }) {
    const { id } = useParams()
    const [coffee, setCoffee] = useState()
    const [toppings, setToppings] = useState()
    const [cart, setCart] = useState({ total: 0 })
    const [ctopping, setCtopping] = useState([])

    useEffect(() => {
        if (!coffee || !toppings) {
            api.get('/product/' + id).then((res) => setCoffee(res.data.data.product))
            api.get('/toppings').then((res) => setToppings(res.data.data.toppings))
        }

        if (coffee) {
            setCart({ productId: coffee.id, total: coffee.price, qty: 1 })
        }
    }, [coffee, id, toppings])

    const handleTopping = (id, price) => {
        if (!ctopping[id]) {
            setCtopping((prevState) => ({ ...prevState, [id]: true }))
            setCart((prevState) => ({ ...prevState, total: cart.total + price }))
        } else {
            setCtopping((prevState) => ({ ...prevState, [id]: false }))
            setCart((prevState) => ({ ...prevState, total: cart.total - price }))
        }
    }

    const handleQty = (e) => {
        let qty = e.target.id === 'add' ? 1 : -1
        if (cart.qty === 1 && qty < 0) qty = 0

        setCart((prevState) => ({ ...prevState, qty: cart.qty + qty }))
    }

    const addToCart = () => {
        let obj = cart
        let topping = Object.keys(ctopping).filter((key) => {
            return ctopping[key] === true
        })

        obj.toppings = topping.toString()
        api.post('/cart', obj)
            .then((res) => {
                setModal({
                    modal: true,
                    modalOpt: 'success',
                    modalMessage: res.data.message,
                    action: 'updatecart',
                })
            })
            .catch((err) => err)
    }

    return (
        <>
            <div className="product-grid w-100">
                <div className="col">
                    <img className="product-img" src={coffee?.image} alt="product-img" />
                </div>
                <div className="product-detail w-100">
                    <h1>{coffee?.title}</h1>
                    <p className="price">{numberToPrice(coffee?.price)}</p>
                    <p className="toping">Toping</p>

                    <div className="toping-grid">
                        {toppings?.map((item, i) => (
                            <div key={i} className="col-4 checkbox-wrapper">
                                <div>
                                    <div>
                                        <input className="checkbox" type="checkbox" id={'check-' + (i + 1)} onClick={() => handleTopping(item.id, item.price)} />
                                        <label htmlFor={'check-' + (i + 1)}>
                                            <img className="img-toping" src={item.image} alt="Toping" />
                                        </label>
                                        <label className="checkmark"></label>
                                    </div>

                                    <label htmlFor={'check-' + (i + 1)} className="toping-name">
                                        {item.title}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="topping-quantity">
                        <div className="quantity">
                            <button id="red" onClick={handleQty}>
                                -
                            </button>
                            <p>{cart.qty}</p>
                            <button id="add" onClick={handleQty}>
                                +
                            </button>
                        </div>
                    </div>
                    <ul>
                        <li>Total</li>
                        <li>{numberToPrice(cart.total * cart.qty)}</li>
                    </ul>

                    <button onClick={addToCart}>Add Cart</button>
                </div>
            </div>
        </>
    )
}
