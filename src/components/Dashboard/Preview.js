import { useEffect, useState } from 'react'

import { api } from '../../config/api'
import { numberToPrice } from '../../functions'

export default function Preview({ item, id, fetch, setFetch }) {
    const setItemStatus = (e) => {
        if (e.target.id === 'delete')
            api.delete(`/${item}/` + id)
                .then((res) => res)
                .catch((err) => err)

        if (e.target.id === 'available')
            api.patch(`/${item}/` + id, {
                status: 'available',
            })
                .then((res) => res)
                .catch((err) => err)

        setFetch(true)
    }

    const [preview, setPreview] = useState()
    useEffect(() => {
        api.get(`/${item}/${id}`).then((res) => setPreview(res.data.data[item]))
    }, [item, id, fetch])

    if (item === 'product' || item === 'topping')
        return (
            <div className="col preview">
                {preview && (
                    <div className={item + ' w-100'}>
                        <h1>{preview.title}</h1>
                        <img src={preview.image} alt="preview-img" />
                        <h2>{numberToPrice(preview.price)}</h2>
                        <h2>{preview.status}</h2>

                        <button id="delete" className="btn btn-primary" onClick={setItemStatus}>
                            Disable
                        </button>

                        <button id="available" className="btn btn-primary" onClick={setItemStatus}>
                            Available
                        </button>
                    </div>
                )}
            </div>
        )
    else return <div className="col">Transaction</div>
}
