define("ace/mode/sql_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextHighlightRules=require("./text_highlight_rules").TextHighlightRules,SqlHighlightRules=function(){var keywords="select|insert|update|delete|from|where|and|or|group|by|order|limit|offset|having|as|case|when|else|end|type|left|right|join|on|outer|desc|asc|union|create|table|primary|key|if|foreign|not|references|default|null|inner|cross|natural|database|drop|grant",builtinConstants="true|false",builtinFunctions="avg|count|first|last|max|min|sum|ucase|lcase|mid|len|round|rank|now|format|coalesce|ifnull|isnull|nvl",dataTypes="int|numeric|decimal|date|varchar|char|bigint|float|double|bit|binary|text|set|timestamp|money|real|number|integer",keywordMapper=this.createKeywordMapper({"support.function":builtinFunctions,keyword:keywords,"constant.language":builtinConstants,"storage.type":dataTypes},"identifier",!0);this.$rules={start:[{token:"comment",regex:"--.*$"},{token:"comment",start:"/\\*",end:"\\*/"},{token:"string",regex:'".*?"'},{token:"string",regex:"'.*?'"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},{token:keywordMapper,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="},{token:"paren.lparen",regex:"[\\(]"},{token:"paren.rparen",regex:"[\\)]"},{token:"text",regex:"\\s+"}]},this.normalizeRules()};oop.inherits(SqlHighlightRules,TextHighlightRules),exports.SqlHighlightRules=SqlHighlightRules}),define("ace/mode/sql",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/sql_highlight_rules","ace/range"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextMode=require("./text").Mode,SqlHighlightRules=require("./sql_highlight_rules").SqlHighlightRules,Mode=(require("../range").Range,function(){this.HighlightRules=SqlHighlightRules});oop.inherits(Mode,TextMode),function(){this.lineCommentStart="--",this.$id="ace/mode/sql"}.call(Mode.prototype),exports.Mode=Mode});