MoMa.Module({
    injectTo : "Test.Menu",
    defines : "Plugin.OpenMenu",
    extendsWith : {

        __init : function() {
            this.__super();
        },

        //Add a method to open the menus
        open : function( elem ){
            if(this.elements.indexOf(elem) !== -1){
                console.log(elem + ' menu opened.');
            }else{
                console.log("Don't exists " + elem + " menu");
            }
        }

    }

});