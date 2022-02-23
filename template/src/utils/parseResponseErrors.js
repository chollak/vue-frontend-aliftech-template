/**
 * @param {Object} error - Error from response
 * @returns {Array} - Array of errors
 */
const parseResponseErrors = (error) => {
  const responseErrors = [];

  if (error.response && error.response.data.errors) {
    const errors = error.response && error.response.data.errors;
    for (const err of Object.keys(errors)) {
      responseErrors.push({ [err]: errors[err][0] });
    }
  } else {
    responseErrors.push(
      (error.response && error.response.data.message) ||
        "[FE] Ошибка при получении данных"
    );
  }

  return responseErrors;
};

export default parseResponseErrors;
