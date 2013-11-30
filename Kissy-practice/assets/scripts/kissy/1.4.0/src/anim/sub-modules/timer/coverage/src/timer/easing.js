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
if (! _$jscoverage['/timer/easing.js']) {
  _$jscoverage['/timer/easing.js'] = {};
  _$jscoverage['/timer/easing.js'].lineData = [];
  _$jscoverage['/timer/easing.js'].lineData[6] = 0;
  _$jscoverage['/timer/easing.js'].lineData[17] = 0;
  _$jscoverage['/timer/easing.js'].lineData[24] = 0;
  _$jscoverage['/timer/easing.js'].lineData[25] = 0;
  _$jscoverage['/timer/easing.js'].lineData[33] = 0;
  _$jscoverage['/timer/easing.js'].lineData[38] = 0;
  _$jscoverage['/timer/easing.js'].lineData[52] = 0;
  _$jscoverage['/timer/easing.js'].lineData[66] = 0;
  _$jscoverage['/timer/easing.js'].lineData[67] = 0;
  _$jscoverage['/timer/easing.js'].lineData[68] = 0;
  _$jscoverage['/timer/easing.js'].lineData[75] = 0;
  _$jscoverage['/timer/easing.js'].lineData[82] = 0;
  _$jscoverage['/timer/easing.js'].lineData[89] = 0;
  _$jscoverage['/timer/easing.js'].lineData[98] = 0;
  _$jscoverage['/timer/easing.js'].lineData[105] = 0;
  _$jscoverage['/timer/easing.js'].lineData[112] = 0;
  _$jscoverage['/timer/easing.js'].lineData[122] = 0;
  _$jscoverage['/timer/easing.js'].lineData[123] = 0;
  _$jscoverage['/timer/easing.js'].lineData[124] = 0;
  _$jscoverage['/timer/easing.js'].lineData[131] = 0;
  _$jscoverage['/timer/easing.js'].lineData[132] = 0;
  _$jscoverage['/timer/easing.js'].lineData[133] = 0;
  _$jscoverage['/timer/easing.js'].lineData[140] = 0;
  _$jscoverage['/timer/easing.js'].lineData[141] = 0;
  _$jscoverage['/timer/easing.js'].lineData[143] = 0;
  _$jscoverage['/timer/easing.js'].lineData[144] = 0;
  _$jscoverage['/timer/easing.js'].lineData[147] = 0;
  _$jscoverage['/timer/easing.js'].lineData[155] = 0;
  _$jscoverage['/timer/easing.js'].lineData[156] = 0;
  _$jscoverage['/timer/easing.js'].lineData[163] = 0;
  _$jscoverage['/timer/easing.js'].lineData[171] = 0;
  _$jscoverage['/timer/easing.js'].lineData[172] = 0;
  _$jscoverage['/timer/easing.js'].lineData[174] = 0;
  _$jscoverage['/timer/easing.js'].lineData[175] = 0;
  _$jscoverage['/timer/easing.js'].lineData[177] = 0;
  _$jscoverage['/timer/easing.js'].lineData[185] = 0;
  _$jscoverage['/timer/easing.js'].lineData[192] = 0;
  _$jscoverage['/timer/easing.js'].lineData[194] = 0;
  _$jscoverage['/timer/easing.js'].lineData[195] = 0;
  _$jscoverage['/timer/easing.js'].lineData[197] = 0;
  _$jscoverage['/timer/easing.js'].lineData[198] = 0;
  _$jscoverage['/timer/easing.js'].lineData[200] = 0;
  _$jscoverage['/timer/easing.js'].lineData[201] = 0;
  _$jscoverage['/timer/easing.js'].lineData[204] = 0;
  _$jscoverage['/timer/easing.js'].lineData[207] = 0;
  _$jscoverage['/timer/easing.js'].lineData[214] = 0;
  _$jscoverage['/timer/easing.js'].lineData[215] = 0;
  _$jscoverage['/timer/easing.js'].lineData[217] = 0;
  _$jscoverage['/timer/easing.js'].lineData[225] = 0;
  _$jscoverage['/timer/easing.js'].lineData[232] = 0;
  _$jscoverage['/timer/easing.js'].lineData[235] = 0;
  _$jscoverage['/timer/easing.js'].lineData[239] = 0;
  _$jscoverage['/timer/easing.js'].lineData[243] = 0;
  _$jscoverage['/timer/easing.js'].lineData[245] = 0;
  _$jscoverage['/timer/easing.js'].lineData[248] = 0;
  _$jscoverage['/timer/easing.js'].lineData[249] = 0;
  _$jscoverage['/timer/easing.js'].lineData[252] = 0;
  _$jscoverage['/timer/easing.js'].lineData[253] = 0;
  _$jscoverage['/timer/easing.js'].lineData[257] = 0;
  _$jscoverage['/timer/easing.js'].lineData[258] = 0;
  _$jscoverage['/timer/easing.js'].lineData[265] = 0;
  _$jscoverage['/timer/easing.js'].lineData[267] = 0;
  _$jscoverage['/timer/easing.js'].lineData[268] = 0;
  _$jscoverage['/timer/easing.js'].lineData[269] = 0;
  _$jscoverage['/timer/easing.js'].lineData[271] = 0;
  _$jscoverage['/timer/easing.js'].lineData[273] = 0;
  _$jscoverage['/timer/easing.js'].lineData[274] = 0;
  _$jscoverage['/timer/easing.js'].lineData[276] = 0;
  _$jscoverage['/timer/easing.js'].lineData[282] = 0;
  _$jscoverage['/timer/easing.js'].lineData[284] = 0;
  _$jscoverage['/timer/easing.js'].lineData[285] = 0;
  _$jscoverage['/timer/easing.js'].lineData[286] = 0;
  _$jscoverage['/timer/easing.js'].lineData[287] = 0;
  _$jscoverage['/timer/easing.js'].lineData[288] = 0;
  _$jscoverage['/timer/easing.js'].lineData[290] = 0;
  _$jscoverage['/timer/easing.js'].lineData[291] = 0;
  _$jscoverage['/timer/easing.js'].lineData[293] = 0;
  _$jscoverage['/timer/easing.js'].lineData[295] = 0;
  _$jscoverage['/timer/easing.js'].lineData[299] = 0;
  _$jscoverage['/timer/easing.js'].lineData[302] = 0;
  _$jscoverage['/timer/easing.js'].lineData[303] = 0;
  _$jscoverage['/timer/easing.js'].lineData[306] = 0;
  _$jscoverage['/timer/easing.js'].lineData[309] = 0;
}
if (! _$jscoverage['/timer/easing.js'].functionData) {
  _$jscoverage['/timer/easing.js'].functionData = [];
  _$jscoverage['/timer/easing.js'].functionData[0] = 0;
  _$jscoverage['/timer/easing.js'].functionData[1] = 0;
  _$jscoverage['/timer/easing.js'].functionData[2] = 0;
  _$jscoverage['/timer/easing.js'].functionData[3] = 0;
  _$jscoverage['/timer/easing.js'].functionData[4] = 0;
  _$jscoverage['/timer/easing.js'].functionData[5] = 0;
  _$jscoverage['/timer/easing.js'].functionData[6] = 0;
  _$jscoverage['/timer/easing.js'].functionData[7] = 0;
  _$jscoverage['/timer/easing.js'].functionData[8] = 0;
  _$jscoverage['/timer/easing.js'].functionData[9] = 0;
  _$jscoverage['/timer/easing.js'].functionData[10] = 0;
  _$jscoverage['/timer/easing.js'].functionData[11] = 0;
  _$jscoverage['/timer/easing.js'].functionData[12] = 0;
  _$jscoverage['/timer/easing.js'].functionData[13] = 0;
  _$jscoverage['/timer/easing.js'].functionData[14] = 0;
  _$jscoverage['/timer/easing.js'].functionData[15] = 0;
  _$jscoverage['/timer/easing.js'].functionData[16] = 0;
  _$jscoverage['/timer/easing.js'].functionData[17] = 0;
  _$jscoverage['/timer/easing.js'].functionData[18] = 0;
  _$jscoverage['/timer/easing.js'].functionData[19] = 0;
  _$jscoverage['/timer/easing.js'].functionData[20] = 0;
  _$jscoverage['/timer/easing.js'].functionData[21] = 0;
  _$jscoverage['/timer/easing.js'].functionData[22] = 0;
  _$jscoverage['/timer/easing.js'].functionData[23] = 0;
  _$jscoverage['/timer/easing.js'].functionData[24] = 0;
}
if (! _$jscoverage['/timer/easing.js'].branchData) {
  _$jscoverage['/timer/easing.js'].branchData = {};
  _$jscoverage['/timer/easing.js'].branchData['67'] = [];
  _$jscoverage['/timer/easing.js'].branchData['67'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['75'] = [];
  _$jscoverage['/timer/easing.js'].branchData['75'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['89'] = [];
  _$jscoverage['/timer/easing.js'].branchData['89'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['112'] = [];
  _$jscoverage['/timer/easing.js'].branchData['112'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['123'] = [];
  _$jscoverage['/timer/easing.js'].branchData['123'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['123'][2] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['123'][3] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['132'] = [];
  _$jscoverage['/timer/easing.js'].branchData['132'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['132'][2] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['132'][3] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['141'] = [];
  _$jscoverage['/timer/easing.js'].branchData['141'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['141'][2] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['141'][3] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['143'] = [];
  _$jscoverage['/timer/easing.js'].branchData['143'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['155'] = [];
  _$jscoverage['/timer/easing.js'].branchData['155'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['174'] = [];
  _$jscoverage['/timer/easing.js'].branchData['174'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['194'] = [];
  _$jscoverage['/timer/easing.js'].branchData['194'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['197'] = [];
  _$jscoverage['/timer/easing.js'].branchData['197'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['200'] = [];
  _$jscoverage['/timer/easing.js'].branchData['200'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['214'] = [];
  _$jscoverage['/timer/easing.js'].branchData['214'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['265'] = [];
  _$jscoverage['/timer/easing.js'].branchData['265'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['268'] = [];
  _$jscoverage['/timer/easing.js'].branchData['268'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['273'] = [];
  _$jscoverage['/timer/easing.js'].branchData['273'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['285'] = [];
  _$jscoverage['/timer/easing.js'].branchData['285'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['287'] = [];
  _$jscoverage['/timer/easing.js'].branchData['287'][1] = new BranchData();
  _$jscoverage['/timer/easing.js'].branchData['290'] = [];
  _$jscoverage['/timer/easing.js'].branchData['290'][1] = new BranchData();
}
_$jscoverage['/timer/easing.js'].branchData['290'][1].init(162, 6, 'x2 > 0');
function visit42_290_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['290'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['287'][1].init(66, 20, 'abs(x2) < ZERO_LIMIT');
function visit41_287_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['287'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['285'][1].init(1019, 7, 't1 > t0');
function visit40_285_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['285'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['273'][1].init(283, 28, 'abs(derivative) < ZERO_LIMIT');
function visit39_273_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['273'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['268'][1].init(95, 20, 'abs(x2) < ZERO_LIMIT');
function visit38_268_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['268'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['265'][1].init(341, 5, 'i < 8');
function visit37_265_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['265'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['214'][1].init(18, 6, 't < .5');
function visit36_214_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['214'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['200'][1].init(252, 16, 't < (2.5 / 2.75)');
function visit35_200_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['200'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['197'][1].init(140, 14, 't < (2 / 2.75)');
function visit34_197_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['197'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['194'][1].init(52, 14, 't < (1 / 2.75)');
function visit33_194_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['194'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['174'][1].init(93, 12, '(t *= 2) < 1');
function visit32_174_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['174'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['155'][1].init(18, 7, 't === 1');
function visit31_155_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['155'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['143'][1].init(111, 5, 't < 1');
function visit30_143_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['143'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['141'][3].init(67, 13, '(t *= 2) === 2');
function visit29_141_3(result) {
  _$jscoverage['/timer/easing.js'].branchData['141'][3].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['141'][2].init(55, 7, 't === 0');
function visit28_141_2(result) {
  _$jscoverage['/timer/easing.js'].branchData['141'][2].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['141'][1].init(55, 25, 't === 0 || (t *= 2) === 2');
function visit27_141_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['141'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['132'][3].init(65, 7, 't === 1');
function visit26_132_3(result) {
  _$jscoverage['/timer/easing.js'].branchData['132'][3].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['132'][2].init(54, 7, 't === 0');
function visit25_132_2(result) {
  _$jscoverage['/timer/easing.js'].branchData['132'][2].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['132'][1].init(54, 18, 't === 0 || t === 1');
function visit24_132_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['132'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['123'][3].init(65, 7, 't === 1');
function visit23_123_3(result) {
  _$jscoverage['/timer/easing.js'].branchData['123'][3].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['123'][2].init(54, 7, 't === 0');
function visit22_123_2(result) {
  _$jscoverage['/timer/easing.js'].branchData['123'][2].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['123'][1].init(54, 18, 't === 0 || t === 1');
function visit21_123_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['123'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['112'][1].init(22, 11, '(t *= 2) < 1');
function visit20_112_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['112'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['89'][1].init(22, 11, '(t *= 2) < 1');
function visit19_89_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['89'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['75'][1].init(338, 29, 'Easing[easingStr] || easeNone');
function visit18_75_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['75'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].branchData['67'][1].init(38, 37, 'm = easingStr.match(CUBIC_BEZIER_REG)');
function visit17_67_1(result) {
  _$jscoverage['/timer/easing.js'].branchData['67'][1].ranCondition(result);
  return result;
}_$jscoverage['/timer/easing.js'].lineData[6]++;
KISSY.add('anim/timer/easing', function() {
  _$jscoverage['/timer/easing.js'].functionData[0]++;
  _$jscoverage['/timer/easing.js'].lineData[17]++;
  var PI = Math.PI, pow = Math.pow, sin = Math.sin, parseNumber = parseFloat, CUBIC_BEZIER_REG = /^cubic-bezier\(([^,]+),([^,]+),([^,]+),([^,]+)\)$/i, BACK_CONST = 1.70158;
  _$jscoverage['/timer/easing.js'].lineData[24]++;
  function easeNone(t) {
    _$jscoverage['/timer/easing.js'].functionData[1]++;
    _$jscoverage['/timer/easing.js'].lineData[25]++;
    return t;
  }
  _$jscoverage['/timer/easing.js'].lineData[33]++;
  var Easing = {
  swing: function(t) {
  _$jscoverage['/timer/easing.js'].functionData[2]++;
  _$jscoverage['/timer/easing.js'].lineData[38]++;
  return (-Math.cos(t * PI) / 2) + 0.5;
}, 
  'easeNone': easeNone, 
  'linear': easeNone, 
  'easeIn': function(t) {
  _$jscoverage['/timer/easing.js'].functionData[3]++;
  _$jscoverage['/timer/easing.js'].lineData[52]++;
  return t * t;
}, 
  'ease': cubicBezierFunction(0.25, 0.1, 0.25, 1.0), 
  'ease-in': cubicBezierFunction(0.42, 0, 1.0, 1.0), 
  'ease-out': cubicBezierFunction(0, 0, 0.58, 1.0), 
  'ease-in-out': cubicBezierFunction(0.42, 0, 0.58, 1.0), 
  'ease-out-in': cubicBezierFunction(0, 0.42, 1.0, 0.58), 
  toFn: function(easingStr) {
  _$jscoverage['/timer/easing.js'].functionData[4]++;
  _$jscoverage['/timer/easing.js'].lineData[66]++;
  var m;
  _$jscoverage['/timer/easing.js'].lineData[67]++;
  if (visit17_67_1(m = easingStr.match(CUBIC_BEZIER_REG))) {
    _$jscoverage['/timer/easing.js'].lineData[68]++;
    return cubicBezierFunction(parseNumber(m[1]), parseNumber(m[2]), parseNumber(m[3]), parseNumber(m[4]));
  }
  _$jscoverage['/timer/easing.js'].lineData[75]++;
  return visit18_75_1(Easing[easingStr] || easeNone);
}, 
  easeOut: function(t) {
  _$jscoverage['/timer/easing.js'].functionData[5]++;
  _$jscoverage['/timer/easing.js'].lineData[82]++;
  return (2 - t) * t;
}, 
  easeBoth: function(t) {
  _$jscoverage['/timer/easing.js'].functionData[6]++;
  _$jscoverage['/timer/easing.js'].lineData[89]++;
  return visit19_89_1((t *= 2) < 1) ? .5 * t * t : .5 * (1 - (--t) * (t - 2));
}, 
  'easeInStrong': function(t) {
  _$jscoverage['/timer/easing.js'].functionData[7]++;
  _$jscoverage['/timer/easing.js'].lineData[98]++;
  return t * t * t * t;
}, 
  easeOutStrong: function(t) {
  _$jscoverage['/timer/easing.js'].functionData[8]++;
  _$jscoverage['/timer/easing.js'].lineData[105]++;
  return 1 - (--t) * t * t * t;
}, 
  'easeBothStrong': function(t) {
  _$jscoverage['/timer/easing.js'].functionData[9]++;
  _$jscoverage['/timer/easing.js'].lineData[112]++;
  return visit20_112_1((t *= 2) < 1) ? .5 * t * t * t * t : .5 * (2 - (t -= 2) * t * t * t);
}, 
  'elasticIn': function(t) {
  _$jscoverage['/timer/easing.js'].functionData[10]++;
  _$jscoverage['/timer/easing.js'].lineData[122]++;
  var p = .3, s = p / 4;
  _$jscoverage['/timer/easing.js'].lineData[123]++;
  if (visit21_123_1(visit22_123_2(t === 0) || visit23_123_3(t === 1))) 
    return t;
  _$jscoverage['/timer/easing.js'].lineData[124]++;
  return -(pow(2, 10 * (t -= 1)) * sin((t - s) * (2 * PI) / p));
}, 
  elasticOut: function(t) {
  _$jscoverage['/timer/easing.js'].functionData[11]++;
  _$jscoverage['/timer/easing.js'].lineData[131]++;
  var p = .3, s = p / 4;
  _$jscoverage['/timer/easing.js'].lineData[132]++;
  if (visit24_132_1(visit25_132_2(t === 0) || visit26_132_3(t === 1))) 
    return t;
  _$jscoverage['/timer/easing.js'].lineData[133]++;
  return pow(2, -10 * t) * sin((t - s) * (2 * PI) / p) + 1;
}, 
  'elasticBoth': function(t) {
  _$jscoverage['/timer/easing.js'].functionData[12]++;
  _$jscoverage['/timer/easing.js'].lineData[140]++;
  var p = .45, s = p / 4;
  _$jscoverage['/timer/easing.js'].lineData[141]++;
  if (visit27_141_1(visit28_141_2(t === 0) || visit29_141_3((t *= 2) === 2))) 
    return t;
  _$jscoverage['/timer/easing.js'].lineData[143]++;
  if (visit30_143_1(t < 1)) {
    _$jscoverage['/timer/easing.js'].lineData[144]++;
    return -.5 * (pow(2, 10 * (t -= 1)) * sin((t - s) * (2 * PI) / p));
  }
  _$jscoverage['/timer/easing.js'].lineData[147]++;
  return pow(2, -10 * (t -= 1)) * sin((t - s) * (2 * PI) / p) * .5 + 1;
}, 
  'backIn': function(t) {
  _$jscoverage['/timer/easing.js'].functionData[13]++;
  _$jscoverage['/timer/easing.js'].lineData[155]++;
  if (visit31_155_1(t === 1)) 
    t -= .001;
  _$jscoverage['/timer/easing.js'].lineData[156]++;
  return t * t * ((BACK_CONST + 1) * t - BACK_CONST);
}, 
  backOut: function(t) {
  _$jscoverage['/timer/easing.js'].functionData[14]++;
  _$jscoverage['/timer/easing.js'].lineData[163]++;
  return (t -= 1) * t * ((BACK_CONST + 1) * t + BACK_CONST) + 1;
}, 
  'backBoth': function(t) {
  _$jscoverage['/timer/easing.js'].functionData[15]++;
  _$jscoverage['/timer/easing.js'].lineData[171]++;
  var s = BACK_CONST;
  _$jscoverage['/timer/easing.js'].lineData[172]++;
  var m = (s *= 1.525) + 1;
  _$jscoverage['/timer/easing.js'].lineData[174]++;
  if (visit32_174_1((t *= 2) < 1)) {
    _$jscoverage['/timer/easing.js'].lineData[175]++;
    return .5 * (t * t * (m * t - s));
  }
  _$jscoverage['/timer/easing.js'].lineData[177]++;
  return .5 * ((t -= 2) * t * (m * t + s) + 2);
}, 
  bounceIn: function(t) {
  _$jscoverage['/timer/easing.js'].functionData[16]++;
  _$jscoverage['/timer/easing.js'].lineData[185]++;
  return 1 - Easing.bounceOut(1 - t);
}, 
  'bounceOut': function(t) {
  _$jscoverage['/timer/easing.js'].functionData[17]++;
  _$jscoverage['/timer/easing.js'].lineData[192]++;
  var s = 7.5625, r;
  _$jscoverage['/timer/easing.js'].lineData[194]++;
  if (visit33_194_1(t < (1 / 2.75))) {
    _$jscoverage['/timer/easing.js'].lineData[195]++;
    r = s * t * t;
  } else {
    _$jscoverage['/timer/easing.js'].lineData[197]++;
    if (visit34_197_1(t < (2 / 2.75))) {
      _$jscoverage['/timer/easing.js'].lineData[198]++;
      r = s * (t -= (1.5 / 2.75)) * t + .75;
    } else {
      _$jscoverage['/timer/easing.js'].lineData[200]++;
      if (visit35_200_1(t < (2.5 / 2.75))) {
        _$jscoverage['/timer/easing.js'].lineData[201]++;
        r = s * (t -= (2.25 / 2.75)) * t + .9375;
      } else {
        _$jscoverage['/timer/easing.js'].lineData[204]++;
        r = s * (t -= (2.625 / 2.75)) * t + .984375;
      }
    }
  }
  _$jscoverage['/timer/easing.js'].lineData[207]++;
  return r;
}, 
  'bounceBoth': function(t) {
  _$jscoverage['/timer/easing.js'].functionData[18]++;
  _$jscoverage['/timer/easing.js'].lineData[214]++;
  if (visit36_214_1(t < .5)) {
    _$jscoverage['/timer/easing.js'].lineData[215]++;
    return Easing.bounceIn(t * 2) * .5;
  }
  _$jscoverage['/timer/easing.js'].lineData[217]++;
  return Easing.bounceOut(t * 2 - 1) * .5 + .5;
}};
  _$jscoverage['/timer/easing.js'].lineData[225]++;
  var ZERO_LIMIT = 1e-6, abs = Math.abs;
  _$jscoverage['/timer/easing.js'].lineData[232]++;
  function cubicBezierFunction(p1x, p1y, p2x, p2y) {
    _$jscoverage['/timer/easing.js'].functionData[19]++;
    _$jscoverage['/timer/easing.js'].lineData[235]++;
    var ax = 3 * p1x - 3 * p2x + 1, bx = 3 * p2x - 6 * p1x, cx = 3 * p1x;
    _$jscoverage['/timer/easing.js'].lineData[239]++;
    var ay = 3 * p1y - 3 * p2y + 1, by = 3 * p2y - 6 * p1y, cy = 3 * p1y;
    _$jscoverage['/timer/easing.js'].lineData[243]++;
    function sampleCurveDerivativeX(t) {
      _$jscoverage['/timer/easing.js'].functionData[20]++;
      _$jscoverage['/timer/easing.js'].lineData[245]++;
      return (3 * ax * t + 2 * bx) * t + cx;
    }
    _$jscoverage['/timer/easing.js'].lineData[248]++;
    function sampleCurveX(t) {
      _$jscoverage['/timer/easing.js'].functionData[21]++;
      _$jscoverage['/timer/easing.js'].lineData[249]++;
      return ((ax * t + bx) * t + cx) * t;
    }
    _$jscoverage['/timer/easing.js'].lineData[252]++;
    function sampleCurveY(t) {
      _$jscoverage['/timer/easing.js'].functionData[22]++;
      _$jscoverage['/timer/easing.js'].lineData[253]++;
      return ((ay * t + by) * t + cy) * t;
    }
    _$jscoverage['/timer/easing.js'].lineData[257]++;
    function solveCurveX(x) {
      _$jscoverage['/timer/easing.js'].functionData[23]++;
      _$jscoverage['/timer/easing.js'].lineData[258]++;
      var t2 = x, derivative, x2;
      _$jscoverage['/timer/easing.js'].lineData[265]++;
      for (var i = 0; visit37_265_1(i < 8); i++) {
        _$jscoverage['/timer/easing.js'].lineData[267]++;
        x2 = sampleCurveX(t2) - x;
        _$jscoverage['/timer/easing.js'].lineData[268]++;
        if (visit38_268_1(abs(x2) < ZERO_LIMIT)) {
          _$jscoverage['/timer/easing.js'].lineData[269]++;
          return t2;
        }
        _$jscoverage['/timer/easing.js'].lineData[271]++;
        derivative = sampleCurveDerivativeX(t2);
        _$jscoverage['/timer/easing.js'].lineData[273]++;
        if (visit39_273_1(abs(derivative) < ZERO_LIMIT)) {
          _$jscoverage['/timer/easing.js'].lineData[274]++;
          break;
        }
        _$jscoverage['/timer/easing.js'].lineData[276]++;
        t2 -= x2 / derivative;
      }
      _$jscoverage['/timer/easing.js'].lineData[282]++;
      var t1 = 1, t0 = 0;
      _$jscoverage['/timer/easing.js'].lineData[284]++;
      t2 = x;
      _$jscoverage['/timer/easing.js'].lineData[285]++;
      while (visit40_285_1(t1 > t0)) {
        _$jscoverage['/timer/easing.js'].lineData[286]++;
        x2 = sampleCurveX(t2) - x;
        _$jscoverage['/timer/easing.js'].lineData[287]++;
        if (visit41_287_1(abs(x2) < ZERO_LIMIT)) {
          _$jscoverage['/timer/easing.js'].lineData[288]++;
          return t2;
        }
        _$jscoverage['/timer/easing.js'].lineData[290]++;
        if (visit42_290_1(x2 > 0)) {
          _$jscoverage['/timer/easing.js'].lineData[291]++;
          t1 = t2;
        } else {
          _$jscoverage['/timer/easing.js'].lineData[293]++;
          t0 = t2;
        }
        _$jscoverage['/timer/easing.js'].lineData[295]++;
        t2 = (t1 + t0) / 2;
      }
      _$jscoverage['/timer/easing.js'].lineData[299]++;
      return t2;
    }
    _$jscoverage['/timer/easing.js'].lineData[302]++;
    function solve(x) {
      _$jscoverage['/timer/easing.js'].functionData[24]++;
      _$jscoverage['/timer/easing.js'].lineData[303]++;
      return sampleCurveY(solveCurveX(x));
    }
    _$jscoverage['/timer/easing.js'].lineData[306]++;
    return solve;
  }
  _$jscoverage['/timer/easing.js'].lineData[309]++;
  return Easing;
});
