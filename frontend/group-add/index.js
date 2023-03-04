// tag .........................
export const tag = (self) => {
    return self.template('group-add-button');
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
            self.trigger('form');
        });

    }, 

    'form' : async (self) => {

        // prepare ...............
        let tags = self.tags();
        let dom  = self.dom();

        // form ........................
        if(tags.form){
            dom.remove(tags.form);
        }

        // form ..................
        tags.form = self.template('group-add-form');

        // form ..................
        let button = dom.select(tags.form, '.button-add');
        dom.click(button, () => {
            self.trigger('send');
        });

        // modal ..................
        if(self.modal){
            self.modal.trigger('close');
        }
        self.modal =  await self.component({
            alias : 'modal' ,
            setup : {
                title: 'Добави категория' ,
                with : '70%' ,
                height : 'auto' ,
                content : tags.form
            } ,
        });

    }, 

    'cancel': async function (self) {

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

        // inputs ......................
        let sets = {
            name :  dom.select(tags.form, '.input-name').value.trim()
        }
        let inputs = {
            sets : sets ,
        }

        // channel ......................
        self.channel('group.add', inputs, [
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