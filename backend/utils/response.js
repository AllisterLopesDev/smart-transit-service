function success(data, message = "success", status = 200) {
  return {
    success: true,
    data,
    error: null,
    message,
    status,
  };
}

function failure(errorCode, errorMessage, status = 400) {
  return {
    success: false,
    data: null,
    error: {
      code: errorCode,
      message: errorMessage,
    },
    status,
  };
}

module.exports = { success, failure };
