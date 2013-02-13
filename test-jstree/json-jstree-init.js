



var wikipediaJsCategory = {
  category: 'JavaScript',
  subcategories: [
    {category: 'Ajax (programming)'},
    {category: 'JavaScript engines'},
    {category: 'JavaScript programming languages family',
     subcategories: [{
       category: 'JavaScript dialect engines'
     }]
    },
    {category: 'JavaScript based calendar components'},
    {category: 'JavaScript based HTML editors'}
  ]
};

var tree = Arboreal.parse(wikipediaJsCategory, 'subcategories');













var tree = new Arboreal();

tree.appendChild();
tree.appendChild();
tree.children[0].appendChild();
tree.children[0].appendChild();

console.log(tree);

data = {
                "all": {
                    "name": "All json jstree",
                    "todo": {
                        "name": "Todo",
                        "id": "502b600ba272a22e75000004"
                    },
                    "travel": {
                        "name": "Travel",
                        "id": "502b600ba272a22e75000005",
                        "cambodia": {
                            "name": "Cambodia",
                            "id": "502b600ba272a22e75000006"
                        }
                    }
                }

            };


// INITIALISATION OF THE JSON JSTREE
$("#json-tree").jstree({
    "plugins" : ["json_datat","hemes","html_data","ui","crrm","hotkeys"],
    "json_data": treeData,
    "core" : { "initially_open" : [ "phtml_1" ] },
    "themes" : {
        "theme" : "default",
        "url"   : "./themes/default/style.css",
        "dots"  : false,
        "icons" : true
        }
});



var _this = this;
sourceList = [];

sortFunction = function(a, b) {
  if (a.name > b.name) {
    return 1;
  } else if (a.name === b.name) {
    return 0;
  } else if (a.name < b.name) {
    return -1;
  }
};

_convertData= function(data) {
    var tree;
    tree = {
        data: {
            data: "all",
            attr: {
                id: "tree-node-all",
                rel: "root"
            },
            children: []
        }
    };
    _this._convertNode(tree.data, data.all, "-all");
    if (tree.data.length === 0) {
        tree.data = "loading...";
    }
    return tree;
};
  
_convertNode= function(parentNode, nodeToConvert, idpath) {
    var newNode, nodeIdPath, object, property, _results;
    _results = [];
    for (property in nodeToConvert) {
        if (!(property !== "name" && property !== "id")) {
            continue;
        }
        nodeIdPath = "" + idpath + "-" + (property.replace(/_/g, "-"));
        object = {
            type: "folder",
            name: nodeToConvert[property].name
        };
        sourceList.push(object);
        sourceList.sort(sortFunction);
        newNode = {
            data: nodeToConvert[property].name,
            metadata: {
                id: nodeToConvert[property].id
            },
            attr: {
                // id: "tree-node" + nodeIdPath,
                id: "node" + nodeToConvert[property].id,
                rel: "default"
            },
            children: []
        };
        if (parentNode.children === void 0) {
            parentNode.data.push(newNode);
        } else {
            parentNode.children.push(newNode);
        }
        _results.push(this._convertNode(newNode, nodeToConvert[property], nodeIdPath));
    }
    return _results;
};

treeData =_convertData ( data );























// INITIALISATION OF THE JSON JSTREE
jstreeWidget = $("#json-tree").jstree({
    "plugins" : ["themes","json_data","ui","crrm","unique", "sort", "cookies", "types",
                "dnd", "search"],
    "core" : { "initially_open" : [ "tree-node-all" ], "animation":0 },
    "themes" : {
        "theme" : "default",
        // "url"   : "./themes/default/style.css",
        "dots"  : false,
        "icons" : false
        },
    "json_data" : {"data" : "A node"},
    "types": {
        "default": {
          "valid_children": "default"
        },
        "root": {
          "valid_children": null,
          "delete_node": false,
          "rename_node": false,
          "move_node": false,
          "start_drag": false
        }
    },
    "cookies": {"save_selected": false},
    "ui": {"select_limit": 1},
    "unique": {
        "error_callback": function(node, p, func) {
          return alert("A note has already that name: '" + node + "'");
        }
    },
    "search": {"show_only_matches": true}

});



// EVENTS SENT BY THE JSON JSTREE
$("#json-tree").bind("loaded.jstree", function (event, data) {
    // you get two params - event & data - check the core docs for a detailed description
    console.log("event : loaded.json-jstree");
    $(this).jstree("set_theme","apple","./themes/apple/style.css");
    $("#json-tree").jstree("_parse_json", treeData.data , -1);

});

$("#json-tree").bind("create_node.jstree", function (event, data) {
    // you get two params - event & data - check the core docs for a detailed description
    console.log("event : create_node.json-jstree");
});


$("#json-tree").bind("load_node.jstree", function (event, data) {
    // you get two params - event & data - check the core docs for a detailed description
    console.log("event : load_node.json-jstree");
});

$("#json-tree").bind("hover_node.jstree", function (event, data) {
    // you get two params - event & data - check the core docs for a detailed description
    console.log("event : hover_node.json-jstree");
    // console.log(event);
    // console.log(data);
    console.log(data.args[0]);
    $("#json-tree-buttons").appendTo( data.args[0] );
    $("#json-tree-buttons").css("display","block");
});


$("#json-tree").bind("dehover_node.jstree", function (event, data) {
    // you get two params - event & data - check the core docs for a detailed description
    console.log("event : dehover_node.json-jstree");
    console.log(data.args[0]);
    $("#json-tree-buttons").appendTo( $("body") );
    $("#json-tree-buttons").css("display","none");
});

// BUTTONS ACTIONS
$("#create-btn-json-tree").on("click", function(e){
    console.log("event : json-tree.click.create-btn");
    $("#json-tree").jstree("create", e.currentTarget.parentElement.parentElement.parentElement , 0 , "new note");
    // $("#tree").create ( node , position , js , callback , skip_rename );
    e.stopPropagation();
});

$("#rename-btn-json-tree").on("click", function(e){
    console.log("event : json-tree.click.rename-btn");
    $("#json-tree").jstree("rename", e.currentTarget.parentElement.parentElement.parentElement );
    e.stopPropagation();
});

$("#delete-btn-json-tree").on("click", function(e){
    console.log("event : json-tree.click.delete-btn");
    $("#json-tree").jstree("remove", e.currentTarget.parentElement.parentElement.parentElement );
    e.stopPropagation();
});





