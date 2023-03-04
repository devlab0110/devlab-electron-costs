

// project ...................
const provider = require('devlab-electron-provider');


// router ................................
const router = async (name, inputs) => {
    try {
      const procedures = await provider.get('procedures');
      let data = await procedures[name].execute(inputs);
      return await provider.factory('response ok', data);
    } 
    catch (error) {
      console.log('router', error);
      return await provider.factory('response error', error.message);
    }
};

// channels ................................
const channels = {
  'tree.fetch' : async (event, inputs) => {
    return await router('tree.fetch', inputs);
  },

  'group.add' : async (event, inputs) => {
    return await router('group.add', inputs);
  },

  'group.delete' : async (event, inputs) => {
    return await router('group.delete', inputs);
  },

  'group.form' : async (event, inputs) => {
    return await router('group.form', inputs);
  },

  'group.edit' : async (event, inputs) => {
    return await router('group.edit', inputs);
  },

  'cost.add.form' : async (event, inputs) => {
    return await router('cost.add.form', inputs);
  },

  'cost.add' : async (event, inputs) => {
    return await router('cost.add', inputs);
  },

  'cost.edit.form' : async (event, inputs) => {
    return await router('cost.edit.form', inputs);
  },

  'cost.edit' : async (event, inputs) => {
    return await router('cost.edit', inputs);
  },
  'cost.delete' : async (event, inputs) => {
    return await router('cost.delete', inputs);
  },
  
  'cost.active' : async (event, inputs) => {
    return await router('cost.active', inputs);
  },
}


module.exports = channels;