import { useEffect, useState } from 'react'

import { api } from '../../config/api'
import { numberToPrice } from '../../functions'

import Logo from '../../assets/logo.svg'
import QR from '../../assets/qrcode.svg'

import '../../styles/pages/customer/Profile.css'

export default function Profile({ user, setModal }) {
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
                    {transactions?.map((trans) => (
                        <div key={trans?.id}>
                            <div className="row transaction-card">
                                <div className="col">
                                    {trans.orderitems.map((item) => (
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
                                        <p className={trans.status}>{trans.status === 'waiting' ? 'Waiting Approve' : trans.status === 'approve' ? 'Waiting Order to be Made' : trans.status === 'otw' ? 'On The Way' : trans.status === 'receive' ? 'Order Received' : 'Order Canceled'}</p>
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
