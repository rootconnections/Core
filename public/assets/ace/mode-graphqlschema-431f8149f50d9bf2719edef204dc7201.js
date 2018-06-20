define("ace/mode/graphqlschema_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextHighlightRules=require("./text_highlight_rules").TextHighlightRules,GraphQLSchemaHighlightRules=function(){var keywords="type|interface|union|enum|schema|input|implements|extends|scalar",dataTypes="Int|Float|String|ID|Boolean",keywordMapper=this.createKeywordMapper({keyword:keywords,"storage.type":dataTypes},"identifier");this.$rules={start:[{token:"comment",regex:"#.*$"},{token:"paren.lparen",regex:/[\[({]/,next:"start"},{token:"paren.rparen",regex:/[\])}]/},{token:keywordMapper,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}]},this.normalizeRules()};oop.inherits(GraphQLSchemaHighlightRules,TextHighlightRules),exports.GraphQLSchemaHighlightRules=GraphQLSchemaHighlightRules}),define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(require,exports){"use strict";var oop=require("../../lib/oop"),Range=require("../../range").Range,BaseFoldMode=require("./fold_mode").FoldMode,FoldMode=exports.FoldMode=function(commentRegex){commentRegex&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+commentRegex.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+commentRegex.end)))};oop.inherits(FoldMode,BaseFoldMode),function(){this.foldingStartMarker=/(\{|\[)[^\}\]]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(session,foldStyle,row){var line=session.getLine(row);if(this.singleLineBlockCommentRe.test(line)&&!this.startRegionRe.test(line)&&!this.tripleStarBlockCommentRe.test(line))return"";var fw=this._getFoldWidgetBase(session,foldStyle,row);return!fw&&this.startRegionRe.test(line)?"start":fw},this.getFoldWidgetRange=function(session,foldStyle,row,forceMultiline){var line=session.getLine(row);if(this.startRegionRe.test(line))return this.getCommentRegionBlock(session,line,row);var match=line.match(this.foldingStartMarker);if(match){var i=match.index;if(match[1])return this.openingBracketBlock(session,match[1],row,i);var range=session.getCommentFoldRange(row,i+match[0].length,1);return range&&!range.isMultiLine()&&(forceMultiline?range=this.getSectionRange(session,row):"all"!=foldStyle&&(range=null)),range}if("markbegin"!==foldStyle){var match=line.match(this.foldingStopMarker);if(match){var i=match.index+match[0].length;return match[1]?this.closingBracketBlock(session,match[1],row,i):session.getCommentFoldRange(row,i,-1)}}},this.getSectionRange=function(session,row){var line=session.getLine(row),startIndent=line.search(/\S/),startRow=row,startColumn=line.length;row+=1;for(var endRow=row,maxRow=session.getLength();++row<maxRow;){line=session.getLine(row);var indent=line.search(/\S/);if(-1!==indent){if(startIndent>indent)break;var subRange=this.getFoldWidgetRange(session,"all",row);if(subRange){if(subRange.start.row<=startRow)break;if(subRange.isMultiLine())row=subRange.end.row;else if(startIndent==indent)break}endRow=row}}return new Range(startRow,startColumn,endRow,session.getLine(endRow).length)},this.getCommentRegionBlock=function(session,line,row){for(var startColumn=line.search(/\s*$/),maxRow=session.getLength(),startRow=row,re=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,depth=1;++row<maxRow;){line=session.getLine(row);var m=re.exec(line);if(m&&(m[1]?depth--:depth++,!depth))break}var endRow=row;if(endRow>startRow)return new Range(startRow,startColumn,endRow,line.length)}}.call(FoldMode.prototype)}),define("ace/mode/graphqlschema",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/graphqlschema_highlight_rules","ace/mode/folding/cstyle"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextMode=require("./text").Mode,GraphQLSchemaHighlightRules=require("./graphqlschema_highlight_rules").GraphQLSchemaHighlightRules,FoldMode=require("./folding/cstyle").FoldMode,Mode=function(){this.HighlightRules=GraphQLSchemaHighlightRules,this.foldingRules=new FoldMode};oop.inherits(Mode,TextMode),function(){this.lineCommentStart="#",this.$id="ace/mode/graphqlschema"}.call(Mode.prototype),exports.Mode=Mode});