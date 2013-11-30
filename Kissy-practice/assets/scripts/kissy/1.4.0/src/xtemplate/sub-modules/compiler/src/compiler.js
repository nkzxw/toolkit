/**
 * translate ast to js function code
 * @author yiminghe@gmail.com
 * @ignore
 */
KISSY.add("xtemplate/compiler", function (S, parser, ast, XTemplateRuntime, undefined) {
    parser.yy = ast;

    var doubleReg = /\\*"/g,
        singleReg = /\\*'/g,
        arrayPush = [].push,
        variableId = 0,
        xtemplateId = 0;

    function guid(str) {
        return str + (variableId++);
    }

    function escapeString(str, isCode) {
        if (isCode) {
            str = escapeSingleQuoteInCodeString(str, false);
        } else {
            str = str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        }
        str = str.replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n').replace(/\t/g, '\\t');
        return str;
    }

    function escapeSingleQuoteInCodeString(str, isDouble) {
        return str.replace(isDouble ? doubleReg : singleReg, function (m) {
            // \ 's number ，用户显式转过 "\'" , "\\\'" 就不处理了，否则手动对 ` 加 \ 转义
            if (m.length % 2) {
                m = '\\' + m;
            }
            return m;
        });
    }

    function pushToArray(to, from) {
        arrayPush.apply(to, from);
    }

    function lastOfArray(arr) {
        return arr[arr.length - 1];
    }

    var gen = {
        // ------------ helper generation function start
        genFunction: function (statements, global, includes) {
            var source = [];
            if (!global) {
                source.push('function(scopes) {');
            }
            source.push('var buffer = ""' + (global ? ',' : ';'));
            if (global) {
                source.push('config = this.config,' +
                    // current xtemplate engine
                    'engine = this, ' +
                    'utils = config.utils;');

                var natives = '',
                    c,
                    utils = XTemplateRuntime.utils;

                for (c in utils) {
                    natives += c + 'Util = utils["' + c + '"],';
                }

                if (natives) {
                    source.push('var ' + natives.slice(0, natives.length - 1) + ';');
                }
            }
            if (statements) {
                for (var i = 0, len = statements.length; i < len; i++) {
                    pushToArray(source, this[statements[i].type](statements[i], includes));
                }
            }
            source.push('return buffer;');
            if (!global) {
                source.push('}');
                return source;
            } else {
                return {
                    params: ['scopes', 'S', 'undefined'],
                    source: source,
                    includes: includes
                };
            }
        },

        genId: function (idNode, tplNode, preserveUndefined, includes) {
            var source = [],
                depth = idNode.depth,
                idParts = idNode.parts,
                idName = guid('id'),
                self = this;

            // {{#each variable}} {{variable}}
            // {{command}}
            if (depth == 0) {
                var configNameCode = tplNode && self.genConfig(tplNode);
                var configName;
                if (configNameCode) {
                    configName = configNameCode[0];
                    pushToArray(source, configNameCode[1]);
                }
            }

            // variable {{variable.subVariable}}
            var idString = self.getIdStringFromIdParts(source, idParts);

            // collect includes modules
            if (includes && idString == 'include') {
                includes.push(tplNode.params[0].value);
            }

            source.push('var ' + idName +
                ' = getPropertyOrRunCommandUtil(engine,scopes,' +
                (configName || '{}') + ',"' +
                idString +
                '",' + depth + ',' + idNode.lineNumber +
                ',' + (tplNode && tplNode.escaped) +
                ',' + preserveUndefined + ');');

            return [idName, source];
        },

        genOpExpression: function (e, type) {
            var source = [],
                name1,
                name2,
                code1 = this[e.op1.type](e.op1),
                code2 = this[e.op2.type](e.op2);

            name1 = code1[0];
            name2 = code2[0];

            if (name1 && name2) {
                pushToArray(source, code1[1]);
                pushToArray(source, code2[1]);
                source.push(name1 + type + name2);
                return ['', source];
            }

            if (!name1 && !name2) {
                pushToArray(source, code1[1].slice(0, -1));
                pushToArray(source, code2[1].slice(0, -1));
                source.push('(' +
                    lastOfArray(code1[1]) +
                    ')' +
                    type +
                    '(' + lastOfArray(code2[1]) + ')');
                return ['', source];
            }

            if (name1 && !name2) {
                pushToArray(source, code1[1]);
                pushToArray(source, code2[1].slice(0, -1));
                source.push(name1 + type +
                    '(' +
                    lastOfArray(code2[1]) +
                    ')');
                return ['', source];
            }

            if (!name1 && name2) {
                pushToArray(source, code1[1].slice(0, -1));
                pushToArray(source, code2[1]);
                source.push('(' +
                    lastOfArray(code1[1]) +
                    ')' +
                    type + name2);
                return ['', source];
            }

            return undefined;
        },

        genConfig: function (tplNode) {
            var source = [],
                configName,
                params,
                hash,
                self = this;

            if (tplNode) {
                params = tplNode.params;
                hash = tplNode.hash;

                if (params || hash) {
                    configName = guid('config');
                    source.push('var ' + configName + ' = {};');
                }

                if (params) {
                    var paramsName = guid('params');
                    source.push('var ' + paramsName + ' = [];');
                    S.each(params, function (param) {
                        var nextIdNameCode = self[param.type](param);
                        if (nextIdNameCode[0]) {
                            pushToArray(source, nextIdNameCode[1]);
                            source.push(paramsName + '.push(' + nextIdNameCode[0] + ');')
                        } else {
                            pushToArray(source, nextIdNameCode[1].slice(0, -1));
                            source.push(paramsName + '.push(' + lastOfArray(nextIdNameCode[1]) + ');')
                        }
                    });
                    source.push(configName + '.params=' + paramsName + ';');
                }

                if (hash) {
                    var hashName = guid('hash');
                    source.push('var ' + hashName + ' = {};');
                    S.each(hash.value, function (v, key) {
                        var nextIdNameCode = self[v.type](v);
                        if (nextIdNameCode[0]) {
                            pushToArray(source, nextIdNameCode[1]);
                            source.push(hashName + '["' + key + '"] = ' + nextIdNameCode[0] + ';')
                        } else {
                            pushToArray(source, nextIdNameCode[1].slice(0, -1));
                            source.push(hashName + '["' + key + '"] = ' + lastOfArray(nextIdNameCode[1]) + ';')
                        }
                    });
                    source.push(configName + '.hash=' + hashName + ';');
                }
            }

            return [configName, source];
        },
        // ------------ helper generation function end

        conditionalOrExpression: function (e) {
            return this.genOpExpression(e, '||');
        },

        conditionalAndExpression: function (e) {
            return this.genOpExpression(e, '&&');
        },

        relationalExpression: function (e) {
            return this.genOpExpression(e, e.opType);
        },

        equalityExpression: function (e) {
            return this.genOpExpression(e, e.opType);
        },

        additiveExpression: function (e) {
            return this.genOpExpression(e, e.opType);
        },

        multiplicativeExpression: function (e) {
            return this.genOpExpression(e, e.opType);
        },

        unaryExpression: function (e) {
            var source = [],
                name,
                code = this[e.value.type](e.value);
            arrayPush.apply(source, code[1]);
            if (name = code[0]) {
                source.push(name + '=!' + name + ';');
            } else {
                source[source.length - 1] = '!' + lastOfArray(source);
            }
            return [name, source];
        },

        'string': function (e) {
            // same as contentNode.value
            return ['', ["'" + escapeString(e.value, true) + "'"]];
        },

        'number': function (e) {
            return ['', [e.value]];
        },

        'boolean': function (e) {
            return ['', [e.value]];
        },

        'id': function (e, topLevel) {
            // topLevel: {{n}}
            return this.genId(e, undefined, !topLevel);
        },

        'block': function (block) {
            var programNode = block.program,
                source = [],
                self = this,
                tplNode = block.tpl,
                configNameCode = self.genConfig(tplNode),
                configName = configNameCode[0],
                tplPath = tplNode.path,
                pathString = tplPath.string,
                inverseFn;

            pushToArray(source, configNameCode[1]);

            if (!configName) {
                configName = S.guid('config');
                source.push('var ' + configName + ' = {};');
            }

            source.push(configName + '.fn=' +
                self.genFunction(programNode.statements).join('\n') + ';');

            if (programNode.inverse) {
                inverseFn = self.genFunction(programNode.inverse).join('\n');
                source.push(configName + '.inverse=' + inverseFn + ';');
            }

            // support {{^
            // exchange fn with inverse
            if (tplNode.isInverted) {
                var tmp = guid('inverse');
                source.push('var ' + tmp + '=' + configName + '.fn;');
                source.push(configName + '.fn = ' + configName + '.inverse;');
                source.push(configName + '.inverse = ' + tmp + ';');
            }

            if (!tplNode.hash && !tplNode.params) {
                var parts = tplPath.parts;
                for (var i = 0; i < parts.length; i++) {
                    // {{x[d]}}
                    if (typeof parts[i] != 'string') {
                        pathString = self.getIdStringFromIdParts(source, parts);
                        break;
                    }
                }
            }

            source.push('buffer += runBlockCommandUtil(engine, scopes, ' +
                configName + ', ' +
                '"' + pathString + '", ' +
                tplPath.lineNumber + ');');
            return source;
        },

        'content': function (contentNode) {
            return ['buffer += \'' + escapeString(contentNode.value, false) + '\';'];
        },

        'tpl': function (tplNode, includes) {
            var source = [],
                genIdCode = this.genId(tplNode.path, tplNode, undefined, includes);
            pushToArray(source, genIdCode[1]);
            source.push('buffer += ' + genIdCode[0] + ';');
            return source;
        },

        'tplExpression': function (e) {
            var source = [],
                escaped = e.escaped,
                expressionOrVariable;
            var code = this[e.expression.type](e.expression, 1);
            if (code[0]) {
                pushToArray(source, code[1]);
                expressionOrVariable = code[0];
            } else {
                pushToArray(source, code[1].slice(0, -1));
                expressionOrVariable = lastOfArray(code[1]);
            }
            source.push('buffer += getExpressionUtil(' + expressionOrVariable + ',' + escaped + ');');
            return source;
        },

        // consider x[d]
        'getIdStringFromIdParts': function (source, idParts) {
            var idString = '',
                self = this,
                i,
                idPart,
                idPartType,
                nextIdNameCode,
                first = true;
            for (i = 0; i < idParts.length; i++) {
                idPart = idParts[i];
                idPartType = idPart.type;
                if (!first) {
                    idString += '.';
                }
                if (idPartType) {
                    nextIdNameCode = self[idPartType](idPart);
                    if (nextIdNameCode[0]) {
                        pushToArray(source, nextIdNameCode[1]);
                        idString += '"+' + nextIdNameCode[0] + '+"';
                        first = true
                    }
                } else {
                    // number or string
                    idString += idPart;
                    first = false;
                }
            }
            return idString;
        }
    };

    var compiler;

    /**
     * compiler for xtemplate
     * @class KISSY.XTemplate.compiler
     * @singleton
     */
    return compiler = {
        /**
         * get ast of template
         * @param {String} tpl
         * @return {Object}
         */
        parse: function (tpl) {
            return parser.parse(tpl);
        },
        /**
         * get template function string
         * @param {String} tpl
         * @return {String}
         */
        compileToStr: function (tpl) {
            var func = this.compile(tpl);
            return 'function(' + func.params.join(',') + '){\n' +
                func.source.join('\n') +
                '}';
        },
        compileToModule: function (tpl, includes) {
            var func = this.compile(tpl, includes);
            var requires = '';
            if (includes && includes.length) {
                requires += includes.join('","');
                requires = ', {requires:["' + requires + '"]}';
            }
            return '/** Compiled By kissy-xtemplate */\n' +
                'KISSY.add(function(){ return function(' + func.params.join(',') + '){\n' +
                func.source.join('\n') +
                '};}' + requires + ');';
        },
        /**
         * get template function json format
         * @param {String} tpl
         * @param {String[]} [includes] included modules
         * @return {Object}
         */
        compile: function (tpl, includes) {
            var root = this.parse(tpl);
            variableId = 0;
            return gen.genFunction(root.statements, true, includes);
        },
        /**
         * get template function
         * @param {String} tpl
         * @param {Object} config
         * @param {String} config.name template file name
         * @return {Function}
         */
        compileToFn: function (tpl, config) {
            var code = compiler.compile(tpl);
            config = config || {};
            var sourceURL = 'sourceURL=' + (config.name ?
                config.name :
                ('xtemplate' + (xtemplateId++))) +
                '.js';
            // eval is not ok for eval("(function(){})") ie
            return Function.apply(null, []
                .concat(code.params)
                .concat(code.source.join('\n') +
                    // old chrome
                    '\n//@ ' + sourceURL +
                    // modern browser
                    '\n//# ' + sourceURL));
        }
    };
}, {
    requires: ['./compiler/parser', './compiler/ast', 'xtemplate/runtime']
});

/*
 todo:
 need oop, new Source().gen()
 */