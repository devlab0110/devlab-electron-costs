
module.exports = {

    init : async (attrs) => {

        // inputs ...................
        let inputs = attrs.get('inputs');
        inputs = Object.assign({
            cost_id   : null ,
        }, inputs);
        attrs.set('inputs', inputs);

    },

    steps : {

        cost : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let inputs = attrs.get('inputs');

            // find ......................
            const cost = await databases.costs.find(inputs.cost_id);
            attrs.set('cost', cost);

        },   

       
        status : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let cost      = attrs.get('cost');

            // check ................
            if(!cost){
                throw new Error('Разхода не е открит!');
            }

            // update ................
            let active = true;
            if(cost.active){
                active = false;
            }
            await databases.costs.update(cost, {
                active : active
            });

        } ,   
 

    },

    complete : async (attrs) => {
        return {};
    },

};