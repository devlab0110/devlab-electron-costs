const Attrs = require('./attrs');

class Procedure {

    constructor(attrs, implement) {

        this.attrs = new Attrs();
        for(let name in attrs){
            let value = attrs[name];
            this.attrs.set(name, value);
        }

        this.implement = Object.assign({
            init     : () => {} ,
            steps    : {} ,
            complete : () => {} ,
            error    : (attrs, error) => {
                throw error;
            } ,
        }, implement);

    }    

    async execute(inputs){

        let result = null;
        try {

            this.attrs.set('inputs', inputs);
            await this.implement.init(this.attrs);
            for(var i in this.implement.steps){
                await this.implement.steps[i](this.attrs);
            }
            result = await this.implement.complete(this.attrs);

        }
         catch (error) {
            result = await this.error(this.attrs, error);
        }
        return result;

    }

}

module.exports = Procedure;