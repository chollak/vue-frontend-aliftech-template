import { reactive, toRefs } from 'vue';

/**
 * @typedef { import("vue").Ref } Ref
 */

/**
 * @typedef execute
 * @type {Function}
 * @param {*} [arguments]
 * @returns Promise
 */

/**
 * @typedef setError
 * @type {Function}
 * @param {?(object|string)} e - error response
 * @param {?string} title
 * @returns {VoidFunction}
 */

/**
 * @typedef setSuccess
 * @type {Function}
 * @param {?string} message
 * @param {?string} title
 * @returns {VoidFunction}
 */

/**
 * @typedef alertObject
 * @type {object}
 * @property {?string} message
 * @property {?string} type
 * @property {?string} title
 * @property {?boolean} dismissible
 */

/**
 * @typedef setAlert
 * @type {Function}
 * @param {alertObject} alert
 * @returns {VoidFunction}
 */

/**
 * @typedef setResponse
 * @type {Function}
 * @param {?(object|array)} payload
 * @returns {VoidFunction}
 */

/**
 * @typedef setLoading
 * @type {Function}
 * @param {boolean} payload
 * @returns {VoidFunction}
 */

/**
 * @typedef Result
 * @type {object}
 * @property {Ref<{response: ?(object|array), error: ?object, errors: ?object, loading: boolean, alert: ?alertObject, request: array, hasError: boolean}>} refData
 * @property {execute} execute
 * @property {setError} setError
 * @property {setAlert} setAlert
 * @property {setSuccess} setSuccess
 * @property {setResponse} setResponse
 * @property {setLoading} setLoading
 */

/**
 * @param {Function} callback - axios callback
 * @returns {Result}
 */
export const useService = (callback) => {

  /**
   * Method to get all states with initial value
   * @returns {{request: *[], alert: null, response: null, hasError: boolean, error: null, loading: boolean, errors: null}}
   */
  const getState = () => ({
    response: null,
    error: null,
    errors: null,
    loading: false,
    alert: null,
    request: [],
    hasError: false,
  });
  const data = reactive({ ...getState() });

  /**
   * Method to reset all states
   * @returns {VoidFunction}
   */
  const resetState = () => {
    Object.assign(data, { ...getState() });
  };

  const setError = (e, title = null) => {
    if (Object.prototype.toString.call(e) === '[object Object]' && 'errors' in e) {
      data.errors = e.errors;
      return;
    } else if (Object.prototype.toString.call(e) === '[object Object]' && 'message' in e) {
      setAlert({ message: e.message, type: 'danger', title: title });
      data.error = { ...(e || {}) };
      return;
    } else if (Object.prototype.toString.call(e) === '[object String]') {
      setAlert({ message: e, type: 'danger', title: title });
      return;
    } else {
      setError('Что-то пошло не так. Попробуйте обновить страницу');
      return;
    }
  };

  /**
   * @type setSuccess
   */
  const setSuccess = (message, title = null) => {
    setAlert({ message: message, type: 'success', title });
  };

  /**
   * @type setAlert
   */
  const setAlert = ({ message = null, type = null, title = null, dismissible = true }) => {
    data.alert = {
      type,
      message,
      title,
      dismissible,
      id: message ? new Date().getTime() : null,
    };
  };

  /**
   * @type setResponse
   */
  const setResponse = payload => {
    data.response = payload;
  };

  /**
   * @type setLoading
   */
  const setLoading = payload => {
    data.loading = payload;
  };

  /**
   * @type execute
   */
  const execute = (...args) => {
    resetState();
    setLoading(true);
    data.request = [...args];

    return new Promise((resolve, reject) => {
      callback(...args)
          .then(res => {
            setResponse(res?.data);
            return resolve(res);
          })
          .catch(err => {
            data.hasError = true;
            setError(err);
            return reject(err);
          })
          .finally(() => {
            setLoading(false);
          });
    });
  };

  return {
    ...toRefs(data),
    execute,
    setError,
    setAlert,
    setSuccess,
    setResponse,
    setLoading,
  };
};
