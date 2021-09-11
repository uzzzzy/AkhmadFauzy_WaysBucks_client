import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { numberToPrice } from '../../functions/'
import { api } from '../../config/api'

import '../../styles/pages/admin/Dashboard.css'

const limit = 4

export default function Dashboard() {
    const [products, setProducts] = useState()
    const [list, setList] = useState()
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
                    setList(res.data.data.products)
                })
                .catch((err) => err)

        if (tab && tab === 'topping')
            api.get('/toppings', query)
                .then((res) => {
                    setCount(res.data.data.count)
                    setList(res.data.data.toppings)
                })
                .catch((err) => err)
        setFetch(false)
    }, [tab, page, item, fetch])

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
                {item ? <Preview item={tab} id={item} fetch={fetch} setFetch={setFetch} /> : null}
                <div className="app-inner-bar col">
                    {tab === 'product' || tab === 'topping' ? (
                        <div className="tabcontent">
                            <ul>
                                {list?.map((item) => (
                                    <Item key={item.id} item={item} setItem={setItem} />
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="tabcontent">{'No Transaction'}</div>
                    )}
                </div>
            </div>

            {count > limit && (
                <div className="w-100 text-right">
                    <button className="btn btn-primary" onClick={prevBtn}>
                        Prev
                    </button>
                    {page + 1}
                    <button className="btn btn-primary" onClick={nextBtn}>
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

function Item({ item, setItem }) {
    return (
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
    )
}

function Preview({ item, id, fetch, setFetch }) {
    const setItemStatus = (e) => {
        if (e.target.id === 'delete')
            api.delete(`/${item}/` + id)
                .then((res) => console.log(res))
                .catch((err) => err)

        if (e.target.id === 'available')
            api.patch(`/${item}/` + id, {
                status: 'available',
            })
                .then((res) => console.log(res))
                .catch((err) => err)

        setFetch(true)
    }

    const [preview, setPreview] = useState()
    useEffect(() => {
        api.get(`/${item}/${id}`).then((res) => setPreview(res.data.data[item]))
    }, [item, id, fetch])

    if (item === 'product' || item === 'topping')
        return (
            <div className="col preview">
                {preview && (
                    <div className={item + ' w-100'}>
                        <h1>{preview.title}</h1>
                        <img src={preview.image} alt="preview-img" />
                        <h2>{numberToPrice(preview.price)}</h2>
                        <h2>{preview.status}</h2>

                        <button id="delete" className="btn btn-primary" onClick={setItemStatus}>
                            Disable
                        </button>

                        <button id="available" className="btn btn-primary" onClick={setItemStatus}>
                            Available
                        </button>
                    </div>
                )}
            </div>
        )
    else return <div className="col">Transaction</div>
}
