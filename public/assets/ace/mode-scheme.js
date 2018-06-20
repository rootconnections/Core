define("ace/mode/scheme_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextHighlightRules=require("./text_highlight_rules").TextHighlightRules,SchemeHighlightRules=function(){var keywordControl="case|do|let|loop|if|else|when",keywordOperator="eq?|eqv?|equal?|and|or|not|null?",constantLanguage="#t|#f",supportFunctions="cons|car|cdr|cond|lambda|lambda*|syntax-rules|format|set!|quote|eval|append|list|list?|member?|load",keywordMapper=this.createKeywordMapper({"keyword.control":keywordControl,"keyword.operator":keywordOperator,"constant.language":constantLanguage,"support.function":supportFunctions},"identifier",!0);this.$rules={start:[{token:"comment",regex:";.*$"},{token:["storage.type.function-type.scheme","text","entity.name.function.scheme"],regex:"(?:\\b(?:(define|define-syntax|define-macro))\\b)(\\s+)((?:\\w|\\-|\\!|\\?)*)"},{token:"punctuation.definition.constant.character.scheme",regex:"#:\\S+"},{token:["punctuation.definition.variable.scheme","variable.other.global.scheme","punctuation.definition.variable.scheme"],regex:"(\\*)(\\S*)(\\*)"},{token:"constant.numeric",regex:"#[xXoObB][0-9a-fA-F]+"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?"},{token:keywordMapper,regex:"[a-zA-Z_#][a-zA-Z0-9_\\-\\?\\!\\*]*"},{token:"string",regex:'"(?=.)',next:"qqstring"}],qqstring:[{token:"constant.character.escape.scheme",regex:"\\\\."},{token:"string",regex:'[^"\\\\]+',merge:!0},{token:"string",regex:"\\\\$",next:"qqstring",merge:!0},{token:"string",regex:'"|$',next:"start",merge:!0}]}};oop.inherits(SchemeHighlightRules,TextHighlightRules),exports.SchemeHighlightRules=SchemeHighlightRules}),define("ace/mode/matching_parens_outdent",["require","exports","module","ace/range"],function(require,exports){"use strict";var Range=require("../range").Range,MatchingParensOutdent=function(){};(function(){this.checkOutdent=function(line,input){return!!/^\s+$/.test(line)&&/^\s*\)/.test(input)},this.autoOutdent=function(doc,row){var line=doc.getLine(row),match=line.match(/^(\s*\))/);if(!match)return 0;var column=match[1].length,openBracePos=doc.findMatchingBracket({row:row,column:column});if(!openBracePos||openBracePos.row==row)return 0;var indent=this.$getIndent(doc.getLine(openBracePos.row));doc.replace(new Range(row,0,row,column-1),indent)},this.$getIndent=function(line){var match=line.match(/^(\s+)/);return match?match[1]:""}}).call(MatchingParensOutdent.prototype),exports.MatchingParensOutdent=MatchingParensOutdent}),define("ace/mode/scheme",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/scheme_highlight_rules","ace/mode/matching_parens_outdent"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextMode=require("./text").Mode,SchemeHighlightRules=require("./scheme_highlight_rules").SchemeHighlightRules,MatchingParensOutdent=require("./matching_parens_outdent").MatchingParensOutdent,Mode=function(){this.HighlightRules=SchemeHighlightRules,this.$outdent=new MatchingParensOutdent,this.$behaviour=this.$defaultBehaviour};oop.inherits(Mode,TextMode),function(){this.lineCommentStart=";",this.minorIndentFunctions=["define","lambda","define-macro","define-syntax","syntax-rules","define-record-type","define-structure"],this.$toIndent=function(str){return str.split("").map(function(ch){return/\s/.exec(ch)?ch:" "}).join("")},this.$calculateIndent=function(line,tab){for(var isParen,ch,baseIndent=this.$getIndent(line),delta=0,i=line.length-1;i>=0&&(ch=line[i],"("===ch?(delta--,isParen=!0):"("===ch||"["===ch||"{"===ch?(delta--,isParen=!1):")"!==ch&&"]"!==ch&&"}"!==ch||delta++,!(delta<0));i--);if(!(delta<0&&isParen))return delta<0&&!isParen?this.$toIndent(line.substring(0,i+1)):delta>0?baseIndent=baseIndent.substring(0,baseIndent.length-tab.length):baseIndent;i+=1;for(var iBefore=i,fn="";;){if(" "===(ch=line[i])||"\t"===ch)return-1!==this.minorIndentFunctions.indexOf(fn)?this.$toIndent(line.substring(0,iBefore-1)+tab):this.$toIndent(line.substring(0,i+1));if(ch===undefined)return this.$toIndent(line.substring(0,iBefore-1)+tab);fn+=line[i],i++}},this.getNextLineIndent=function(state,line,tab){return this.$calculateIndent(line,tab)},this.checkOutdent=function(state,line,input){return this.$outdent.checkOutdent(line,input)},this.autoOutdent=function(state,doc,row){this.$outdent.autoOutdent(doc,row)},this.$id="ace/mode/scheme"}.call(Mode.prototype),exports.Mode=Mode});