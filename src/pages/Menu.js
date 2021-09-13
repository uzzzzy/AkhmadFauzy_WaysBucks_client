import { useState, useEffect } from 'react'
import MenuCard from '../components/MenuCard'

import { api } from '../config/api'

export default function Menu({ user, setModal }) {
    const [coffees, setCoffees] = useState()

    useEffect(() => {
        let query = {
            params: {
                order: 'createdAt,desc',
                status: 'available',
            },
        }

        api.get('/products', query)
            .then((res) => setCoffees(res.data.data.products))
            .catch((err) => err)
    }, [])
    return (
        <section className="menu">
            <div className="menu-header">
                <h1>All Menu</h1>
            </div>
            <div className="grid">
                {coffees?.map((item, i) => (
                    <MenuCard user={user} key={i} item={item} setModal={setModal} />
                ))}
            </div>
        </section>
    )
}
