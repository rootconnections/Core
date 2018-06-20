define("ace/mode/verilog_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextHighlightRules=require("./text_highlight_rules").TextHighlightRules,VerilogHighlightRules=function(){var keywords="always|and|assign|automatic|begin|buf|bufif0|bufif1|case|casex|casez|cell|cmos|config|deassign|default|defparam|design|disable|edge|else|end|endcase|endconfig|endfunction|endgenerate|endmodule|endprimitive|endspecify|endtable|endtask|event|for|force|forever|fork|function|generate|genvar|highz0|highz1|if|ifnone|incdir|include|initial|inout|input|instance|integer|join|large|liblist|library|localparam|macromodule|medium|module|nand|negedge|nmos|nor|noshowcancelled|not|notif0|notif1|or|output|parameter|pmos|posedge|primitive|pull0|pull1|pulldown|pullup|pulsestyle_onevent|pulsestyle_ondetect|rcmos|real|realtime|reg|release|repeat|rnmos|rpmos|rtran|rtranif0|rtranif1|scalared|showcancelled|signed|small|specify|specparam|strong0|strong1|supply0|supply1|table|task|time|tran|tranif0|tranif1|tri|tri0|tri1|triand|trior|trireg|unsigned|use|vectored|wait|wand|weak0|weak1|while|wire|wor|xnor|xorbegin|bufif0|bufif1|case|casex|casez|config|else|end|endcase|endconfig|endfunction|endgenerate|endmodule|endprimitive|endspecify|endtable|endtask|for|forever|function|generate|if|ifnone|macromodule|module|primitive|repeat|specify|table|task|while",builtinConstants="true|false|null",builtinFunctions="count|min|max|avg|sum|rank|now|coalesce|main",keywordMapper=this.createKeywordMapper({"support.function":builtinFunctions,keyword:keywords,"constant.language":builtinConstants},"identifier",!0);this.$rules={start:[{token:"comment",regex:"//.*$"},{token:"comment.start",regex:"/\\*",next:[{token:"comment.end",regex:"\\*/",next:"start"},{defaultToken:"comment"}]},{token:"string",regex:'".*?"'},{token:"string",regex:"'.*?'"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},{token:keywordMapper,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="},{token:"paren.lparen",regex:"[\\(]"},{token:"paren.rparen",regex:"[\\)]"},{token:"text",regex:"\\s+"}]},this.normalizeRules()};oop.inherits(VerilogHighlightRules,TextHighlightRules),exports.VerilogHighlightRules=VerilogHighlightRules}),define("ace/mode/verilog",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/verilog_highlight_rules","ace/range"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextMode=require("./text").Mode,VerilogHighlightRules=require("./verilog_highlight_rules").VerilogHighlightRules,Mode=(require("../range").Range,function(){this.HighlightRules=VerilogHighlightRules,this.$behaviour=this.$defaultBehaviour});oop.inherits(Mode,TextMode),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/verilog"}.call(Mode.prototype),exports.Mode=Mode});