
module.exports = {

    init : async (attrs) => {

        // prepare .................
        let inputs = Object.assign({
            group_id : null
        }, attrs.get('inputs'));
        let databases = attrs.get('databases');


        // check ..................
        if(!inputs.group_id){
            throw new Error('Invalid input group_id');
        }

        // group ......................
        const group = await databases.groups.find(inputs.group_id);
        attrs.set('group', group);

    },

    steps : { },

    complete : async (attrs) => {
        return {
            group : attrs.get('group') ,
        };
    },

};