// tag .........................
export const tag = (self) => {
    return self.template('cost-edit-button');
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
                cost_id : setup.cost_id ,
            }
            self.channel('cost.edit.form', inputs, [
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
        tags.form = self.template('cost-edit-form');

        // form ........................
        input = dom.select(tags.form, '.input-id');
        input.value = data.cost._id;

        // form ........................
        input = dom.select(tags.form, '.input-name');
        input.value = data.cost.name;

        // form ........................
        input = dom.select(tags.form, '.input-price');
        input.value = data.cost.price;

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
        dom.form.select.set(input, data.cost.position);

        // form ..................
        let button = dom.select(tags.form, '.button-edit');
        dom.click(button, () => {
            self.trigger('send');
        });

        // modal ..................
        self.modal = await self.component({
            alias : 'modal' ,
            setup : {
                title: 'Редактирай разход' ,
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
        data.sets = {
            name     : dom.select(tags.form, '.input-name').value.trim() ,
            price    : dom.select(tags.form, '.input-price').value.trim() ,
            position : 0
        };
        input = dom.select(tags.form, '.input-position');
        data.sets.position = dom.form.select.get(input);

        // channel .......................
        self.channel('cost.edit', data, [
            'complete',
            'error'
        ]);

    }, 

    'complete' : async (self, result) => {
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