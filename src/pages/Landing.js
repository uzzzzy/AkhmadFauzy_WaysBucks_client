import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

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
                order: 'id,desc',
                status: 'available',
            },
        }

        api.get('/products', query)
            .then((res) => setCoffees(res.data.data.products))
            .catch((err) => err)
    }, [])
    return (
        <>
            <section className="intro">
                <div
                    style={{
                        backgroundImage: 'url(' + bg + ')',
                        backgroundSize: 'cover',
                    }}
                    className="jumbotron">
                    <h1>WAYSBUCKS</h1>
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
                    <Link to="/menu">All Menu &raquo;</Link>
                </div>
                <div className="grid">
                    {coffees?.map((item, i) => (
                        <MenuCard user={user} key={i} item={item} setModal={setModal} />
                    ))}
                </div>
            </section>
            <section className="outlet">
                <h1 className="text-center bold">OUTLET</h1>

                <div className="outlet-grid">
                    <div className="text-center">
                        <ul>
                            <li>Outlet Waysbucks 1</li>
                            <li>South Jakarta, RT.5/RW.2, Kuningan, East Kuningan, Setiabudi, South Jakarta City, Jakarta 12940</li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <ul>
                            <li>Outlet Waysbucks 2</li>
                            <li>Jl. Jend. Sudirman, RT.5/RW.3, Senayan, Kec. Kby. Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 10270</li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <ul>
                            <li>Outlet Waysbucks 3</li>
                            <li>Central Jakarta, RT.11/RW.2, Gambir, Central Jakarta City, Jakarta 10110</li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <ul>
                            <li>Outlet Waysbucks 4</li>
                            <li>RT.3/RW.5, Pegangsaan, Menteng, Central Jakarta City, Jakarta</li>
                        </ul>
                    </div>
                </div>
                <div className="map-container">
                    <iframe title="my-map" loading="lazy" className="map" src="https://www.google.com/maps/d/embed?mid=1L0TqjVR1iPiwGEGzgKmeysCl2Rtl6HYf" />
                </div>
            </section>
        </>
    )
}
