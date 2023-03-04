
module.exports = {

    init : async (attrs) => { },

    steps : {

        group : async (attrs) => {

            // prepare .................
            let inputs = Object.assign({
                group_id : null
            }, attrs.get('inputs'));
            let databases = attrs.get('databases');

            // check ..................
            if(!inputs.group_id){
                throw new Error('Invalid inputs');
            }

            // group ......................
            const group = await databases.groups.find(inputs.group_id);
            attrs.set('group', group);

        } ,   

        
        positions : async (attrs) => {

            // prepare .................
            let databases = attrs.get('databases');
            let positions = attrs.set('positions', []);
           
            // positions ......................
            const groups = await databases.groups.list({
                filters : {} ,
                sort    : { 
                    position: 1 
                } ,
                skip    : null ,
                limit   : null
            });
            for(let i in groups){
                positions.push(groups[i].position);
            }
            attrs.set('positions', positions);
            
        } ,   

    },

    complete : async (attrs) => {
        return {
            group     : attrs.get('group') ,
            positions : attrs.get('positions') ,
        };
    },

};