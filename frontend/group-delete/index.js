// tag .........................
export const tag = (self) => {
    return self.template('group-delete-button');
};

// tags .........................
export const tags = (self) => {
    return {
        form : null
    }
};

// components .........................
export const components = {

    'confirm' : {
        name  : 'confirm' ,
        put   : (self, tag) => {
            let dom  = self.dom();
            let into = document.body;
            dom.append(into, tag);
        },
        afters : {
            'yes' : 'send' ,
            'no'  : 'cancel'
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
            self.trigger('confirm');
        });

    }, 

    'confirm': async (self) => {
        self.confirm = await self.component({
            alias : 'confirm',
            setup : {
                message : 'Изтриване на категория?'
            } 
        });
    },    

    'cancel': async (self) => {
        try {
            self.confirm.trigger('close');
        } 
        catch (error) { }
        self.confirm = null;
    },
  
    'send' : async (self) => {

        // prepare ...............
        let setup = self.setup();

        // data ......................
        let data = {
            group_id : setup.group_id
        };
      
        // channel .......................
        self.channel('group.delete', data, [
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