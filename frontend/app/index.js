// tag .........................
export const tag = (self) => {
    return self.template('app')
};

// components .........................
export const components = {

    'main' : {
        name  : 'main' ,
        put   : (self, tag) => {
            let dom  = self.dom();
            let into = self.tag();
            dom.html(into, tag);
        },
    }

};

// events .........................
export const events = {

    'init' : async (self) => {

        // prepare ...............
        let dom = self.dom();

        // title ..................
        dom.title.set('Месечни разходи');

        // main ..................
        await self.component({
            alias : 'main' ,
            setup : {} ,
        });
        
    }, 

}