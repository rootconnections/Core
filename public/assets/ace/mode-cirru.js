define("ace/mode/cirru_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextHighlightRules=require("./text_highlight_rules").TextHighlightRules,CirruHighlightRules=function(){this.$rules={start:[{token:"constant.numeric",regex:/[\d\.]+/},{token:"comment.line.double-dash",regex:/--/,next:"comment"},{token:"storage.modifier",regex:/\(/},{token:"storage.modifier",regex:/,/,next:"line"},{token:"support.function",regex:/[^\(\)"\s]+/,next:"line"},{token:"string.quoted.double",regex:/"/,next:"string"},{token:"storage.modifier",regex:/\)/}],comment:[{token:"comment.line.double-dash",regex:/ +[^\n]+/,next:"start"}],string:[{token:"string.quoted.double",regex:/"/,next:"line"},{token:"constant.character.escape",regex:/\\/,next:"escape"},{token:"string.quoted.double",regex:/[^\\"]+/}],escape:[{token:"constant.character.escape",regex:/./,next:"string"}],line:[{token:"constant.numeric",regex:/[\d\.]+/},{token:"markup.raw",regex:/^\s*/,next:"start"},{token:"storage.modifier",regex:/\$/,next:"start"},{token:"variable.parameter",regex:/[^\(\)"\s]+/},{token:"storage.modifier",regex:/\(/,next:"start"},{token:"storage.modifier",regex:/\)/},{token:"markup.raw",regex:/^ */,next:"start"},{token:"string.quoted.double",regex:/"/,next:"string"}]}};oop.inherits(CirruHighlightRules,TextHighlightRules),exports.CirruHighlightRules=CirruHighlightRules}),define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"],function(require,exports){"use strict";var oop=require("../../lib/oop"),BaseFoldMode=require("./fold_mode").FoldMode,Range=require("../../range").Range,FoldMode=exports.FoldMode=function(){};oop.inherits(FoldMode,BaseFoldMode),function(){this.getFoldWidgetRange=function(session,foldStyle,row){var range=this.indentationBlock(session,row);if(range)return range;var re=/\S/,line=session.getLine(row),startLevel=line.search(re);if(-1!=startLevel&&"#"==line[startLevel]){for(var startColumn=line.length,maxRow=session.getLength(),startRow=row,endRow=row;++row<maxRow;){line=session.getLine(row);var level=line.search(re);if(-1!=level){if("#"!=line[level])break;endRow=row}}if(endRow>startRow){var endColumn=session.getLine(endRow).length;return new Range(startRow,startColumn,endRow,endColumn)}}},this.getFoldWidget=function(session,foldStyle,row){var line=session.getLine(row),indent=line.search(/\S/),next=session.getLine(row+1),prev=session.getLine(row-1),prevIndent=prev.search(/\S/),nextIndent=next.search(/\S/);if(-1==indent)return session.foldWidgets[row-1]=-1!=prevIndent&&prevIndent<nextIndent?"start":"","";if(-1==prevIndent){if(indent==nextIndent&&"#"==line[indent]&&"#"==next[indent])return session.foldWidgets[row-1]="",session.foldWidgets[row+1]="","start"}else if(prevIndent==indent&&"#"==line[indent]&&"#"==prev[indent]&&-1==session.getLine(row-2).search(/\S/))return session.foldWidgets[row-1]="start",session.foldWidgets[row+1]="","";return session.foldWidgets[row-1]=-1!=prevIndent&&prevIndent<indent?"start":"",indent<nextIndent?"start":""}}.call(FoldMode.prototype)}),define("ace/mode/cirru",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/cirru_highlight_rules","ace/mode/folding/coffee"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextMode=require("./text").Mode,CirruHighlightRules=require("./cirru_highlight_rules").CirruHighlightRules,CoffeeFoldMode=require("./folding/coffee").FoldMode,Mode=function(){this.HighlightRules=CirruHighlightRules,this.foldingRules=new CoffeeFoldMode,this.$behaviour=this.$defaultBehaviour};oop.inherits(Mode,TextMode),function(){this.lineCommentStart="--",this.$id="ace/mode/cirru"}.call(Mode.prototype),exports.Mode=Mode});