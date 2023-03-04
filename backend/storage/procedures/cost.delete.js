
module.exports = {

    init : async (attrs) => {

        // prepare .................
        let inputs = attrs.get('inputs');

        // id ...................
        let id = null;
        try {
            id = inputs.cost_id;
        } catch (error) { }
        attrs.set('id', id);

    },

    steps : {

        cost : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let id = attrs.get('id');

            // check ................
            if(!id){
                throw new Error('Not found cost id');
            }

            // find ..................
            const cost = await databases.costs.find(id);
            attrs.set('cost', cost);

        },
        
        resort : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let cost     = attrs.get('cost');

            // check ................
            if(!cost){
                throw new Error('Разхода не е открит!');
            }

            // resort ..................
            let forResort = await databases.costs.list({
                filters : {
                    _id : {
                        $ne : cost._id ,
                    },     
                    group_id : cost.group_id , 
                    position : {
                        $gt : cost.position ,
                    }
                } ,
                sort    : { 
                    position: 1 
                } ,
                skip    : null ,
                limit   : null
            });

            // resort ..................
            for(let i in forResort){

                let cost = forResort[i];
                let newpos = parseInt(cost.position) - 1;
                
                await databases.costs.update(cost, {
                    position : newpos
                });
            }

        } ,   


        delete : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let cost     = attrs.get('cost');

            // check ................
            if(!cost){
                throw new Error('Разхода не е открит!');
            }

            // delete ................
            await databases.costs.delete(cost._id);
            
        } ,   


    },

    complete : async (attrs) => {
        return {};
    },

};