import Component from "./component.js";

document.addEventListener("DOMContentLoaded", async function() {

    // config ...................
    let config = {
        components : {
            path : '.' ,
        },
        templates : {
            appendTo : document.body
        },
        styles : {
            appendTo : document.getElementsByTagName('head')[0]
        }, 
    };
    Component.configs.set(config);

    // channels ........................
    Component.channels.set(myAPI.channels);

    // init ........................
    let component = await Component.create('app');
    let tag       = component.tag();
    document.body.appendChild(tag);

});