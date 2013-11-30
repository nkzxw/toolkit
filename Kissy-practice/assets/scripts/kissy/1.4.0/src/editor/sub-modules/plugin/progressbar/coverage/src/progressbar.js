function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/progressbar.js']) {
  _$jscoverage['/progressbar.js'] = {};
  _$jscoverage['/progressbar.js'].lineData = [];
  _$jscoverage['/progressbar.js'].lineData[6] = 0;
  _$jscoverage['/progressbar.js'].lineData[7] = 0;
  _$jscoverage['/progressbar.js'].lineData[9] = 0;
  _$jscoverage['/progressbar.js'].lineData[11] = 0;
  _$jscoverage['/progressbar.js'].lineData[12] = 0;
  _$jscoverage['/progressbar.js'].lineData[13] = 0;
  _$jscoverage['/progressbar.js'].lineData[16] = 0;
  _$jscoverage['/progressbar.js'].lineData[44] = 0;
  _$jscoverage['/progressbar.js'].lineData[45] = 0;
  _$jscoverage['/progressbar.js'].lineData[46] = 0;
  _$jscoverage['/progressbar.js'].lineData[47] = 0;
  _$jscoverage['/progressbar.js'].lineData[48] = 0;
  _$jscoverage['/progressbar.js'].lineData[49] = 0;
  _$jscoverage['/progressbar.js'].lineData[50] = 0;
  _$jscoverage['/progressbar.js'].lineData[54] = 0;
  _$jscoverage['/progressbar.js'].lineData[56] = 0;
  _$jscoverage['/progressbar.js'].lineData[57] = 0;
}
if (! _$jscoverage['/progressbar.js'].functionData) {
  _$jscoverage['/progressbar.js'].functionData = [];
  _$jscoverage['/progressbar.js'].functionData[0] = 0;
  _$jscoverage['/progressbar.js'].functionData[1] = 0;
  _$jscoverage['/progressbar.js'].functionData[2] = 0;
  _$jscoverage['/progressbar.js'].functionData[3] = 0;
}
if (! _$jscoverage['/progressbar.js'].branchData) {
  _$jscoverage['/progressbar.js'].branchData = {};
  _$jscoverage['/progressbar.js'].branchData['44'] = [];
  _$jscoverage['/progressbar.js'].branchData['44'][1] = new BranchData();
}
_$jscoverage['/progressbar.js'].branchData['44'][1].init(1248, 9, 'container');
function visit1_44_1(result) {
  _$jscoverage['/progressbar.js'].branchData['44'][1].ranCondition(result);
  return result;
}_$jscoverage['/progressbar.js'].lineData[6]++;
KISSY.add("editor/plugin/progressbar", function(S, Base) {
  _$jscoverage['/progressbar.js'].functionData[0]++;
  _$jscoverage['/progressbar.js'].lineData[7]++;
  var Node = S.Node;
  _$jscoverage['/progressbar.js'].lineData[9]++;
  return Base.extend({
  destroy: function() {
  _$jscoverage['/progressbar.js'].functionData[1]++;
  _$jscoverage['/progressbar.js'].lineData[11]++;
  var self = this;
  _$jscoverage['/progressbar.js'].lineData[12]++;
  self.detach();
  _$jscoverage['/progressbar.js'].lineData[13]++;
  self.el.remove();
}, 
  initializer: function() {
  _$jscoverage['/progressbar.js'].functionData[2]++;
  _$jscoverage['/progressbar.js'].lineData[16]++;
  var self = this, h = self.get("height"), prefixCls = self.get('prefixCls'), el = new Node(S.substitute("<div" + " class='{prefixCls}editor-progressbar' " + " style='width:" + self.get("width") + ";" + "height:" + h + ";'" + "></div>", {
  prefixCls: prefixCls})), container = self.get("container"), p = new Node(S.substitute("<div style='overflow:hidden;'>" + "<div class='{prefixCls}editor-progressbar-inner' style='height:" + (parseInt(h) - 4) + "px'>" + "<div class='{prefixCls}editor-progressbar-inner-bg'></div>" + "</div>" + "</div>", {
  prefixCls: prefixCls})).appendTo(el), title = new Node("<span class='" + prefixCls + "editor-progressbar-title'></span>").appendTo(el);
  _$jscoverage['/progressbar.js'].lineData[44]++;
  if (visit1_44_1(container)) {
    _$jscoverage['/progressbar.js'].lineData[45]++;
    el.appendTo(container);
  }
  _$jscoverage['/progressbar.js'].lineData[46]++;
  self.el = el;
  _$jscoverage['/progressbar.js'].lineData[47]++;
  self._title = title;
  _$jscoverage['/progressbar.js'].lineData[48]++;
  self._p = p;
  _$jscoverage['/progressbar.js'].lineData[49]++;
  self.on("afterProgressChange", self._progressChange, self);
  _$jscoverage['/progressbar.js'].lineData[50]++;
  self._progressChange({
  newVal: self.get("progress")});
}, 
  _progressChange: function(ev) {
  _$jscoverage['/progressbar.js'].functionData[3]++;
  _$jscoverage['/progressbar.js'].lineData[54]++;
  var self = this, v = ev.newVal;
  _$jscoverage['/progressbar.js'].lineData[56]++;
  self._p.css("width", v + "%");
  _$jscoverage['/progressbar.js'].lineData[57]++;
  self._title.html(v + "%");
}}, {
  ATTRS: {
  container: {}, 
  width: {}, 
  height: {}, 
  progress: {
  value: 0}, 
  prefixCls: {
  value: 'ks-'}}});
}, {
  requires: ['base']});
