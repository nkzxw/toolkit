/*
  Generated by kissy-xtemplate.*/
KISSY.add('combobox/combobox-xtpl', function () {
    return function (scopes, S, undefined) {
        var buffer = "",
            config = this.config,
            engine = this,
            utils = config.utils;
        var runBlockCommandUtil = utils["runBlockCommand"],
            getExpressionUtil = utils["getExpression"],
            getPropertyOrRunCommandUtil = utils["getPropertyOrRunCommand"];
        buffer += '<div id="ks-combobox-invalid-el-';
        var id0 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 1, undefined, false);
        buffer += getExpressionUtil(id0, true);
        buffer += '"\r\n     class="';
        var config2 = {};
        var params3 = [];
        params3.push('invalid-el');
        config2.params = params3;
        var id1 = getPropertyOrRunCommandUtil(engine, scopes, config2, "getBaseCssClasses", 0, 2, true, undefined);
        buffer += id1;
        buffer += '">\r\n    <div class="';
        var config5 = {};
        var params6 = [];
        params6.push('invalid-inner');
        config5.params = params6;
        var id4 = getPropertyOrRunCommandUtil(engine, scopes, config5, "getBaseCssClasses", 0, 3, true, undefined);
        buffer += id4;
        buffer += '"></div>\r\n</div>\r\n\r\n';
        var config7 = {};
        var params8 = [];
        var id9 = getPropertyOrRunCommandUtil(engine, scopes, {}, "hasTrigger", 0, 6, undefined, true);
        params8.push(id9);
        config7.params = params8;
        config7.fn = function (scopes) {
            var buffer = "";
            buffer += '\r\n<div id="ks-combobox-trigger-';
            var id10 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 7, undefined, false);
            buffer += getExpressionUtil(id10, true);
            buffer += '"\r\n     class="';
            var config12 = {};
            var params13 = [];
            params13.push('trigger');
            config12.params = params13;
            var id11 = getPropertyOrRunCommandUtil(engine, scopes, config12, "getBaseCssClasses", 0, 8, true, undefined);
            buffer += id11;
            buffer += '">\r\n    <div class="';
            var config15 = {};
            var params16 = [];
            params16.push('trigger-inner');
            config15.params = params16;
            var id14 = getPropertyOrRunCommandUtil(engine, scopes, config15, "getBaseCssClasses", 0, 9, true, undefined);
            buffer += id14;
            buffer += '">&#x25BC;</div>\r\n</div>\r\n';
            return buffer;
        };
        buffer += runBlockCommandUtil(engine, scopes, config7, "if", 6);
        buffer += '\r\n\r\n<div class="';
        var config18 = {};
        var params19 = [];
        params19.push('input-wrap');
        config18.params = params19;
        var id17 = getPropertyOrRunCommandUtil(engine, scopes, config18, "getBaseCssClasses", 0, 13, true, undefined);
        buffer += id17;
        buffer += '">\r\n\r\n    <input id="ks-combobox-input-';
        var id20 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 15, undefined, false);
        buffer += getExpressionUtil(id20, true);
        buffer += '"\r\n           aria-haspopup="true"\r\n           aria-autocomplete="list"\r\n           aria-haspopup="true"\r\n           role="autocomplete"\r\n           aria-expanded="false"\r\n\r\n    ';
        var config21 = {};
        var params22 = [];
        var id23 = getPropertyOrRunCommandUtil(engine, scopes, {}, "disabled", 0, 22, undefined, true);
        params22.push(id23);
        config21.params = params22;
        config21.fn = function (scopes) {
            var buffer = "";
            buffer += '\r\n    disabled\r\n    ';
            return buffer;
        };
        buffer += runBlockCommandUtil(engine, scopes, config21, "if", 22);
        buffer += '\r\n\r\n    autocomplete="off"\r\n    class="';
        var config25 = {};
        var params26 = [];
        params26.push('input');
        config25.params = params26;
        var id24 = getPropertyOrRunCommandUtil(engine, scopes, config25, "getBaseCssClasses", 0, 27, true, undefined);
        buffer += id24;
        buffer += '"\r\n\r\n    value="';
        var id27 = getPropertyOrRunCommandUtil(engine, scopes, {}, "value", 0, 29, undefined, false);
        buffer += getExpressionUtil(id27, true);
        buffer += '"\r\n    />\r\n\r\n\r\n    <label id="ks-combobox-placeholder-';
        var id28 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 33, undefined, false);
        buffer += getExpressionUtil(id28, true);
        buffer += '"\r\n           for="ks-combobox-input-';
        var id29 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 34, undefined, false);
        buffer += getExpressionUtil(id29, true);
        buffer += '"\r\n            style=\'display:';
        var config30 = {};
        var params31 = [];
        var id32 = getPropertyOrRunCommandUtil(engine, scopes, {}, "value", 0, 35, undefined, true);
        params31.push(id32);
        config30.params = params31;
        config30.fn = function (scopes) {
            var buffer = "";
            buffer += 'none';
            return buffer;
        };
        config30.inverse = function (scopes) {
            var buffer = "";
            buffer += 'block';
            return buffer;
        };
        buffer += runBlockCommandUtil(engine, scopes, config30, "if", 35);
        buffer += ';\'\r\n    class="';
        var config34 = {};
        var params35 = [];
        params35.push('placeholder');
        config34.params = params35;
        var id33 = getPropertyOrRunCommandUtil(engine, scopes, config34, "getBaseCssClasses", 0, 36, true, undefined);
        buffer += id33;
        buffer += '">\r\n    ';
        var id36 = getPropertyOrRunCommandUtil(engine, scopes, {}, "placeholder", 0, 37, undefined, false);
        buffer += getExpressionUtil(id36, true);
        buffer += '\r\n    </label>\r\n</div>\r\n';
        return buffer;
    }
});