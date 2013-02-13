(function(/*! Brunch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var module = cache[name], path = expand(root, name), fn;
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: name, exports: {}};
        try {
          cache[name] = module.exports;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return cache[name] = module.exports;
        } catch (err) {
          delete cache[name];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    };
    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
}).call(this);(this.require.define({
  "helpers": function(exports, require, module) {
    (function() {

  exports.BrunchApplication = (function() {

    function BrunchApplication() {
      var _this = this;
      $(function() {
        _this.initialize(_this);
        return Backbone.history.start();
      });
    }

    BrunchApplication.prototype.initialize = function() {
      return null;
    };

    return BrunchApplication;

  })();

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var BrunchApplication, HomeView, MainRouter, initPage,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BrunchApplication = require('helpers').BrunchApplication;

  MainRouter = require('routers/main_router').MainRouter;

  HomeView = require('views/home_view').HomeView;

  initPage = require('views/initPage').initPage;

  exports.Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.initialize = function() {
      this.router = new MainRouter;
      this.homeView = new HomeView;
      return initPage();
    };

    return Application;

  })(BrunchApplication);

  window.app = new exports.Application;

}).call(this);

  }
}));
(this.require.define({
  "routers/main_router": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.MainRouter = (function(_super) {

    __extends(MainRouter, _super);

    function MainRouter() {
      MainRouter.__super__.constructor.apply(this, arguments);
    }

    MainRouter.prototype.routes = {
      '': 'home'
    };

    MainRouter.prototype.home = function() {};

    return MainRouter;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "views/home_view": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.HomeView = (function(_super) {

    __extends(HomeView, _super);

    function HomeView() {
      HomeView.__super__.constructor.apply(this, arguments);
    }

    HomeView.prototype.id = 'home-view';

    HomeView.prototype.render = function() {
      $(this.el).html(require('./templates/home'));
      return this;
    };

    return HomeView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/beautify": function(exports, require, module) {
    (function() {
  var any, read_settings_from_cookie, store_settings_to_cookie, the, unpacker_filter;

  any = function(a, b) {
    return a || b;
  };

  read_settings_from_cookie = function() {
    $("#tabsize").val(any($.cookie("tabsize"), "4"));
    $("#brace-style").val(any($.cookie("brace-style"), "collapse"));
    $("#detect-packers").attr("checked", $.cookie("detect-packers") !== "off");
    $("#preserve-newlines").attr("checked", $.cookie("preserve-newlines") !== "off");
    $("#keep-array-indentation").attr("checked", $.cookie("keep-array-indentation") === "on");
    $("#indent-scripts").val(any($.cookie("indent-scripts"), "normal"));
    return $("#space-before-conditional").attr("checked", $.cookie("space-before-conditional") !== "off");
  };

  store_settings_to_cookie = function() {
    var opts;
    opts = {
      expires: 360
    };
    $.cookie("tabsize", $("#tabsize").val(), opts);
    $.cookie("brace-style", $("#brace-style").val(), opts);
    $.cookie("detect-packers", ($("#detect-packers").attr("checked") ? "on" : "off"), opts);
    $.cookie("preserve-newlines", ($("#preserve-newlines").attr("checked") ? "on" : "off"), opts);
    $.cookie("keep-array-indentation", ($("#keep-array-indentation").attr("checked") ? "on" : "off"), opts);
    $.cookie("space-before-conditional", ($("#space-before-conditional").attr("checked") ? "on" : "off"), opts);
    return $.cookie("indent-scripts", $("#indent-scripts").val(), opts);
  };

  unpacker_filter = function(source) {
    var comment, found, trailing_comments, _results;
    trailing_comments = "";
    comment = "";
    found = false;
    _results = [];
    while (true) {
      found = false;
      if (/^\s*\/\*/.test(source)) {
        found = true;
        comment = source.substr(0, source.indexOf("*/") + 2);
        source = source.substr(comment.length).replace(/^\s+/, "");
        trailing_comments += comment + "\n";
      } else if (/^\s*\/\//.test(source)) {
        found = true;
        comment = source.match(/^\s*\/\/.*/)[0];
        source = source.substr(comment.length).replace(/^\s+/, "");
        trailing_comments += comment + "\n";
      }
      if (!found) {
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  exports.beautify = function() {
    var brace_style, comment_mark, indent_char, indent_scripts, indent_size, keep_array_indentation, opts, preserve_newlines, source, space_before_conditional;
    if (the.beautify_in_progress) return;
    the.beautify_in_progress = true;
    source = $("#editorTextContent").html();
    indent_size = $("#tabsize").val();
    indent_char = (indent_size === 1 ? "\t" : " ");
    preserve_newlines = $("#preserve-newlines").attr("checked");
    keep_array_indentation = $("#keep-array-indentation").attr("checked");
    indent_scripts = $("#indent-scripts").val();
    brace_style = $("#brace-style").val();
    space_before_conditional = $("#space-before-conditional").attr("checked");
    if ($("#detect-packers").attr("checked")) source = unpacker_filter(source);
    comment_mark = "<-" + "-";
    opts = {
      indent_size: 4,
      indent_char: " ",
      preserve_newlines: true,
      brace_style: "collapse",
      keep_array_indentation: false,
      space_after_anon_function: true,
      space_before_conditional: true,
      indent_scripts: "normal"
    };
    if (source && source[0] === "<" && source.substring(0, 4) !== comment_mark) {
      $("#resultText").val(style_html(source, opts));
    } else {
      $("#resultText").val(js_beautify(unpacker_filter(source), opts));
    }
    return the.beautify_in_progress = false;
  };

  the = {
    beautify_in_progress: false
  };

}).call(this);

  }
}));
(this.require.define({
  "views/initEditor": function(exports, require, module) {
    (function() {
  var MPKeyPressListener, cancelEvent, findPrevLine, increaseDepth, indent_bloc, stopEvent;

  stopEvent = function(e) {
    if (!e) e = window.event;
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {

    }
    return e.cancelBubble = true;
  };

  cancelEvent = function(e) {
    if (!e) e = window.event;
    if (e.preventDefault) {
      return e.preventDefault();
    } else {
      return e.returnValue = false;
    }
  };

  findPrevLine = function(b$) {
    var r;
    if (b$.attr("class").substr(0, 2) === "Tu") b$ = b$.parent();
    r = b$.prev();
    if (r.length === 0) r = void 0;
    return r;
  };

  increaseDepth = function(b$) {};

  indent_bloc = function(b$) {
    var bCl, bDepth, cl, prevl$, prevlDepth, t;
    prevl$ = findPrevLine(b$);
    if (prevl$) {
      cl = prevl$.attr("class");
      prevlDepth = cl.substr(cl.length - 2, 2);
      bCl = b$.attr("class");
      bDepth = bCl.substr(bCl.length - 2, 2);
      if (prevlDepth === bDepth) {
        b$.parent().wrap("<ul class='Lu-02' />");
        increaseDepth(b$.parent());
      }
      return t = 2;
    }
  };

  MPKeyPressListener = function(e) {
    var b, blocs$, clone_p$, initialEndOffset, initialStartOffset, keyCode, keyStrokesCode, metaKeyStrokesCode, newTxt, prevLine_p$, prevline$, range, rangeIsEndLine, rangeIsStartLine, range_clone, sel, source, source$, sourceClass, source_p$, source_pClass, tnc, _i, _len, _results;
    keyCode = void 0;
    metaKeyStrokesCode = (e.altKey ? "Alt" : "") + (e.ctrlKey ? "Ctrl" : "") + (e.shiftKey ? "Shift" : "");
    switch (e.keyCode) {
      case 13:
        keyStrokesCode = "return";
        break;
      case 37:
        keyStrokesCode = "left";
        break;
      case 39:
        keyStrokesCode = "up";
        break;
      case 40:
        keyStrokesCode = "right";
        break;
      case 41:
        keyStrokesCode = "down";
        break;
      case 9:
        keyStrokesCode = "tab";
        break;
      default:
        switch (e.which) {
          case 32:
            keyStrokesCode = "space";
            break;
          case 8:
            keyStrokesCode = "backspace";
            break;
          default:
            keyStrokesCode += "_" + e.which;
        }
    }
    if (keyStrokesCode === "return") {
      sel = rangy.getSelection();
      range = sel.getRangeAt(0);
      initialStartOffset = range.startOffset;
      initialEndOffset = range.endOffset;
      source = range.startContainer;
      source$ = $(source);
      if (source.nodeType === 3) source$ = source$.parent();
      sourceClass = source$[0].className;
      source_p$ = source$.parent();
      source_pClass = source_p$[0].className;
      rangeIsEndLine = false;
      if (range.endContainer.nodeType === 3) {
        if (initialEndOffset === source$.text().length) rangeIsEndLine = true;
      } else {
        rangeIsEndLine = true;
      }
      rangeIsStartLine = false;
      if (range.startContainer.nodeType === 3) {
        if (initialStartOffset === 0) rangeIsStartLine = true;
      } else {
        if (initialStartOffset === 0) {
          rangeIsStartLine = true;
        } else {
          rangeIsStartLine = false;
        }
      }
      clone_p$ = source_p$.clone();
      range_clone = rangy.createRange();
      if (rangeIsStartLine) {
        source$.html("<br>");
      } else {
        range.setStart(source, initialStartOffset);
        range.setEndAfter(source);
        range.deleteContents();
      }
      tnc = clone_p$[0].firstElementChild.firstChild;
      if (rangeIsEndLine) {
        clone_p$.children().html("<br>");
      } else {
        range_clone.selectNode(tnc);
        range_clone.setStart(tnc, 0);
        range_clone.setEnd(tnc, initialEndOffset);
        range_clone.deleteContents();
      }
      source_p$.after(clone_p$);
      range.collapseToPoint(clone_p$[0].firstElementChild, 0);
      e.preventDefault();
    }
    if (keyStrokesCode === "backspace") {
      sel = rangy.getSelection();
      range = sel.getRangeAt(0);
      initialStartOffset = range.startOffset;
      initialEndOffset = range.endOffset;
      rangeIsStartLine = false;
      if (range.startContainer.nodeType === 3) {
        if (initialStartOffset === 0) rangeIsStartLine = true;
      } else {
        if (initialStartOffset === 0) {
          rangeIsStartLine = true;
        } else {
          rangeIsStartLine = false;
        }
      }
      if (rangeIsStartLine && initialEndOffset === 0) {
        source$ = $(range.startContainer);
        if (source$[0].nodeType === 3) source$ = source$.parent();
        source_p$ = source$.parent();
        prevLine_p$ = source_p$.prev();
        if (prevLine_p$.length) {
          prevline$ = prevLine_p$.children();
          range.collapseAfter(prevline$[0]);
          newTxt = prevline$.text() + source$.text();
          if (newTxt) {
            prevline$.text(newTxt);
          } else {
            prevline$.html("<br>");
          }
          source_p$.remove();
          e.preventDefault();
        } else {

        }
      }
    }
    if (keyStrokesCode === "tab") {
      sel = rangy.getSelection();
      range = sel.getRangeAt(0);
      initialStartOffset = range.startOffset;
      initialEndOffset = range.endOffset;
      source = range.startContainer;
      source$ = $(source);
      if (source.nodeType === 3) {
        source = source$.parent();
        source$ = $(source);
      }
      source_p$ = source$.parent();
      blocs$ = [source$];
      _results = [];
      for (_i = 0, _len = blocs$.length; _i < _len; _i++) {
        b = blocs$[_i];
        _results.push(indent_bloc(b));
      }
      return _results;
    }
  };

  exports.MP = {
    create: function(editorDivID) {
      return $(editorDivID).bind('keypress', MPKeyPressListener);
    }
  };

}).call(this);

  }
}));
(this.require.define({
  "views/initPage": function(exports, require, module) {
    (function() {
  var MP, beautify, retrieveFile;

  beautify = require('views/beautify').beautify;

  MP = require('views/initEditor').MP;

  retrieveFile = function(fichier, dest) {
    return $.ajax({
      url: fichier,
      success: function(data) {
        dest.append(data.documentElement);
        return beautify();
      }
    });
  };

  exports.initPage = function() {
    $("body").html(require('./templates/editor'));
    $("#resultBtnBar_coller").bind("click", beautify);
    $("#glBtnBar_EmptyText").bind("click", function() {
      return window.fillDefaultContent();
    });
    $("#EmptyTextBtn").bind("click", function() {
      return retrieveFile("ContentEmpty.txt", $("#editorTextContent"));
    });
    $("#SimpleTextBtn").bind("click", function() {
      return retrieveFile("ContentSimple.html", $("#editorTextContent"));
    });
    $("#FullTextBtn").bind("click", function() {
      return retrieveFile("ContentFull.txt", $("#editorTextContent"));
    });
    $("#printRangeBtn").bind("click", function() {
      var range, sel;
      sel = rangy.getSelection();
      range = sel.getRangeAt(0);
      console.log("-- range --");
      console.log(range);
      console.log("startOffset : " + range.startOffset);
      console.log("endOffset   : " + range.endOffset);
      console.log("startContainer :");
      console.log(range.startContainer);
      console.log("endContainer   :");
      return console.log(range.endContainer);
    });
    retrieveFile("ContentSimple.html", $("#editorTextContent"));
    $("#editorTextContent").bind('keyup', function() {
      var t;
      beautify();
      return t = 1;
    });
    return MP.create('#editorTextContent');
  };

}).call(this);

  }
}));
(this.require.define({
  "views/templates/editor": function(exports, require, module) {
    module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ 'id':('main'), "class": ('table-ly-wrpr') }));
buf.push('><!-- boutons for the editor--><div');
buf.push(attrs({ 'id':('divMainBtn'), "class": ('table-ly-hder') }));
buf.push('><div');
buf.push(attrs({ 'id':('generalBtnBar'), "class": ('btn-group') }));
buf.push('><button');
buf.push(attrs({ 'id':('EmptyTextBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
buf.push('>Init texte vide  </button><button');
buf.push(attrs({ 'id':('SimpleTextBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
buf.push('>Init texte simple</button><button');
buf.push(attrs({ 'id':('FullTextBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
buf.push('>Init texte long</button><button');
buf.push(attrs({ 'id':('logKeysBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
buf.push('>Log keystrokes</button><button');
buf.push(attrs({ 'id':('logRangeBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
buf.push('>Log range</button><button');
buf.push(attrs({ 'id':('printRangeBtn'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
buf.push('>Print Range</button></div></div><div');
buf.push(attrs({ 'id':('main-div'), "class": ('table-ly-ctnt') }));
buf.push('><div');
buf.push(attrs({ 'id':('col-wrap') }));
buf.push('><div');
buf.push(attrs({ 'id':('editor-col') }));
buf.push('><div');
buf.push(attrs({ 'id':('well-editor'), "class": ('monWell') }));
buf.push('><div');
buf.push(attrs({ 'id':('editorDiv'), "class": ('table-ly-wrpr') }));
buf.push('><!-- boutons for the editor--><div');
buf.push(attrs({ "class": ('table-ly-hder') }));
buf.push('><div');
buf.push(attrs({ 'id':('editorBtnBar'), "class": ('btn-group') }));
buf.push('><button');
buf.push(attrs({ "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
buf.push('>test</button><button');
buf.push(attrs({ "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
buf.push('>test</button></div></div><!-- text for the editor--><div');
buf.push(attrs({ 'id':('editorContent'), "class": ('table-ly-ctnt') }));
buf.push('><div');
buf.push(attrs({ 'id':('editorTextContent'), 'contenteditable':("true") }));
buf.push('>to 2 to</div></div></div></div></div><div');
buf.push(attrs({ 'id':('result-col') }));
buf.push('><div');
buf.push(attrs({ 'id':('well-result'), "class": ('monWell') }));
buf.push('><div');
buf.push(attrs({ 'id':('resultDiv'), "class": ('table-ly-wrpr') }));
buf.push('><div');
buf.push(attrs({ "class": ('table-ly-hder') }));
buf.push('><div');
buf.push(attrs({ 'id':('resultBtnBar'), "class": ('btn-group') }));
buf.push('><button');
buf.push(attrs({ 'id':('resultBtnBar_coller'), "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
buf.push('>Coller</button><button');
buf.push(attrs({ "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
buf.push('>-</button><button');
buf.push(attrs({ "class": ('btn') + ' ' + ('btn-small') + ' ' + ('btn-primary') }));
buf.push('>-</button></div></div><!-- text for the resulting html--><div');
buf.push(attrs({ 'id':('resultContent'), "class": ('table-ly-ctnt') }));
buf.push('><textarea');
buf.push(attrs({ 'id':('resultText') }));
buf.push('></textarea></div></div></div></div></div></div></div>');
}
return buf.join("");
};
  }
}));
(this.require.define({
  "views/templates/home": function(exports, require, module) {
    module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
  }
}));
