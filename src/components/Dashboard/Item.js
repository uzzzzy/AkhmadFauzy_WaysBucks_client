import { Link } from 'react-router-dom'

import { numberToPrice } from '../../functions'

export default function Item({ tab, item, setItem, setModal }) {
    const status = item.status
    const statusMessage = status === 'otw' ? 'on the Way' : status === 'approve' ? 'approved' : status === 'cancel' ? 'canceled' : status === 'receive' ? 'Received' : status

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
                <div className="flex">
                    <h4 className={`capitalize ${status}`}>{statusMessage}</h4>
                    <h5 className="text-left">
                        To: {item.address}, Pos Code: {item.poscode}, Phone: {item.phone}
                    </h5>
                </div>
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
