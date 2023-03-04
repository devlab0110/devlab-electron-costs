// tag .........................
export const tag = (self) => {
    return self.template('confirm')
};

// tags .........................
export const tags = (self) => {

    // prepare ...............
    let dom  = self.dom();
    let tag = self.tag();

    // tags ....................
    let tags = {};
    tags.container = dom.select(tag, '.confirm-container');
    tags.message   = dom.select(tag, '.confirm-message');
    tags.no        = dom.select(tag, '.confirm-buttons .button-no');
    tags.yes       = dom.select(tag, '.confirm-buttons .button-yes');
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
        
        // no .....................
        dom.click(tags.no, (event) => {
            self.trigger('no');
        });

        // yes .....................
        dom.click(tags.yes, (event) => {
            self.trigger('yes');
        });

    }, 

    'close': async (self) => {
        let tag  = self.tag();
        let dom  = self.dom();
        dom.remove(tag);
    },

    'yes': async (self) => {
        let tag  = self.tag();
        let dom  = self.dom();
        dom.remove(tag);
    },

    'no': async (self) => {
        let tag  = self.tag();
        let dom  = self.dom();
        dom.remove(tag);
    },

}