
// helpers ........................
const helpers = {};
helpers.sum = (costs) => {

    let total = 0;

    for(let j in costs){

        let cost = costs[j];

        let price = 0;
        if(cost.active){
            price = cost.price;
            try {
                price = parseFloat(price).toFixed(2);
                price = parseFloat(price);
            } 
            catch (error) { }
            if(isNaN(price)){
                price = 0;
            }
        }

        total += price;

    }

    return total;

}



module.exports = {

    init : async (attrs) => {

        let tree = {
            groups : [] ,
            total  : 0
        }
        attrs.set('tree', tree);

    },

    steps : {

        groups : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let tree      = attrs.get('tree');

            // groups ......................
            const groups = await databases.groups.list({
                filters : {} ,
                sort    : { 
                    position: 1 
                } ,
                skip    : null ,
                limit   : null
            });
            tree.groups = groups;

            // tree ......................
            attrs.set('tree', tree);

        } ,   

        
        costs : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let tree      = attrs.get('tree');

            // check ................
            if(!tree){
                return ;
            }
            if(!tree.groups){
                return ;
            }
            if(!Array.isArray(tree.groups)){
                return ;
            }

            // groups ................
            for(let i in tree.groups){

                let group = tree.groups[i];
                group.total = 0;

                try {

                    const costs = await databases.costs.list({
                        filters : {
                            group_id : group._id
                        } ,
                        sort    : { 
                            position: 1
                        } ,
                        skip    : null ,
                        limit   : null
                    });
                    
                    tree.groups[i].costs = costs;

                    const total = helpers.sum(costs);
                    tree.groups[i].total = total;
                    tree.total = tree.total + total;

                } 
                catch (error) {}

            }

            // tree ................
            attrs.set('tree', tree);

        } ,   

    },

    complete : async (attrs) => {
        return attrs.get('tree');
    },

};