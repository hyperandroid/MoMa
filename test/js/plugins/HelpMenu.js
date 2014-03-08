MoMa.Module({
    injectTo : "Test.Menu",
    defines : "Plugin.HelpMenu",
    extendsWith : {

        __init : function() {
            this.__super();

            //Add a Help menu
            var elem = "Help";
            if(this.elements.indexOf(elem) === -1) this.elements.push('Help');
        }

    }

});