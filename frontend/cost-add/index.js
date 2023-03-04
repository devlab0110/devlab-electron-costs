// tag .........................
export const tag = (self) => {
    return self.template('cost-add-button');
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

            self.channel('cost.add.form', inputs, [
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
        tags.form = self.template('cost-add-form');

        // form ........................
        input = dom.select(tags.form, '.input-group-id');
        input.value = data.group._id;

        // form ..................
        let button = dom.select(tags.form, '.button-add');
        dom.click(button, () => {
            self.trigger('send');
        });

        // modal ..................
        self.modal = await self.component({
            alias : 'modal' ,
            setup : {
                title: 'Добави разход' ,
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

        // data ......................
        let data = {};
        data.sets = {
            group_id : dom.select(tags.form, '.input-group-id').value.trim() ,
            name     : dom.select(tags.form, '.input-name').value.trim() ,
            price    : dom.select(tags.form, '.input-price').value.trim() ,
        };
        data.sets.price = parseFloat(data.sets.price).toFixed(2);

        // channel .......................
        self.channel('cost.add', data, [
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