
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error("API Error:", {
    message: err.message,
    path: req.originalUrl,
    method: req.method
  });


  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request payload is too large. Maximum allowed size is 100 KB."
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body."
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error."
  });
}
