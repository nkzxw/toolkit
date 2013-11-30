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
if (! _$jscoverage['/io/script-transport.js']) {
  _$jscoverage['/io/script-transport.js'] = {};
  _$jscoverage['/io/script-transport.js'].lineData = [];
  _$jscoverage['/io/script-transport.js'].lineData[8] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[9] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[15] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[32] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[33] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[39] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[40] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[42] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[43] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[45] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[46] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[47] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[50] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[52] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[60] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[61] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[62] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[63] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[65] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[66] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[69] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[71] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[74] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[76] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[79] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[83] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[89] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[90] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[93] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[100] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[103] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[107] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[110] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[111] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[114] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[115] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[118] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[119] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[125] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[129] = 0;
  _$jscoverage['/io/script-transport.js'].lineData[131] = 0;
}
if (! _$jscoverage['/io/script-transport.js'].functionData) {
  _$jscoverage['/io/script-transport.js'].functionData = [];
  _$jscoverage['/io/script-transport.js'].functionData[0] = 0;
  _$jscoverage['/io/script-transport.js'].functionData[1] = 0;
  _$jscoverage['/io/script-transport.js'].functionData[2] = 0;
  _$jscoverage['/io/script-transport.js'].functionData[3] = 0;
  _$jscoverage['/io/script-transport.js'].functionData[4] = 0;
  _$jscoverage['/io/script-transport.js'].functionData[5] = 0;
  _$jscoverage['/io/script-transport.js'].functionData[6] = 0;
}
if (! _$jscoverage['/io/script-transport.js'].branchData) {
  _$jscoverage['/io/script-transport.js'].branchData = {};
  _$jscoverage['/io/script-transport.js'].branchData['42'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['42'][1] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['56'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['56'][1] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['57'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['57'][1] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['65'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['65'][1] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['74'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['74'][1] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['76'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['76'][1] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['89'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['89'][1] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['94'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['94'][1] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['95'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['95'][1] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['96'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['96'][1] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['97'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['97'][1] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['103'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['103'][1] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['114'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['114'][1] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['114'][2] = new BranchData();
  _$jscoverage['/io/script-transport.js'].branchData['118'] = [];
  _$jscoverage['/io/script-transport.js'].branchData['118'][1] = new BranchData();
}
_$jscoverage['/io/script-transport.js'].branchData['118'][1].init(674, 16, 'event == \'error\'');
function visit127_118_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['118'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['114'][2].init(520, 16, 'event != \'error\'');
function visit126_114_2(result) {
  _$jscoverage['/io/script-transport.js'].branchData['114'][2].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['114'][1].init(510, 26, '!abort && event != \'error\'');
function visit125_114_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['114'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['103'][1].init(151, 25, 'head && script.parentNode');
function visit124_103_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['103'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['97'][1].init(65, 16, 'event == \'error\'');
function visit123_97_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['97'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['96'][1].init(42, 82, '/loaded|complete/.test(script.readyState) || event == \'error\'');
function visit122_96_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['96'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['95'][1].init(29, 125, '!script.readyState || /loaded|complete/.test(script.readyState) || event == \'error\'');
function visit121_95_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['95'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['94'][1].init(21, 155, 'abort || !script.readyState || /loaded|complete/.test(script.readyState) || event == \'error\'');
function visit120_94_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['94'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['89'][1].init(188, 7, '!script');
function visit119_89_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['89'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['76'][1].init(142, 17, 'e.type || \'error\'');
function visit118_76_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['76'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['74'][1].init(30, 14, 'e || win.event');
function visit117_74_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['74'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['65'][1].init(432, 18, 'c[\'scriptCharset\']');
function visit116_65_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['65'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['57'][1].init(35, 79, 'doc.getElementsByTagName(\'head\')[0] || doc.documentElement');
function visit115_57_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['57'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['56'][1].init(128, 115, 'doc[\'head\'] || doc.getElementsByTagName(\'head\')[0] || doc.documentElement');
function visit114_56_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['56'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].branchData['42'][1].init(98, 19, '!config.crossDomain');
function visit113_42_1(result) {
  _$jscoverage['/io/script-transport.js'].branchData['42'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/script-transport.js'].lineData[8]++;
KISSY.add('io/script-transport', function(S, IO, _, undefined) {
  _$jscoverage['/io/script-transport.js'].functionData[0]++;
  _$jscoverage['/io/script-transport.js'].lineData[9]++;
  var win = S.Env.host, doc = win.document, logger = S.getLogger('s/io'), OK_CODE = 200, ERROR_CODE = 500;
  _$jscoverage['/io/script-transport.js'].lineData[15]++;
  IO.setupConfig({
  accepts: {
  script: 'text/javascript, ' + 'application/javascript, ' + 'application/ecmascript, ' + 'application/x-ecmascript'}, 
  contents: {
  script: /javascript|ecmascript/}, 
  converters: {
  text: {
  script: function(text) {
  _$jscoverage['/io/script-transport.js'].functionData[1]++;
  _$jscoverage['/io/script-transport.js'].lineData[32]++;
  S.globalEval(text);
  _$jscoverage['/io/script-transport.js'].lineData[33]++;
  return text;
}}}});
  _$jscoverage['/io/script-transport.js'].lineData[39]++;
  function ScriptTransport(io) {
    _$jscoverage['/io/script-transport.js'].functionData[2]++;
    _$jscoverage['/io/script-transport.js'].lineData[40]++;
    var config = io.config;
    _$jscoverage['/io/script-transport.js'].lineData[42]++;
    if (visit113_42_1(!config.crossDomain)) {
      _$jscoverage['/io/script-transport.js'].lineData[43]++;
      return new (IO['getTransport']('*'))(io);
    }
    _$jscoverage['/io/script-transport.js'].lineData[45]++;
    this.io = io;
    _$jscoverage['/io/script-transport.js'].lineData[46]++;
    logger.info('use ScriptTransport for: ' + config.url);
    _$jscoverage['/io/script-transport.js'].lineData[47]++;
    return this;
  }
  _$jscoverage['/io/script-transport.js'].lineData[50]++;
  S.augment(ScriptTransport, {
  send: function() {
  _$jscoverage['/io/script-transport.js'].functionData[3]++;
  _$jscoverage['/io/script-transport.js'].lineData[52]++;
  var self = this, script, io = self.io, c = io.config, head = visit114_56_1(doc['head'] || visit115_57_1(doc.getElementsByTagName('head')[0] || doc.documentElement));
  _$jscoverage['/io/script-transport.js'].lineData[60]++;
  self.head = head;
  _$jscoverage['/io/script-transport.js'].lineData[61]++;
  script = doc.createElement('script');
  _$jscoverage['/io/script-transport.js'].lineData[62]++;
  self.script = script;
  _$jscoverage['/io/script-transport.js'].lineData[63]++;
  script.async = true;
  _$jscoverage['/io/script-transport.js'].lineData[65]++;
  if (visit116_65_1(c['scriptCharset'])) {
    _$jscoverage['/io/script-transport.js'].lineData[66]++;
    script.charset = c['scriptCharset'];
  }
  _$jscoverage['/io/script-transport.js'].lineData[69]++;
  script.src = io._getUrlForSend();
  _$jscoverage['/io/script-transport.js'].lineData[71]++;
  script.onerror = script.onload = script.onreadystatechange = function(e) {
  _$jscoverage['/io/script-transport.js'].functionData[4]++;
  _$jscoverage['/io/script-transport.js'].lineData[74]++;
  e = visit117_74_1(e || win.event);
  _$jscoverage['/io/script-transport.js'].lineData[76]++;
  self._callback((visit118_76_1(e.type || 'error')).toLowerCase());
};
  _$jscoverage['/io/script-transport.js'].lineData[79]++;
  head.insertBefore(script, head.firstChild);
}, 
  _callback: function(event, abort) {
  _$jscoverage['/io/script-transport.js'].functionData[5]++;
  _$jscoverage['/io/script-transport.js'].lineData[83]++;
  var self = this, script = self.script, io = self.io, head = self.head;
  _$jscoverage['/io/script-transport.js'].lineData[89]++;
  if (visit119_89_1(!script)) {
    _$jscoverage['/io/script-transport.js'].lineData[90]++;
    return;
  }
  _$jscoverage['/io/script-transport.js'].lineData[93]++;
  if (visit120_94_1(abort || visit121_95_1(!script.readyState || visit122_96_1(/loaded|complete/.test(script.readyState) || visit123_97_1(event == 'error'))))) {
    _$jscoverage['/io/script-transport.js'].lineData[100]++;
    script['onerror'] = script.onload = script.onreadystatechange = null;
    _$jscoverage['/io/script-transport.js'].lineData[103]++;
    if (visit124_103_1(head && script.parentNode)) {
      _$jscoverage['/io/script-transport.js'].lineData[107]++;
      head.removeChild(script);
    }
    _$jscoverage['/io/script-transport.js'].lineData[110]++;
    self.script = undefined;
    _$jscoverage['/io/script-transport.js'].lineData[111]++;
    self.head = undefined;
    _$jscoverage['/io/script-transport.js'].lineData[114]++;
    if (visit125_114_1(!abort && visit126_114_2(event != 'error'))) {
      _$jscoverage['/io/script-transport.js'].lineData[115]++;
      io._ioReady(OK_CODE, 'success');
    } else {
      _$jscoverage['/io/script-transport.js'].lineData[118]++;
      if (visit127_118_1(event == 'error')) {
        _$jscoverage['/io/script-transport.js'].lineData[119]++;
        io._ioReady(ERROR_CODE, 'script error');
      }
    }
  }
}, 
  abort: function() {
  _$jscoverage['/io/script-transport.js'].functionData[6]++;
  _$jscoverage['/io/script-transport.js'].lineData[125]++;
  this._callback(0, 1);
}});
  _$jscoverage['/io/script-transport.js'].lineData[129]++;
  IO['setupTransport']('script', ScriptTransport);
  _$jscoverage['/io/script-transport.js'].lineData[131]++;
  return IO;
}, {
  requires: ['./base', './xhr-transport']});
