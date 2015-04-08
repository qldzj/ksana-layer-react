var assert=require("assert");
var API=require("ksana-layer");
var flatten=require("..").flatten;
var text="aaabbbcccdd";
var segid="a";


var React=require("react/addons")
var TestUtils=React.addons.TestUtils;

var renderer=TestUtils.createRenderer();
var FlattenView=require("..").FlattenView;
var createoverlapmarkups =function() {
	var doc=API.layerdoc.create();
	doc.put(segid,text);

	var M=API.layermarkup.create(doc);
	var m=M.createMarkup(segid,2,4,{tag:"abbb"});
	var m2=M.createMarkup(segid,4,4,{tag:"bbcc"});
	return {text:text, markups:M.markups[segid]};
}

describe("test flattenview",function(){
	it("overlap",function(){
		var res=createoverlapmarkups();

		renderer.render(React.createElement(FlattenView,res));
		var renderoutput=renderer.getRenderOutput();
		var C=renderoutput.props.children;
		assert.equal(C.length,5);
		assert.equal(C[0].props.children,"aa")
		assert.equal(C[0].props.start,0);
		assert.equal(C[0].props.mid,null);
		assert.equal(C[1].props.children,"ab");
		assert.equal(C[1].props.start,2);
		assert.deepEqual(C[1].props.mid,[0]);
		assert.equal(C[2].props.children,"bb");
		assert.deepEqual(C[2].props.mid,[0,1]); //overlap

		assert.equal(C[3].props.children,"cc");
		assert.deepEqual(C[3].props.mid,[1]);
		assert.equal(C[4].props.children,"cdd");
		assert.equal(C[4].props.mid,null);
	});

});