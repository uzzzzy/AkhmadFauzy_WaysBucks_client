const formatter = Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

exports.numberToPrice = (val) => {
    return formatter.format(val).replace(/,/g, '.')
}
