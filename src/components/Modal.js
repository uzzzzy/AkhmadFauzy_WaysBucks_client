import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { api } from '../config/api'
import { numberToPrice } from '../functions'

import '../styles/components/Modal.css'

export default function Modal({ modal, setModal, setToken }) {
    const { user, modalOpt, modalMessage, modalTransaction } = modal
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
                <Transaction modalTransaction={modalTransaction} setModal={setModal} user={user} />
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

function Transaction({ user, modalTransaction, setModal }) {
    const [transaction, setTransaction] = useState({})
    const [view, setView] = useState(false)
    const [total, setTotal] = useState(0)
    const [tab, setTab] = useState('detail')
    let status = transaction.status === 'waiting' ? 'Waiting Approve' : transaction.status === 'approve' ? 'Waiting Order to be Made' : transaction.status === 'otw' ? 'On The Way' : transaction.status === 'receive' ? 'Order Received' : 'Order Canceled'

    const handleBtn = (e) => {
        switch (e.target.id) {
            case 'cancel':
            case 'approve':
            case 'otw':
            case 'receive':
                api.patch('/transaction/' + transaction.id, {
                    status: e.target.id,
                })
                    .then((res) => {
                        setModal({
                            modal: false,
                            reopen: true,
                            modalOpt: 'success',
                            modalMessage: 'Success',
                        })
                    })
                    .catch((err) => err)
                break
            default:
                setTab(e.target.id)
                break
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
            <div className={view ? 'row tabcontent hidden' : 'row tabcontent'}>
                <button id="detail" className={tab === 'detail' ? 'col tab active' : 'col tab'} onClick={handleBtn}>
                    Detail
                </button>
                <button id="list" className={tab === 'list' ? 'col tab active' : 'col tab'} onClick={handleBtn}>
                    Order List
                </button>
            </div>
            {tab === 'detail' ? (
                <>
                    <img className={view ? 'attachment view' : 'attachment'} src={transaction.attachment} alt="transaction" onClick={() => setView(!view)} />
                    {transaction.status === 'waiting' ? (
                        <div className={view ? 'row hidden' : 'row'}>
                            <button id="approve" className="col approve" onClick={handleBtn}>
                                Approve
                            </button>
                            <button id="cancel" className="col cancel" onClick={handleBtn}>
                                Cancel
                            </button>
                        </div>
                    ) : user ? (
                        <div className={view ? 'row hidden' : 'row'}>
                            <button id="receive" className="col btn-receive" onClick={handleBtn}>
                                Recieve Order
                            </button>
                        </div>
                    ) : (
                        transaction.status === 'approve' && (
                            <div className={view ? 'row hidden' : 'row'}>
                                <button id="otw" className="col send" onClick={handleBtn}>
                                    Send Order
                                </button>
                            </div>
                        )
                    )}
                    <div className={view ? 'transaction-detail hidden' : 'transaction-detail'}>
                        <h2 className={transaction.status}>{status}</h2>
                        <h2 className="total">{numberToPrice(total)}</h2>
                        {!user && (
                            <div className="row">
                                <ul className="w-25">
                                    <li>Order By</li>
                                </ul>
                                <ul className="col">
                                    <li>{transaction.user?.fullName}</li>
                                    <li>{transaction.user?.email}</li>
                                </ul>
                            </div>
                        )}
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
                            <div key={item.id} className="transaction-item">
                                <div className="col w-100">
                                    <ul>
                                        <li>
                                            <h3 className="bold">
                                                {item.qty} x {item.product.title}
                                            </h3>
                                        </li>
                                        <li>
                                            {item.toppings.length > 0 && (
                                                <ul className="topping">
                                                    {item.toppings.map((toppItem) => (
                                                        <li key={toppItem.id}>+{toppItem.title}</li>
                                                    ))}
                                                </ul>
                                            )}
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
