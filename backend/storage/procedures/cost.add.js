const extend = require('extend');

// helpers ........................
const helpers = {};
helpers.toPrice = (price) => {
    try {
        price = parseFloat(price).toFixed(2);
        price = parseFloat(price);
    } 
    catch (error) { }
    if(isNaN(price)){
        price = 0;
    }
    return price;
}


module.exports = {

    init : async (attrs) => {

        // prepare .................
        let databases = attrs.get('databases');
        let schema = attrs.get('schema');
        let inputs = attrs.get('inputs');

        // sets .................
        let sets = extend(schema.cost, inputs.sets);
        sets.price = helpers.toPrice(sets.price);
        sets.active = true;

        // sets .................
        const count = await databases.costs.count({
            group_id : sets.group_id
        });
        sets.position = count + 1;

        // sets .................
        attrs.set('sets', sets);
        
    },

    steps : {

        add : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let sets      = attrs.get('sets');

            // check ................
            if(!sets){
                throw new Error('Not found cost sets');
            }

            // add ......................
            const cost = await databases.costs.insert(sets);
            attrs.set('cost', cost);

        },

    },

    complete : async (attrs) => {
        return {
            cost : attrs.get('cost')
        };
    },

};