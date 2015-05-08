try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}

var update=React.addons.update;
var E=React.createElement;
var PT=React.PropTypes;

var Embed=React.createClass({
	render:function() {
		return E("span",this.props,this.props.children);
	}
});
var Super=React.createClass({
	render:function() {
		return E("div",{style:{position:"absolute",left:0,top:"-1.2em"}},this.props.children);
	}
});
var Sub=React.createClass({
	render:function() {
		return E("div",{style:{position:"absolute",left:0,top:"0.6em"}},this.props.children);
	}
});
var Container=React.createClass({
	render:function() {
		return E("span",{style:{position:"relative"}},
			this.props.children);
	}
});

module.exports={Container:Container,Super:Super, Sub:Sub, Embed:Embed};