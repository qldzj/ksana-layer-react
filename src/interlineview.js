/*
	InterlineView
	filter markups and create tags and pass to selectableview

	markups : data from firebase,
	          interline editor mutate markups and write back to database.

	tags: with before/after component and className, ready for render
		    tags are generated on-the-fly , no need to save.

*/

try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var SelectableView=require("./selectableview");
var markup2tag=require("./markup2tag");

var InterlineView=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		markups:PT.object.isRequired  //markup from firebase
		,user:PT.string
	}
	,getInitialState:function() {
		//markupActivated : { mid: true , mid: false }; //otherwise it is not initialized
		return {tags:[],editing:null,hovering:null,markupActivated:{}};
	}
	,componentWillUpdate:function(nextProps,nextState) {
		this.markup2tag(nextProps,nextState);
	}
	,componentDidMount:function() {
		this.forceUpdate();
	}
	,markup2tag:function(nextProps,nextState) {
		var status={editing:nextState.editing,hovering:nextState.hovering
			,text:this.props.text
			,action:this.action,markupActivated:nextState.markupActivated,action:this.action};

		nextState.tags=markup2tag(nextProps.markups,status);
		nextState.markupActivated=status.markupActivated; //markup2tag might change markupActivated
	}
  ,activateMarkup:function(mid) {
  	var m=this.props.markups[mid];
		var markupActivated=this.deactivateOverlapMarkup(m.s,m.l);
		var activate={};
		activate[mid]=true;
		var ma=update(markupActivated,{$merge:activate});
		this.setState({editing:null,hovering:null,markupActivated:ma});
  }
  ,activateOrEditMarkup:function(mid) {
  	if (this.props.markups[mid].author===this.props.user) {
  		this.setState({editing:mid,hovering:null});
  	} else {
  		this.activateMarkup(mid);
  	}
  }
  ,deactivateMarkup:function(mid) {
		var markupActivated=this.state.markupActivated;
		var deactive={};
		deactive[mid]=false;
		var ma=update(markupActivated,{$merge:deactive});
		this.setState({editing:null,hovering:null,markupActivated:ma});
  }
  ,deactivateOverlapMarkup:function(start,len) {
		//set state to 0 for any overlap markup
		var deactive={};
		for (var mid in this.props.markups) {
			var m=this.props.markups[mid];
			if (!(start>=m.s+m.l || start+len<=m.s) ) {
				if (this.state.markupActivated[mid]) deactive[mid]=false;
		  }
			if (start===m.s && this.state.markupActivated[mid]) deactive[mid]=false;
		};
		return update(this.state.markupActivated,{$merge:deactive});
  }
  ,setMarkup:function(mid,key,value) {
  	var m=this.props.markups[mid];
  	var obj={};
  	obj[key]=value;
  	this.props.markups[mid]=update(m,{$merge:obj});
  	this.forceUpdate();
  }
	,action:function(act,p1,p2,p3) {
		if(act==="enter") {
 			this.setState({hovering:p1})
		} else if (act==="leave") {
			this.setState({hovering:null,editing:null});
		} else if (act==="activate") {
			this.activateMarkup(p1);
		} else if (act==="deactivate") {
			this.deactivateMarkup(p1)
		} else if (act==="activate_edit") { //
			this.activateOrEditMarkup(p1);
		} else if (act==="setMarkup") {
			this.setMarkup(p1,p2,p3);
		}
	}
	,render:function(){
		var props=update(this.props,{$merge:{tags:this.state.tags}});
		return E(SelectableView,props);
	}

});

module.exports=InterlineView;