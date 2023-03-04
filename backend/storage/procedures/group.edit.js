
module.exports = {

    init : async (attrs) => {

        // inputs ...................
        let inputs = attrs.get('inputs');
        inputs = Object.assign({
            id   : null ,
            sets : {}
        }, inputs);
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

        group : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let inputs = attrs.get('inputs');

            // find ......................
            const group = await databases.groups.find(inputs.id);
            attrs.set('group', group);

            // inputs ...................
            inputs.sets = Object.assign({
                name     : group.name ,
                position : group.position
            }, inputs.sets);
            attrs.set('inputs', inputs);

        },   

        resort : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let inputs    = attrs.get('inputs'); 
            let group     = attrs.get('group');

            // check ................
            if(!group){
                throw new Error('Категорията не е открита!');
            }

            // resort ...................
            let position = {
                changed   : null ,
                direction : null ,
                new       : parseInt(inputs.sets.position) ,
                old       : group.position ,
            };
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

            // resort ..................
            let filters = {
                _id : {
                    $ne : group._id ,
                },                   
                position : {}
            };

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

            let forResort = await databases.groups.list({
                filters : filters ,
                sort    : { 
                    position: 1 
                } ,
                skip    : null ,
                limit   : null
            });

            // update ..................
            for(let i in forResort){

                let group = forResort[i];
            
                let newpos = 0;
                if(position.direction > 0){
                    newpos = group.position - 1;
                }
                else if(position.direction < 0){
                    newpos = group.position + 1;
                }

                await databases.groups.update(group, {
                    position : newpos
                });
            }

        } ,   

        update : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let group     = attrs.get('group');
            let inputs    = attrs.get('inputs'); 

            // check ................
            if(!group){
                throw new Error('Категорията не е открита!');
            }

            // update ................
            group = await databases.groups.update(group, {
                name     : inputs.sets.name ,
                position : parseInt(inputs.sets.position) ,
            });

            // set ................
            attrs.set('group', group);

        } ,   

    },

    complete : async (attrs) => {
        return {
            group : attrs.get('group')
        };
    },

};