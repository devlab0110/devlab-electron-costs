


// MODULES ..................
let modules = {};
modules.load = async (path) => {
    return await import(path)
}


// CSS ..................
let css = {};
css.import = async (into, href) => {

    return new Promise( (resolve, reject) => {

        let link = document.createElement('link'); 
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href",href);
        link.setAttribute("type","text/css"); 
        link.onload = link.onreadystatechange = function(e) {
            resolve();
        };
        into.appendChild(link);

    });    

}


// TEMPLATES ..................
const templates = {};
templates.import = async (into, url) => {

    //.......................
    const response = await fetch(url);
    const html     = await response.text();

    //.....................
    let parser = new DOMParser();
    let doc    = parser.parseFromString(html,'text/html');

    //............................
    let templates = doc.getElementsByTagName('template');
    if(templates){
        [...templates].forEach(function(template) {
            into.appendChild(template);
        });
    }

}
templates.id = 0;
templates.create = function (name)  {

    templates.id++;

    const selector = 'template[name="'+name+'"]';
    const template = document.querySelector(selector);

    const cloning = template.content.cloneNode(true);
    let first   = cloning.firstElementChild;
    
    first.id = 'template-'+templates.id;
    return first;

}    
// TEMPLATES ..................


// DOM ..................
let dom = {};

dom.zIndexAi = 100;
dom.zIndex = () => {
    dom.zIndexAi++;
    return dom.zIndexAi;
};
dom.clear = (into) => {
    into.innerHTML = "";
};

dom.html = (into, tag) => {
    into.innerHTML = "";
    into.appendChild(tag);
};
dom.append = (into, tag) => {
    into.appendChild(tag);
};
dom.select = (into, selector) => {
    return into.querySelector(selector); 
};
dom.remove = (tag) => {
    tag.remove(); 
};
dom.selectAll = (into, selector) => {
    let list = into.querySelectorAll(selector);
    if(!list){
        return [];
    }
    return list;
};
dom.title = {};
dom.title.set = (title) => {
    document.title = title;
};

dom.text = (tag, text) => {
    tag.textContent = text;
};

dom.click = (tag, callback) => {
    tag.addEventListener("click", callback);
};

dom.css = (tag, css) => {
    for(let name in css){
        let value = css[name];
        dom.styles[name](tag, value);
    }
};
dom.styles = {
    'z-index' : (tag, value) => {
        tag.style.zIndex = value;
    }, 
    'with' : (tag, value) => {
        tag.style.width = value;
    }, 
    'height' : (tag, value) => {
        tag.style.height = value;
    }, 
};

dom.form = {};
dom.form.select = {};
dom.form.select.options = (select, list) => {
    for (let i in list){
        let option = document.createElement('option');
        option.value     = list[i].value;
        option.innerHTML = list[i].label;
        select.appendChild(option);
    }
};
dom.form.select.set = (select, selected) => {
    select.value = String(selected);
};
dom.form.select.get = (select) => {
    return select.value;
};

dom.attr = {};
dom.attr.set = (tag, attrs) => {
    for(let name in attrs){
        let value = attrs[name];
        tag.setAttribute(name, value)
    }
};
// DOM ..................



// COMPONENT ..................
class Component {

    // ID ..............
    static idAi = 0;

    // CONFIGS ................
    static configs = {

        '*' : {
            components : {
                path : null ,
            },
            templates : {
                appendTo : null
            },
            styles : {
                appendTo : null
            },  

        } ,

        set : function(config){
            this['*'] = Object.assign(this['*'], config);
        },

        get : function(){
            return this['*'];
        },
    };


    // CHANNELS ................
    static channels = {
        obj : null,
        set : function(obj){
            this.obj = obj;
        },
        get : function(){
            return this.obj;
        },
    };


    // CONSTRUCTOR ....................
    constructor(signature) {

        // PREPARE .....................
        let self = this;

        // SIGNATURE ..........................
        this.signature  = Object.assign({
            id     : null ,
            name   : '' ,
            setup  : {},
            module : null ,
            tag    : null ,
            tags   : {},
            before : [],
            after  : [],
        }, signature);

        // TAG ..........................
        this.signature.tag = this.signature.module.tag(this);

        // TAGS ..........................
        if(typeof this.signature.module.tags === "function"){
            this.signature.tags = this.signature.module.tags(this);
        }

        // SETUP ..........................
        if(typeof this.signature.module.setup === "function"){
            this.signature.setup = Object.assign(
                this.signature.module.setup(this), 
                this.signature.setup
            );
        }

        // INIT ..................
        this.trigger('init');

    }
    // CONSTRUCTOR ....................


    // CHANNEL  ..............
    channel(name, data, triggers){
        Component.channels.get().invoke(name, data, (result) => {
            let trigger = null;
            if(result.status  == 'ok'){
                trigger = triggers[0];
            }
            else{
                trigger = triggers[1];
            }
            this.trigger(trigger, result);
        });
    }    


    // TEMPLATE ...............
    template(name){
        return templates.create(name);
    }

    // LOG ...............
    log(...args){
        console.log('--------------------------------');
        console.log('Component: ' + this.name());
        for(let i in args){
            console.log(args[i]);
        }
        console.log('--------------------------------');
    }

    // GETTERS .....................
    name(){
        return this.signature.name;
    }
    tag(){
        return this.signature.tag;
    }
    tags(){
        return this.signature.tags;
    }
    dom(){
        return dom;
    }
    setup(){
        return this.signature.setup;
    }
    // GETTERS .....................


    // EVENTS ..................................................
    before(event, callback){
        
        if(!this.signature.module.events.hasOwnProperty(event)){
            throw new Error('Not found event "'+event+'"');
        }

        if(!this.signature.before.hasOwnProperty(event)){
            this.signature.before[event] = [];
        }

        this.signature.before[event].push(callback);

    }

    after(event, callback){

        if(!this.signature.module.events.hasOwnProperty(event)){
            throw new Error('Not found event "'+event+'"');
        }

        if(!this.signature.after.hasOwnProperty(event)){
            this.signature.after[event] = [];
        }

        this.signature.after[event].push(callback);

    }

    async trigger(...args){

        // CHECK .............................
        let event = args.shift();
        if(!this.signature.module.events.hasOwnProperty(event)){
            throw new Error('Not found event "'+event+'"');
        }

        // BEFORE ...............
        if(this.signature.before.hasOwnProperty(event)){
            for(let i in this.signature.before[event]){
                await this.signature.before[event][i](...args);
            }
        }

        // CURRENT .....................
        let list = [this];
        for(let i in args){
            list.push(args[i]);
        }
        await this.signature.module.events[event](...list);

        // AFTER ...............
        if(this.signature.after.hasOwnProperty(event)){
            for(let i in this.signature.after[event]){
                await this.signature.after[event][i](...args);
            }
        }

    }
    // EVENTS ..................................................


    // COMPONENTS ................................
    async component(options){

        // OPTIONS ............................
        options = Object.assign({
            alias : null ,
            setup : null ,
            put   : null ,
        }, options);


        // CREATE .................
        let self = this;
        let factory = this.signature.module.components[options.alias];
        let component = await Component.create(factory.name, options.setup);

        // PUT ..................
        let put = factory.put;
        if(options.put){
            put = options.put;
        }
        let tag = component.tag();
        put(self, tag);

        // BEFORE ..................
        if(factory.hasOwnProperty('befores')){
            for(let event in factory.befores){
                let trigger = factory.befores[event];
                component.before(event,  (data) => {
                    self.trigger(trigger, data);
                });
            }
        }

        // AFTER ..................
        if(factory.hasOwnProperty('afters')){
            for(let event in factory.afters){
                let trigger = factory.afters[event];
                component.after(event, (data) => {
                    self.trigger(trigger, data);
                });
            }
        }

        return component;
       
    }    
    // COMPONENTS ................................


    // FACTORY ................................
    static imported = {
        templates : {} ,
        styles    : {} ,
    };

    static async create(name , setup) {

        // PREPARE ..............
        let into;
        let url;
        let path;
        let config = Component.configs.get();
        if(!setup){
            setup = {};
        }

        // ID ......................
        Component.idAi++;
        let id = Component.idAi;

        // CSS .................
        into = config.styles.appendTo;
        url  = config.components.path + '/' + name + '/styles.css';
        if(!Component.imported.styles.hasOwnProperty(url)){
            Component.imported.styles[url] = true;
            await css.import(into, url);
        }

        // TEMPLATES ......................
        into = config.templates.appendTo;
        url  = config.components.path + '/' + name + '/templates.html';
        if(!Component.imported.templates.hasOwnProperty(url)){
            Component.imported.templates[url] = true;
            await templates.import(into, url);
        }
        
        // MODULE ......................
        path = config.components.path + '/' + name + '/index.js';
        let module = await modules.load(path);

        // COMPONENT ......................
        let component = new Component({
            id     : id ,
            name   : name ,
            setup  : setup,
            module : module
        });

        return component;

    }
    // FACTORY ................................

}


export default Component;