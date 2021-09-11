import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { numberToPrice } from '../../functions/'
import { api } from '../../config/api'

import '../../styles/pages/admin/Dashboard.css'

const limit = 4

export default function Dashboard() {
    const [products, setProducts] = useState()
    const [toppings, setToppings] = useState()
    const [fetch, setFetch] = useState(true)

    const [count, setCount] = useState()
    const [page, setPage] = useState(0)
    const [tab, setTab] = useState()

    const [item, setItem] = useState()

    useEffect(() => {
        const query = {
            params: {
                limit: limit,
                offset: limit * page,
            },
            where: {},
        }

        if (tab && tab === 'product')
            api.get('/products', query)
                .then((res) => {
                    setCount(res.data.data.count)
                    setProducts(res.data.data.products)
                })
                .catch((err) => err)

        if (tab && tab === 'topping')
            api.get('/toppings', query)
                .then((res) => {
                    setCount(res.data.data.count)
                    setToppings(res.data.data.toppings)
                })
                .catch((err) => err)
        setFetch(false)
    }, [tab, page, item, fetch])

    const deleteItem = (e) => {
        api.delete(`/${tab}/` + e.target.id)
            .then((res) => console.log(res))
            .catch((err) => err)
        setFetch(true)
    }

    const handleTab = (e) => {
        setPage(0)
        setItem()
        setCount(0)
        setTab(e.target.id)
    }

    const nextBtn = () => {
        if (page < Math.floor(count / limit)) setPage(page + 1)
    }
    const prevBtn = () => {
        if (page !== 0) setPage(page - 1)
    }

    return (
        <div>
            <div className="row">
                <div className="tab">
                    <button className="tablinks" onClick={handleTab}>
                        Transaction
                    </button>
                    <button id="product" className="tablinks" onClick={handleTab}>
                        Products
                    </button>
                    <button id="topping" className="tablinks" onClick={handleTab}>
                        Toppings
                    </button>
                </div>
                <div className="tab">Filter List</div>
                {item ? <Preview item={tab} id={item} /> : null}
                <div className="app-inner-bar col">
                    {tab === 'topping' ? (
                        <div className="tabcontent">
                            <ul>
                                {toppings?.map((item) => (
                                    <li key={item.id} className={'item ' + item.status} onClick={() => setItem(item.id)}>
                                        <img src={item.image} alt="topping-img" />
                                        <span>
                                            <h3>{item.title}</h3>
                                            <h5>{numberToPrice(item.price)}</h5>
                                        </span>
                                        <div className="action">
                                            <Link to={`/update-topping/${item.id}`}>
                                                <button>Update</button>
                                            </Link>
                                            <button id={item.id} onClick={deleteItem}>
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : tab === 'product' ? (
                        <div id="Product" className="tabcontent">
                            <ul>
                                {products?.map((item) => (
                                    <li key={item.id} className={'item ' + item.status}>
                                        <img src={item.image} alt="topping-img" width="50px" />
                                        <span>
                                            <h3>{item.title + item.id}</h3>
                                            <h5>{numberToPrice(item.price)}</h5>
                                        </span>
                                        <div className="action">
                                            <Link to={`/update-product/${item.id}`}>
                                                <button>Update</button>
                                            </Link>
                                            <button id={item.id} onClick={() => setItem(item.id)}>
                                                View
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="tabcontent">{'No Transaction'}</div>
                    )}
                </div>
            </div>

            <div className="w-100 text-right">
                <button className="btn btn-primary" onClick={prevBtn}>
                    Next
                </button>
                {page + 1}
                <button className="btn btn-primary" onClick={nextBtn}>
                    Next
                </button>
            </div>
        </div>
    )
}

function Preview({ item, id }) {
    const [preview, setPreview] = useState()
    useEffect(() => {
        api.get(`/${item}/${id}`).then((res) => setPreview(res.data.data[item]))
    }, [item, id])

    if (item === 'product' || item === 'topping')
        return (
            <div className="col preview">
                {preview && (
                    <div className={item + ' w-100'}>
                        <h1>{preview.title}</h1>
                        <img src={preview.image} alt="preview-img" />
                        <h2>{numberToPrice(preview.price)}</h2>
                        <h2>{preview.status}</h2>
                    </div>
                )}
            </div>
        )
    else return <div className="col">Transaction</div>
}
