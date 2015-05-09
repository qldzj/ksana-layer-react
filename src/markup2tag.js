var React=require("react");
var E=React.createElement;
var typedef=require("./typedef");
var markuputil=require("./markuputil");
var MarkupSelector=require("./markupselector");

/**
	put no conflict markup in object markupActivated
*/
var defaultActiveMarkups=function(gbo,markupActivated) {
	for (var start in gbo){
		var markupcount= Object.keys(gbo[start]).length;
		for (var mid in gbo[start]){
			if (typeof markupActivated[mid]==="undefined") {
				markupActivated[mid]= markupcount===1? true:false;
			}
		}
	}
}

var allDisabled=function(markups,markupActivated) {
	for (var mid in markups) {
		if (markupActivated[mid]) return false;
	}
	return true;
}

var createMarkupSelector=function(start,context,markups) {
	var selector=E(MarkupSelector,{markups:markups,context:context,key:"selector"} );
	return {s:start,l:0,before:selector};
}


var markup2tag=function(markups,context) {
	var gbo=markuputil.groupByOffset(markups);
	defaultActiveMarkups(gbo,context.markupActivated);
	var out=[];
	var createTag=function(mid,showSuper) {
			var m=markups[mid], cls=cls||m.type;
			var Component=typedef[m.type].Component;
			var getStyle=typedef[m.type].getStyle||function(){return {}};
			//console.log("style",context.hovering,getStyle(mid,context),mid)
			var before=E(Component,
							{ mid:mid,showSuper:showSuper,
								hovering:context.hovering===mid,
								editing:context.editing===mid,
								markup:m,context,context,key:mid,
								activated:context.markupActivated[mid]
							}
					);
			return {s:start, l:m.l, mid:mid, before: before, style:getStyle(mid,context)};
	}
	for (var i in gbo) {
		var start=parseInt(i), markups=gbo[i];
		var hovering=markups[context.hovering]?context.hovering:null; //this group has hovering markup
		var editing=markups[context.editing]?context.editing:null;    //this group has editing markup
		var markupcount=Object.keys(markups).length;
		var showSuper=true;
		if (!context.editing && markupcount>1 && allDisabled(markups,context.markupActivated )) {
			showSuper=false;
			console.log("show multi")
			out.push(createMarkupSelector(start,context,markups));
		}
		if (editing||hovering) {
			out.push(createTag(editing||hovering,showSuper));
		} else {
			for (var mid in markups) {
				out.push(createTag(mid, showSuper && (context.markupActivated[mid]||markupcount===1)));
			}
		}
	}
	
	return out;
}


module.exports=markup2tag;