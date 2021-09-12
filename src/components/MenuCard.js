import { useHistory } from 'react-router-dom'
import { numberToPrice } from '../functions'

import '../styles/components/MenuCard.css'

export default function Menu({ item, user, setModal }) {
    let history = useHistory()

    const handleCard = (e) => {
        console.log(item.id)
        history.push('/product/' + item.id)
    }

    return (
        <div title="product" className="card" onClick={user ? handleCard : () => setModal({ modal: true, modalOpt: 'login' })}>
            <img title="product" src={item.image} alt="product" />
            <div title="product" className="label">
                <h3 title="product">{item.title}</h3>
                <p title="product">{numberToPrice(item.price)}</p>
            </div>
        </div>
    )
}
