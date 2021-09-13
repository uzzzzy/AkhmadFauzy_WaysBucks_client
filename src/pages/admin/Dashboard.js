import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Preview from '../../components/Dashboard/Preview'
import Item from '../../components/Dashboard/Item'

import { delayTime } from '../../functions/'
import { api } from '../../config/api'

import '../../styles/pages/admin/Dashboard.css'

const limit = 4
const delay = delayTime

export default function Dashboard({ data, setData, setModal }) {
    const [list, setList] = useState()
    const [fetch, setFetch] = useState(true)
    const [status, setStatus] = useState('')
    const [count, setCount] = useState()
    const [page, setPage] = useState(0)
    const [tab, setTab] = useState('transaction')
    let history = useHistory()
    const statusMessage = status === 'otw' ? 'on the Way' : status === 'approve' ? 'approved' : status === 'cancel' ? 'canceled' : status

    const [item, setItem] = useState()

    useEffect(() => {
        let search = window.location.search
        let par = new URLSearchParams(search)
        let foo = par.get('tab')

        if (foo) {
            setTab(foo)
        }

        const query = {
            params: {
                limit,
                offset: limit * page,
                status,
            },
        }

        if (data) {
            setData()
            setFetch(true)
            setList()
        }

        if (tab === 'product')
            setTimeout(function () {
                api.get('/products', query)
                    .then((res) => {
                        setCount(res.data.data.count)
                        setList(res.data.data.products)
                        if (fetch) setFetch()
                    })
                    .catch((err) => err)
            }, delay * 1000)

        if (tab === 'topping')
            setTimeout(function () {
                api.get('/toppings', query)
                    .then((res) => {
                        setCount(res.data.data.count)
                        setList(res.data.data.toppings)
                        if (fetch) setFetch()
                    })
                    .catch((err) => err)
            }, delay * 1000)

        if (tab === 'transaction') {
            setTimeout(function () {
                api.get('/transactions', query)
                    .then((res) => {
                        setCount(res.data.data.count)
                        setList(res.data.data.transactions)
                        if (fetch) setFetch()
                    })
                    .catch((err) => err)
            }, delay * 1000)
        }
    }, [tab, page, item, fetch, status, data, setData])

    const handleTab = (e) => {
        if (e.target.id !== tab) {
            setList()
            history.push(`/`)
            setPage(0)
            setTab(e.target.id)
            setItem()
            setCount(0)
            setStatus('')
            setFetch(true)
        }
    }

    const handleFilter = (e) => {
        if (status !== e.target.id) {
            setList()
            setFetch(true)
            setPage(0)
            setStatus(e.target.id)
        }
    }

    const nextBtn = () => {
        if (count !== limit && page < Math.floor(count / limit)) {
            setList()
            setFetch(true)
            setPage(page + 1)
        }
    }

    const prevBtn = () => {
        if (page !== 0) {
            setList()
            setFetch(true)
            setPage(page - 1)
        }
    }

    return (
        <div>
            <div className="row">
                <div className="tab">
                    <button id="transaction" name="tab" className="tablinks" onClick={handleTab}>
                        Transaction
                    </button>
                    <button id="product" name="tab" className="tablinks" onClick={handleTab}>
                        Products
                    </button>
                    <button id="topping" name="tab" className="tablinks" onClick={handleTab}>
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

                        {!fetch && list && (
                            <h2 className="capitalize">
                                {count} {statusMessage} {tab} found
                            </h2>
                        )}
                        <div className="tab-filter">
                            {!fetch && tab === 'transaction' ? (
                                <div className="dropdown">
                                    <span className="capitalize">{statusMessage ? statusMessage : 'No Filter'} </span>
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
                                        <button id="receive" onClick={handleFilter}>
                                            Received
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                !fetch && (
                                    <div className="dropdown">
                                        <span>Status</span>
                                        <div className="dropdown-content">
                                            <button onClick={handleFilter}>All</button>
                                            <button id="available" onClick={handleFilter}>
                                                Available
                                            </button>
                                            <button id="disabled" onClick={handleFilter}>
                                                Disabled
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    {!fetch && list?.length > 0 ? (
                        <>
                            <div className="tabcontent">
                                <ul>
                                    {list?.map((item) => (
                                        <Item key={item.id} tab={tab} item={item} setItem={setItem} setModal={setModal} />
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : fetch ? (
                        <div className="lottie-container">
                            <lottie-player src="https://assets5.lottiefiles.com/packages/lf20_YMim6w.json" background="transparent" speed="1" loop autoplay />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
