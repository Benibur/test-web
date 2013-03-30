(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"body": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="main-div"><p>Type in the texteArea below in order to print the properties of the corresponding "keydown" up and press events.</p><textarea id="txtArea">Un textarea</textarea><div id="editableDiv" contentEditable="true"><div><span>Une span editable</span></div></div></br><div id="tableContainer"></div></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"initialize": function(exports, require, module) {
  
  $(document).on('ready', function() {
    var addCell, addRowForEvent, editableDiv, lable, lableList, row, rowIndex, table, tbody, thead, txtArea, _i, _len;
    $('body').html(require('body')());
    txtArea = document.getElementById("txtArea");
    editableDiv = document.getElementById("editableDiv");
    addCell = function(row, text) {
      var cell;
      cell = row.insertCell(-1);
      return cell.appendChild(document.createTextNode(text));
    };
    table = document.createElement('table');
    thead = table.createTHead();
    row = thead.insertRow(-1);
    lableList = ['#', 'type', 'which', 'keyCode', 'charCode', 'line value', 'e.altKey', 'e.ctrlKey', 'e.shiftKey', 'e.meta'];
    for (_i = 0, _len = lableList.length; _i < _len; _i++) {
      lable = lableList[_i];
      addCell(row, lable);
    }
    document.getElementById('tableContainer').appendChild(table);
    tbody = document.createElement('tbody');
    table.appendChild(tbody);
    rowIndex = 1;
    addRowForEvent = function(e) {
      console.log('ttot');
      row = tbody.insertRow(0);
      row.className = (rowIndex % 2) === 0 ? 'odd' : 'even';
      addCell(row, rowIndex);
      addCell(row, e.type);
      addCell(row, e.which + ' (' + String.fromCharCode(e.which) + ')');
      addCell(row, e.keyCode + ' (' + String.fromCharCode(e.keyCode) + ')');
      addCell(row, e.charCode + ' (' + String.fromCharCode(e.charCode) + ')');
      addCell(row, txtArea.value);
      addCell(row, e.altKey);
      addCell(row, e.ctrlKey);
      addCell(row, e.shiftKey);
      addCell(row, e.metaKey);
      return rowIndex += 1;
    };
    txtArea.addEventListener("keyup", function(e) {
      addRowForEvent(e);
      return console.log('keyup, value="' + this.value + '"');
    });
    txtArea.addEventListener("keydown", function(e) {
      addRowForEvent(e);
      return console.log('keydown, value="' + this.value + '"');
    });
    txtArea.addEventListener("keypress", function(e) {
      addRowForEvent(e);
      return console.log('keypress, value="' + this.value + '"');
    });
    editableDiv.addEventListener("keyup", function(e) {
      addRowForEvent(e);
      return console.log('keyup, value="' + this.value + '"');
    });
    editableDiv.addEventListener("keydown", function(e) {
      addRowForEvent(e);
      return console.log('keydown, value="' + this.value + '"');
    });
    return editableDiv.addEventListener("keypress", function(e) {
      addRowForEvent(e);
      return console.log('keypress, value="' + this.value + '"');
    });
  });
  
}});

