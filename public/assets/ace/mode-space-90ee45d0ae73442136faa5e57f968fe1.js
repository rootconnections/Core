define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"],function(require,exports){"use strict";var oop=require("../../lib/oop"),BaseFoldMode=require("./fold_mode").FoldMode,Range=require("../../range").Range,FoldMode=exports.FoldMode=function(){};oop.inherits(FoldMode,BaseFoldMode),function(){this.getFoldWidgetRange=function(session,foldStyle,row){var range=this.indentationBlock(session,row);if(range)return range;var re=/\S/,line=session.getLine(row),startLevel=line.search(re);if(-1!=startLevel&&"#"==line[startLevel]){for(var startColumn=line.length,maxRow=session.getLength(),startRow=row,endRow=row;++row<maxRow;){line=session.getLine(row);var level=line.search(re);if(-1!=level){if("#"!=line[level])break;endRow=row}}if(endRow>startRow){var endColumn=session.getLine(endRow).length;return new Range(startRow,startColumn,endRow,endColumn)}}},this.getFoldWidget=function(session,foldStyle,row){var line=session.getLine(row),indent=line.search(/\S/),next=session.getLine(row+1),prev=session.getLine(row-1),prevIndent=prev.search(/\S/),nextIndent=next.search(/\S/);if(-1==indent)return session.foldWidgets[row-1]=-1!=prevIndent&&prevIndent<nextIndent?"start":"","";if(-1==prevIndent){if(indent==nextIndent&&"#"==line[indent]&&"#"==next[indent])return session.foldWidgets[row-1]="",session.foldWidgets[row+1]="","start"}else if(prevIndent==indent&&"#"==line[indent]&&"#"==prev[indent]&&-1==session.getLine(row-2).search(/\S/))return session.foldWidgets[row-1]="start",session.foldWidgets[row+1]="","";return session.foldWidgets[row-1]=-1!=prevIndent&&prevIndent<indent?"start":"",indent<nextIndent?"start":""}}.call(FoldMode.prototype)}),define("ace/mode/space_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextHighlightRules=require("./text_highlight_rules").TextHighlightRules,SpaceHighlightRules=function(){this.$rules={start:[{token:"empty_line",regex:/ */,next:"key"},{token:"empty_line",regex:/$/,next:"key"}],key:[{token:"variable",regex:/\S+/},{token:"empty_line",regex:/$/,next:"start"},{token:"keyword.operator",regex:/ /,next:"value"}],value:[{token:"keyword.operator",regex:/$/,next:"start"},{token:"string",regex:/[^$]/}]}};oop.inherits(SpaceHighlightRules,TextHighlightRules),exports.SpaceHighlightRules=SpaceHighlightRules}),define("ace/mode/space",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/folding/coffee","ace/mode/space_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextMode=require("./text").Mode,FoldMode=require("./folding/coffee").FoldMode,SpaceHighlightRules=require("./space_highlight_rules").SpaceHighlightRules,Mode=function(){this.HighlightRules=SpaceHighlightRules,this.foldingRules=new FoldMode,this.$behaviour=this.$defaultBehaviour};oop.inherits(Mode,TextMode),function(){this.$id="ace/mode/space"}.call(Mode.prototype),exports.Mode=Mode});