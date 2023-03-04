
module.exports = {

    init : async (attrs) => {

        // prepare .................
        let inputs = attrs.get('inputs');

        // id ...................
        let id = null;
        try {
            id = inputs.group_id;
        } catch (error) { }
        attrs.set('id', id);

    },

    steps : {

        group : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let id = attrs.get('id');

            // check ................
            if(!id){
                throw new Error('Not found group id');
            }

            // group ..................
            const group = await databases.groups.find(id);
            attrs.set('group', group);

        },
        
        costs : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let group     = attrs.get('group');

            // check ................
            if(!group){
                throw new Error('Not found group');
            }

            // count ................
            const filters = {
                group_id: group._id
            };   
            const count = await databases.costs.count(filters);
            if(count > 0){
                throw new Error('Тази категория съдържа разходи и не може да бъде изтрита!');
            }

        } ,   

        resort : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let group     = attrs.get('group');

            // check ................
            if(!group){
                throw new Error('Категорията не е открита!');
            }

            // resort ..................
            let forResort = await databases.groups.list({
                filters : {
                    _id : {
                        $ne : group._id ,
                    },
                    position : {
                        $gt : group.position ,
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
                let group = forResort[i];
                let newpos = parseInt(group.position) - 1;
                await databases.groups.update(group, {
                    position : newpos
                });
            }

        } ,   


        delete : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let group     = attrs.get('group');

            // check ................
            if(!group){
                throw new Error('Категорията не е открита!');
            }

            // delete ................
            await databases.groups.delete(group._id);
            
        } ,   


    },

    complete : async (attrs) => {
        return {};
    },

};