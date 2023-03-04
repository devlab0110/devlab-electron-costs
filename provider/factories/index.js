
module.exports = {
    'window main' : require('./window.main'),

    'response ok' : async (data) => {
        return {
            status  : 'ok',
            message : '',
            data    : data
        };
    },

    'response error' : async (message) => {
        return {
            status  : 'error',
            message : message,
            data    : null
        };
    }    

};