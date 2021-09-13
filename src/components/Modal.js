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
    const [transaction, setTransaction] = useState({})
    const [total, setTotal] = useState(0)
    const [error, setError] = useState()
    let history = useHistory()

    const closeModal = (e) => {
        if (e.target.id === 'modal') setModal({ modal: false })
        if (e.target.id === 'success') {
            setModal({ modal: false })
            history.push('/cart')
        }
    }

    useEffect(() => {
        if (modalTransaction)
            api.get('/transaction/' + modalTransaction)
                .then((res) => {
                    const data = res.data.data.transaction
                    setTransaction(data)
                    setTotal(res.data.data.total)
                })
                .catch((err) => console.log(err.response.data))
    }, [modalTransaction])

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
        let status = transaction.status === 'waiting' ? 'Waiting Approve' : transaction.status === 'approve' ? 'Approved' : transaction.status === 'otw' ? 'On The Way' : transaction.status === 'received' ? 'Order Received' : 'Canceled'

        const handleBtn = (e) => {
            console.log(e.target.id, transaction.id)
        }

        return (
            <div id="modal" className={`modal ${modalOpt}`} onClick={closeModal}>
                <div className="transaction-container">
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
                </div>
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
