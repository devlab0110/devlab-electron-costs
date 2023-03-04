
module.exports = {

    init : async (attrs) => { },

    steps : {

        group : async (attrs) => {

            // prepare .................
            let inputs = Object.assign({
                cost_id : null
            }, attrs.get('inputs'));
            let databases = attrs.get('databases');


            // check ..................
            if(!inputs.cost_id){
                throw new Error('Invalid inputs');
            }

            // find ......................
            const cost = await databases.costs.find(inputs.cost_id);
            attrs.set('cost', cost);

        } ,   

        
        positions : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let cost = attrs.get('cost');
            let positions = attrs.set('positions', []);

            
           
            // repositions ......................
            const costs = await databases.costs.list({
                filters : {
                    group_id : cost.group_id
                } ,
                sort    : { 
                    position: 1 
                } ,
                skip    : null ,
                limit   : null
            });

            // repositions ......................
            for(let i in costs){
                positions.push(costs[i].position);
            }
            attrs.set('positions', positions);
            
        } ,   

    },

    complete : async (attrs) => {
        return {
            cost      : attrs.get('cost') ,
            positions : attrs.get('positions') ,
        };
    },

};