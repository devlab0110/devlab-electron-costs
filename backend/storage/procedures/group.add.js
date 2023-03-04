const extend = require('extend');

module.exports = {

    init : async (attrs) => {

        // prepare .................
        let schema = attrs.get('schema');
        let inputs = attrs.get('inputs');

        // sets .................
        let sets = extend(schema.group, inputs.sets);
        attrs.set('sets', sets);

    },

    steps : {

        add : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let sets = attrs.get('sets');

            // check ................
            if(!sets){
                throw new Error('Not found group sets');
            }

            // add ................
            const group = await databases.groups.insert(sets);
            attrs.set('group', group);
        },
        
        resort : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let group     = attrs.get('group');

            // check ................
            if(!group){
                throw new Error('Not found group');
            }

            // list ......................
            let forResort = await databases.groups.list({
                filters : {
                    _id : {
                        $ne : group._id
                    }
                } ,
                sort    : { 
                    position: 1 
                } ,
                skip    : null ,
                limit   : null
            });
    

            // update ......................
            for(let i in forResort){
                let group = forResort[i];
                await databases.groups.update(group, {
                    position : (group.position + 1)
                });
            }

        } ,   

    },

    complete : async (attrs) => {
        return {
            group : attrs.get('group')
        };
    },

};