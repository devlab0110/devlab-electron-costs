// tag .........................
export const tag = (self) => {
    return self.template('alert')
};

// tags .........................
export const tags = (self) => {

    // prepare ...............
    let dom = self.dom();
    let tag = self.tag();

    // tags ....................
    let tags = {};
    tags.container = dom.select(tag, '.alert-container');
    tags.message   = dom.select(tag, '.alert-message');
    tags.ok        = dom.select(tag, '.alert-buttons .button-ok');
    return tags;

};


// events .........................
export const events = {

    'init' : async (self) => {

        // prepare ...............
        let dom  = self.dom();
        let tag  = self.tag();
        let tags = self.tags();
        let setup = self.setup();

        // setup ..................
        dom.css(tag, {
            'z-index' : dom.zIndex()
        });
        dom.css(tags.container, {
            'with'   : setup.with ,
            'height' : setup.height ,
        });
        dom.text(tags.message, setup.message);
        
        // close ..............
        dom.click(tag, (event) => {
            if(event.target.id == tag.id){
                self.trigger('close');
            }
        });

        // ok .....................
        dom.click(tags.ok, (event) => {
            self.trigger('ok');
        });
    }, 

    'close': async (self) => {
        let tag  = self.tag();
        let dom  = self.dom();
        dom.remove(tag);
    },

    'ok': async (self) => {
        let tag  = self.tag();
        let dom  = self.dom();
        dom.remove(tag);
    },

}