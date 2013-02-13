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
  buf.push('<div id="main-div" contenteditable="true"><div id="div1"><span id="span1">Content of text node</span><br id="br1"/></div><div id="div2"><span id="span2">span2 text node</span><span id="span3">span3 text node</span><br id="br2"/></div><div id="div3"><span id="span4"></span><br id="br3"/></div></div><div id="tools"><br/><select id="startContainerSelect"><option>#main-div</option><option>#div1</option><option>#div2</option><option>#span1</option><option>#span2</option><option>#span3</option><option>#span4</option><option>#text1</option><option>#text2</option><option>#text3</option><option>#text4</option><option>#br1</option><option>#br2</option></select><input id="startOffSetInput" type="text"/><button id="setStartContainerBtn">set startcontainer</button><br/><select id="endContainerSelect"><option>#main-div</option><option>#div1</option><option>#div2</option><option>#span1</option><option>#span2</option><option>#span3</option><option>#span4</option><option>#text1</option><option>#text2</option><option>#text3</option><option>#text4</option><option>#br1</option><option>#br2</option></select><input id="endOffSetInput" type="text"/><button id="setEndContainerBtn">set endcontainer</button><br/><br/><button id="setRange">    selection => range</button><button id="setSelection">range => selection</button><br/><button id="printRange">  print range</button><button id="printSel">    print selection</button><br/><button id="normBtn">     normalize selection</button><br/><button id="getLineDivBtn">Get line div and isStart isEnd</button><br/><button id="testChromeBtn">Test the chrome selection bug</button></div><div id="logs"></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"initialize": function(exports, require, module) {
  
  $(document).on('ready', function() {
    var endContainerSelect, endOffSetInput, getLineDivBtn, getLineDivIsStartIsEnd, getRange, getSelection, logifyRange, logs, normBtn, normalize, normalizeBP, printRange, printRangeBtn, printSelBtn, printSelection, selection, setEndContainerBtn, setRange, setSelection, setSelectionBtn, setStartContainerBtn, startContainerSelect, startOffSetInput, testChromeBtn, _getNodeFromSelector;
    $('body').html(require('body')());
    startContainerSelect = $('#startContainerSelect');
    endContainerSelect = $('#endContainerSelect');
    startOffSetInput = $('#startOffSetInput');
    endOffSetInput = $('#endOffSetInput');
    setStartContainerBtn = $('#setStartContainerBtn');
    setEndContainerBtn = $('#setEndContainerBtn');
    testChromeBtn = $('#testChromeBtn');
    setSelectionBtn = $('#setSelection');
    setRange = $('#setRange');
    printRangeBtn = $('#printRange');
    printSelBtn = $('#printSel');
    normBtn = $('#normBtn');
    getLineDivBtn = $('#getLineDivBtn');
    logs = $('#logs');
    selection = {};
    selection.range = document.createRange();
    getRange = function() {
      if (selection.range != null) {
        return selection.range;
      } else {
        return null;
      }
    };
    getSelection = function() {
      return window.getSelection().getRangeAt(0);
    };
    setStartContainerBtn.on('click', function(e) {
      var range, startNode, startNodeSelector, startOffset;
      startNodeSelector = startContainerSelect.val();
      startNode = _getNodeFromSelector(startNodeSelector);
      startOffset = startOffSetInput.val() * 1;
      range = getRange();
      range.setStart(startNode, startOffset);
      return setSelection();
    });
    setEndContainerBtn.on('click', function(e) {
      var endNode, endNodeSelector, endOffset, range;
      endNodeSelector = endContainerSelect.val();
      endNode = _getNodeFromSelector(endNodeSelector);
      endOffset = endOffSetInput.val() * 1;
      range = getRange();
      range.setEnd(endNode, endOffset);
      return setSelection();
    });
    _getNodeFromSelector = function(selector) {
      var node, spanId;
      if (selector.slice(0, 5) === "#text") {
        spanId = "span" + selector.slice(5, 6);
        node = document.getElementById(spanId).firstChild;
      } else {
        node = $(selector)[0];
      }
      return node;
    };
    setSelection = function(e) {
      var sel;
      sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(getRange());
      return $('#main-div').focus();
    };
    setSelectionBtn.on('click', setSelection);
    setRange.on('click', function(e) {
      var sel;
      sel = window.getSelection();
      selection.range = sel.getRangeAt(0);
      return $('#main-div').focus();
    });
    logifyRange = function(range) {
      var endContainer, endContainerId, startContainer, startContainerId, txt;
      startContainer = range.startContainer;
      if (startContainer.id) {
        startContainerId = startContainer.id;
      } else {
        startContainerId = startContainer.parentElement.id + '/nodeText';
      }
      endContainer = range.endContainer;
      if (endContainer.id) {
        endContainerId = endContainer.id;
      } else {
        endContainerId = endContainer.parentElement.id + '/nodeText';
      }
      txt = 'start : ' + startContainerId;
      txt += ' - ' + range.startOffset + '</br>';
      txt += 'end  : ' + endContainerId;
      return txt += ' - ' + range.endOffset + '</br>';
    };
    normalize = function(range) {
      var isCollapsed, newEndBP, newStartBP;
      isCollapsed = range.collapsed;
      newStartBP = normalizeBP(range.startContainer, range.startOffset);
      range.setStart(newStartBP.cont, newStartBP.offset);
      if (isCollapsed) {
        return range.collapse(true);
      } else {
        newEndBP = normalizeBP(range.endContainer, range.endOffset);
        return range.setEnd(newEndBP.cont, newEndBP.offset);
      }
    };
    normalizeBP = function(cont, offset) {
      var newCont, newOffset, res;
      if (cont.nodeName === '#text') {
        res = {
          cont: cont,
          offset: offset
        };
      } else if (cont.nodeName === 'SPAN') {
        if (offset > 0) {
          newCont = cont.childNodes[offset - 1];
          newOffset = newCont.length;
        } else if (cont.childNodes.length > 0) {
          newCont = cont.firstChild;
          newOffset = 0;
        } else {
          newCont = document.createTextNode('');
          cont.appendChild(newCont);
          newOffset = 0;
        }
      } else if (cont.nodeName === 'DIV' && cont.id !== "main-div") {
        if (offset === 0) {
          res = normalizeBP(cont.firstChild, 0);
        } else if (offset < cont.children.length - 1) {
          newCont = cont.children[offset - 1];
          newOffset = newCont.childNodes.length;
          res = normalizeBP(newCont, newOffset);
        } else {
          newCont = cont.children[cont.children.length - 2];
          newOffset = newCont.childNodes.length;
          res = normalizeBP(newCont, newOffset);
        }
      } else if (cont.nodeName === 'DIV' && cont.id === "main-div") {
        if (offset === 0) {
          newCont = cont.firstChild;
          newOffset = 0;
          res = normalizeBP(newCont, newOffset);
        } else if (offset === cont.childNodes.length) {
          newCont = cont.lastChild;
          newOffset = newCont.childNodes.length;
          res = normalizeBP(newCont, newOffset);
        } else {
          newCont = cont.children[offset - 1];
          newOffset = newCont.childNodes.length;
          res = normalizeBP(newCont, newOffset);
        }
      }
      if (!res) {
        res = {
          cont: newCont,
          offset: newOffset
        };
      }
      return res;
    };
    normBtn.on('click', function(e) {
      var range, txt;
      console.log("normalize :");
      txt = 'selection before normalize :</br>';
      range = window.getSelection().getRangeAt(0);
      txt += logifyRange(range);
      normalize(range);
      txt += '</br>';
      txt += 'selection after normalize :</br>';
      txt += logifyRange(range);
      logs.html(txt);
      return $('#main-div').focus();
    });
    printRange = function() {
      var newHtml;
      console.log("range :");
      console.log(getRange());
      newHtml = 'range = </br>' + logifyRange(getRange());
      logs.html(newHtml);
      $('#main-div').focus();
      return newHtml;
    };
    printSelection = function() {
      var newHtml, range;
      console.log("selection :");
      console.log(getRange());
      range = window.getSelection().getRangeAt(0);
      newHtml = 'selection = </br>' + logifyRange(range);
      logs.html(newHtml);
      $('#main-div').focus();
      return newHtml;
    };
    printRangeBtn.on('click', function(e) {
      return printRange();
    });
    printSelBtn.on('click', function(e) {
      return printSelection();
    });
    /**
     * return the div corresponding to an element inside a line and tells wheter
     * the breabk point is at the end or at the beginning of the line
     * @param  {element} cont   the container of the break point
     * @param  {number} offset offset of the break point
     * @return {object}        {div[element], isStart[bool], isEnd[bool]}
    */

    getLineDivIsStartIsEnd = function(cont, offset) {
      var isEnd, isStart, nodesNum, parent;
      parent = cont;
      isStart = true;
      isEnd = true;
      while (!(parent.nodeName === 'DIV' && (parent.id != null) && parent.id.substr(0, 3) === 'div') && parent.parentNode !== null) {
        isStart = isStart && (offset === 0);
        if (parent.length != null) {
          isEnd = isEnd && (offset === parent.length);
        } else {
          isEnd = isEnd && (offset === parent.childNodes.length - 1);
        }
        if (parent.previousSibling === null) {
          offset = 0;
        } else if (parent.nextSibling === null) {
          offset = parent.parentNode.childNodes.length - 1;
        } else if (parent.nextSibling.nextSibling === null) {
          offset = parent.parentNode.childNodes.length - 2;
        } else {
          offset = 1;
        }
        parent = parent.parentNode;
      }
      nodesNum = parent.childNodes.length;
      isStart = isStart && (offset === 0);
      if (parent.textContent === '') {
        isStart = true;
      }
      isEnd = isEnd && (offset === nodesNum - 1 || offset === nodesNum - 2);
      return {
        div: parent,
        isStart: isStart,
        isEnd: isEnd
      };
    };
    getLineDivBtn.on('click', function(e) {
      var div, isEnd, isStart, newHtml, range, _ref;
      range = window.getSelection().getRangeAt(0);
      _ref = getLineDivIsStartIsEnd(range.startContainer, range.startOffset), div = _ref.div, isStart = _ref.isStart, isEnd = _ref.isEnd;
      newHtml = 'selection = </br>' + logifyRange(range);
      newHtml += '</br>' + 'div=' + div.id + '</br>' + ' isStart:<b>' + isStart + '</b></br>' + ' isEnd:  <b>' + isEnd + '</b>';
      logs.html(newHtml);
      console.log('div', div.id, 'isStart', isStart, 'isEnd', isEnd);
      return $('#main-div').focus();
    });
    return testChromeBtn.on('click', function(e) {
      var range, rangeOfSel, result, sel, startNode, startOffset;
      startNode = document.getElementById('span4');
      startOffset = 0;
      range = document.createRange();
      range.setStart(startNode, startOffset);
      range.collapse(true);
      sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      rangeOfSel = sel.getRangeAt(0);
      if (rangeOfSel.startContainer === range.startContainer) {
        result = "<strong style='color:green'>There is no bug ! The selection IS realy in span4</strong>";
      } else {
        result = "<strong style='color:red'>There is a bug ! The selection is NOT in span4 !</strong>";
      }
      logs.html(result);
      return $('#main-div').focus();
    });
  });
  
}});

