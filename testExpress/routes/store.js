// our 'database'
var items = {
    SKN:{name:'Shuriken', price:100},
    ASK:{name:'Ashiko', price:690},
    CGI:{name:'Chigiriki', price:250},
    NGT:{name:'Naginata', price:900},
    KTN:{name:'Katana', price:1000}
};

exports.home = function(req, res){
    if (typeof req.session.username == 'undefined') res.render('home', { title: 'Ninja Store'});
    // if user is logged in already, take them straight to the items list
    else res.redirect('/items');
};

exports.home_post = function(req, res){
    username =  req.body.username || 'JoLindien';
    req.session.username = username;
    res.redirect("/");
};

exports.items = function(req, res){
    if (typeof req.session.username == 'undefined') res.redirect('/');
    else res.render('items', { title: 'Ninja Store - Items', username: req.session.username, items:items });
};


exports.item = function(req, res){
    if (typeof req.session.username == 'undefined') res.redirect('/');
    else {
        item_id = req.params.id;
        item = { item_id: items[item_id] };
        console.log('-----------');
        console.log(item);
        console.log('-----------');
        res.render('items', { title: 'Ninja Store - Items', username: req.session.username, items: item });
    }
    
};