import { useEffect, useState } from 'react'

import { api } from '../config/api'

import MenuCard from '../components/MenuCard'

import coffeetable from '../assets/coffee-table.bmp'
import bg from '../assets/bg.svg'

import '../styles/pages/Landing.css'

export default function Landing({ user, setModal }) {
    const [coffees, setCoffees] = useState()

    useEffect(() => {
        let query = {
            params: {
                limit: 4,
                offset: 0,
            },
        }

        api.get('/products', query)
            .then((res) => setCoffees(res.data.data.products))
            .catch((err) => err)
    }, [])
    return (
        <div>
            <section className="intro">
                <div
                    style={{
                        backgroundImage: 'url(' + bg + ')',
                        backgroundSize: 'cover',
                    }}
                    className="jumbotron">
                    <h1>WAYSBUCK</h1>
                    <br />
                    <h3>Things are changing, but we’re still here for you</h3>
                    <br />
                    <p>
                        We have temporarily closed our in-store cafes, but select grocery and drive-thru locations remaining open. <b>Waysbucks</b> Drivers is also available
                        <br />
                        <br />
                        Let’s Order...
                    </p>
                </div>
                <div className="img-container">
                    <img id="img" src={coffeetable} className="image-coffee" alt="jumbotron" />
                </div>
            </section>
            <section className="menu">
                <div className="menu-header">
                    <h1>Let's Order</h1>
                    <button>All Menu</button>
                </div>
                <div className="grid">
                    {coffees?.map((item, i) => (
                        <MenuCard user={user} key={i} item={item} setModal={setModal} />
                    ))}
                </div>
            </section>
        </div>
    )
}
