MoMa.Module({

    defines : "Test.Menu",
    extendsWith : {

        //Menu elements
        elements : [
            'File',
            'Edit',
            'Find'
        ],

        __init : function() {

        },

        getElements : function(){
            return JSON.stringify(this.elements);
        }
    }

});