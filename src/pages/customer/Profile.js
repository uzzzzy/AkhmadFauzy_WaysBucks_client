import { useEffect, useState } from 'react'

import { api } from '../../config/api'
import { numberToPrice } from '../../functions'

import Logo from '../../assets/logo.svg'
import QR from '../../assets/qrcode.svg'

import '../../styles/pages/customer/Profile.css'

export default function Profile({ userP: user }) {
    const [transactions, setTransactions] = useState()
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
        console.log(transactions)
    }, [transactions])
    return (
        <div className="row">
            <div className="col user-detail">
                <h2>My Profile</h2>
                <div className="row">
                    <img className="user-image" src={user?.image} alt="user_image" />
                    <div className="col">
                        <h4>Full Name</h4>
                        <h4>{user ? user.fullName : '-'}</h4>
                        <br />
                        <h4>Email</h4>
                        <h4>{user ? user.email : '-'}</h4>
                    </div>
                </div>
            </div>
            <div className="col transactions">
                <h2>My Transactions</h2>
                <div>
                    {transactions?.map((item) => (
                        <div key={item?.id}>
                            <div className="row transaction-card">
                                <div className="col">Item List</div>
                                <div className="status">
                                    <img className="logo" src={Logo} alt="logo" />
                                    <img className="qr" src={QR} alt="barcode" />
                                    <p>{item?.status?.toUpperCase()}</p>
                                    <h5>Sub Total: {numberToPrice(item?.total)}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
