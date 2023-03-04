// tag .........................
export const tag = (self) => {

    let setup = self.setup();
    if(setup.cost.active){
        return self.template('cost-deactivate-button');
    }
    else{
        return self.template('cost-activate-button');
    }
    
};

// tags .........................
export const tags = (self) => {
    return {
        form : null
    }
};

// components .........................
export const components = {

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
                cost_id : setup.cost._id ,
            }

            self.channel('cost.active', inputs, [
                'complete',
                'error'
            ]);

        });

    }, 

    'complete' : async (self, result) => { }, 
    
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

}