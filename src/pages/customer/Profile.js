import { useEffect, useState } from 'react'

import { api } from '../../config/api'
import { numberToPrice } from '../../functions'

import Logo from '../../assets/logo.svg'
import QR from '../../assets/qrcode.svg'

import '../../styles/pages/customer/Profile.css'

export default function Profile({ user, setUser, setModal }) {
    const [transactions, setTransactions] = useState()
    const [edit, setEdit] = useState(false)
    const [preview, setPreview] = useState(user?.image)
    useEffect(() => {
        if (!transactions) {
            api.get('/transactions', {
                params: {
                    order: 'id,desc',
                    attributes: 'id,status',
                },
            })
                .then((res) => setTransactions(res.data.data.transactions))
                .catch((err) => err)
        }
    }, [transactions])

    const handleOnChange = (e) => {
        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        }
    }

    const handleSave = (e) => {
        e.preventDefault()
        if (e.target.id === 'submit' || e.target.elements.image.files[0] || e.target.elements.fullName.value || e.target.elements.email.value) {
            let formData = new FormData()

            formData.append('image', e.target.elements.image?.files[0])
            formData.append('fullName', e.target.elements.fullName?.value)
            formData.append('email', e.target.elements.email?.value)

            api.patch('/user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((res) => {
                    setUser((prevState) => ({ ...prevState, image: preview }))
                    if (e.target.elements.email) setUser((prevState) => ({ ...prevState, email: e.target.elements.fullName?.value }))
                    if (e.target.elements.fullName) setUser((prevState) => ({ ...prevState, fullName: e.target.elements.fullName?.value }))
                    setModal({ modal: true, modalOpt: 'success', modalMessage: res.data.data.message })
                })
                .catch((error) => {
                    if (error.response) {
                        setModal({ modal: true, modalOpt: 'success', modalMessage: error.response.data.message })
                    }
                })
            console.log('submit')
        }
        setEdit(!edit)
    }

    return (
        <div className="row">
            <div className="col user-detail">
                <h2>My Profile</h2>
                <form className="row" onSubmit={handleSave}>
                    {edit ? (
                        <>
                            <label className="pointer" htmlFor="upload-photo">
                                <img className="user-image" src={preview} alt="user_image" />
                            </label>
                            <input id="upload-photo" name="image" type="file" className="form-control image-upload" onChange={handleOnChange} />
                        </>
                    ) : (
                        <img className="user-image" src={preview} alt="user_image" />
                    )}
                    <div className="col">
                        <h4>Full Name</h4>

                        {edit ? <input name="fullName" className="form-control w-100" placeholder={user?.fullName} /> : <h4>{user ? user.fullName : '-'}</h4>}
                        <br />
                        <h4>Email</h4>
                        {edit ? <input name="email" className="form-control w-100" placeholder={user?.email} /> : <h4>{user ? user.email : '-'}</h4>}
                        {edit ? (
                            <>
                                <button id="submit" className="btn btn-secondary w-100" type="submit">
                                    Save
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-primary w-100" onClick={() => setEdit(!edit)}>
                                Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <div className="col transactions">
                <h2>My Transactions</h2>
                <div>
                    {transactions?.map((trans) => (
                        <div key={trans?.id}>
                            <div className="row transaction-card">
                                <div className="col">
                                    {trans.orderitems.map((item) => (
                                        <div key={item.id} className="cart-item">
                                            <div className="cart-img">
                                                <img src={item.product.image} alt={item.product.title} />
                                            </div>
                                            <div className="col profile-cart-detail w-100">
                                                <ul>
                                                    <li>
                                                        {item.qty} x {item.product.title}
                                                    </li>
                                                    <li>{item.toppings.length} Topping</li>
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="status">
                                    <img className="logo" src={Logo} alt="logo" />
                                    <img className="qr" src={QR} alt="barcode" />
                                    {trans.status === 'otw' ? (
                                        <button
                                            className={'btn ' + trans.status}
                                            onClick={() =>
                                                setModal({
                                                    modal: true,
                                                    modalOpt: 'transaction',
                                                    modalTransaction: trans.id,
                                                    user: true,
                                                })
                                            }>
                                            On The Way
                                        </button>
                                    ) : (
                                        <>
                                            <p className={trans.status}>{trans.status === 'waiting' ? 'Waiting Approve' : trans.status === 'approve' ? 'Waiting Order to be Made' : trans.status === 'otw' ? 'On The Way' : trans.status === 'receive' ? 'Order Received' : 'Order Canceled'}</p>

                                            <button
                                                className="btn-primary"
                                                onClick={() =>
                                                    setModal({
                                                        modal: true,
                                                        modalOpt: 'transaction',
                                                        modalTransaction: trans.id,
                                                        user: true,
                                                    })
                                                }>
                                                View Order
                                            </button>
                                        </>
                                    )}
                                    <h5>{numberToPrice(trans?.total)}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
