import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { api } from '../config/api'
import { numberToPrice } from '../functions'

import '../styles/components/Modal.css'

export default function Modal({ modal, setModal, setToken }) {
    const { modalOpt, modalMessage, modalTransaction } = modal
    const [form, setForm] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState()
    let history = useHistory()

    const closeModal = (e) => {
        if (e.target.id === 'modal') setModal({ modal: false })
        if (e.target.id === 'success') {
            setModal({ modal: false })
            history.push('/cart')
        }
    }

    if (modalOpt === 'login' || modalOpt === 'register') {
        const handleOnChange = (e) => {
            setForm((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }

        const changeModal = () => {
            if (modalOpt === 'login')
                setModal((prevState) => ({
                    ...prevState,
                    modalOpt: 'register',
                }))
            else
                setModal((prevState) => ({
                    ...prevState,
                    modalOpt: 'login',
                }))
        }

        const handleSubmit = (e) => {
            e.preventDefault()
            const config = {
                email: form.email,
                password: form.password,
            }
            if (modalOpt === 'register') config.fullName = form.fullName

            api.post(`/${modalOpt}`, config)
                .then((res) => {
                    setModal({
                        modal: true,
                        modalOpt: 'success',
                        modalMessage: `${modalOpt} Success`,
                    })
                    setToken(res.data.data.token)
                    localStorage.token = res.data.data.token
                })
                .catch((err) => setError(err.response.data.message))
        }

        return (
            <div id="modal" className="modal" onClick={closeModal}>
                <form className="modal-content" onSubmit={handleSubmit}>
                    <h2>{modalOpt}</h2>

                    {error && <div className="alert">{error}</div>}

                    {modalOpt === 'register' ? <input name="fullName" className="form-control w-100" placeholder="Fullname" onChange={handleOnChange} /> : null}
                    <input name="email" className="form-control w-100" placeholder="Email" onChange={handleOnChange} />

                    <input name="password" className="form-control w-100" placeholder="Password" type="password" onChange={handleOnChange} />
                    <button className="btn btn-primary w-100 capitalize" type="submit">
                        {modalOpt}
                    </button>
                    <p>
                        {modalOpt === 'register' ? "Dont't Have an account" : 'Already have an account'} ? Click{' '}
                        <b onClick={changeModal} style={{ cursor: 'pointer' }}>
                            Here
                        </b>
                    </p>
                </form>
            </div>
        )
    } else if (modalOpt === 'success' || modalOpt === 'error') {
        return (
            <div id="modal" className={`modal ${modalOpt}`} onClick={closeModal}>
                <div className="modal-content">{modalMessage}</div>
            </div>
        )
    } else if (modalOpt === 'transaction') {
        return (
            <div id="modal" className={`modal ${modalOpt}`} onClick={closeModal}>
                <Transaction modalTransaction={modalTransaction} />
            </div>
        )
    } else {
        return (
            <div id="success" className="modal" onClick={closeModal}>
                <div className="modal-content success">
                    Add to Cart Success
                    <br />
                    {modalOpt}
                </div>
            </div>
        )
    }
}

function Transaction({ modalTransaction }) {
    const [transaction, setTransaction] = useState({})
    const [total, setTotal] = useState(0)
    const [tab, setTab] = useState('detail')
    let status = transaction.status === 'waiting' ? 'Waiting Approve' : transaction.status === 'approve' ? 'Waiting Order to be Made' : transaction.status === 'otw' ? 'On The Way' : transaction.status === 'received' ? 'Order Received' : 'Order Canceled'

    const handleBtn = (e) => {
        switch (e.target.id) {
            case 'cancel':
            case 'approve':
            case 'send':
                console.log(e.target.id, transaction.id)
                break
            default:
                setTab(e.target.id)
        }
    }

    useEffect(() => {
        if (modalTransaction)
            api.get('/transaction/' + modalTransaction)
                .then((res) => {
                    setTransaction(res.data.data.transaction)
                    setTotal(res.data.data.total)
                })
                .catch((err) => console.log(err))
    }, [modalTransaction])
    return (
        <div className="transaction-container">
            <div className="row tabcontent">
                <button id="detail" className={tab === 'detail' ? 'col tab active' : 'col tab'} onClick={handleBtn}>
                    Detail
                </button>
                <button id="list" className={tab === 'list' ? 'col tab active' : 'col tab'} onClick={handleBtn}>
                    Order List
                </button>
            </div>
            {tab === 'detail' ? (
                <>
                    <img src={transaction.attachment} alt="transaction" />
                    {transaction.status === 'waiting' ? (
                        <div className="row">
                            <button id="approve" className="col approve" onClick={handleBtn}>
                                Approve
                            </button>
                            <button id="cancel" className="col cancel" onClick={handleBtn}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        transaction.status === 'approve' && (
                            <div className="row">
                                <button id="send" className="col send" onClick={handleBtn}>
                                    Send Order
                                </button>
                            </div>
                        )
                    )}
                    <div className="transaction-detail">
                        <h2 className={transaction.status}>{status}</h2>
                        <h2 className="total">{numberToPrice(total)}</h2>
                        <div className="row">
                            <ul className="w-25">
                                <li>Order By</li>
                            </ul>
                            <ul className="col">
                                <li>{transaction.user?.fullName}</li>
                                <li>{transaction.user?.email}</li>
                            </ul>
                        </div>
                        <div className="row">
                            <ul className="w-25">
                                <li>Recipient</li>
                            </ul>
                            <ul className="col">
                                <li>{transaction.fullName}</li>
                                <li>{transaction.email}</li>
                                <li>{transaction.phone}</li>
                                <li>{transaction.poscode}</li>
                                <li>{transaction.address}</li>
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="row transaction-list">
                        {transaction.orderitems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-img">
                                    <img src={item.product.image} alt={item.product.title} />
                                </div>
                                <div className="col cart-detail w-100">
                                    <ul>
                                        <li>{item.product.title}</li>
                                        <li>
                                            {item.toppings.length > 0
                                                ? item?.toppings?.map((tpItem, i) => (
                                                      <div key={tpItem.id} className="tooltip">
                                                          <img src={tpItem.image} alt={tpItem.title} />
                                                          <span className="tooltiptext">{tpItem.title}</span>
                                                      </div>
                                                  ))
                                                : 'No Topping'}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
