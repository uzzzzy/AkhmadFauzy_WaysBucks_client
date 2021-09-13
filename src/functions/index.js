const { api } = require('../config/api')

const formatter = Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

exports.delayTime = 2

exports.numberToPrice = (val) => {
    return formatter.format(val).replace(/,/g, '.')
}

exports.getCartCount = (setCartCounter) => {
    return api
        .get('cart', {
            params: {
                count: true,
            },
        })
        .then((res) => setCartCounter(res.data.count))
        .catch((err) => err)
}
