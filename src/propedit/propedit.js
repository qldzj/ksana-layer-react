try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;
/*
	display markup properties  (類型)
  jump to other range.



  save, cancel editing markup.
*/

var PropEdit=React.createClass({
	displayName:"PropEdit"
	,propTypes:{
		ranges:PT.object.isRequired

	}
	,mixins:[PureRenderMixin]
	,render:function(){
		return E("div",null,
			E("span",null,this.props.ranges)
		);
	}
});

module.exports=PropEdit;