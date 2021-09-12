import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { delayTime, numberToPrice } from '../../functions/'
import { api } from '../../config/api'

import '../../styles/pages/admin/Dashboard.css'

const limit = 4
const delay = delayTime

export default function Dashboard() {
    const [list, setList] = useState()
    const [fetch, setFetch] = useState(true)

    const [count, setCount] = useState()
    const [page, setPage] = useState(0)
    const [tab, setTab] = useState('transaction')

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
            setTimeout(function () {
                api.get('/products', query)
                    .then((res) => {
                        setCount(res.data.data.count)
                        setList(res.data.data.products)
                    })
                    .catch((err) => err)
            }, delay * 1000)

        if (tab && tab === 'topping')
            setTimeout(function () {
                api.get('/toppings', query)
                    .then((res) => {
                        setCount(res.data.data.count)
                        setList(res.data.data.toppings)
                    })
                    .catch((err) => err)
            }, delay * 1000)

        if (tab && tab === 'transaction')
            setTimeout(function () {
                api.get('/toppings', query)
                    .then((res) => {
                        setCount(0)
                        setList([])
                    })
                    .catch((err) => err)
            }, delay * 1000)
        setFetch(false)
    }, [tab, page, item, fetch])

    const handleTab = (e) => {
        if (e.target.id !== tab) {
            setPage(0)
            setItem()
            setCount(0)
            setTab(e.target.id)
            setList()
        }
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
                    <button id="transaction" className="tablinks" onClick={handleTab}>
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
                    {(tab === 'product' || tab === 'topping') && list?.length > 0 ? (
                        <div className="tabcontent">
                            <ul>
                                {list?.map((item) => (
                                    <Item key={item.id} tab={tab} item={item} setItem={setItem} />
                                ))}
                            </ul>
                        </div>
                    ) : list?.length === 0 ? (
                        'noItem'
                    ) : (
                        <div className="lottie-container">
                            <lottie-player src="https://assets5.lottiefiles.com/packages/lf20_YMim6w.json" background="transparent" speed="1" loop autoplay />
                        </div>
                    )}
                </div>
            </div>

            {count > limit && (
                <div className="pagination">
                    <p onClick={prevBtn}>&laquo;</p>
                    <p>{page + 1}</p>
                    <p onClick={nextBtn}>&raquo;</p>
                </div>
            )}
        </div>
    )
}

function Item({ tab, item, setItem }) {
    return (
        <li key={item.id} className={'item ' + item.status}>
            <img src={item.image} alt="topping-img" width="50px" />
            <span>
                <h3>{item.title}</h3>
                <h5>{numberToPrice(item.price)}</h5>
            </span>
            <div className="action">
                <Link to={`/update-${tab}/${item.id}`}>
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
                .then((res) => res)
                .catch((err) => err)

        if (e.target.id === 'available')
            api.patch(`/${item}/` + id, {
                status: 'available',
            })
                .then((res) => res)
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
