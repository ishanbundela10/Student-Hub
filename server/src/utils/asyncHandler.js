const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            // Ensure status code uses err.statusCode (401, 404, etc.) instead of fallback 500
            const statusCode = err.statuscode || err.code || 500;
            return res.status(statusCode).json({
                success: false,
                message: err.message || "Internal Server Error"
            });

        })
    }
}

export { asyncHandler }