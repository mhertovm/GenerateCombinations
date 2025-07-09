const errorHandler = (err, req, res) => {
    console.error(req.method, req.path, err);

    const statusCode = err.status || 500
    const message = err.message || 'Internal Server Error'

    res.status(statusCode).json({ success: false, message });
};

module.exports = { errorHandler };