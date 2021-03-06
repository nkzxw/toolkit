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
if (! _$jscoverage['/local-Offline Storage.js']) {
  _$jscoverage['/local-Offline Storage.js'] = {};
  _$jscoverage['/local-Offline Storage.js'].lineData = [];
  _$jscoverage['/local-Offline Storage.js'].lineData[6] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[7] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[11] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[13] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[17] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[19] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[28] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[38] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[39] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[41] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[57] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[58] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[59] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[63] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[64] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[65] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[66] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[68] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[69] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[73] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[74] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[77] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[79] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[82] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[85] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[86] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[89] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[90] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[91] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[96] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[97] = 0;
  _$jscoverage['/local-Offline Storage.js'].lineData[107] = 0;
}
if (! _$jscoverage['/local-Offline Storage.js'].functionData) {
  _$jscoverage['/local-Offline Storage.js'].functionData = [];
  _$jscoverage['/local-Offline Storage.js'].functionData[0] = 0;
  _$jscoverage['/local-Offline Storage.js'].functionData[1] = 0;
  _$jscoverage['/local-Offline Storage.js'].functionData[2] = 0;
  _$jscoverage['/local-Offline Storage.js'].functionData[3] = 0;
  _$jscoverage['/local-Offline Storage.js'].functionData[4] = 0;
  _$jscoverage['/local-Offline Storage.js'].functionData[5] = 0;
  _$jscoverage['/local-Offline Storage.js'].functionData[6] = 0;
  _$jscoverage['/local-Offline Storage.js'].functionData[7] = 0;
  _$jscoverage['/local-Offline Storage.js'].functionData[8] = 0;
  _$jscoverage['/local-Offline Storage.js'].functionData[9] = 0;
}
if (! _$jscoverage['/local-Offline Storage.js'].branchData) {
  _$jscoverage['/local-Offline Storage.js'].branchData = {};
  _$jscoverage['/local-Offline Storage.js'].branchData['7'] = [];
  _$jscoverage['/local-Offline Storage.js'].branchData['7'][1] = new BranchData();
  _$jscoverage['/local-Offline Storage.js'].branchData['11'] = [];
  _$jscoverage['/local-Offline Storage.js'].branchData['11'][1] = new BranchData();
  _$jscoverage['/local-Offline Storage.js'].branchData['11'][2] = new BranchData();
  _$jscoverage['/local-Offline Storage.js'].branchData['11'][3] = new BranchData();
}
_$jscoverage['/local-Offline Storage.js'].branchData['11'][3].init(135, 6, 'ie > 8');
function visit4_11_3(result) {
  _$jscoverage['/local-Offline Storage.js'].branchData['11'][3].ranCondition(result);
  return result;
}_$jscoverage['/local-Offline Storage.js'].branchData['11'][2].init(128, 13, '!ie || ie > 8');
function visit3_11_2(result) {
  _$jscoverage['/local-Offline Storage.js'].branchData['11'][2].ranCondition(result);
  return result;
}_$jscoverage['/local-Offline Storage.js'].branchData['11'][1].init(128, 37, '(!ie || ie > 8) && window.localStorage');
function visit2_11_1(result) {
  _$jscoverage['/local-Offline Storage.js'].branchData['11'][1].ranCondition(result);
  return result;
}_$jscoverage['/local-Offline Storage.js'].branchData['7'][1].init(15, 32, 'document.documentMode || S.UA.ie');
function visit1_7_1(result) {
  _$jscoverage['/local-Offline Storage.js'].branchData['7'][1].ranCondition(result);
  return result;
}_$jscoverage['/local-Offline Storage.js'].lineData[6]++;
KISSY.add("editor/plugin/local-Offline Storage", function(S, Editor, Overlay, FlashBridge) {
  _$jscoverage['/local-Offline Storage.js'].functionData[0]++;
  _$jscoverage['/local-Offline Storage.js'].lineData[7]++;
  var ie = visit1_7_1(document.documentMode || S.UA.ie);
  _$jscoverage['/local-Offline Storage.js'].lineData[11]++;
  if (visit2_11_1((visit3_11_2(!ie || visit4_11_3(ie > 8))) && window.localStorage)) {
    _$jscoverage['/local-Offline Storage.js'].lineData[13]++;
    return window.localStorage;
  }
  _$jscoverage['/local-Offline Storage.js'].lineData[17]++;
  var swfSrc = Editor.Utils.debugUrl("plugin/local-Offline Storage/assets/swfstore.swf?t=" + (+new Date()));
  _$jscoverage['/local-Offline Storage.js'].lineData[19]++;
  var css = {
  width: 215, 
  border: '1px solid red'}, reverseCss = {
  width: 0, 
  border: 'none'};
  _$jscoverage['/local-Offline Storage.js'].lineData[28]++;
  var o = new Overlay({
  prefixCls: 'ks-editor-', 
  elStyle: {
  background: 'white'}, 
  width: "0px", 
  content: "<h1 style='" + "text-align:center;'>\u8bf7\u70b9\u51fb\u5141\u8bb8</h1>" + "<div class='Offline Storage-container'></div>",
  zIndex: Editor.baseZIndex(Editor.ZIndexManager.STORE_FLASH_SHOW)});
  _$jscoverage['/local-Offline Storage.js'].lineData[38]++;
  o.render();
  _$jscoverage['/local-Offline Storage.js'].lineData[39]++;
  o.show();
  _$jscoverage['/local-Offline Storage.js'].lineData[41]++;
  var store = new FlashBridge({
  src: swfSrc, 
  render: o.get("contentEl").one('.Offline Storage-container'),
  params: {
  flashVars: {
  useCompression: true}}, 
  attrs: {
  height: 138, 
  width: '100%'}, 
  methods: ["setItem", "removeItem", "getItem", "setMinDiskSpace", "getValueOf"]});
  _$jscoverage['/local-Offline Storage.js'].lineData[57]++;
  S.ready(function() {
  _$jscoverage['/local-Offline Storage.js'].functionData[1]++;
  _$jscoverage['/local-Offline Storage.js'].lineData[58]++;
  setTimeout(function() {
  _$jscoverage['/local-Offline Storage.js'].functionData[2]++;
  _$jscoverage['/local-Offline Storage.js'].lineData[59]++;
  o.center();
}, 0);
});
  _$jscoverage['/local-Offline Storage.js'].lineData[63]++;
  store.on("pending", function() {
  _$jscoverage['/local-Offline Storage.js'].functionData[3]++;
  _$jscoverage['/local-Offline Storage.js'].lineData[64]++;
  o.get('el').css(css);
  _$jscoverage['/local-Offline Storage.js'].lineData[65]++;
  o.center();
  _$jscoverage['/local-Offline Storage.js'].lineData[66]++;
  o.show();
  _$jscoverage['/local-Offline Storage.js'].lineData[68]++;
  setTimeout(function() {
  _$jscoverage['/local-Offline Storage.js'].functionData[4]++;
  _$jscoverage['/local-Offline Storage.js'].lineData[69]++;
  store.retrySave();
}, 1000);
});
  _$jscoverage['/local-Offline Storage.js'].lineData[73]++;
  store.on("save", function() {
  _$jscoverage['/local-Offline Storage.js'].functionData[5]++;
  _$jscoverage['/local-Offline Storage.js'].lineData[74]++;
  o.get('el').css(reverseCss);
});
  _$jscoverage['/local-Offline Storage.js'].lineData[77]++;
  var oldSet = store.setItem;
  _$jscoverage['/local-Offline Storage.js'].lineData[79]++;
  S.mix(store, {
  _ke: 1, 
  getItem: function(k) {
  _$jscoverage['/local-Offline Storage.js'].functionData[6]++;
  _$jscoverage['/local-Offline Storage.js'].lineData[82]++;
  return this['getValueOf'](k);
}, 
  retrySave: function() {
  _$jscoverage['/local-Offline Storage.js'].functionData[7]++;
  _$jscoverage['/local-Offline Storage.js'].lineData[85]++;
  var self = this;
  _$jscoverage['/local-Offline Storage.js'].lineData[86]++;
  self.setItem(self.lastSave.k, self.lastSave.v);
}, 
  setItem: function(k, v) {
  _$jscoverage['/local-Offline Storage.js'].functionData[8]++;
  _$jscoverage['/local-Offline Storage.js'].lineData[89]++;
  var self = this;
  _$jscoverage['/local-Offline Storage.js'].lineData[90]++;
  self.lastSave = {
  k: k, 
  v: v};
  _$jscoverage['/local-Offline Storage.js'].lineData[91]++;
  oldSet.call(self, k, v);
}});
  _$jscoverage['/local-Offline Storage.js'].lineData[96]++;
  store.on("contentReady", function() {
  _$jscoverage['/local-Offline Storage.js'].functionData[9]++;
  _$jscoverage['/local-Offline Storage.js'].lineData[97]++;
  store._ready = 1;
});
  _$jscoverage['/local-Offline Storage.js'].lineData[107]++;
  return store;
}, {
  "requires": ["editor", "overlay", "./flash-bridge"]});
