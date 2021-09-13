import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { api } from '../../config/api'

import attachment from '../../assets/img-attachment.svg'

import '../../styles/pages/admin/AddUpdateItem.css'

export default function AddOrUpdateItem({ setModal }) {
    const [preview, setPreview] = useState('http://localhost:5000/uploads/placeholder.png')
    const [form, setForm] = useState({
        title: '',
        image: '',
        price: 0,
    })

    const { mod, item, id } = useParams()
    let history = useHistory()
    useEffect(() => {
        if (mod === 'update' && id) {
            api.get(`/${item}/${id}`)
                .then((res) => {
                    setPreview(res.data.data[item].image)
                    setForm({
                        title: res.data.data[item].title,
                        price: res.data.data[item].price,
                        image: res.data.data[item].image,
                    })
                })
                .catch((err) => err)
        }
        if (mod === 'add') {
            setForm({
                title: '',
                image: '',
                price: 0,
            })
            setPreview('http://localhost:5000/uploads/placeholder.png')
        }
    }, [mod, item, id])

    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.type === 'file' ? e.target.files : e.target.value,
        })
        // Create image url for preview
        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        }
    }

    const submitItem = (e) => {
        e.preventDefault()
        let formData = new FormData()

        formData.append('image', e.target.elements.image?.files[0])
        formData.append('title', e.target.elements.title?.value)
        formData.append('price', e.target.elements.price?.value)

        if (mod === 'add')
            api.post(`/${item}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((res) => {
                    setModal({ modal: true, modalOpt: 'success', modalMessage: item + ' has been added' })
                    history.push(`/?tab=${item}`)
                })
                .catch((error) => {
                    setModal({ modal: true, modalOpt: 'success', modalMessage: error.response.data.message })
                })
        else if (mod === 'update')
            api.patch(`/${item}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((res) => {
                    setModal({ modal: true, modalOpt: 'success', modalMessage: item + ' has been added' })
                    history.push(`/?tab=${item}`)
                })
                .catch((error) => {
                    if (error.response) {
                        setModal({ modal: true, modalOpt: 'success', modalMessage: error.response.data.message })
                    }
                })
    }

    return (
        <>
            <div className="add-item-group">
                <form id="item" className="add-item-form" onSubmit={submitItem}>
                    <h2>{item}</h2>

                    <input name="title" placeholder={form.title ? form.title : `${item.charAt(0).toUpperCase() + item.slice(1)} Name`} type="text" className="form-control" onChange={handleOnChange} />

                    <input name="price" placeholder={form.price ? form.price : 'Price'} type="number" className="form-control" onChange={handleOnChange} />

                    <label htmlFor="upload-photo">
                        <div className="form-control img-field" style={{ color: 'rgba(191, 154, 154, 0.5)', fontWeight: '300', cursor: 'pointer' }}>
                            {form.image[0]?.name ? form.image[0].name + ' ' : 'Photo ' + item.charAt(0).toUpperCase() + item.slice(1)}
                            <img className="attachment" src={attachment} alt="attachment" />
                        </div>
                    </label>
                    <input id="upload-photo" name="image" type="file" className="form-control image-upload" onChange={handleOnChange} />

                    <button type="submit" className="btn-add">
                        {mod} {item}
                    </button>
                </form>
                <div>
                    <img src={preview} className={item === 'product' ? 'product' : 'topping'} alt="img" />
                </div>
            </div>
        </>
    )
}
