import { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { api } from '../config/api'

import '../styles/components/Modal.css'

export default function Modal({ modalOpt, modalMessage, setModal, setToken }) {
    const [form, setForm] = useState({
        email: '',
        password: '',
    })
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
                    setToken(res.data.data.token)
                    localStorage.token = res.data.data.token
                })
                .catch((err) => err)
        }

        return (
            <div id="modal" className="modal" onClick={closeModal}>
                <form className="modal-content" onSubmit={handleSubmit}>
                    <h2>{modalOpt}</h2>

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
    } else if (modalOpt === 'success') {
        return (
            <div id="modal" className="modal success" onClick={closeModal}>
                <div className="modal-content">{modalMessage}</div>
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
