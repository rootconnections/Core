define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextHighlightRules=require("./text_highlight_rules").TextHighlightRules,DocCommentHighlightRules=function(){this.$rules={start:[{token:"comment.doc.tag",regex:"@[\\w\\d_]+"},DocCommentHighlightRules.getTagRule(),{defaultToken:"comment.doc",caseInsensitive:!0}]}};oop.inherits(DocCommentHighlightRules,TextHighlightRules),DocCommentHighlightRules.getTagRule=function(){return{token:"comment.doc.tag.storage.type",regex:"\\b(?:TODO|FIXME|XXX|HACK)\\b"}},DocCommentHighlightRules.getStartRule=function(start){return{token:"comment.doc",regex:"\\/\\*(?=\\*)",next:start}},DocCommentHighlightRules.getEndRule=function(start){return{token:"comment.doc",regex:"\\*\\/",next:start}},exports.DocCommentHighlightRules=DocCommentHighlightRules}),define("ace/mode/swift_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/doc_comment_highlight_rules","ace/mode/text_highlight_rules"],function(require,exports){"use strict";var oop=require("../lib/oop"),lang=require("../lib/lang"),DocCommentHighlightRules=require("./doc_comment_highlight_rules").DocCommentHighlightRules,TextHighlightRules=require("./text_highlight_rules").TextHighlightRules,SwiftHighlightRules=function(){function string(start,options){var nestable=options.nestable||options.interpolation,interpStart=options.interpolation&&options.interpolation.nextState||"start",mainRule={regex:start+(options.multiline?"":"(?=.)"),token:"string.start"},nextState=[options.escape&&{regex:options.escape,token:"character.escape"},options.interpolation&&{token:"paren.quasi.start",regex:lang.escapeRegExp(options.interpolation.lead+options.interpolation.open),push:interpStart},options.error&&{regex:options.error,token:"error.invalid"},{regex:start+(options.multiline?"":"|$"),token:"string.end",next:nestable?"pop":"start"},{defaultToken:"string"}].filter(Boolean);if(nestable?mainRule.push=nextState:mainRule.next=nextState,!options.interpolation)return mainRule;var open=options.interpolation.open,close=options.interpolation.close,counter={regex:"["+lang.escapeRegExp(open+close)+"]",onMatch:function(val,state,stack){return this.next=val==open?this.nextState:"",val==open&&stack.length?(stack.unshift("start",state),"paren"):val==close&&stack.length&&(stack.shift(),this.next=stack.shift(),this.next.indexOf("string")!=-1)?"paren.quasi.end":val==open?"paren.lparen":"paren.rparen"},nextState:interpStart};return[counter,mainRule]}function comments(){return[{token:"comment",regex:"\\/\\/(?=.)",next:[DocCommentHighlightRules.getTagRule(),{token:"comment",regex:"$|^",next:"start"},{defaultToken:"comment",caseInsensitive:!0}]},DocCommentHighlightRules.getStartRule("doc-start"),{token:"comment.start",regex:/\/\*/,stateName:"nested_comment",push:[DocCommentHighlightRules.getTagRule(),{token:"comment.start",regex:/\/\*/,push:"nested_comment"},{token:"comment.end",regex:"\\*\\/",next:"pop"},{defaultToken:"comment",caseInsensitive:!0}]}]}var keywordMapper=this.createKeywordMapper({"variable.language":"",keyword:"__COLUMN__|__FILE__|__FUNCTION__|__LINE__|as|associativity|break|case|class|continue|default|deinit|didSet|do|dynamicType|else|enum|extension|fallthrough|for|func|get|if|import|in|infix|init|inout|is|left|let|let|mutating|new|none|nonmutating|operator|override|postfix|precedence|prefix|protocol|return|right|safe|Self|self|set|struct|subscript|switch|Type|typealias|unowned|unsafe|var|weak|where|while|willSet|convenience|dynamic|final|infix|lazy|mutating|nonmutating|optional|override|postfix|prefix|required|static|guard|defer","storage.type":"bool|double|Double|extension|float|Float|int|Int|private|public|string|String","constant.language":"false|Infinity|NaN|nil|no|null|null|off|on|super|this|true|undefined|yes","support.function":""},"identifier");this.$rules={start:[string('"',{escape:/\\(?:[0\\tnr"']|u{[a-fA-F1-9]{0,8}})/,interpolation:{lead:"\\",open:"(",close:")"},error:/\\./,multiline:!1}),comments({type:"c",nestable:!0}),{regex:/@[a-zA-Z_$][a-zA-Z_$\d\u0080-\ufffe]*/,token:"variable.parameter"},{regex:/[a-zA-Z_$][a-zA-Z_$\d\u0080-\ufffe]*/,token:keywordMapper},{token:"constant.numeric",regex:/[+-]?(?:0(?:b[01]+|o[0-7]+|x[\da-fA-F])|\d+(?:(?:\.\d*)?(?:[PpEe][+-]?\d+)?)\b)/},{token:"keyword.operator",regex:/--|\+\+|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\|\||\?\:|[!$%&*+\-~\/^]=?/,next:"start"},{token:"punctuation.operator",regex:/[?:,;.]/,next:"start"},{token:"paren.lparen",regex:/[\[({]/,next:"start"},{token:"paren.rparen",regex:/[\])}]/}]},this.embedRules(DocCommentHighlightRules,"doc-",[DocCommentHighlightRules.getEndRule("start")]),this.normalizeRules()};oop.inherits(SwiftHighlightRules,TextHighlightRules),exports.HighlightRules=SwiftHighlightRules}),define("ace/mode/behaviour/cstyle",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"],function(require,exports){"use strict";var context,oop=require("../../lib/oop"),Behaviour=require("../behaviour").Behaviour,TokenIterator=require("../../token_iterator").TokenIterator,lang=require("../../lib/lang"),SAFE_INSERT_IN_TOKENS=["text","paren.rparen","punctuation.operator"],SAFE_INSERT_BEFORE_TOKENS=["text","paren.rparen","punctuation.operator","comment"],contextCache={},initContext=function(editor){var id=-1;return editor.multiSelect&&(id=editor.selection.index,contextCache.rangeCount!=editor.multiSelect.rangeCount&&(contextCache={rangeCount:editor.multiSelect.rangeCount})),contextCache[id]?context=contextCache[id]:void(context=contextCache[id]={autoInsertedBrackets:0,autoInsertedRow:-1,autoInsertedLineEnd:"",maybeInsertedBrackets:0,maybeInsertedRow:-1,maybeInsertedLineStart:"",maybeInsertedLineEnd:""})},getWrapped=function(selection,selected,opening,closing){var rowDiff=selection.end.row-selection.start.row;return{text:opening+selected+closing,selection:[0,selection.start.column+1,rowDiff,selection.end.column+(rowDiff?0:1)]}},CstyleBehaviour=function(){this.add("braces","insertion",function(state,action,editor,session,text){var cursor=editor.getCursorPosition(),line=session.doc.getLine(cursor.row);if("{"==text){initContext(editor);var selection=editor.getSelectionRange(),selected=session.doc.getTextRange(selection);if(""!==selected&&"{"!==selected&&editor.getWrapBehavioursEnabled())return getWrapped(selection,selected,"{","}");if(CstyleBehaviour.isSaneInsertion(editor,session))return/[\]\}\)]/.test(line[cursor.column])||editor.inMultiSelectMode?(CstyleBehaviour.recordAutoInsert(editor,session,"}"),{text:"{}",selection:[1,1]}):(CstyleBehaviour.recordMaybeInsert(editor,session,"{"),{text:"{",selection:[1,1]})}else if("}"==text){initContext(editor);var rightChar=line.substring(cursor.column,cursor.column+1);if("}"==rightChar){var matching=session.$findOpeningBracket("}",{column:cursor.column+1,row:cursor.row});if(null!==matching&&CstyleBehaviour.isAutoInsertedClosing(cursor,line,text))return CstyleBehaviour.popAutoInsertedClosing(),{text:"",selection:[1,1]}}}else{if("\n"==text||"\r\n"==text){initContext(editor);var closing="";CstyleBehaviour.isMaybeInsertedClosing(cursor,line)&&(closing=lang.stringRepeat("}",context.maybeInsertedBrackets),CstyleBehaviour.clearMaybeInsertedClosing());var rightChar=line.substring(cursor.column,cursor.column+1);if("}"===rightChar){var openBracePos=session.findMatchingBracket({row:cursor.row,column:cursor.column+1},"}");if(!openBracePos)return null;var next_indent=this.$getIndent(session.getLine(openBracePos.row))}else{if(!closing)return void CstyleBehaviour.clearMaybeInsertedClosing();var next_indent=this.$getIndent(line)}var indent=next_indent+session.getTabString();return{text:"\n"+indent+"\n"+next_indent+closing,selection:[1,indent.length,1,indent.length]}}CstyleBehaviour.clearMaybeInsertedClosing()}}),this.add("braces","deletion",function(state,action,editor,session,range){var selected=session.doc.getTextRange(range);if(!range.isMultiLine()&&"{"==selected){initContext(editor);var line=session.doc.getLine(range.start.row),rightChar=line.substring(range.end.column,range.end.column+1);if("}"==rightChar)return range.end.column++,range;context.maybeInsertedBrackets--}}),this.add("parens","insertion",function(state,action,editor,session,text){if("("==text){initContext(editor);var selection=editor.getSelectionRange(),selected=session.doc.getTextRange(selection);if(""!==selected&&editor.getWrapBehavioursEnabled())return getWrapped(selection,selected,"(",")");if(CstyleBehaviour.isSaneInsertion(editor,session))return CstyleBehaviour.recordAutoInsert(editor,session,")"),{text:"()",selection:[1,1]}}else if(")"==text){initContext(editor);var cursor=editor.getCursorPosition(),line=session.doc.getLine(cursor.row),rightChar=line.substring(cursor.column,cursor.column+1);if(")"==rightChar){var matching=session.$findOpeningBracket(")",{column:cursor.column+1,row:cursor.row});if(null!==matching&&CstyleBehaviour.isAutoInsertedClosing(cursor,line,text))return CstyleBehaviour.popAutoInsertedClosing(),{text:"",selection:[1,1]}}}}),this.add("parens","deletion",function(state,action,editor,session,range){var selected=session.doc.getTextRange(range);if(!range.isMultiLine()&&"("==selected){initContext(editor);var line=session.doc.getLine(range.start.row),rightChar=line.substring(range.start.column+1,range.start.column+2);if(")"==rightChar)return range.end.column++,range}}),this.add("brackets","insertion",function(state,action,editor,session,text){if("["==text){initContext(editor);var selection=editor.getSelectionRange(),selected=session.doc.getTextRange(selection);if(""!==selected&&editor.getWrapBehavioursEnabled())return getWrapped(selection,selected,"[","]");if(CstyleBehaviour.isSaneInsertion(editor,session))return CstyleBehaviour.recordAutoInsert(editor,session,"]"),{text:"[]",selection:[1,1]}}else if("]"==text){initContext(editor);var cursor=editor.getCursorPosition(),line=session.doc.getLine(cursor.row),rightChar=line.substring(cursor.column,cursor.column+1);if("]"==rightChar){var matching=session.$findOpeningBracket("]",{column:cursor.column+1,row:cursor.row});if(null!==matching&&CstyleBehaviour.isAutoInsertedClosing(cursor,line,text))return CstyleBehaviour.popAutoInsertedClosing(),{text:"",selection:[1,1]}}}}),this.add("brackets","deletion",function(state,action,editor,session,range){var selected=session.doc.getTextRange(range);if(!range.isMultiLine()&&"["==selected){initContext(editor);var line=session.doc.getLine(range.start.row),rightChar=line.substring(range.start.column+1,range.start.column+2);if("]"==rightChar)return range.end.column++,range}}),this.add("string_dquotes","insertion",function(state,action,editor,session,text){if('"'==text||"'"==text){initContext(editor);var quote=text,selection=editor.getSelectionRange(),selected=session.doc.getTextRange(selection);if(""!==selected&&"'"!==selected&&'"'!=selected&&editor.getWrapBehavioursEnabled())return getWrapped(selection,selected,quote,quote);if(!selected){var cursor=editor.getCursorPosition(),line=session.doc.getLine(cursor.row),leftChar=line.substring(cursor.column-1,cursor.column),rightChar=line.substring(cursor.column,cursor.column+1),token=session.getTokenAt(cursor.row,cursor.column),rightToken=session.getTokenAt(cursor.row,cursor.column+1);if("\\"==leftChar&&token&&/escape/.test(token.type))return null;var pair,stringBefore=token&&/string|escape/.test(token.type),stringAfter=!rightToken||/string|escape/.test(rightToken.type);if(rightChar==quote)pair=stringBefore!==stringAfter;else{if(stringBefore&&!stringAfter)return null;if(stringBefore&&stringAfter)return null;var wordRe=session.$mode.tokenRe;wordRe.lastIndex=0;var isWordBefore=wordRe.test(leftChar);wordRe.lastIndex=0;var isWordAfter=wordRe.test(leftChar);if(isWordBefore||isWordAfter)return null;if(rightChar&&!/[\s;,.})\]\\]/.test(rightChar))return null;pair=!0}return{text:pair?quote+quote:"",selection:[1,1]}}}}),this.add("string_dquotes","deletion",function(state,action,editor,session,range){var selected=session.doc.getTextRange(range);if(!range.isMultiLine()&&('"'==selected||"'"==selected)){initContext(editor);var line=session.doc.getLine(range.start.row),rightChar=line.substring(range.start.column+1,range.start.column+2);if(rightChar==selected)return range.end.column++,range}})};CstyleBehaviour.isSaneInsertion=function(editor,session){var cursor=editor.getCursorPosition(),iterator=new TokenIterator(session,cursor.row,cursor.column);if(!this.$matchTokenType(iterator.getCurrentToken()||"text",SAFE_INSERT_IN_TOKENS)){var iterator2=new TokenIterator(session,cursor.row,cursor.column+1);if(!this.$matchTokenType(iterator2.getCurrentToken()||"text",SAFE_INSERT_IN_TOKENS))return!1}return iterator.stepForward(),iterator.getCurrentTokenRow()!==cursor.row||this.$matchTokenType(iterator.getCurrentToken()||"text",SAFE_INSERT_BEFORE_TOKENS)},CstyleBehaviour.$matchTokenType=function(token,types){return types.indexOf(token.type||token)>-1},CstyleBehaviour.recordAutoInsert=function(editor,session,bracket){var cursor=editor.getCursorPosition(),line=session.doc.getLine(cursor.row);this.isAutoInsertedClosing(cursor,line,context.autoInsertedLineEnd[0])||(context.autoInsertedBrackets=0),context.autoInsertedRow=cursor.row,context.autoInsertedLineEnd=bracket+line.substr(cursor.column),context.autoInsertedBrackets++},CstyleBehaviour.recordMaybeInsert=function(editor,session,bracket){var cursor=editor.getCursorPosition(),line=session.doc.getLine(cursor.row);this.isMaybeInsertedClosing(cursor,line)||(context.maybeInsertedBrackets=0),context.maybeInsertedRow=cursor.row,context.maybeInsertedLineStart=line.substr(0,cursor.column)+bracket,context.maybeInsertedLineEnd=line.substr(cursor.column),context.maybeInsertedBrackets++},CstyleBehaviour.isAutoInsertedClosing=function(cursor,line,bracket){return context.autoInsertedBrackets>0&&cursor.row===context.autoInsertedRow&&bracket===context.autoInsertedLineEnd[0]&&line.substr(cursor.column)===context.autoInsertedLineEnd},CstyleBehaviour.isMaybeInsertedClosing=function(cursor,line){return context.maybeInsertedBrackets>0&&cursor.row===context.maybeInsertedRow&&line.substr(cursor.column)===context.maybeInsertedLineEnd&&line.substr(0,cursor.column)==context.maybeInsertedLineStart},CstyleBehaviour.popAutoInsertedClosing=function(){context.autoInsertedLineEnd=context.autoInsertedLineEnd.substr(1),context.autoInsertedBrackets--},CstyleBehaviour.clearMaybeInsertedClosing=function(){context&&(context.maybeInsertedBrackets=0,context.maybeInsertedRow=-1)},oop.inherits(CstyleBehaviour,Behaviour),exports.CstyleBehaviour=CstyleBehaviour}),define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(require,exports){"use strict";var oop=require("../../lib/oop"),Range=require("../../range").Range,BaseFoldMode=require("./fold_mode").FoldMode,FoldMode=exports.FoldMode=function(commentRegex){commentRegex&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+commentRegex.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+commentRegex.end)))};oop.inherits(FoldMode,BaseFoldMode),function(){this.foldingStartMarker=/(\{|\[)[^\}\]]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(session,foldStyle,row){var line=session.getLine(row);if(this.singleLineBlockCommentRe.test(line)&&!this.startRegionRe.test(line)&&!this.tripleStarBlockCommentRe.test(line))return"";var fw=this._getFoldWidgetBase(session,foldStyle,row);return!fw&&this.startRegionRe.test(line)?"start":fw},this.getFoldWidgetRange=function(session,foldStyle,row,forceMultiline){var line=session.getLine(row);if(this.startRegionRe.test(line))return this.getCommentRegionBlock(session,line,row);var match=line.match(this.foldingStartMarker);if(match){var i=match.index;if(match[1])return this.openingBracketBlock(session,match[1],row,i);var range=session.getCommentFoldRange(row,i+match[0].length,1);return range&&!range.isMultiLine()&&(forceMultiline?range=this.getSectionRange(session,row):"all"!=foldStyle&&(range=null)),range}if("markbegin"!==foldStyle){var match=line.match(this.foldingStopMarker);if(match){var i=match.index+match[0].length;return match[1]?this.closingBracketBlock(session,match[1],row,i):session.getCommentFoldRange(row,i,-1)}}},this.getSectionRange=function(session,row){var line=session.getLine(row),startIndent=line.search(/\S/),startRow=row,startColumn=line.length;row+=1;for(var endRow=row,maxRow=session.getLength();++row<maxRow;){line=session.getLine(row);var indent=line.search(/\S/);if(indent!==-1){if(startIndent>indent)break;var subRange=this.getFoldWidgetRange(session,"all",row);if(subRange){if(subRange.start.row<=startRow)break;if(subRange.isMultiLine())row=subRange.end.row;else if(startIndent==indent)break}endRow=row}}return new Range(startRow,startColumn,endRow,session.getLine(endRow).length)},this.getCommentRegionBlock=function(session,line,row){for(var startColumn=line.search(/\s*$/),maxRow=session.getLength(),startRow=row,re=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,depth=1;++row<maxRow;){line=session.getLine(row);var m=re.exec(line);if(m&&(m[1]?depth--:depth++,!depth))break}var endRow=row;if(endRow>startRow)return new Range(startRow,startColumn,endRow,line.length)}}.call(FoldMode.prototype)}),define("ace/mode/swift",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/swift_highlight_rules","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"],function(require,exports){"use strict";var oop=require("../lib/oop"),TextMode=require("./text").Mode,HighlightRules=require("./swift_highlight_rules").HighlightRules,CstyleBehaviour=require("./behaviour/cstyle").CstyleBehaviour,FoldMode=require("./folding/cstyle").FoldMode,Mode=function(){this.HighlightRules=HighlightRules,this.foldingRules=new FoldMode,this.$behaviour=new CstyleBehaviour};oop.inherits(Mode,TextMode),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/",nestable:!0},this.$id="ace/mode/swift"}.call(Mode.prototype),exports.Mode=Mode});