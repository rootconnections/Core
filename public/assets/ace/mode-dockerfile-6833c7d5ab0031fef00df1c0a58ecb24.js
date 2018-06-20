define("ace/mode/sh_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextHighlightRules=require("./text_highlight_rules").TextHighlightRules,reservedKeywords=exports.reservedKeywords="!|{|}|case|do|done|elif|else|esac|fi|for|if|in|then|until|while|&|;|export|local|read|typeset|unset|elif|select|set|function|declare|readonly",languageConstructs=exports.languageConstructs="[|]|alias|bg|bind|break|builtin|cd|command|compgen|complete|continue|dirs|disown|echo|enable|eval|exec|exit|fc|fg|getopts|hash|help|history|jobs|kill|let|logout|popd|printf|pushd|pwd|return|set|shift|shopt|source|suspend|test|times|trap|type|ulimit|umask|unalias|wait",ShHighlightRules=function(){var keywordMapper=this.createKeywordMapper({keyword:reservedKeywords,"support.function.builtin":languageConstructs,"invalid.deprecated":"debugger"},"identifier"),fraction="(?:\\.\\d+)",intPart="(?:\\d+)",pointFloat="(?:(?:"+intPart+"?"+fraction+")|(?:"+intPart+"\\.))",exponentFloat="(?:(?:"+pointFloat+"|"+intPart+"))",floatNumber="(?:"+exponentFloat+"|"+pointFloat+")",fileDescriptor="(?:&"+intPart+")",variableName="[a-zA-Z_][a-zA-Z0-9_]*",variable="(?:"+variableName+"=)",func="(?:"+variableName+"\\s*\\(\\))";this.$rules={start:[{token:"constant",regex:/\\./},{token:["text","comment"],regex:/(^|\s)(#.*)$/},{token:"string.start",regex:'"',push:[{token:"constant.language.escape",regex:/\\(?:[$`"\\]|$)/},{include:"variables"},{token:"keyword.operator",regex:/`/},{token:"string.end",regex:'"',next:"pop"},{defaultToken:"string"}]},{token:"string",regex:"\\$'",push:[{token:"constant.language.escape",regex:/\\(?:[abeEfnrtv\\'"]|x[a-fA-F\d]{1,2}|u[a-fA-F\d]{4}([a-fA-F\d]{4})?|c.|\d{1,3})/},{token:"string",regex:"'",next:"pop"},{defaultToken:"string"}]},{regex:"<<<",token:"keyword.operator"},{stateName:"heredoc",regex:"(<<-?)(\\s*)(['\"`]?)([\\w\\-]+)(['\"`]?)",onMatch:function(value,currentState,stack){var next="-"==value[2]?"indentedHeredoc":"heredoc",tokens=value.split(this.splitRegex);return stack.push(next,tokens[4]),[{type:"constant",value:tokens[1]},{type:"text",value:tokens[2]},{type:"string",value:tokens[3]},{type:"support.class",value:tokens[4]},{type:"string",value:tokens[5]}]},rules:{heredoc:[{onMatch:function(value,currentState,stack){return value===stack[1]?(stack.shift(),stack.shift(),this.next=stack[0]||"start","support.class"):(this.next="","string")},regex:".*$",next:"start"}],indentedHeredoc:[{token:"string",regex:"^\t+"},{onMatch:function(value,currentState,stack){return value===stack[1]?(stack.shift(),stack.shift(),this.next=stack[0]||"start","support.class"):(this.next="","string")},regex:".*$",next:"start"}]}},{regex:"$",token:"empty",next:function(currentState,stack){return"heredoc"===stack[0]||"indentedHeredoc"===stack[0]?stack[0]:currentState}},{token:["keyword","text","text","text","variable"],regex:/(declare|local|readonly)(\s+)(?:(-[fixar]+)(\s+))?([a-zA-Z_][a-zA-Z0-9_]*\b)/},{token:"variable.language",regex:"(?:\\$(?:SHLVL|\\$|\\!|\\?))"},{token:"variable",regex:variable},{include:"variables"},{token:"support.function",regex:func},{token:"support.function",regex:fileDescriptor},{token:"string",start:"'",end:"'"},{token:"constant.numeric",regex:floatNumber},{token:"constant.numeric",regex:"(?:(?:[1-9]\\d*)|(?:0))\\b"},{token:keywordMapper,regex:"[a-zA-Z_][a-zA-Z0-9_]*\\b"},{token:"keyword.operator",regex:"\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|~|<|>|<=|=>|=|!=|[%&|`]"},{token:"punctuation.operator",regex:";"},{token:"paren.lparen",regex:"[\\[\\(\\{]"},{token:"paren.rparen",regex:"[\\]]"},{token:"paren.rparen",regex:"[\\)\\}]",next:"pop"}],variables:[{token:"variable",regex:/(\$)(\w+)/},{token:["variable","paren.lparen"],regex:/(\$)(\()/,push:"start"},{token:["variable","paren.lparen","keyword.operator","variable","keyword.operator"],regex:/(\$)(\{)([#!]?)(\w+|[*@#?\-$!0_])(:[?+\-=]?|##?|%%?|,,?\/|\^\^?)?/,push:"start"},{token:"variable",regex:/\$[*@#?\-$!0_]/},{token:["variable","paren.lparen"],regex:/(\$)(\{)/,push:"start"}]},this.normalizeRules()};oop.inherits(ShHighlightRules,TextHighlightRules),exports.ShHighlightRules=ShHighlightRules}),define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(require,exports){"use strict";var oop=require("../../lib/oop"),Range=require("../../range").Range,BaseFoldMode=require("./fold_mode").FoldMode,FoldMode=exports.FoldMode=function(commentRegex){commentRegex&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+commentRegex.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+commentRegex.end)))};oop.inherits(FoldMode,BaseFoldMode),function(){this.foldingStartMarker=/(\{|\[)[^\}\]]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(session,foldStyle,row){var line=session.getLine(row);if(this.singleLineBlockCommentRe.test(line)&&!this.startRegionRe.test(line)&&!this.tripleStarBlockCommentRe.test(line))return"";var fw=this._getFoldWidgetBase(session,foldStyle,row);return!fw&&this.startRegionRe.test(line)?"start":fw},this.getFoldWidgetRange=function(session,foldStyle,row,forceMultiline){var line=session.getLine(row);if(this.startRegionRe.test(line))return this.getCommentRegionBlock(session,line,row);var match=line.match(this.foldingStartMarker);if(match){var i=match.index;if(match[1])return this.openingBracketBlock(session,match[1],row,i);var range=session.getCommentFoldRange(row,i+match[0].length,1);return range&&!range.isMultiLine()&&(forceMultiline?range=this.getSectionRange(session,row):"all"!=foldStyle&&(range=null)),range}if("markbegin"!==foldStyle){var match=line.match(this.foldingStopMarker);if(match){var i=match.index+match[0].length;return match[1]?this.closingBracketBlock(session,match[1],row,i):session.getCommentFoldRange(row,i,-1)}}},this.getSectionRange=function(session,row){var line=session.getLine(row),startIndent=line.search(/\S/),startRow=row,startColumn=line.length;row+=1;for(var endRow=row,maxRow=session.getLength();++row<maxRow;){line=session.getLine(row);var indent=line.search(/\S/);if(-1!==indent){if(startIndent>indent)break;var subRange=this.getFoldWidgetRange(session,"all",row);if(subRange){if(subRange.start.row<=startRow)break;if(subRange.isMultiLine())row=subRange.end.row;else if(startIndent==indent)break}endRow=row}}return new Range(startRow,startColumn,endRow,session.getLine(endRow).length)},this.getCommentRegionBlock=function(session,line,row){for(var startColumn=line.search(/\s*$/),maxRow=session.getLength(),startRow=row,re=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,depth=1;++row<maxRow;){line=session.getLine(row);var m=re.exec(line);if(m&&(m[1]?depth--:depth++,!depth))break}var endRow=row;if(endRow>startRow)return new Range(startRow,startColumn,endRow,line.length)}}.call(FoldMode.prototype)}),define("ace/mode/sh",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/sh_highlight_rules","ace/range","ace/mode/folding/cstyle","ace/mode/behaviour/cstyle"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextMode=require("./text").Mode,ShHighlightRules=require("./sh_highlight_rules").ShHighlightRules,Range=require("../range").Range,CStyleFoldMode=require("./folding/cstyle").FoldMode,CstyleBehaviour=require("./behaviour/cstyle").CstyleBehaviour,Mode=function(){this.HighlightRules=ShHighlightRules,this.foldingRules=new CStyleFoldMode,this.$behaviour=new CstyleBehaviour};oop.inherits(Mode,TextMode),function(){this.lineCommentStart="#",this.getNextLineIndent=function(state,line,tab){var indent=this.$getIndent(line),tokenizedLine=this.getTokenizer().getLineTokens(line,state),tokens=tokenizedLine.tokens;if(tokens.length&&"comment"==tokens[tokens.length-1].type)return indent;if("start"==state){line.match(/^.*[\{\(\[:]\s*$/)&&(indent+=tab)}return indent};var outdents={pass:1,"return":1,raise:1,"break":1,"continue":1};this.checkOutdent=function(state,line,input){if("\r\n"!==input&&"\r"!==input&&"\n"!==input)return!1;var tokens=this.getTokenizer().getLineTokens(line.trim(),state).tokens;if(!tokens)return!1;do{var last=tokens.pop()}while(last&&("comment"==last.type||"text"==last.type&&last.value.match(/^\s+$/)));return!!last&&("keyword"==last.type&&outdents[last.value])},this.autoOutdent=function(state,doc,row){row+=1;var indent=this.$getIndent(doc.getLine(row)),tab=doc.getTabString();indent.slice(-tab.length)==tab&&doc.remove(new Range(row,indent.length-tab.length,row,indent.length))},this.$id="ace/mode/sh"}.call(Mode.prototype),exports.Mode=Mode}),define("ace/mode/dockerfile_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/sh_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),ShHighlightRules=require("./sh_highlight_rules").ShHighlightRules,DockerfileHighlightRules=function(){ShHighlightRules.call(this);for(var startRules=this.$rules.start,i=0;i<startRules.length;i++)if("variable.language"==startRules[i].token){startRules.splice(i,0,{token:"constant.language",regex:"(?:^(?:FROM|MAINTAINER|RUN|CMD|EXPOSE|ENV|ADD|ENTRYPOINT|VOLUME|USER|WORKDIR|ONBUILD|COPY|LABEL)\\b)",caseInsensitive:!0});break}};oop.inherits(DockerfileHighlightRules,ShHighlightRules),exports.DockerfileHighlightRules=DockerfileHighlightRules}),define("ace/mode/dockerfile",["require","exports","module","ace/lib/oop","ace/mode/sh","ace/mode/dockerfile_highlight_rules","ace/mode/folding/cstyle"],function(require,exports){"use strict";var oop=require("../lib/oop"),ShMode=require("./sh").Mode,DockerfileHighlightRules=require("./dockerfile_highlight_rules").DockerfileHighlightRules,CStyleFoldMode=require("./folding/cstyle").FoldMode,Mode=function(){ShMode.call(this),this.HighlightRules=DockerfileHighlightRules,this.foldingRules=new CStyleFoldMode};oop.inherits(Mode,ShMode),function(){this.$id="ace/mode/dockerfile"}.call(Mode.prototype),exports.Mode=Mode});