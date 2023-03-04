class Attrs {

    constructor() {
        this.list = {};
    }  

    set(name, value){
        this.list[name] = value;
        return this.list[name];
    }

    get(){

        //........................
        let name = null;
        if(arguments.hasOwnProperty('0')){
            name = arguments[0];
        }
        
        //........................
        let defaults = null;
        if(arguments.hasOwnProperty('1')){
            defaults = arguments[1];
        }

        //........................
        if(!name){
            return defaults;
        }

        //........................
        if(!this.isset(name)){
            return defaults;
        }

        //..................
        return this.list[name];
        
    }

    isset(name){
        return this.list.hasOwnProperty(name);
    }

}

module.exports = Attrs;