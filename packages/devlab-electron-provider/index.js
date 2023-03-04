class Provider {

    static attrs = {};
    static factories = {};

    static async setup(setup){
        setup = Object.assign({
            attrs       : {},
            factories   : {},
        }, setup);
        Provider.attrs = setup.attrs;
        Provider.factories = setup.factories;
    }    

    static async get(name, _default){
        if(!Object.prototype.hasOwnProperty.call(Provider.attrs, name)){
            throw new Error('Not defined get attr name: "'+name+'"!');
        }
        if(!Object.prototype.hasOwnProperty.call(Provider.attrs, name)){
            return _default;
        }
        return Provider.attrs[name];
    }

    static async set(name, value){
        if(!Object.prototype.hasOwnProperty.call(Provider.attrs, name)){
            throw new Error('Not defined set attr name: "'+name+'"!');
        }
        if(!Object.prototype.hasOwnProperty.call(Provider.attrs, name)){
            throw new Error('Not defined set attr value!');
        }
        Provider.attrs[name] = value;
        return Provider.attrs[name];
    }

    static async factory(...args){
        const name = args.shift();
        if(!Object.prototype.hasOwnProperty.call(Provider.factories, name)){
            throw new Error('Not defined factory: "'+name+'"!');
        }
        return Provider.factories[name].call(this, ...args);
    }

}

module.exports = Provider;