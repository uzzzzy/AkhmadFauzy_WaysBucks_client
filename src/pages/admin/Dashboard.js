import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { delayTime, numberToPrice } from '../../functions/'
import { api } from '../../config/api'

import '../../styles/pages/admin/Dashboard.css'

const limit = 4
const delay = delayTime

export default function Dashboard({ setModal }) {
    const [list, setList] = useState()
    const [fetch, setFetch] = useState()
    const [status, setStatus] = useState()
    const [count, setCount] = useState()
    const [page, setPage] = useState(0)
    const [tab, setTab] = useState('transaction')

    const [item, setItem] = useState()

    useEffect(() => {
        const order = tab === 'transaction' ? 'createdAt,desc' : undefined

        const query = {
            params: {
                limit,
                offset: limit * page,
                status,
                order,
            },
        }

        if (tab === 'product')
            setTimeout(function () {
                api.get('/products', query)
                    .then((res) => {
                        setCount(res.data.data.count)
                        setList(res.data.data.products)
                    })
                    .catch((err) => err)
            }, delay * 1000)

        if (tab === 'topping')
            setTimeout(function () {
                api.get('/toppings', query)
                    .then((res) => {
                        setCount(res.data.data.count)
                        setList(res.data.data.toppings)
                    })
                    .catch((err) => err)
            }, delay * 1000)

        if (tab === 'transaction') {
            setTimeout(function () {
                api.get('/transactions', query)
                    .then((res) => {
                        setCount(0)
                        setList(res.data.data.transactions)
                    })
                    .catch((err) => err)
            }, delay * 1000)
        }

        setFetch(false)
    }, [tab, page, item, fetch, status])

    const handleTab = (e) => {
        if (e.target.id !== tab) {
            setPage(0)
            setItem()
            setCount(0)
            setTab(e.target.id)
            setList()
            setStatus()
        }
    }

    const handleFilter = (e) => {
        if (item !== e.target.id) {
            setList()
            setPage(0)
            setStatus(e.target.id)
            if (item) setItem()
        }
    }

    const nextBtn = () => {
        if (page < Math.floor(count / limit) || tab === 'transaction') {
            setPage(page + 1)
            setFetch(true)
            setList()
        }
    }
    const prevBtn = () => {
        if (page !== 0) {
            setPage(page - 1)
            setFetch(true)
            setList()
        }
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
                    <div className="tab-tool">
                        <div className="pagination">
                            <p onClick={prevBtn}>&laquo;</p>
                            <p>{page + 1}</p>
                            <p onClick={nextBtn}>&raquo;</p>
                        </div>
                        <div className="tab-filter">
                            {tab === 'transaction' ? (
                                <div className="dropdown">
                                    <span>Status</span>
                                    <div className="dropdown-content">
                                        <button onClick={handleFilter}>All</button>
                                        <button id="waiting" onClick={handleFilter}>
                                            Waiting
                                        </button>
                                        <button id="approve" onClick={handleFilter}>
                                            Approved
                                        </button>
                                        <button id="cancel" onClick={handleFilter}>
                                            Canceled
                                        </button>
                                        <button id="otw" onClick={handleFilter}>
                                            On The Way
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="dropdown">
                                    <span>Status</span>
                                    <div className="dropdown-content">
                                        <button id="available" onClick={handleFilter}>
                                            Available
                                        </button>
                                        <button id="disabled" onClick={handleFilter}>
                                            Disabled
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {tab && list?.length > 0 ? (
                        <>
                            <div className="tabcontent">
                                <ul>
                                    {list?.map((item) => (
                                        <Item key={item.id} tab={tab} item={item} setItem={setItem} setModal={setModal} />
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : list?.length === 0 ? (
                        'noItem'
                    ) : (
                        <div className="lottie-container">
                            <lottie-player src="https://assets5.lottiefiles.com/packages/lf20_YMim6w.json" background="transparent" speed="1" loop autoplay />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function Item({ tab, item, setItem, setModal }) {
    const handleItem = () => {
        setModal({
            modal: true,
            modalOpt: 'transaction',
            modalTransaction: item.id,
        })
    }
    return tab === 'transaction' ? (
        <li className="item">
            <img src={item.attachment} alt="img" width="50px" />
            <span>
                <h3>{numberToPrice(item.total)}</h3>
                <h5>{item.status}</h5>
            </span>
            <div className="action transaction">
                <button onClick={handleItem} id={item.id}>
                    View
                </button>
            </div>
        </li>
    ) : (
        <li className={'item ' + item.status}>
            <img src={item.image} alt="img" width="50px" />
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
