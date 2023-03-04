// tag .........................
export const tag = (self) => {
    return self.template('main')
};

// tags .........................
export const tags = (self) => {

    // prepare ...............
    let dom = self.dom();
    let tag = self.tag();

    return {
        frames : {
            buttons : dom.select(tag, '.frame-buttons') ,
            content : dom.select(tag, '.frame-content') ,
        },
        content : dom.select(tag, '.content') ,
        wrapper : dom.select(tag, '.wrapper') ,
    }
};

// components .........................
export const components = {

    'group-add' : {
        name  : 'group-add' ,
        put   : (self, tag) => {
            let dom  = self.dom();
            let tags = self.tags();
            let into = tags.frames.buttons;
            dom.append(into, tag);
        },
        afters : {
            'complete' : 'tree.fetch'
        },
    } ,

    'group-edit' : {
        name  : 'group-edit' ,
        put   : null,
        afters : {
            'complete' : 'tree.fetch'
        },
    } ,

    'group-delete' : {
        name  : 'group-delete' ,
        put   : null,
        afters : {
            'complete' : 'tree.fetch'
        },
    } ,

    'cost-add' : {
        name  : 'cost-add' ,
        put   : null,
        afters : {
            'complete' : 'tree.fetch'
        },
    } ,

    'cost-edit' : {
        name  : 'cost-edit' ,
        put   : null,
        afters : {
            'complete' : 'tree.fetch'
        },
    } ,

    'cost-delete' : {
        name  : 'cost-delete' ,
        put   : null,
        afters : {
            'complete' : 'tree.fetch'
        },
    } ,

    'cost-active' : {
        name  : 'cost-active' ,
        put   : null,
        afters : {
            'complete' : 'tree.fetch'
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

    'loading' : {
        name  : 'loading' ,
        put   : (self, tag) => {
            let dom  = self.dom();
            let tags = self.tags();
            let into = tags.frames.content;
            dom.append(into, tag);
        },
    } ,

};


// EVENTS .........................
export const events = {

    // init ................
    'init' : async (self) => {

        // group-add ..................
        self.groupAdd = await self.component({
            alias : 'group-add' ,
            setup : {} ,
        });

        // trigger ..................
        self.trigger('tree.fetch');

    }, 

 
    // TREE FETCH ..................
    'tree.fetch' : async (self) => {

        // prepare 
        let tags = self.tags();


        // loading 
        try {
            self.loading.trigger('close');
        } 
        catch (error) { }
        self.loading = await self.component({
            alias : 'loading',
        });

        // scroll
        self.scrollTop = tags.wrapper.scrollTop;

        // fetch
        setTimeout(function(){
            self.channel('tree.fetch', {}, [
                'tree.fetch.complete',
                'tree.fetch.error'
            ]);
        }, 200);

    }, 
    'tree.fetch.complete' : async (self, result) => {

        // prepare ...............
        let tags  = self.tags();
        let dom   = self.dom();
        let data  = result.data;

        // prepare ...............
        dom.clear(tags.content);
    
        // groups ..................................
        for (let a in data.groups) {

            let group = data.groups[a];

            // group .........................
            await self.trigger('tree.fetch.group', {
                content : tags.content ,
                group   : group ,
            });

            // costs .........................
            for (let b in group.costs) {
                let cost = group.costs[b];
                await self.trigger('tree.fetch.group.cost', {
                    content : tags.content ,
                    group   : group ,
                    cost    : cost
                });
            }

            // total .........................
            if (group.costs.length > 0) {
                await self.trigger('tree.fetch.group.total', {
                    content : tags.content ,
                    group   : group ,
                });
            }

        }

        // total .....................
        await self.trigger('tree.fetch.total', {
            content : tags.content ,
            tree    : data ,
        });

        // scroll
        tags.wrapper.scrollTop = self.scrollTop;

        // loading 
        try {
            self.loading.trigger('close');
        } 
        catch (error) { }

    }, 
    'tree.fetch.group' : async (self, options) => {

        // options ............................
        options = Object.assign({
            content : null ,
            group   : null ,
        }, options);

        // ............................
        let dom = self.dom();
        let td;

        // row ............................
        let row = self.template('main-group-row');
        
        // name ..................
        td = dom.select(row, ':scope > .name');
        dom.text(td, options.group.name);

        // buttons ..................
        let buttons = dom.select(row, ':scope > .buttons');

        // edit ..................
        await self.component({
            alias : 'group-edit' ,
            setup : {
                group_id : options.group._id
            } ,
            put : (self, tag) => {
                dom.append(buttons, tag);
            }
        });

        // delete ..................
        await self.component({
            alias : 'group-delete' ,
            setup : {
                group_id : options.group._id
            } ,
            put : (self, tag) => {
                dom.append(buttons, tag);
            }
        });

        // cost ..................
        await self.component({
            alias : 'cost-add' ,
            setup : {
                group_id : options.group._id
            } ,
            put : (self, tag) => {
                dom.append(buttons, tag);
            }
        });

        // append ............................
        dom.append(options.content, row);

    }, 

    'tree.fetch.group.cost' : async (self, options) => {

        // options .................
        options = Object.assign({
            content : null ,
            group   : null ,
            cost    : null
        }, options);

        // check ...................
        let dom = self.dom();
        let tg;

        // row ............................
        let row = self.template('main-cost-row');
        dom.attr.set(row, {
            active :  options.cost.active ? 1 : 0
        });

        // name ..................
        tg = dom.select(row, ':scope > .name');
        dom.text(tg, options.cost.name);

        // price ..................
        tg = dom.select(row, ':scope > .price');
        dom.text(tg, options.cost.price + ' лв');
        
        // buttons ..................
        let buttons = dom.select(row, ':scope > .buttons');

        // edit ..................
        await self.component({
            alias : 'cost-edit' ,
            setup : {
                cost_id : options.cost._id ,
            } ,
            put : (self, tag) => {
                dom.append(buttons, tag);
            }
        });

        // delete ..................
        await self.component({
            alias : 'cost-delete' ,
            setup : {
                cost_id : options.cost._id ,
            } ,
            put : (self, tag) => {
                dom.append(buttons, tag);
            }
        });

        // active ..................
        await self.component({
            alias : 'cost-active' ,
            setup : {
                cost : options.cost 
            } ,
            put : (self, tag) => {
                dom.append(buttons, tag);
            }
        });

        // append ............................
        dom.append(options.content, row);

    }, 

    'tree.fetch.group.total' : async (self, options) => {

        // options ...................
        options = Object.assign({
            content : null ,
            group   : null ,
        }, options);

        // prepare ....................
        let dom = self.dom();
        let td;

        // row ............................
        let row = self.template('main-group-total');
        
        // total ..................
        td = dom.select(row, ':scope > .total');
        dom.text(td, options.group.total + ' лв');

        // append ............................
        dom.append(options.content, row);

    }, 

    'tree.fetch.total' : async (self, options) => {

        // options ......................
        options = Object.assign({
            content : null ,
            tree    : null ,
        }, options);

        // prepare ............................
        let dom = self.dom();
        let td;

        // row ............................
        let row = self.template('main-total');
        
        // total ..................
        td = dom.select(row, ':scope > .total');
        dom.text(td, options.tree.total + ' лв');

        // append ............................
        dom.append(options.content, row);

    }, 

    'tree.fetch.error' : async (self, result) => {

        // scroll
        tags.wrapper.scrollTop = self.scrollTop;

        // loading 
        try {
            self.loading.trigger('close');
        } 
        catch (error) { }

        // alert 
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
    // TREE FETCH ..................


}