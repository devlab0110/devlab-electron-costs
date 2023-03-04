// tag .........................
export const tag = (self) => {
    return self.template('modal')
};

// tags .........................
export const tags = (self) => {

    // prepare ...............
    let dom  = self.dom();
    let tag = self.tag();

    // TAGS ....................
    let tags = {};
    tags.container = dom.select(tag, '.modal-container');
    tags.title     = dom.select(tag, '.modal-title');
    tags.close     = dom.select(tag, '.modal-close .button');
    tags.content   = dom.select(tag, '.modal-content');
    return tags;

};

// setup .........................
export const setup = (self) => {
    return {
        title   : '...' ,
        content : '...' ,
        with    : '70%' ,
        height  : 'auto' ,
    };
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
        dom.text(tags.title, setup.title);
        if(setup.content){
            dom.html(tags.content, setup.content);
        }

        // close .....................
        dom.click(tags.close, (event) => {
             self.trigger('close');
        });

    }, 

    'close': async (self) => {
        let tag  = self.tag();
        let dom  = self.dom();
        dom.remove(tag);
    },

}