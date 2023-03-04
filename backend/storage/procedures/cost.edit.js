
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

        // inputs ...................
        let inputs = attrs.get('inputs');
        inputs = Object.assign({
            id   : null ,
            sets : {}
        }, inputs);
        inputs.sets.price = helpers.toPrice(inputs.sets.price);
        attrs.set('inputs', inputs);

        // check ...................
        if(inputs.sets && inputs.sets.position){
            let position = NaN;
            try {
                position = parseInt(inputs.sets.position);
            } catch (error) {}
            if(isNaN(position)){
                throw new Error('Invalid input position');
            }
        }

    },

    steps : {

        cost : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let inputs = attrs.get('inputs');

            // find ......................
            const cost = await databases.costs.find(inputs.id);
            attrs.set('cost', cost);

            // inputs ...................
            inputs.sets = Object.assign({
                name     : cost.name ,
                position : cost.position ,
                price    : cost.price ,
            }, inputs.sets);
            attrs.set('inputs', inputs);

        },   

        resort : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let inputs    = attrs.get('inputs'); 
            let cost      = attrs.get('cost');

            // check ................
            if(!cost){
                throw new Error('Разхода не е открит!');
            }

            // repositions ...................
            let position = {
                changed   : null ,
                direction : null ,
                new       : parseInt(inputs.sets.position) ,
                old       : cost.position ,
            };

            // repositions ...................
            if(position.new > position.old){
                position.direction = 1;
            }
            else if(position.new < position.old){
                position.direction = -1;
            }
            else{
                position.direction = 0;
            }
            if(position.direction == 0){
                return ;
            }

            // repositions ..................
            let filters = {
                _id : {
                    $ne : cost._id ,
                },     
                group_id : cost.group_id ,              
                position : {}
            };

            // repositions ..................
            if(position.direction > 0){
                filters.position = {
                    $gt  : position.old,
                    $lte : position.new
                };
            }
            else if (position.direction < 0){
                filters.position = {
                    $gte : position.new,
                    $lt  : position.old
                }
            }

            // repositions ..................
            let forResort = await databases.costs.list({
                filters : filters ,
                sort    : { 
                    position: 1 
                } ,
                skip    : null ,
                limit   : null
            });

            // uodate ..................
            for(let i in forResort){

                let cost = forResort[i];
            
                let newpos = 0;
                if(position.direction > 0){
                    newpos = cost.position - 1;
                }
                else if(position.direction < 0){
                    newpos = cost.position + 1;
                }

                await databases.costs.update(cost, {
                    position : newpos
                });
            }

        } ,   


        update : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let cost     = attrs.get('cost');
            let inputs    = attrs.get('inputs'); 

            // check ................
            if(!cost){
                throw new Error('Разхода не е открит!');
            }

            // update ................
            inputs.sets.price = helpers.toPrice(inputs.sets.price);
            await databases.costs.update(cost, {
                name     : inputs.sets.name ,
                price    : inputs.sets.price ,
                position : parseInt(inputs.sets.position) ,
            });

        } ,   

    },

    complete : async (attrs) => {
        return {};
    },

};