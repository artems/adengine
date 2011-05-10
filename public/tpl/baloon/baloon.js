var baloon = {
	/* local private defines */
	_pnames : ['link1','clickTAG'],

codeVariant : function(kphid){
	var r = {};
	try {
		var pd = parent.document;
		if (pd == document) throw (new Error(-1,""));
		r.placeholder = pd.getElementById(kphid);
		if (r.placeholder == null) throw (new Error(-1,""));
		/* placeholder found. Wow! We're in async code. */
		r.document = pd;
		r.window = parent;
		r.type = 'async';
		setTimeout('document.close()', 1000);
		return r;
	} catch(e) {}
	r.document = document;
	r.window = window;
	r.placeholder = document.getElementById(kphid);
	r.type = (null == r.placeholder ? 'none' : 'inline');
	return r;
},

flver : function(){
	var d, n = navigator, f = 'Shockwave Flash';
	if((n = n.plugins) && n[f]){d = n[f].description}
	else if (window.ActiveXObject) { try { d = (new ActiveXObject((f+'.'+f).replace(/ /g,''))).GetVariable('$version');} catch (e) { try { new ActiveXObject((f+'.'+f+'.6').replace(/ /g,'')); d='WIN 6,0,21,0';} catch (e) {} }}
	return d ? d.replace(/\D+/,'').split(/\D+/) : [0,0];
},

// common functions

/*
 * event functions
 */
addEvent : function(ePtr, eventType, eventFunc) {
	if (ePtr.addEventListener){
		ePtr.addEventListener(eventType, eventFunc, false);
	}
	if (ePtr.attachEvent){
		ePtr.attachEvent('on' + eventType, eventFunc);
	}
},

removeEvent : function(ePtr, eventType, eventFunc) {
	if (ePtr.addEventListener) {
		ePtr.removeEventListener(eventType, eventFunc, false);
		return;
	}
	ePtr.detachEvent('on' + eventType, eventFunc);
},

/* returns a complete swf object. No check is performed on this level */
_swf : function(file, w, h, link, bgc, wmode){
	var fv = this._pnames[0] + '=' + escape(link);
	for (i=1; i<this._pnames.length; ++i) fv += '&' + this._pnames[i] + "=" + escape(link);
	var src = file + (( -1 == file.indexOf('?')) ? '?' : '&') + fv;
	if ('undefined' == bgc) bgc = '#FFFFFF';
	if ('undefined' == wmode) wmode = 'opaque';
	var s = '';
	if ('\v'=='v'){
	    s += '<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" WIDTH='+w+' HEIGHT='+h+'>';
	    s += '<PARAM NAME=movie VALUE="'+src+'">';
	    s += '<PARAM NAME=flashvars VALUE="'+fv+'">';
	    s += '<PARAM NAME=wmode VALUE="'+wmode+'">';
	    s += '<PARAM NAME=quality VALUE=high>';
	    s += '<PARAM NAME=bgcolor VALUE="'+bgc+'">';
	    s += '<PARAM NAME=menu VALUE=false>';
	    s += '<PARAM NAME=play VALUE=true>';
	    s += '<PARAM NAME=loop VALUE=true>';
	    s += '</OBJECT>';
	} else {
	    s += '<EMBED src="'+src+'" menu=false flashvars="'+fv+'" wmode="'+wmode+'" quality=high bgcolor="'+bgc+'" swLiveConnect=FALSE play=true loop=true WIDTH='+w+' height='+h+' TYPE="application/x-shockwave-flash" PLUGINSPAGE="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash"></EMBED>';
	}
	return s;
},

_gif : function(file, w, h, link){
	s = '';
	s += '<center><a href="'+link+'" target=_blank><img src="'+file+'" width='+w+' height='+h+' alt="" border=0><br /></a></center>';
	return s;
},


/* Now perform checks and return a table with content OR nothing */
obj : function(swf, gif, w, h, link, fv, bgc, wmode){
	if ((fv <= parseInt(this.flver()[0])) && (0 == swf.toUpperCase().indexOf('HTTP://'))) {
		return this._swf(swf, w, h, link, bgc, wmode); 
	} else {
		if (0 != gif.toUpperCase().indexOf('HTTP://')) return '';
		return this._gif(gif, w, h, link);
	}
	return '';
},

callevent : function(z) {
	for (var i in z) if(z[i].toUpperCase().indexOf("HTTP://")==0)(new Image()).src = z[i];
},

/* find a current position of the object */
_FindPos : function(obj) {
	var res = {left:0, top:0};
	if (obj) {
		var hideAgain = false;
		if ('none' == obj.style.display){obj.style.display = 'block'; hideAgain = true;}
		var r = this._FindPos(obj.offsetParent);
		res.left = obj.offsetLeft + r.left;
		res.top = obj.offsetTop + r.top;
		if (hideAgain) obj.style.display = 'none';
	}
	return res;
},

/* window size funcs */
getBodyScrollTop : function (win,doc) {
	return win.pageYOffset || (doc.documentElement && doc.documentElement.scrollTop) || (doc.body && doc.body.scrollTop);
},

getBodyScrollLeft : function (win,doc) {
	return win.pageXOffset || (doc.documentElement && doc.documentElement.scrollLeft) || (doc.body && doc.body.scrollLeft);
},

winsize : function(win, doc) {
	var g = new Object();
	g.width = 0;
	g.height = 0;
	var db = doc.body;
	de = doc.documentElement;
	try { 
		if (win.innerWidth == undefined) {
			throw(new Error(-22,"IE must die"));
		}
		g.width = win.innerWidth; // check for netscape and compatible
		g.height = win.innerHeight;
		if (self.outerWidth == g.cw || db.clientWidth == db.scrollWidth) {
			g.width = db.clientWidth; 
		} // fix for firefox
	} catch(e) {
		try {
			if (de && de.clientHeight) {   // Explorer 6 Strict Mode &&de.scrollTop
				g.width = de.clientWidth;
				g.height = de.clientHeight;
			} else {          // other IE
				g.width = db.clientWidth;
				g.height = db.clientHeight;
			}
		} catch(e) {}
	}
	g.scrollLeft = this.getBodyScrollLeft(win, doc);
	g.scrollTop = this.getBodyScrollTop(win, doc);
	return g;
},

inplace : function (b, x, y){
	return (b.o.style.left == x) && (b.o.style.top == y);
},

repos : function (b, x, y){
	b.o.style.left = x + 'px';
	b.o.style.top = y + 'px';
},

getpos : function (b){
	var pos = {left:0, top:0};
	pos.left = parseInt(b.o.style.left);
	pos.top = parseInt(b.o.style.top);
	return pos;
},

animate : function(b, dx, dy, newx, newy){
	if (b.timer) {clearTimeout(b.timer); b.timer = 0;}
	if (!this.inplace(b, newx, newy)) { 
		var c = this.getpos(b); 
		if (Math.abs(dx) > Math.abs(newx-c.left)) {dx=newx-c.left;}
		if (Math.abs(dy) > Math.abs(newy-c.top)) {dy=newy-c.top;}
	    this.repos(b, c.left+dx, c.top+dy); 
		b.timer=setTimeout('baloon.animate('+b.name+','+dx+','+dy+','+newx+','+newy+')', b.frame);
	}
},

reposition : function (b,x,y){
	if (b.timer) {clearTimeout(b.timer);}
	var c = this.getpos(b);
	var dx = Math.round((x-c.left)/b.frames);var dy=Math.round((y-c.top)/b.frames);
	b.timer=setTimeout('baloon.animate('+b.name+','+dx+','+dy+','+x+','+y+')', b.tout);
},

show : function (b) {
	if (b.shown || b.disabled) return;
	clearTimeout(b.timeout);
	b.div.style.display="block";
	b.shown=true;
	this.reposition(b, 0, 0);
},

hide_div : function (b) {
	b.div.style.display = 'none';
},

hide : function (b) {
	if (!b.shown) return;
	b.shown=false;
	this.reposition(b,270,0);
	b.timeout=setTimeout('baloon.hide_div('+b.name+')', 3000);
},

listener : function (b) {
	var g=this.winsize(b.ph.window, b.ph.document);
	if ((g.scrollTop+g.height)>this._FindPos(b.ph.placeholder).top) this.show(b); else this.hide(b);
},

init : function (b){
	b.ph = this.codeVariant(b.kphid);

	var str = '';
	str += '<table style="padding: 0; border-collapse: collapse; position: relative; left: 0px; width: 235px; top: 0px;">';
	str += '	<tr><td style="background-color:#fff;padding:0;background: url(http://'+b.khost+'/tpl/baloon/baloon_u1.png) repeat scroll 0% 0% transparent;width:35px;height:35px;filter:expression(fixPNG(this));">&nbsp;</td>';
	str += '	<td style="background-color:#fff;padding:0;background: url(http://'+b.khost+'/tpl/baloon/baloon_bg1.png) repeat scroll 0% 0% transparent;height:35px;filter:expression(fixPNG(this));">&nbsp;</td></tr>';
	str += '	<tr><td style="background-color:#fff;padding:0;background: url(http://'+b.khost+'/tpl/baloon/baloon_bg2.png) repeat scroll 0% 0% transparent;width:35px;filter:expression(fixPNG(this));">&nbsp;</td>';
	str += '	<td style="padding: 0pt;background-color:#fff;">';
	str += '		<div>';
	str += '			<div style="display:inline;float:left;height: 17px; width: 10px; margin-top:-5px; z-index: 1000;"><h2 style="font:12px/1.1675 Arial,sans-serif; font-width:bold; font-size: 18px; line-height: 20px; margin: 0pt 0pt 10px;">'+b.header+'</h2></div>';
	str += '			<div style="display:inline;float:right;margin-right:8px;width:20px;height:20px;margin-top:-8px; z-index: 100;"><a id="vsplyvashka_close" style="display:block;width:20px;height:20px;background:url(http://'+b.khost+'/tpl/baloon/close.gif) no-repeat 0 0;text-decoration:none;z-index:100;"></a></div>';
	str += '		</div>';
	str += '		<div style="display:inline;float:left;margin-top:5px;">';
	str +=	this.obj(b.swf, b.gif, 200, 300 , b.link, b.fv, "#FFFFFF", "opaque");
	str += '		</div><div style="display:inline;float:left;margin-top:5px;">';
	str += '		<div style="display:inline;float:right;height: 12px; margin-top:5px;"><a href="http://kavanga.ru/a/adv_advantages?f=n" target="_blank" style="font:12px/1.1675 Arial,sans-serif; font-width:bold; font-size: 12px; line-height: 12px; margin: 0pt 0pt 10px;">Разместить рекламу</a></div>';
	str += '		</div></td></tr>';
	str += '	<tr><td style="background-color:#fff;padding:0;background: url(http://'+b.khost+'/tpl/baloon/baloon_u3.png) repeat scroll 0% 0% transparent;width:35px;height:35px;filter:expression(fixPNG(this));">&nbsp;</td>';
	str += '	<td style="background-color:#fff;padding:0;background: url(http://'+b.khost+'/tpl/baloon/baloon_bg4.png) repeat scroll 0% 0% transparent;height:35px;filter:expression(fixPNG(this));">&nbsp;</td></tr>';
	str += '</table>';

	b.o = b.ph.document.createElement('div');
	b.o.style.left = '270px';
	b.o.style.top = '0px';
	b.o.style.position = 'relative';
	b.o.style.display = 'block';
	b.o.innerHTML = str;

	b.div = b.ph.document.createElement('div');
	b.div.style.position = 'fixed';
	try{ b.div.style.top = 'expression(document.getElementsByTagName("body")[0].scrollTop+"px")';} catch(e){}
	b.div.style.overflow = 'hidden';
	b.div.style.bottom ='20%';
	b.div.style.right = '0px';
	b.div.style.width = '235px';
	b.div.style.zIndex = 99;
	b.div.style.display = 'none';
	b.div.appendChild(b.o);

	b.ph.document.body.appendChild(b.div);

	b.disabled=false;
	b.shown=false;
	b.timeout = 0;
	b.hide = this.hide;

	b.timer=0;
	b.frames=30;
	b.tout = 100;

	var closeButton = new Function(b.name+'.disabled=true; baloon.hide('+b.name+');');
	this.addEvent(b.ph.document.getElementById("vsplyvashka_close"), 'click', closeButton);

	if (b.ph.type != 'none'){
		var f = new Function('baloon.listener('+b.name+')');
		this.addEvent(b.ph.window, 'resize', f);
		this.addEvent(b.ph.window, 'scroll', f);
		this.addEvent(b.ph.window, 'load', f);
	} else {
		setTimeout('baloon.show('+b.name+')',  2000);
		setTimeout('baloon.hide('+b.name+')', 12000);
	}
}

};

