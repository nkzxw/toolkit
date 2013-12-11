/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Nov 12 12:32
*/
KISSY.add("xtemplate/compiler/parser",function(){var g={},a=KISSY,h=function(c){this.rules=[];a.mix(this,c);this.resetInput(this.input)};h.prototype={constructor:function(c){this.rules=[];a.mix(this,c);this.resetInput(this.input)},resetInput:function(c){a.mix(this,{input:c,matched:"",stateStack:[h.STATIC.INITIAL],match:"",text:"",firstLine:1,lineNumber:1,lastLine:1,firstColumn:1,lastColumn:1})},getCurrentRules:function(){var c=this.stateStack[this.stateStack.length-1],b=[],c=this.mapState(c);a.each(this.rules,
function(q){var f=q.state||q[3];f?a.inArray(c,f)&&b.push(q):c==h.STATIC.INITIAL&&b.push(q)});return b},pushState:function(c){this.stateStack.push(c)},popState:function(){return this.stateStack.pop()},getStateStack:function(){return this.stateStack},showDebugInfo:function(){var c=h.STATIC.DEBUG_CONTEXT_LIMIT,b=this.matched,a=this.match,f=this.input,b=b.slice(0,b.length-a.length),b=(b.length>c?"...":"")+b.slice(-c).replace(/\n/," "),a=a+f,a=a.slice(0,c)+(a.length>c?"...":"");return b+a+"\n"+Array(b.length+
1).join("-")+"^"},mapSymbol:function(c){var b=this.symbolMap;return!b?c:b[c]||(b[c]=++this.symbolId)},mapReverseSymbol:function(c){var b=this.symbolMap,a,f=this.reverseSymbolMap;if(!f&&b)for(a in f=this.reverseSymbolMap={},b)f[b[a]]=a;return f?f[c]:c},mapState:function(c){var b=this.stateMap;return!b?c:b[c]||(b[c]=++this.stateId)},lex:function(){var c=this.input,b,d,f,l=this.getCurrentRules();this.match=this.text="";if(!c)return this.mapSymbol(h.STATIC.END_TAG);for(b=0;b<l.length;b++){d=l[b];var g=
d.token||d[0];f=d.action||d[2]||void 0;if(d=c.match(d.regexp||d[1])){if(b=d[0].match(/\n.*/g))this.lineNumber+=b.length;a.mix(this,{firstLine:this.lastLine,lastLine:this.lineNumber+1,firstColumn:this.lastColumn,lastColumn:b?b[b.length-1].length-1:this.lastColumn+d[0].length});b=this.match=d[0];this.matches=d;this.text=b;this.matched+=b;f=f&&f.call(this);f=void 0==f?g:this.mapSymbol(f);this.input=c=c.slice(b.length);return f?f:this.lex()}}"lex error at line "+this.lineNumber+":\n"+this.showDebugInfo()}};
h.STATIC={INITIAL:"I",DEBUG_CONTEXT_LIMIT:20,END_TAG:"$EOF"};var d=new h({rules:[[0,/^[\s\S]*?(?={{)/,function(){var c=this.text,b,a=0;if(b=c.match(/\\+$/))a=b[0].length;a%2?this.pushState("et"):this.pushState("t");a&&(c=c.slice(0,-1));this.text=c;return"CONTENT"}],[2,/^[\s\S]+/,0],[2,/^[\s\S]{2,}?(?:(?={{)|$)/,function(){this.popState()},["et"]],[3,/^{{(?:#|@|\^)/,0,["t"]],[4,/^{{\//,0,["t"]],[5,/^{{\s*else\s*}}/,function(){this.popState()},["t"]],[0,/^{{![\s\S]*?}}/,function(){this.popState()},
["t"]],[2,/^{{%([\s\S]*?)%}}/,function(){this.text=this.matches[1]||"";this.popState()},["t"]],[6,/^{{{?/,0,["t"]],[0,/^\s+/,0,["t"]],[7,/^}}}?/,function(){this.popState()},["t"]],[8,/^\(/,0,["t"]],[9,/^\)/,0,["t"]],[10,/^\|\|/,0,["t"]],[11,/^&&/,0,["t"]],[12,/^===/,0,["t"]],[13,/^!==/,0,["t"]],[15,/^>=/,0,["t"]],[17,/^<=/,0,["t"]],[14,/^>/,0,["t"]],[16,/^</,0,["t"]],[18,/^\+/,0,["t"]],[19,/^-/,0,["t"]],[20,/^\*/,0,["t"]],[21,/^\//,0,["t"]],[22,/^%/,0,["t"]],[23,/^!/,0,["t"]],[24,/^"(\\[\s\S]|[^"])*"/,
function(){this.text=this.text.slice(1,-1).replace(/\\"/g,'"')},["t"]],[24,/^'(\\[\s\S]|[^'])*'/,function(){this.text=this.text.slice(1,-1).replace(/\\'/g,"'")},["t"]],[25,/^true/,0,["t"]],[25,/^false/,0,["t"]],[26,/^\d+(?:\.\d+)?(?:e-?\d+)?/i,0,["t"]],[27,/^=/,0,["t"]],[28,/^\.(?=})/,0,["t"]],[28,/^\.\./,function(){this.pushState("ws")},["t"]],[29,/^\//,function(){this.popState()},["ws"]],[29,/^\./,0,["t"]],[30,/^\[/,0,["t"]],[31,/^\]/,0,["t"]],[28,/^[a-zA-Z0-9_$]+/,0,["t"]],[32,/^./,0,["t"]]]});
g.lexer=d;d.symbolMap={$EOF:1,CONTENT:2,OPEN_BLOCK:3,OPEN_CLOSE_BLOCK:4,INVERSE:5,OPEN_TPL:6,CLOSE:7,LPAREN:8,RPAREN:9,OR:10,AND:11,LOGIC_EQUALS:12,LOGIC_NOT_EQUALS:13,GT:14,GE:15,LT:16,LE:17,PLUS:18,MINUS:19,MULTIPLY:20,DIVIDE:21,MODULUS:22,NOT:23,STRING:24,BOOLEAN:25,NUMBER:26,EQUALS:27,ID:28,SEP:29,REF_START:30,REF_END:31,INVALID:32,$START:33,program:34,statements:35,statement:36,openBlock:37,closeBlock:38,tpl:39,inBlockTpl:40,path:41,inTpl:42,Expression:43,params:44,hash:45,param:46,ConditionalOrExpression:47,
ConditionalAndExpression:48,EqualityExpression:49,RelationalExpression:50,AdditiveExpression:51,MultiplicativeExpression:52,UnaryExpression:53,PrimaryExpression:54,hashSegments:55,hashSegment:56,pathSegments:57};g.productions=[[33,[34]],[34,[35,5,35],function(){return new this.yy.ProgramNode(this.lexer.lineNumber,this.$1,this.$3)}],[34,[35],function(){return new this.yy.ProgramNode(this.lexer.lineNumber,this.$1)}],[35,[36],function(){return[this.$1]}],[35,[35,36],function(){this.$1.push(this.$2)}],
[36,[37,34,38],function(){return new this.yy.BlockNode(this.lexer.lineNumber,this.$1,this.$2,this.$3)}],[36,[39]],[36,[2],function(){return new this.yy.ContentNode(this.lexer.lineNumber,this.$1)}],[40,[41],function(){return new this.yy.TplNode(this.lexer.lineNumber,this.$1)}],[40,[42]],[37,[3,40,7],function(){"^"==this.$1.charAt(this.$1.length-1)&&(this.$2.isInverted=1);return this.$2}],[38,[4,41,7],function(){return this.$2}],[39,[6,42,7],function(){3===this.$1.length&&(this.$2.escaped=!1);return this.$2}],
[39,[6,43,7],function(){var c=new this.yy.TplExpressionNode(this.lexer.lineNumber,this.$2);3===this.$1.length&&(c.escaped=!1);return c}],[42,[41,44,45],function(){return new this.yy.TplNode(this.lexer.lineNumber,this.$1,this.$2,this.$3)}],[42,[41,44],function(){return new this.yy.TplNode(this.lexer.lineNumber,this.$1,this.$2)}],[42,[41,45],function(){return new this.yy.TplNode(this.lexer.lineNumber,this.$1,null,this.$2)}],[44,[44,46],function(){this.$1.push(this.$2)}],[44,[46],function(){return[this.$1]}],
[46,[43]],[43,[47]],[47,[48]],[47,[47,10,48],function(){return new this.yy.ConditionalOrExpression(this.$1,this.$3)}],[48,[49]],[48,[48,11,49],function(){return new this.yy.ConditionalAndExpression(this.$1,this.$3)}],[49,[50]],[49,[49,12,50],function(){return new this.yy.EqualityExpression(this.$1,"===",this.$3)}],[49,[49,13,50],function(){return new this.yy.EqualityExpression(this.$1,"!==",this.$3)}],[50,[51]],[50,[50,16,51],function(){return new this.yy.RelationalExpression(this.$1,"<",this.$3)}],
[50,[50,14,51],function(){return new this.yy.RelationalExpression(this.$1,">",this.$3)}],[50,[50,17,51],function(){return new this.yy.RelationalExpression(this.$1,"<=",this.$3)}],[50,[50,15,51],function(){return new this.yy.RelationalExpression(this.$1,">=",this.$3)}],[51,[52]],[51,[51,18,52],function(){return new this.yy.AdditiveExpression(this.$1,"+",this.$3)}],[51,[51,19,52],function(){return new this.yy.AdditiveExpression(this.$1,"-",this.$3)}],[52,[53]],[52,[52,20,53],function(){return new this.yy.MultiplicativeExpression(this.$1,
"*",this.$3)}],[52,[52,21,53],function(){return new this.yy.MultiplicativeExpression(this.$1,"/",this.$3)}],[52,[52,22,53],function(){return new this.yy.MultiplicativeExpression(this.$1,"%",this.$3)}],[53,[23,53],function(){return new this.yy.UnaryExpression(this.$1)}],[53,[54]],[54,[24],function(){return new this.yy.StringNode(this.lexer.lineNumber,this.$1)}],[54,[26],function(){return new this.yy.NumberNode(this.lexer.lineNumber,this.$1)}],[54,[25],function(){return new this.yy.BooleanNode(this.lexer.lineNumber,
this.$1)}],[54,[41]],[54,[8,43,9],function(){return this.$2}],[45,[55],function(){return new this.yy.HashNode(this.lexer.lineNumber,this.$1)}],[55,[55,56],function(){this.$1.push(this.$2)}],[55,[56],function(){return[this.$1]}],[56,[28,27,43],function(){return[this.$1,this.$3]}],[41,[57],function(){return new this.yy.IdNode(this.lexer.lineNumber,this.$1)}],[57,[57,29,28],function(){this.$1.push(this.$3)}],[57,[57,30,43,31],function(){this.$1.push(this.$3)}],[57,[57,29,26],function(){this.$1.push(this.$3)}],
[57,[28],function(){return[this.$1]}]];g.table={gotos:{"0":{34:4,35:5,36:6,37:7,39:8},2:{40:10,41:11,42:12,57:13},3:{41:19,42:20,43:21,47:22,48:23,49:24,50:25,51:26,52:27,53:28,54:29,57:13},5:{36:31,37:7,39:8},7:{34:32,35:5,36:6,37:7,39:8},11:{41:35,43:36,44:37,45:38,46:39,47:22,48:23,49:24,50:25,51:26,52:27,53:28,54:29,55:40,56:41,57:13},14:{41:35,43:44,47:22,48:23,49:24,50:25,51:26,52:27,53:28,54:29,57:13},15:{41:35,53:45,54:29,57:13},19:{41:35,43:36,44:37,45:38,46:39,47:22,48:23,49:24,50:25,51:26,
52:27,53:28,54:29,55:40,56:41,57:13},30:{35:61,36:6,37:7,39:8},32:{38:63},37:{41:35,43:36,45:65,46:66,47:22,48:23,49:24,50:25,51:26,52:27,53:28,54:29,55:40,56:41,57:13},40:{56:68},43:{41:35,43:71,47:22,48:23,49:24,50:25,51:26,52:27,53:28,54:29,57:13},48:{41:35,48:73,49:24,50:25,51:26,52:27,53:28,54:29,57:13},49:{41:35,49:74,50:25,51:26,52:27,53:28,54:29,57:13},50:{41:35,50:75,51:26,52:27,53:28,54:29,57:13},51:{41:35,50:76,51:26,52:27,53:28,54:29,57:13},52:{41:35,51:77,52:27,53:28,54:29,57:13},53:{41:35,
51:78,52:27,53:28,54:29,57:13},54:{41:35,51:79,52:27,53:28,54:29,57:13},55:{41:35,51:80,52:27,53:28,54:29,57:13},56:{41:35,52:81,53:28,54:29,57:13},57:{41:35,52:82,53:28,54:29,57:13},58:{41:35,53:83,54:29,57:13},59:{41:35,53:84,54:29,57:13},60:{41:35,53:85,54:29,57:13},61:{36:31,37:7,39:8},62:{41:86,57:13},64:{41:35,43:87,47:22,48:23,49:24,50:25,51:26,52:27,53:28,54:29,57:13}},action:{"0":{2:[1,void 0,1],3:[1,void 0,2],6:[1,void 0,3]},1:{1:[2,7],2:[2,7],3:[2,7],4:[2,7],5:[2,7],6:[2,7]},2:{28:[1,void 0,
9]},3:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},4:{1:[0]},5:{1:[2,2],2:[1,void 0,1],3:[1,void 0,2],4:[2,2],5:[1,void 0,30],6:[1,void 0,3]},6:{1:[2,3],2:[2,3],3:[2,3],4:[2,3],5:[2,3],6:[2,3]},7:{2:[1,void 0,1],3:[1,void 0,2],6:[1,void 0,3]},8:{1:[2,6],2:[2,6],3:[2,6],4:[2,6],5:[2,6],6:[2,6]},9:{7:[2,55],8:[2,55],9:[2,55],10:[2,55],11:[2,55],12:[2,55],13:[2,55],14:[2,55],15:[2,55],16:[2,55],17:[2,55],18:[2,55],19:[2,55],20:[2,55],21:[2,55],
22:[2,55],23:[2,55],24:[2,55],25:[2,55],26:[2,55],28:[2,55],29:[2,55],30:[2,55],31:[2,55]},10:{7:[1,void 0,33]},11:{7:[2,8],8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,34]},12:{7:[2,9]},13:{7:[2,51],8:[2,51],9:[2,51],10:[2,51],11:[2,51],12:[2,51],13:[2,51],14:[2,51],15:[2,51],16:[2,51],17:[2,51],18:[2,51],19:[2,51],20:[2,51],21:[2,51],22:[2,51],23:[2,51],24:[2,51],25:[2,51],26:[2,51],28:[2,51],29:[1,void 0,42],30:[1,void 0,43],31:[2,51]},14:{8:[1,
void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},15:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},16:{7:[2,42],8:[2,42],9:[2,42],10:[2,42],11:[2,42],12:[2,42],13:[2,42],14:[2,42],15:[2,42],16:[2,42],17:[2,42],18:[2,42],19:[2,42],20:[2,42],21:[2,42],22:[2,42],23:[2,42],24:[2,42],25:[2,42],26:[2,42],28:[2,42],31:[2,42]},17:{7:[2,44],8:[2,44],9:[2,44],10:[2,44],11:[2,44],12:[2,44],13:[2,44],14:[2,44],
15:[2,44],16:[2,44],17:[2,44],18:[2,44],19:[2,44],20:[2,44],21:[2,44],22:[2,44],23:[2,44],24:[2,44],25:[2,44],26:[2,44],28:[2,44],31:[2,44]},18:{7:[2,43],8:[2,43],9:[2,43],10:[2,43],11:[2,43],12:[2,43],13:[2,43],14:[2,43],15:[2,43],16:[2,43],17:[2,43],18:[2,43],19:[2,43],20:[2,43],21:[2,43],22:[2,43],23:[2,43],24:[2,43],25:[2,43],26:[2,43],28:[2,43],31:[2,43]},19:{7:[2,45],8:[1,void 0,14],10:[2,45],11:[2,45],12:[2,45],13:[2,45],14:[2,45],15:[2,45],16:[2,45],17:[2,45],18:[2,45],19:[2,45],20:[2,45],
21:[2,45],22:[2,45],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,34]},20:{7:[1,void 0,46]},21:{7:[1,void 0,47]},22:{7:[2,20],8:[2,20],9:[2,20],10:[1,void 0,48],23:[2,20],24:[2,20],25:[2,20],26:[2,20],28:[2,20],31:[2,20]},23:{7:[2,21],8:[2,21],9:[2,21],10:[2,21],11:[1,void 0,49],23:[2,21],24:[2,21],25:[2,21],26:[2,21],28:[2,21],31:[2,21]},24:{7:[2,23],8:[2,23],9:[2,23],10:[2,23],11:[2,23],12:[1,void 0,50],13:[1,void 0,51],23:[2,23],24:[2,23],25:[2,23],26:[2,23],
28:[2,23],31:[2,23]},25:{7:[2,25],8:[2,25],9:[2,25],10:[2,25],11:[2,25],12:[2,25],13:[2,25],14:[1,void 0,52],15:[1,void 0,53],16:[1,void 0,54],17:[1,void 0,55],23:[2,25],24:[2,25],25:[2,25],26:[2,25],28:[2,25],31:[2,25]},26:{7:[2,28],8:[2,28],9:[2,28],10:[2,28],11:[2,28],12:[2,28],13:[2,28],14:[2,28],15:[2,28],16:[2,28],17:[2,28],18:[1,void 0,56],19:[1,void 0,57],23:[2,28],24:[2,28],25:[2,28],26:[2,28],28:[2,28],31:[2,28]},27:{7:[2,33],8:[2,33],9:[2,33],10:[2,33],11:[2,33],12:[2,33],13:[2,33],14:[2,
33],15:[2,33],16:[2,33],17:[2,33],18:[2,33],19:[2,33],20:[1,void 0,58],21:[1,void 0,59],22:[1,void 0,60],23:[2,33],24:[2,33],25:[2,33],26:[2,33],28:[2,33],31:[2,33]},28:{7:[2,36],8:[2,36],9:[2,36],10:[2,36],11:[2,36],12:[2,36],13:[2,36],14:[2,36],15:[2,36],16:[2,36],17:[2,36],18:[2,36],19:[2,36],20:[2,36],21:[2,36],22:[2,36],23:[2,36],24:[2,36],25:[2,36],26:[2,36],28:[2,36],31:[2,36]},29:{7:[2,41],8:[2,41],9:[2,41],10:[2,41],11:[2,41],12:[2,41],13:[2,41],14:[2,41],15:[2,41],16:[2,41],17:[2,41],18:[2,
41],19:[2,41],20:[2,41],21:[2,41],22:[2,41],23:[2,41],24:[2,41],25:[2,41],26:[2,41],28:[2,41],31:[2,41]},30:{2:[1,void 0,1],3:[1,void 0,2],6:[1,void 0,3]},31:{1:[2,4],2:[2,4],3:[2,4],4:[2,4],5:[2,4],6:[2,4]},32:{4:[1,void 0,62]},33:{2:[2,10],3:[2,10],6:[2,10]},34:{7:[2,55],8:[2,55],10:[2,55],11:[2,55],12:[2,55],13:[2,55],14:[2,55],15:[2,55],16:[2,55],17:[2,55],18:[2,55],19:[2,55],20:[2,55],21:[2,55],22:[2,55],23:[2,55],24:[2,55],25:[2,55],26:[2,55],27:[1,void 0,64],28:[2,55],29:[2,55],30:[2,55]},
35:{7:[2,45],8:[2,45],9:[2,45],10:[2,45],11:[2,45],12:[2,45],13:[2,45],14:[2,45],15:[2,45],16:[2,45],17:[2,45],18:[2,45],19:[2,45],20:[2,45],21:[2,45],22:[2,45],23:[2,45],24:[2,45],25:[2,45],26:[2,45],28:[2,45],31:[2,45]},36:{7:[2,19],8:[2,19],23:[2,19],24:[2,19],25:[2,19],26:[2,19],28:[2,19]},37:{7:[2,15],8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,34]},38:{7:[2,16]},39:{7:[2,18],8:[2,18],23:[2,18],24:[2,18],25:[2,18],26:[2,18],28:[2,18]},40:{7:[2,
47],28:[1,void 0,67]},41:{7:[2,49],28:[2,49]},42:{26:[1,void 0,69],28:[1,void 0,70]},43:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},44:{9:[1,void 0,72]},45:{7:[2,40],8:[2,40],9:[2,40],10:[2,40],11:[2,40],12:[2,40],13:[2,40],14:[2,40],15:[2,40],16:[2,40],17:[2,40],18:[2,40],19:[2,40],20:[2,40],21:[2,40],22:[2,40],23:[2,40],24:[2,40],25:[2,40],26:[2,40],28:[2,40],31:[2,40]},46:{1:[2,12],2:[2,12],3:[2,12],4:[2,12],5:[2,12],6:[2,12]},47:{1:[2,
13],2:[2,13],3:[2,13],4:[2,13],5:[2,13],6:[2,13]},48:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},49:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},50:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},51:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},52:{8:[1,void 0,14],23:[1,void 0,
15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},53:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},54:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},55:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},56:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},57:{8:[1,
void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},58:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},59:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},60:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},61:{1:[2,1],2:[1,void 0,1],3:[1,void 0,2],4:[2,1],6:[1,void 0,3]},62:{28:[1,void 0,9]},63:{1:[2,
5],2:[2,5],3:[2,5],4:[2,5],5:[2,5],6:[2,5]},64:{8:[1,void 0,14],23:[1,void 0,15],24:[1,void 0,16],25:[1,void 0,17],26:[1,void 0,18],28:[1,void 0,9]},65:{7:[2,14]},66:{7:[2,17],8:[2,17],23:[2,17],24:[2,17],25:[2,17],26:[2,17],28:[2,17]},67:{27:[1,void 0,64]},68:{7:[2,48],28:[2,48]},69:{7:[2,54],8:[2,54],9:[2,54],10:[2,54],11:[2,54],12:[2,54],13:[2,54],14:[2,54],15:[2,54],16:[2,54],17:[2,54],18:[2,54],19:[2,54],20:[2,54],21:[2,54],22:[2,54],23:[2,54],24:[2,54],25:[2,54],26:[2,54],28:[2,54],29:[2,54],
30:[2,54],31:[2,54]},70:{7:[2,52],8:[2,52],9:[2,52],10:[2,52],11:[2,52],12:[2,52],13:[2,52],14:[2,52],15:[2,52],16:[2,52],17:[2,52],18:[2,52],19:[2,52],20:[2,52],21:[2,52],22:[2,52],23:[2,52],24:[2,52],25:[2,52],26:[2,52],28:[2,52],29:[2,52],30:[2,52],31:[2,52]},71:{31:[1,void 0,88]},72:{7:[2,46],8:[2,46],9:[2,46],10:[2,46],11:[2,46],12:[2,46],13:[2,46],14:[2,46],15:[2,46],16:[2,46],17:[2,46],18:[2,46],19:[2,46],20:[2,46],21:[2,46],22:[2,46],23:[2,46],24:[2,46],25:[2,46],26:[2,46],28:[2,46],31:[2,
46]},73:{7:[2,22],8:[2,22],9:[2,22],10:[2,22],11:[1,void 0,49],23:[2,22],24:[2,22],25:[2,22],26:[2,22],28:[2,22],31:[2,22]},74:{7:[2,24],8:[2,24],9:[2,24],10:[2,24],11:[2,24],12:[1,void 0,50],13:[1,void 0,51],23:[2,24],24:[2,24],25:[2,24],26:[2,24],28:[2,24],31:[2,24]},75:{7:[2,26],8:[2,26],9:[2,26],10:[2,26],11:[2,26],12:[2,26],13:[2,26],14:[1,void 0,52],15:[1,void 0,53],16:[1,void 0,54],17:[1,void 0,55],23:[2,26],24:[2,26],25:[2,26],26:[2,26],28:[2,26],31:[2,26]},76:{7:[2,27],8:[2,27],9:[2,27],
10:[2,27],11:[2,27],12:[2,27],13:[2,27],14:[1,void 0,52],15:[1,void 0,53],16:[1,void 0,54],17:[1,void 0,55],23:[2,27],24:[2,27],25:[2,27],26:[2,27],28:[2,27],31:[2,27]},77:{7:[2,30],8:[2,30],9:[2,30],10:[2,30],11:[2,30],12:[2,30],13:[2,30],14:[2,30],15:[2,30],16:[2,30],17:[2,30],18:[1,void 0,56],19:[1,void 0,57],23:[2,30],24:[2,30],25:[2,30],26:[2,30],28:[2,30],31:[2,30]},78:{7:[2,32],8:[2,32],9:[2,32],10:[2,32],11:[2,32],12:[2,32],13:[2,32],14:[2,32],15:[2,32],16:[2,32],17:[2,32],18:[1,void 0,56],
19:[1,void 0,57],23:[2,32],24:[2,32],25:[2,32],26:[2,32],28:[2,32],31:[2,32]},79:{7:[2,29],8:[2,29],9:[2,29],10:[2,29],11:[2,29],12:[2,29],13:[2,29],14:[2,29],15:[2,29],16:[2,29],17:[2,29],18:[1,void 0,56],19:[1,void 0,57],23:[2,29],24:[2,29],25:[2,29],26:[2,29],28:[2,29],31:[2,29]},80:{7:[2,31],8:[2,31],9:[2,31],10:[2,31],11:[2,31],12:[2,31],13:[2,31],14:[2,31],15:[2,31],16:[2,31],17:[2,31],18:[1,void 0,56],19:[1,void 0,57],23:[2,31],24:[2,31],25:[2,31],26:[2,31],28:[2,31],31:[2,31]},81:{7:[2,34],
8:[2,34],9:[2,34],10:[2,34],11:[2,34],12:[2,34],13:[2,34],14:[2,34],15:[2,34],16:[2,34],17:[2,34],18:[2,34],19:[2,34],20:[1,void 0,58],21:[1,void 0,59],22:[1,void 0,60],23:[2,34],24:[2,34],25:[2,34],26:[2,34],28:[2,34],31:[2,34]},82:{7:[2,35],8:[2,35],9:[2,35],10:[2,35],11:[2,35],12:[2,35],13:[2,35],14:[2,35],15:[2,35],16:[2,35],17:[2,35],18:[2,35],19:[2,35],20:[1,void 0,58],21:[1,void 0,59],22:[1,void 0,60],23:[2,35],24:[2,35],25:[2,35],26:[2,35],28:[2,35],31:[2,35]},83:{7:[2,37],8:[2,37],9:[2,37],
10:[2,37],11:[2,37],12:[2,37],13:[2,37],14:[2,37],15:[2,37],16:[2,37],17:[2,37],18:[2,37],19:[2,37],20:[2,37],21:[2,37],22:[2,37],23:[2,37],24:[2,37],25:[2,37],26:[2,37],28:[2,37],31:[2,37]},84:{7:[2,38],8:[2,38],9:[2,38],10:[2,38],11:[2,38],12:[2,38],13:[2,38],14:[2,38],15:[2,38],16:[2,38],17:[2,38],18:[2,38],19:[2,38],20:[2,38],21:[2,38],22:[2,38],23:[2,38],24:[2,38],25:[2,38],26:[2,38],28:[2,38],31:[2,38]},85:{7:[2,39],8:[2,39],9:[2,39],10:[2,39],11:[2,39],12:[2,39],13:[2,39],14:[2,39],15:[2,39],
16:[2,39],17:[2,39],18:[2,39],19:[2,39],20:[2,39],21:[2,39],22:[2,39],23:[2,39],24:[2,39],25:[2,39],26:[2,39],28:[2,39],31:[2,39]},86:{7:[1,void 0,89]},87:{7:[2,50],28:[2,50]},88:{7:[2,53],8:[2,53],9:[2,53],10:[2,53],11:[2,53],12:[2,53],13:[2,53],14:[2,53],15:[2,53],16:[2,53],17:[2,53],18:[2,53],19:[2,53],20:[2,53],21:[2,53],22:[2,53],23:[2,53],24:[2,53],25:[2,53],26:[2,53],28:[2,53],29:[2,53],30:[2,53],31:[2,53]},89:{1:[2,11],2:[2,11],3:[2,11],4:[2,11],5:[2,11],6:[2,11]}}};g.parse=function(c){var b=
this,d=b.lexer,f,h,g,n=b.table,t=n.gotos,n=n.action,o=b.productions,m=[null],k=[0];for(d.resetInput(c);;){f=k[k.length-1];h||(h=d.lex());if(!h)return"it is not a valid input: "+c,"error",!1;g=n[f]&&n[f][h];if(!g){var s=[];n[f]&&a.each(n[f],function(e,p){s.push(b.lexer.mapReverseSymbol(p))});c="Syntax error at line "+d.lineNumber+":\n"+d.showDebugInfo()+"\nexpect "+s.join(", ");c;return!1}switch(g[0]){case 1:k.push(h);m.push(d.text);k.push(g[2]);h=null;break;case 2:var e=o[g[1]];f=e.symbol||e[0];g=
e.action||e[2];var p=(e.rhs||e[1]).length,u=0,v=void 0,e=m[m.length-p];for(b.$$=e;u<p;u++)b["$"+(p-u)]=m[m.length-1-u];g&&(v=g.call(b));e=void 0!==v?v:b.$$;p&&(k=k.slice(0,-2*p),m=m.slice(0,-1*p));k.push(f);m.push(e);k.push(t[k[k.length-2]][k[k.length-1]]);break;case 0:return e}}};return g});
KISSY.add("xtemplate/compiler/ast",function(g){var a={ProgramNode:function(a,d,c){this.lineNumber=a;this.statements=d;this.inverse=c}};a.ProgramNode.prototype.type="program";a.BlockNode=function(a,d,c,b){b=b.parts;g.equals(d.path.parts,b)||(b="Syntax error at line "+a+":\nexpect {{/"+d.path.parts+"}} not {{/"+b+"}}",b);this.lineNumber=a;this.tpl=d;this.program=c};a.BlockNode.prototype.type="block";a.TplNode=function(a,d,c,b){this.lineNumber=a;this.path=d;this.params=c;this.hash=b;this.escaped=!0;
this.isInverted=!1};a.TplNode.prototype.type="tpl";a.TplExpressionNode=function(a,d){this.lineNumber=a;this.expression=d;this.escaped=!0};a.TplExpressionNode.prototype.type="tplExpression";a.ContentNode=function(a,d){this.lineNumber=a;this.value=d};a.ContentNode.prototype.type="content";a.UnaryExpression=function(a){this.value=a};a.UnaryExpression.prototype.type="unaryExpression";a.MultiplicativeExpression=function(a,d,c){this.op1=a;this.opType=d;this.op2=c};a.MultiplicativeExpression.prototype.type=
"multiplicativeExpression";a.AdditiveExpression=function(a,d,c){this.op1=a;this.opType=d;this.op2=c};a.AdditiveExpression.prototype.type="additiveExpression";a.RelationalExpression=function(a,d,c){this.op1=a;this.opType=d;this.op2=c};a.RelationalExpression.prototype.type="relationalExpression";a.EqualityExpression=function(a,d,c){this.op1=a;this.opType=d;this.op2=c};a.EqualityExpression.prototype.type="equalityExpression";a.ConditionalAndExpression=function(a,d){this.op1=a;this.op2=d};a.ConditionalAndExpression.prototype.type=
"conditionalAndExpression";a.ConditionalOrExpression=function(a,d){this.op1=a;this.op2=d};a.ConditionalOrExpression.prototype.type="conditionalOrExpression";a.StringNode=function(a,d){this.lineNumber=a;this.value=d};a.StringNode.prototype.type="string";a.NumberNode=function(a,d){this.lineNumber=a;this.value=d};a.NumberNode.prototype.type="number";a.BooleanNode=function(a,d){this.lineNumber=a;this.value=d};a.BooleanNode.prototype.type="boolean";a.HashNode=function(a,d){var c={};this.lineNumber=a;g.each(d,
function(a){c[a[0]]=a[1]});this.value=c};a.HashNode.prototype.type="hash";a.IdNode=function(a,d){var c=[],b=0;this.lineNumber=a;g.each(d,function(a){".."==a?b++:c.push(a)});this.parts=c;this.string=c.join(".");this.depth=b};a.IdNode.prototype.type="id";return a});
KISSY.add("xtemplate/compiler",function(g,a,h,d,c){function b(e,a){e=a?q(e,!1):e.replace(/\\/g,"\\\\").replace(/'/g,"\\'");return e=e.replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")}function q(e,a){return e.replace(a?w:n,function(e){e.length%2&&(e="\\"+e);return e})}function f(e,a){t.apply(e,a)}function l(e){return e[e.length-1]}a.yy=h;var w=/\\*"/g,n=/\\*'/g,t=[].push,o=0,m=0,k={genFunction:function(e,a,c){var b=[];a||b.push("function(scopes) {");b.push('var buffer = ""'+(a?",":";"));
if(a){b.push("config = this.config,engine = this, utils = config.utils;");var j="",i,r=d.utils;for(i in r)j+=i+'Util = utils["'+i+'"],';j&&b.push("var "+j.slice(0,j.length-1)+";")}if(e){j=0;for(i=e.length;j<i;j++)f(b,this[e[j].type](e[j],c))}b.push("return buffer;");return!a?(b.push("}"),b):{params:["scopes","S","undefined"],source:b,includes:c}},genId:function(e,a,b,c){var d=[],i=e.depth,r=e.parts,g="id"+o++;if(0==i){var h=a&&this.genConfig(a),k;h&&(k=h[0],f(d,h[1]))}r=this.getIdStringFromIdParts(d,
r);c&&"include"==r&&c.push(a.params[0].value);d.push("var "+g+" = getPropertyOrRunCommandUtil(engine,scopes,"+(k||"{}")+',"'+r+'",'+i+","+e.lineNumber+","+(a&&a.escaped)+","+b+");");return[g,d]},genOpExpression:function(e,a){var b=[],d,j,i=this[e.op1.type](e.op1),g=this[e.op2.type](e.op2);d=i[0];j=g[0];return d&&j?(f(b,i[1]),f(b,g[1]),b.push(d+a+j),["",b]):!d&&!j?(f(b,i[1].slice(0,-1)),f(b,g[1].slice(0,-1)),b.push("("+l(i[1])+")"+a+"("+l(g[1])+")"),["",b]):d&&!j?(f(b,i[1]),f(b,g[1].slice(0,-1)),b.push(d+
a+"("+l(g[1])+")"),["",b]):!d&&j?(f(b,i[1].slice(0,-1)),f(b,g[1]),b.push("("+l(i[1])+")"+a+j),["",b]):c},genConfig:function(e){var a=[],b,c,d=this;if(e){c=e.params;e=e.hash;if(c||e)b="config"+o++,a.push("var "+b+" = {};");if(c){var i="params"+o++;a.push("var "+i+" = [];");g.each(c,function(e){e=d[e.type](e);e[0]?(f(a,e[1]),a.push(i+".push("+e[0]+");")):(f(a,e[1].slice(0,-1)),a.push(i+".push("+l(e[1])+");"))});a.push(b+".params="+i+";")}if(e){var h="hash"+o++;a.push("var "+h+" = {};");g.each(e.value,
function(e,b){var c=d[e.type](e);c[0]?(f(a,c[1]),a.push(h+'["'+b+'"] = '+c[0]+";")):(f(a,c[1].slice(0,-1)),a.push(h+'["'+b+'"] = '+l(c[1])+";"))});a.push(b+".hash="+h+";")}}return[b,a]},conditionalOrExpression:function(e){return this.genOpExpression(e,"||")},conditionalAndExpression:function(e){return this.genOpExpression(e,"&&")},relationalExpression:function(e){return this.genOpExpression(e,e.opType)},equalityExpression:function(e){return this.genOpExpression(e,e.opType)},additiveExpression:function(e){return this.genOpExpression(e,
e.opType)},multiplicativeExpression:function(e){return this.genOpExpression(e,e.opType)},unaryExpression:function(e){var a=[],b,e=this[e.value.type](e.value);t.apply(a,e[1]);(b=e[0])?a.push(b+"=!"+b+";"):a[a.length-1]="!"+l(a);return[b,a]},string:function(a){return["",["'"+b(a.value,!0)+"'"]]},number:function(a){return["",[a.value]]},"boolean":function(a){return["",[a.value]]},id:function(a,b){return this.genId(a,c,!b)},block:function(a){var b=a.program,c=[],d=a.tpl,j=this.genConfig(d),a=j[0],i=d.path,
h=i.string;f(c,j[1]);a||(a=g.guid("config"),c.push("var "+a+" = {};"));c.push(a+".fn="+this.genFunction(b.statements).join("\n")+";");b.inverse&&(b=this.genFunction(b.inverse).join("\n"),c.push(a+".inverse="+b+";"));d.isInverted&&(b="inverse"+o++,c.push("var "+b+"="+a+".fn;"),c.push(a+".fn = "+a+".inverse;"),c.push(a+".inverse = "+b+";"));if(!d.hash&&!d.params){d=i.parts;for(b=0;b<d.length;b++)if("string"!=typeof d[b]){h=this.getIdStringFromIdParts(c,d);break}}c.push("buffer += runBlockCommandUtil(engine, scopes, "+
a+', "'+h+'", '+i.lineNumber+");");return c},content:function(a){return["buffer += '"+b(a.value,!1)+"';"]},tpl:function(a,b){var d=[],g=this.genId(a.path,a,c,b);f(d,g[1]);d.push("buffer += "+g[0]+";");return d},tplExpression:function(a){var b=[],c=a.escaped,a=this[a.expression.type](a.expression,1);a[0]?(f(b,a[1]),a=a[0]):(f(b,a[1].slice(0,-1)),a=l(a[1]));b.push("buffer += getExpressionUtil("+a+","+c+");");return b},getIdStringFromIdParts:function(a,b){var c="",d,g,i,h=!0;for(d=0;d<b.length;d++)g=
b[d],i=g.type,h||(c+="."),i?(g=this[i](g),g[0]&&(f(a,g[1]),c+='"+'+g[0]+'+"',h=!0)):(c+=g,h=!1);return c}},s;return s={parse:function(b){return a.parse(b)},compileToStr:function(a){a=this.compile(a);return"function("+a.params.join(",")+"){\n"+a.source.join("\n")+"}"},compileToModule:function(a,b){var c=this.compile(a,b),d="";b&&b.length&&(d+=b.join('","'),d=', {requires:["'+d+'"]}');return"/** Compiled By kissy-xtemplate */\nKISSY.add(function(){ return function("+c.params.join(",")+"){\n"+c.source.join("\n")+
"};}"+d+");"},compile:function(a,b){var c=this.parse(a);o=0;return k.genFunction(c.statements,!0,b)},compileToFn:function(a,b){var c=s.compile(a),b=b||{},d="sourceURL="+(b.name?b.name:"xtemplate"+m++)+".js";return Function.apply(null,[].concat(c.params).concat(c.source.join("\n")+"\n//@ "+d+"\n//# "+d))}}},{requires:["./compiler/parser","./compiler/ast","xtemplate/runtime"]});