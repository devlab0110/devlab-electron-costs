// tag .........................
export const tag = (self) => {
    return self.template('loading')
};

// tags .........................
export const tags = (self) => {
    return {};
};


// events .........................
export const events = {

    'init' : async (self) => {

        // prepare ...............
        let dom = self.dom();
        let tag = self.tag();

        // setup ..................
        dom.css(tag, {
            'z-index' : dom.zIndex()
        });

    }, 

    'close': async (self) => {
        let tag = self.tag();
        let dom = self.dom();
        dom.remove(tag);
    },


}