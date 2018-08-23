module.exports = {
    flash: value => value.length ? value[0] : '',
    array: array => array && Array.isArray(array) ? [...array] : [],
};