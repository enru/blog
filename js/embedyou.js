
var EmbedYou = {
	reObj: /http(s)?:\/\/www\.youtube\.com\/watch\?v=[a-z0-9]+/i
	,initCSS: function(url) {
		var head = document.getElementsByTagName("head")[0];
        var css = document.createElement("link");
		css.rel = 'stylesheet';
        css.href = "http://www.enru.co.uk/embedyou/embedyou.css";
        head.appendChild(css)
	}
	,init: function() {
		this.initCSS();
		var anchors = document.getElementsByTagName('a');
		for(var i = 0; i < anchors.length; i++) {
			var a = anchors[i];
			if(this.reObj.test(a.href)) this.handle(a)
		}
	}
	,handle: function(anchor) {
		this.append(anchor.href);
		var id = anchor.href.match(/v=[0-9a-z]+/i)[0].split('=')[1];
		anchor.id = 'embedyou_'+id
	}
	,load: function(id, code) {
		var a = document.getElementById(id);
		var html = document.createElement('div');
		html.setAttribute('class', 'embedyou_wrapper');
		html.innerHTML = code;
		a.style.display = 'none';
		a.parentNode.insertBefore(html, a);
	}
	,append: function(url) {
		var head = document.getElementsByTagName("head")[0];
        var script  = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://www.enru.co.uk/embedyou/?url="+url;
        head.appendChild(script)
	}
}
EmbedYou.init();

