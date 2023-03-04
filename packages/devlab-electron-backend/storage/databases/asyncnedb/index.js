// common ...............
const path = require('path');
const nedb = require('nedb');


class AsyncNedb {

    constructor(dir, file){
        this.nedb = new nedb({ 
            filename: path.join(dir, file),
            autoload: true
        });
    }

    async find(id){

        return new Promise( (resolve, reject) => {

            let filters = {
                _id: id
            };

            this.nedb.findOne(filters, function (err, doc) {
                if(err){
                    reject(err);
                    return ;
                }
                resolve(doc);
            });
    
        });

    }

    async list(query){

        query = Object.assign({
            filters : null ,
            sort    : null ,
            skip    : null ,
            limit   : null
        }, query);

        return new Promise( (resolve, reject) => {

            let obj = this.nedb;

            if(query.filters){
                obj = obj.find(query.filters);
            }
            if(query.sort){
                obj = obj.sort(query.sort);
            }
            if(query.skip){
                obj = obj.skip(query.skip);
            }
            if(query.limit){
                obj = obj.limit(query.limit);
            }
            
            obj.exec(function(err, docs) {
                if(err){
                    reject(err);
                    return ;
                }
                resolve(docs);
            });
    
        });

    }

    async count(filters){

        return new Promise( (resolve, reject) => {

            this.nedb.count(filters, function (err, count) {
                if(err){
                    reject(err);
                    return ;
                }
                resolve(count);
            });
    
        });

    }

    async insert(sets){
        return new Promise( (resolve, reject) => {
            this.nedb.insert(sets, function(err, doc) { 
                if(err){
                    reject(err);
                    return ;
                }
                resolve(doc);
            });
        });
    }   
    
    async update(doc, sets){

        let data = {
            $set: sets
        };

        return new Promise( (resolve, reject) => {
            this.nedb.update(doc, data, {}, function (err, numReplaced) {
                if(err){
                    reject(err);
                    return ;
                }
                resolve(numReplaced);
            });
        });
    }


    async delete(id){

        let filters = {
            _id: id
        };

        return new Promise( (resolve, reject) => {

            this.nedb.remove(filters, {}, function (err, numRemoved) {
                if(err){
                    reject(err);
                    return ;
                }
                resolve(numRemoved);
            });
    
        });

    }
}

module.exports = AsyncNedb;