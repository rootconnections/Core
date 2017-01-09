define("ace/mode/css_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextHighlightRules=(require("../lib/lang"),require("./text_highlight_rules").TextHighlightRules),supportType=exports.supportType="align-content|align-items|align-self|all|animation|animation-delay|animation-direction|animation-duration|animation-fill-mode|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|backface-visibility|background|background-attachment|background-blend-mode|background-clip|background-color|background-image|background-origin|background-position|background-repeat|background-size|border|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius|border-bottom-style|border-bottom-width|border-collapse|border-color|border-image|border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-left|border-left-color|border-left-style|border-left-width|border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style|border-top-width|border-width|bottom|box-shadow|box-sizing|caption-side|clear|clip|color|column-count|column-fill|column-gap|column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|content|counter-increment|counter-reset|cursor|direction|display|empty-cells|filter|flex|flex-basis|flex-direction|flex-flow|flex-grow|flex-shrink|flex-wrap|float|font|font-family|font-size|font-size-adjust|font-stretch|font-style|font-variant|font-weight|hanging-punctuation|height|justify-content|left|letter-spacing|line-height|list-style|list-style-image|list-style-position|list-style-type|margin|margin-bottom|margin-left|margin-right|margin-top|max-height|max-width|min-height|min-width|nav-down|nav-index|nav-left|nav-right|nav-up|opacity|order|outline|outline-color|outline-offset|outline-style|outline-width|overflow|overflow-x|overflow-y|padding|padding-bottom|padding-left|padding-right|padding-top|page-break-after|page-break-before|page-break-inside|perspective|perspective-origin|position|quotes|resize|right|tab-size|table-layout|text-align|text-align-last|text-decoration|text-decoration-color|text-decoration-line|text-decoration-style|text-indent|text-justify|text-overflow|text-shadow|text-transform|top|transform|transform-origin|transform-style|transition|transition-delay|transition-duration|transition-property|transition-timing-function|unicode-bidi|vertical-align|visibility|white-space|width|word-break|word-spacing|word-wrap|z-index",supportFunction=exports.supportFunction="rgb|rgba|url|attr|counter|counters",supportConstant=exports.supportConstant="absolute|after-edge|after|all-scroll|all|alphabetic|always|antialiased|armenian|auto|avoid-column|avoid-page|avoid|balance|baseline|before-edge|before|below|bidi-override|block-line-height|block|bold|bolder|border-box|both|bottom|box|break-all|break-word|capitalize|caps-height|caption|center|central|char|circle|cjk-ideographic|clone|close-quote|col-resize|collapse|column|consider-shifts|contain|content-box|cover|crosshair|cubic-bezier|dashed|decimal-leading-zero|decimal|default|disabled|disc|disregard-shifts|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ease-in|ease-in-out|ease-out|ease|ellipsis|end|exclude-ruby|fill|fixed|georgian|glyphs|grid-height|groove|hand|hanging|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|icon|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|ideographic|inactive|include-ruby|inherit|initial|inline-block|inline-box|inline-line-height|inline-table|inline|inset|inside|inter-ideograph|inter-word|invert|italic|justify|katakana-iroha|katakana|keep-all|last|left|lighter|line-edge|line-through|line|linear|list-item|local|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|mathematical|max-height|max-size|medium|menu|message-box|middle|move|n-resize|ne-resize|newspaper|no-change|no-close-quote|no-drop|no-open-quote|no-repeat|none|normal|not-allowed|nowrap|nw-resize|oblique|open-quote|outset|outside|overline|padding-box|page|pointer|pre-line|pre-wrap|pre|preserve-3d|progress|relative|repeat-x|repeat-y|repeat|replaced|reset-size|ridge|right|round|row-resize|rtl|s-resize|scroll|se-resize|separate|slice|small-caps|small-caption|solid|space|square|start|static|status-bar|step-end|step-start|steps|stretch|strict|sub|super|sw-resize|table-caption|table-cell|table-column-group|table-column|table-footer-group|table-header-group|table-row-group|table-row|table|tb-rl|text-after-edge|text-before-edge|text-bottom|text-size|text-top|text|thick|thin|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|use-script|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|z-index|zero",supportConstantColor=exports.supportConstantColor="aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow",supportConstantFonts=exports.supportConstantFonts="arial|century|comic|courier|cursive|fantasy|garamond|georgia|helvetica|impact|lucida|symbol|system|tahoma|times|trebuchet|utopia|verdana|webdings|sans-serif|serif|monospace",numRe=exports.numRe="\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))",pseudoElements=exports.pseudoElements="(\\:+)\\b(after|before|first-letter|first-line|moz-selection|selection)\\b",pseudoClasses=exports.pseudoClasses="(:)\\b(active|checked|disabled|empty|enabled|first-child|first-of-type|focus|hover|indeterminate|invalid|last-child|last-of-type|link|not|nth-child|nth-last-child|nth-last-of-type|nth-of-type|only-child|only-of-type|required|root|target|valid|visited)\\b",CssHighlightRules=function(){var keywordMapper=this.createKeywordMapper({"support.function":supportFunction,"support.constant":supportConstant,"support.type":supportType,"support.constant.color":supportConstantColor,"support.constant.fonts":supportConstantFonts},"text",!0);this.$rules={start:[{token:"comment",regex:"\\/\\*",push:"comment"},{token:"paren.lparen",regex:"\\{",push:"ruleset"},{token:"string",regex:"@.*?{",push:"media"},{token:"keyword",regex:"#[a-z0-9-_]+"},{token:"variable",regex:"\\.[a-z0-9-_]+"},{token:"string",regex:":[a-z0-9-_]+"},{token:"constant",regex:"[a-z0-9-_]+"},{caseInsensitive:!0}],media:[{token:"comment",regex:"\\/\\*",push:"comment"},{token:"paren.lparen",regex:"\\{",push:"ruleset"},{token:"string",regex:"\\}",next:"pop"},{token:"keyword",regex:"#[a-z0-9-_]+"},{token:"variable",regex:"\\.[a-z0-9-_]+"},{token:"string",regex:":[a-z0-9-_]+"},{token:"constant",regex:"[a-z0-9-_]+"},{caseInsensitive:!0}],comment:[{token:"comment",regex:"\\*\\/",next:"pop"},{defaultToken:"comment"}],ruleset:[{token:"paren.rparen",regex:"\\}",next:"pop"},{token:"comment",regex:"\\/\\*",push:"comment"},{token:"string",regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{token:"string",regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},{token:["constant.numeric","keyword"],regex:"("+numRe+")(ch|cm|deg|em|ex|fr|gd|grad|Hz|in|kHz|mm|ms|pc|pt|px|rad|rem|s|turn|vh|vm|vw|%)"},{token:"constant.numeric",regex:numRe},{token:"constant.numeric",regex:"#[a-f0-9]{6}"},{token:"constant.numeric",regex:"#[a-f0-9]{3}"},{token:["punctuation","entity.other.attribute-name.pseudo-element.css"],regex:pseudoElements},{token:["punctuation","entity.other.attribute-name.pseudo-class.css"],regex:pseudoClasses},{token:["support.function","string","support.function"],regex:"(url\\()(.*)(\\))"},{token:keywordMapper,regex:"\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"},{caseInsensitive:!0}]},this.normalizeRules()};oop.inherits(CssHighlightRules,TextHighlightRules),exports.CssHighlightRules=CssHighlightRules}),define("ace/mode/stylus_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules","ace/mode/css_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextHighlightRules=require("./text_highlight_rules").TextHighlightRules,CssHighlightRules=require("./css_highlight_rules"),StylusHighlightRules=function(){var keywordMapper=this.createKeywordMapper({"support.type":CssHighlightRules.supportType,"support.function":CssHighlightRules.supportFunction,"support.constant":CssHighlightRules.supportConstant,"support.constant.color":CssHighlightRules.supportConstantColor,"support.constant.fonts":CssHighlightRules.supportConstantFonts},"text",!0);this.$rules={start:[{token:"comment",regex:/\/\/.*$/},{token:"comment",regex:/\/\*/,next:"comment"},{token:["entity.name.function.stylus","text"],regex:"^([-a-zA-Z_][-\\w]*)?(\\()"},{token:["entity.other.attribute-name.class.stylus"],regex:"\\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*"},{token:["entity.language.stylus"],regex:"^ *&"},{token:["variable.language.stylus"],regex:"(arguments)"},{token:["keyword.stylus"],regex:"@[-\\w]+"},{token:["punctuation","entity.other.attribute-name.pseudo-element.css"],regex:CssHighlightRules.pseudoElements},{token:["punctuation","entity.other.attribute-name.pseudo-class.css"],regex:CssHighlightRules.pseudoClasses},{token:["entity.name.tag.stylus"],regex:"(?:\\b)(a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|eventsource|fieldset|figure|figcaption|footer|form|frame|frameset|(?:h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)(?:\\b)"},{token:"constant.numeric",regex:"#[a-f0-9]{6}"},{token:"constant.numeric",regex:"#[a-f0-9]{3}"},{token:["punctuation.definition.entity.stylus","entity.other.attribute-name.id.stylus"],regex:"(#)([a-zA-Z][a-zA-Z0-9_-]*)"},{token:"meta.vendor-prefix.stylus",regex:"-webkit-|-moz\\-|-ms-|-o-"},{token:"keyword.control.stylus",regex:"(?:!important|for|in|return|true|false|null|if|else|unless|return)\\b"},{token:"keyword.operator.stylus",regex:"!|~|\\+|-|(?:\\*)?\\*|\\/|%|(?:\\.)\\.\\.|<|>|(?:=|:|\\?|\\+|-|\\*|\\/|%|<|>)?=|!="},{token:"keyword.operator.stylus",regex:"(?:in|is(?:nt)?|not)\\b"},{token:"string",regex:"'(?=.)",next:"qstring"},{token:"string",regex:'"(?=.)',next:"qqstring"},{token:"constant.numeric",regex:CssHighlightRules.numRe},{token:"keyword",regex:"(?:ch|cm|deg|em|ex|fr|gd|grad|Hz|in|kHz|mm|ms|pc|pt|px|rad|rem|s|turn|vh|vm|vw|%)\\b"},{token:keywordMapper,regex:"\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"}],comment:[{token:"comment",regex:".*?\\*\\/",next:"start"},{token:"comment",regex:".+"}],qqstring:[{token:"string",regex:'[^"\\\\]+'},{token:"string",regex:"\\\\$",next:"qqstring"},{token:"string",regex:'"|$',next:"start"}],qstring:[{token:"string",regex:"[^'\\\\]+"},{token:"string",regex:"\\\\$",next:"qstring"},{token:"string",regex:"'|$",next:"start"}]}};oop.inherits(StylusHighlightRules,TextHighlightRules),exports.StylusHighlightRules=StylusHighlightRules}),define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"],function(require,exports){"use strict";var oop=require("../../lib/oop"),BaseFoldMode=require("./fold_mode").FoldMode,Range=require("../../range").Range,FoldMode=exports.FoldMode=function(){};oop.inherits(FoldMode,BaseFoldMode),function(){this.getFoldWidgetRange=function(session,foldStyle,row){var range=this.indentationBlock(session,row);if(range)return range;var re=/\S/,line=session.getLine(row),startLevel=line.search(re);if(startLevel!=-1&&"#"==line[startLevel]){for(var startColumn=line.length,maxRow=session.getLength(),startRow=row,endRow=row;++row<maxRow;){line=session.getLine(row);var level=line.search(re);if(level!=-1){if("#"!=line[level])break;endRow=row}}if(endRow>startRow){var endColumn=session.getLine(endRow).length;return new Range(startRow,startColumn,endRow,endColumn)}}},this.getFoldWidget=function(session,foldStyle,row){var line=session.getLine(row),indent=line.search(/\S/),next=session.getLine(row+1),prev=session.getLine(row-1),prevIndent=prev.search(/\S/),nextIndent=next.search(/\S/);if(indent==-1)return session.foldWidgets[row-1]=prevIndent!=-1&&prevIndent<nextIndent?"start":"","";if(prevIndent==-1){if(indent==nextIndent&&"#"==line[indent]&&"#"==next[indent])return session.foldWidgets[row-1]="",session.foldWidgets[row+1]="","start"}else if(prevIndent==indent&&"#"==line[indent]&&"#"==prev[indent]&&session.getLine(row-2).search(/\S/)==-1)return session.foldWidgets[row-1]="start",session.foldWidgets[row+1]="","";return prevIndent!=-1&&prevIndent<indent?session.foldWidgets[row-1]="start":session.foldWidgets[row-1]="",indent<nextIndent?"start":""}}.call(FoldMode.prototype)}),define("ace/mode/stylus",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/stylus_highlight_rules","ace/mode/folding/coffee"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextMode=require("./text").Mode,StylusHighlightRules=require("./stylus_highlight_rules").StylusHighlightRules,FoldMode=require("./folding/coffee").FoldMode,Mode=function(){this.HighlightRules=StylusHighlightRules,this.foldingRules=new FoldMode};oop.inherits(Mode,TextMode),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/stylus"}.call(Mode.prototype),exports.Mode=Mode});