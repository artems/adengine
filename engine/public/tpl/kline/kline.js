
var kline = {
	/* local private defines */
	_pnames : ['link1','clickTAG'],

codeVariant : function(kphid){
	var r = new Object();
	try {
	var pd = parent.document;
	if (pd != document){
		r.placeholder = pd.getElementById(kphid);
		if (r.placeholder){ // placeholder found. Wow! We're in async code.
			r.document = pd;
			r.window = parent;
			r.type = 'async';
			return r;
		}
	}
	} catch(e) {}
	r.document = document;
	r.window = window;
	r.placeholder = document.getElementById(kphid);
	r.type = (r.placeholder ? 'none' : 'inline');
	return r;
},

flver : function(){
	var d, n = navigator, f = 'Shockwave Flash';
	if((n = n.plugins) && n[f]){d = n[f].description}
	else if (window.ActiveXObject) { try { d = (new ActiveXObject((f+'.'+f).replace(/ /g,''))).GetVariable('$version');} catch (e) { try { new ActiveXObject((f+'.'+f+'.6').replace(/ /g,'')); d='WIN 6,0,21,0';} catch (e) {} }}
	return d ? d.replace(/\D+/,'').split(/\D+/) : [0,0];
},

/* find a current position of the object */
_FindPos : function(obj) {
	var res = {};
	res.left = 0; res.top = 0;
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
	g.scrollX = this.getBodyScrollLeft(win, doc);
	g.scrollY = this.getBodyScrollTop(win, doc);
	return g;
},

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
	s += '<center><a href="'+link+'" target=_blank><img src="'+file+'"'+(w.indexOf('%') == -1 ? ' width='+w : '') +(h.indexOf('%') == -1 ? ' height='+h : '')+' alt="" border=0><br /></a></center>';
	return s;
},


/* Now perform checks and return a table with content OR nothing */
obj : function(swf, gif, w, h, link, fv, bgc, wmode){
	var s = '<table border="0" cellpadding="0" cellspacing="0" width="'+w+'" style="width: '+w+(w.indexOf('%')==-1?'px':'')+'; margin: 0; padding: 0; border:none"><tr style="margin: 0; padding: 0; border:none"><td style="valign: middle; margin: 0; padding: 0; border:none; '+(wmode === 'transparent' ? '' : 'background-color: '+ bgc)+'">';
	if ((fv <= parseInt(this.flver()[0])) && (0 == swf.toUpperCase().indexOf('HTTP://'))) {
		s += this._swf(swf, w, h, link, bgc, wmode); 
	} else {
		if (0 != gif.toUpperCase().indexOf('HTTP://')) return '';
		s += this._gif(gif, w, h, link);
	}
	return s;
},

callevent : function(z) {
	for (var i=0; i<z.length; ++i) if(z[i].toUpperCase().indexOf("HTTP://")==0)(new Image()).src = z[i];
},

ieHack : function(b){
	var g = this.winsize(b.ph.window, b.ph.document);
	b.smallobj.style.top = (g.height+g.scrollY - b.small.height) + 'px';
	b.bigobj.style.top= (g.height+g.scrollY - b.big.height) + 'px';
},
listener : function(b){
	this.callevent(b.zeropixel); /* No need actualy, but let it be */
	if (b.bigobj != null){
		var show = new Function('kline.show('+b.name+')');
		var mmove = new Function('evt', 'kline.check4mouse(evt, '+b.name+')');
		var hide = new Function('kline.hide('+b.name+');');
		kline.addEvent(b.smallobj, 'mouseover', show);
		if ('\v'=='v'){
		    kline.addEvent(b.bigobj, 'mouseover', show);
		    kline.addEvent(b.bigobj, 'mouseout', hide);
		    var iehack = new Function('kline.ieHack('+b.name+');');
		    kline.addEvent(b.ph.window, 'scroll', iehack);
		    kline.addEvent(b.ph.window, 'resize', iehack);
		} else if (window.opera){
		    kline.addEvent(b.bigobj, 'mouseover', show);
		    kline.addEvent(b.bigobj, 'mouseout', hide);
		} else kline.addEvent(b.ph.window, 'mousemove', mmove);
	}
},

inject : function(banner){
	var p = this.codeVariant(banner.kphid);
	if (p.type == 'async') setTimeout('document.close()', 1000);
	var o = this.obj(banner.small.swf, banner.small.gif, banner.small.width, banner.small.height, banner.link, banner.fv, banner.small.bgc, banner.small.wmode);
	if ('' == o) return null;
	var d = p.document.createElement('div');
	d.id = banner.name+'small';
	d.innerHTML = o;
	with(d.style){
		display = 'block';
		if ('\v'=='v'){
			position = 'absolute';
			var g = this.winsize(banner.ph.window, banner.ph.document)
			top = (g.height+g.scrollY - banner.small.height) + 'px';
		} else {
		    bottom = '0px';
		    position = 'fixed';
		}
		left = '0px';
		visibility = 'visible';
		width = '100%';
		height = banner.small.height + 'px';
		zIndex = 98;
	}
	p.document.body.appendChild(d);
	banner.smallobj = d;
	return p;
},

closebutton : function(banner){
	var d = banner.ph.document.createElement('div');
	with (d.style){
		display = 'block';
		position = 'absolute';
		overflow = 'visible';
		zIndex = 99;
		top = '15px';
		right = '15px';
		width = '75px';
	}
	var a = banner.ph.document.createElement('span');
	with(a.style){
		background = 'url("http://'+banner.khost+'/tpl/kline/close.gif") no-repeat scroll right top transparent';
		display = 'block';
		height = '20px';
		padding = '3px 20px 0 0';
		font = '12px/1.1675 Arial,sans-serif';
		textDecoration = 'underline';
		width = '55px';
		zIndex = '100';
		position = 'absolute';
		top = '25px';
		right = '8px';
	}
	a.innerHTML = '&#1047;&#1072;&#1082;&#1088;&#1099;&#1090;&#1100;';
	d.appendChild(a);
	if ('\v'=='v' || window.opera){
	    var show = new Function('kline.show('+banner.name+')');
	    kline.addEvent(d, 'mouseover', show);
	    kline.addEvent(d, 'mouseout', show);
	}
	var close = new Function('kline.close('+banner.name+'); return false;');
	kline.addEvent(a, 'click', close)
	return d;
},

bigban : function(banner){
	var o = this.obj(banner.big.swf, banner.big.gif, banner.big.width, banner.big.height, banner.link, banner.fv, banner.big.bgc, banner.big.wmode);
	if ('' == o) { banner.bigobj = null; return; }
	var d = banner.ph.document.createElement('div');
	d.id = banner.name+'big';
	d.innerHTML = o;
	with(d.style){
		if ('\v'=='v'){
		    position = 'absolute';
			var g = this.winsize(banner.ph.window, banner.ph.document);
		    top = (g.height+g.scrollY - banner.big.height) + 'px';
		} else {
		    bottom = '0px';
		    position = 'fixed';
		}
		left = '0px';
		visibility = 'hidden';
		width = '100%';
		height = banner.big.height + 'px';
		zIndex = 98;
	}
	d.style.display = banner.big.forceReload ? 'none' : 'block';
	banner.ph.document.body.appendChild(d);
	banner.bigobj = d;
	var c = this.closebutton(banner);
	d.appendChild(c);
},

init : function(b){
	/* drop IE6 */
//	if ( !!( !navigator.userAgent.match(/opera/gim) && /msie\s*([\w.]+)/gim.exec(navigator.userAgent) && (/msie\s*([\w.]+)/gim.exec(navigator.userAgent)[1] <= 7)) ) return;
	b.ph = this.inject(b);
	if (null != b.ph) {
		this.bigban(b)
		b.shown = false;
		b.timeout = null;
		kline.listener(b);
	}
},

show : function(banner){
	if (banner.timeout) clearTimeout(banner.timeout);
	if (banner.shown) return;
	banner.bigobj.style.visibility = 'visible';
	if(banner.big.forceReload)banner.bigobj.style.display = 'block';
	banner.smallobj.style.visibility = 'hidden';
	banner.shown = true
},

dohide : function(banner){
	banner.smallobj.style.visibility = 'visible';
	banner.bigobj.style.visibility = 'hidden';
	if(banner.big.forceReload) banner.bigobj.style.display = 'none';
},

hide : function(banner){
	if (!banner.shown) return;
	banner.shown = false;
	banner.timeout = setTimeout('kline.dohide('+banner.name+')', 500);
},

close : function(banner){
	banner.ph.document.body.removeChild(banner.bigobj);
	banner.ph.document.body.removeChild(banner.smallobj);
},

/* Stupid MAC Firefox block */

mousePos : function(evt, ph) {
	var pos = {};
	if (evt.pageX) pos.x = evt.pageX;
	else if (evt.clientX) return pos.x = evt.clientX + (ph.document.documentElement.scrollLeft ? ph.document.documentElement.scrollLeft : ph.document.body.scrollLeft);
	else pos.x = null;
	if (evt.pageY) pos.y = evt.pageY;
	else if (evt.clientY) pos.x = evt.clientY + (ph.document.documentElement.scrollTop ? ph.document.documentElement.scrollTop : ph.document.body.scrollTop);
	else pos.y = null;
	return pos;
},

check4mouse : function(evt, banner){
	if (!banner.shown) return; /* we intend to hide banner, do nothing if it was shown */
	var mouse = this.mousePos(evt, banner.ph); /* retrive mouse position */
	var pos = this._FindPos(banner.bigobj); /* retrive bigobj position */
	var w = banner.bigobj.offsetWidth; /* retrive bigobj size */
	var h = banner.bigobj.offsetHeight;
	var l = pos.left + (banner.ph.document.documentElement.scrollLeft ? banner.ph.document.documentElement.scrollLeft : banner.ph.document.body.scrollLeft);
	var t = pos.top + (banner.ph.document.documentElement.scrollTop ? banner.ph.document.documentElement.scrollTop : banner.ph.document.body.scrollTop);
	if ((mouse.x >= l) && (mouse.x <= (l + w)) && (mouse.y >= t) && (mouse.y <= (t + h))) return; /* It is yet OK */
	this.hide(banner);
	return false;
}

}
