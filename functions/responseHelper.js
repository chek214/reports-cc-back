const resp = (res, status, data, message) => {
    let ok = true
    if (status >= 400) {
        ok = false
    }
    return res.status(status).json({ok, data, message})
}

export default resp