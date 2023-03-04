// tag .........................
export const tag = (self) => {
    return self.template('group-edit-button');
};

// tags .........................
export const tags = (self) => {
    return {
        form : null
    }
};

// components .........................
export const components = {

    'modal' : {
        name  : 'modal' ,
        put   : (self, tag) => {
            let dom  = self.dom();
            let into = document.body;
            dom.append(into, tag);
        },
        afters : {
            'close' : 'cancel'
        },
    } ,

    'alert' : {
        name  : 'alert' ,
        put   : (self, tag) => {
            let dom  = self.dom();
            let into = document.body;
            dom.append(into, tag);
        },
    } ,

};

// events .........................
export const events = {

    'init' : async (self) => {

        // prepare ...............
        let dom  = self.dom();
        let tag  = self.tag();

        // click ............. 
        dom.click(tag, () => {

            let setup = self.setup();
            let inputs = {
                group_id : setup.group_id ,
            }

            self.channel('group.form', inputs, [
                'form.loaded',
                'error'
            ]);

        });

    }, 

    'form.loaded' : async (self, result) => {

        // prepare ...............
        let tags = self.tags();
        let dom  = self.dom();
        let data = result.data;
        let input;

        // form ........................
        if(tags.form){
            dom.remove(tags.form);
        }
        tags.form = self.template('group-edit-form');

        // form ........................
        input = dom.select(tags.form, '.input-id');
        input.value = data.group._id;

        // form ........................
        input = dom.select(tags.form, '.input-name');
        input.value = data.group.name;

        // form ........................
        input = dom.select(tags.form, '.input-position');
        let options = [];
        for(let i in data.positions){
            options.push({
                value : data.positions[i] ,
                label : data.positions[i]
            });
        }
        dom.form.select.options(input, options);
        dom.form.select.set(input, data.group.position);

        // form ..................
        let button = dom.select(tags.form, '.button-edit');
        dom.click(button, () => {
            self.trigger('send');
        });

        // modal ..................
        self.modal = await self.component({
            alias : 'modal' ,
            setup : {
                title: 'Редактирай категория' ,
                with : '70%' ,
                height : 'auto' ,
                content : tags.form
            } ,
        });

    }, 

    'cancel': async (self) => {

        // prepare ...............
        let tags = self.tags();
        let dom  = self.dom();

        // form ...................
        if(tags.form){
            dom.remove(tags.form);
        }
        tags.form = null;

        // modal .................
        try {
            self.modal.trigger('close');
        } 
        catch (error) { }
        self.modal = null;

    },
  
    'send' : async (self) => {

        // prepare ...............
        let tags = self.tags();
        let dom  = self.dom();
        let input;

        // data ......................
        let data = {};
        data.id   = dom.select(tags.form, '.input-id').value;
        data.sets = {};

        input = dom.select(tags.form, '.input-name');
        data.sets.name = input.value.trim();
        
        input = dom.select(tags.form, '.input-position');
        data.sets.position = dom.form.select.get(input);

        // channel .......................
        self.channel('group.edit', data, [
            'complete',
            'error'
        ]);

    }, 

    'complete' : async (self, result) => {
        console.log('COMPLETE EDIT', result);
        self.trigger('cancel');
    }, 
    
    'error': async (self, result) => {

        try {
            self.alert.trigger('close');
        } 
        catch (error) { }

        self.alert = await self.component({
            alias : 'alert',
            setup : {
                message : result.message
            } 
        });
        
    },

};