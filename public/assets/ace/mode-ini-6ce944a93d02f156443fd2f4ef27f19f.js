define("ace/mode/ini_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextHighlightRules=require("./text_highlight_rules").TextHighlightRules,escapeRe="\\\\(?:[\\\\0abtrn;#=:]|x[a-fA-F\\d]{4})",IniHighlightRules=function(){this.$rules={start:[{token:"punctuation.definition.comment.ini",regex:"#.*",push_:[{token:"comment.line.number-sign.ini",regex:"$|^",next:"pop"},{defaultToken:"comment.line.number-sign.ini"}]},{token:"punctuation.definition.comment.ini",regex:";.*",push_:[{token:"comment.line.semicolon.ini",regex:"$|^",next:"pop"},{defaultToken:"comment.line.semicolon.ini"}]},{token:["keyword.other.definition.ini","text","punctuation.separator.key-value.ini"],regex:"\\b([a-zA-Z0-9_.-]+)\\b(\\s*)(=)"},{token:["punctuation.definition.entity.ini","constant.section.group-title.ini","punctuation.definition.entity.ini"],regex:"^(\\[)(.*?)(\\])"},{token:"punctuation.definition.string.begin.ini",regex:"'",push:[{token:"punctuation.definition.string.end.ini",regex:"'",next:"pop"},{token:"constant.language.escape",regex:escapeRe},{defaultToken:"string.quoted.single.ini"}]},{token:"punctuation.definition.string.begin.ini",regex:'"',push:[{token:"constant.language.escape",regex:escapeRe},{token:"punctuation.definition.string.end.ini",regex:'"',next:"pop"},{defaultToken:"string.quoted.double.ini"}]}]},this.normalizeRules()};IniHighlightRules.metaData={fileTypes:["ini","conf"],keyEquivalent:"^~I",name:"Ini",scopeName:"source.ini"},oop.inherits(IniHighlightRules,TextHighlightRules),exports.IniHighlightRules=IniHighlightRules}),define("ace/mode/folding/ini",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(require,exports){"use strict";var oop=require("../../lib/oop"),Range=require("../../range").Range,BaseFoldMode=require("./fold_mode").FoldMode,FoldMode=exports.FoldMode=function(){};oop.inherits(FoldMode,BaseFoldMode),function(){this.foldingStartMarker=/^\s*\[([^\])]*)]\s*(?:$|[;#])/,this.getFoldWidgetRange=function(session,foldStyle,row){var re=this.foldingStartMarker,line=session.getLine(row),m=line.match(re);if(m){for(var startName=m[1]+".",startColumn=line.length,maxRow=session.getLength(),startRow=row,endRow=row;++row<maxRow;)if(line=session.getLine(row),!/^\s*$/.test(line)){if(m=line.match(re),m&&0!==m[1].lastIndexOf(startName,0))break;endRow=row}if(endRow>startRow){var endColumn=session.getLine(endRow).length;return new Range(startRow,startColumn,endRow,endColumn)}}}}.call(FoldMode.prototype)}),define("ace/mode/ini",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/ini_highlight_rules","ace/mode/folding/ini"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextMode=require("./text").Mode,IniHighlightRules=require("./ini_highlight_rules").IniHighlightRules,FoldMode=require("./folding/ini").FoldMode,Mode=function(){this.HighlightRules=IniHighlightRules,this.foldingRules=new FoldMode};oop.inherits(Mode,TextMode),function(){this.lineCommentStart=";",this.blockComment=null,this.$id="ace/mode/ini"}.call(Mode.prototype),exports.Mode=Mode});