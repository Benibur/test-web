
// INITIALISATION OF THE HTML JSTREE
$("#html-tree").jstree({
    "plugins" : ["themes","html_data","ui","crrm","hotkeys"],
    "core" : { "initially_open" : [ "phtml_1" ] },
    "themes" : {
        "theme" : "default",
        "url"   : "./themes/default/style.css",
        "dots"  : false,
        "icons" : true
        }
});


// EVENTS SENT BY THE HTML JSTREE
$("#html-tree").bind("loaded.jstree", function (event, data) {
    // you get two params - event & data - check the core docs for a detailed description
    console.log("event : loaded.jstree");
    $(this).jstree("set_theme","apple","./themes/apple/style.css");

});

$("#html-tree").bind("create_node.jstree", function (event, data) {
    // you get two params - event & data - check the core docs for a detailed description
    console.log("event : create_node.jstree");
});


$("#html-tree").bind("load_node.jstree", function (event, data) {
    // you get two params - event & data - check the core docs for a detailed description
    console.log("event : load_node.jstree");
});

$("#html-tree").bind("hover_node.jstree", function (event, data) {
    // you get two params - event & data - check the core docs for a detailed description
    console.log("event : hover_node.jstree");
    // console.log(event);
    // console.log(data);
    console.log(data.args[0]);
    $("#html-tree-buttons").appendTo( data.args[0] );
    $("#html-tree-buttons").css("display","block");
});


$("#html-tree").bind("dehover_node.jstree", function (event, data) {
    // you get two params - event & data - check the core docs for a detailed description
    console.log("event : dehover_node.jstree");
    console.log(data.args[0]);
    $("#html-tree-buttons").appendTo( $("body") );
    $("#html-tree-buttons").css("display","none");
});

// BUTTONS ACTIONS
$("#create-btn-html-tree").on("click", function(e){
    console.log("event : html-tree.click.create-btn");
    $("#html-tree").jstree("create", e.currentTarget.parentElement.parentElement.parentElement , 0 , "new note");
    // $("#tree").create ( node , position , js , callback , skip_rename );
    e.stopPropagation();
});

$("#rename-btn-html-tree").on("click", function(e){
    console.log("event : html-tree.click.rename-btn");
    $("#html-tree").jstree("rename", e.currentTarget.parentElement.parentElement.parentElement );
    e.stopPropagation();
});

$("#delete-btn-html-tree").on("click", function(e){
    console.log("event : html-tree.click.delete-btn"+e.currentTarget.parentElement.parentElement.parentElement);
    $("#html-tree").jstree("remove", e.currentTarget.parentElement.parentElement.parentElement );
    e.stopPropagation();
});





