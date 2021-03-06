import { useEffect, useState } from 'react'
import { api } from '../../config/api'
import { numberToPrice } from '../../functions'

export default function TransactionModal({ user, modalTransaction, setModal, setData }) {
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
                        setTransaction((prevState) => ({ ...prevState, status: e.target.id }))
                        setData(e.target.id)
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
                    {!user && <img className={view ? 'attachment view' : 'attachment'} src={transaction.attachment} alt="transaction" onClick={() => setView(!view)} />}
                    {transaction.status === 'waiting' && !user ? (
                        <div className={view ? 'row hidden' : 'row'}>
                            <button id="approve" className="col approve" onClick={handleBtn}>
                                Approve
                            </button>
                            <button id="cancel" className="col cancel" onClick={handleBtn}>
                                Cancel
                            </button>
                        </div>
                    ) : transaction.status === 'otw' && user ? (
                        <div className={view ? 'row hidden' : 'row'}>
                            <button id="receive" className="col btn-receive" onClick={handleBtn}>
                                Recieve Order
                            </button>
                        </div>
                    ) : (
                        transaction.status === 'approve' &&
                        !user && (
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
