var screenglide = {
	/* local private defines */
	_pnames : ['link1','clickTAG'],

codeVariant : function(kphid){
	var r = new Object();
	try {
	var pd = parent.document;
	if ( pd !== document ) {
		r.placeholder = pd.getElementById(kphid);
		if (r.placeholder) { /* placeholder found. Wow! We're in async code. */
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
	var res = new Object();
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
_swf : function(file, w, h, link, bgc, wmode, pid){
	var fv = this._pnames[0] + '=' + escape(link);
	for (i=1; i<this._pnames.length; ++i) fv += '&' + this._pnames[i] + "=" + escape(link);
	if (pid) fv += '&fc=' + pid;
	var src = file + (( -1 == file.indexOf('?')) ? '?' : '&') + fv;
	if ('undefined' == bgc) bgc = '#FFFFFF';
	if ('undefined' == wmode) wmode = 'opaque';
	var s = '';
	s += '<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" WIDTH='+w+' HEIGHT='+h+'>';
	s += '<PARAM NAME=movie VALUE="'+src+'">';
	s += '<PARAM NAME=flashvars VALUE="'+fv+'">';
	s += '<PARAM NAME=wmode VALUE="'+wmode+'">';
	s += '<PARAM NAME=quality VALUE=high>';
	s += '<PARAM NAME=bgcolor VALUE="'+bgc+'">';
	s += '<PARAM NAME=menu VALUE=false>';
	s += '<PARAM NAME=play VALUE=true>';
	s += '<PARAM NAME=loop VALUE=true>';
	s += '<EMBED src="'+src+'" menu=false flashvars="'+fv+'" wmode="'+wmode+'" quality=high bgcolor="'+bgc+'" swLiveConnect=FALSE play=true loop=true WIDTH='+w+' height='+h+' TYPE="application/x-shockwave-flash" PLUGINSPAGE="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash">';
	s += '</EMBED></OBJECT><BR>';
	return s;
},
_gif : function(file, w, h, link){
	s = '';
	s += '<center><a href="'+link+'" target=_blank><img src="'+file+'"'+(w.indexOf('%') == -1 ? ' width='+w : '') +(h.indexOf('%') == -1 ? ' height='+h : '')+' alt="" border=0><br /></a></center>';
	return s;
},


/* Now perform checks and return a table with content OR nothing */
obj : function(swf, gif, w, h, link, fv, bgc, wmode, pid){
	var s = '<table border="0" cellpadding="0" cellspacing="0" width="'+w+'" style="width: '+w+(w.indexOf('%')==-1?'px':'')+'; margin: 0; padding: 0; border:none"><tr style="margin: 0; padding: 0; border:none"><td style="vertical-align: middle; margin: 0; padding: 0; border:none; '+(wmode === 'transparent' ? '' : 'background-color: '+ bgc)+'">';
	if ((fv <= parseInt(this.flver()[0])) && (0 == swf.toUpperCase().indexOf('HTTP://'))) {
		s += this._swf(swf, w, h, link, bgc, wmode, pid); 
	} else {
		if (0 != gif.toUpperCase().indexOf('HTTP://')) return '';
		s += this._gif(gif, w, h, link);
	}
	return s;
},

callevent : function(z) {
	for (var i in z) if((typeof(z[i])=="string") && (z[i].toUpperCase().indexOf("HTTP://")==0))(new Image()).src = z[i];
},

listener : function(b){
	var g = screenglide.winsize(b.ph.window, b.ph.document);
	var h = screenglide._FindPos(b.ph.placeholder).top+b.small.height/2; // banner middle
		if (Math.abs(g.scrollY+g.height/2-h)<=g.height/2){ // banner middle is visible
			screenglide.callevent(b.zeropixel);
			screenglide.removeEvent(b.ph.window, 'scroll', b.listener);
			screenglide.removeEvent(b.ph.window, 'resize', b.listener);
			if (b.bigobj != null){
				b.shown = false;
				b.timeout = 0;
				b.show = new Function('screenglide.show('+b.name+')');
				b.hide = new Function('screenglide.hide('+b.name+')');
				b.mmove = new Function('evt', 'screenglide.check4mouse(evt, '+b.name+')');
				screenglide.addEvent(b.ph.placeholder, 'mouseover', b.show);
				screenglide.addEvent(b.bigobj, 'mouseover', b.show);
				screenglide.addEvent(b.bigobj, 'mouseout', b.hide);
				screenglide.addEvent(b.ph.document, 'mousemove', b.mmove);
			}
		}
},

inject : function(banner){
	var p = this.codeVariant(banner.kphid);
	if (p.type == 'async') setTimeout('document.close()', 1000);
	var o = this.obj(banner.small.swf, banner.small.gif, banner.small.width, banner.small.height, banner.link, banner.fv, banner.small.bgc, banner.small.wmode);
	if ('' == o) return null;
	p.placeholder.innerHTML = o;
	with(p.placeholder.style) {
		display = 'block';
		visibility = 'visible';
		width = banner.small.width + (banner.small.width.indexOf('%') == -1 ? 'px' : '');
		height = banner.small.height + (banner.small.height.indexOf('%') == -1 ? 'px' : '');;
	}
	return p;
},

bigban : function(banner){
	var o = this.obj(banner.big.swf, banner.big.gif, banner.big.width, banner.big.height, banner.link, banner.fv, banner.big.bgc, banner.big.wmode, banner.pid);
	if ('' == o) { banner.bigobj = null; return; }
	var d = banner.ph.document.createElement('div');
	d.id = banner.name+'big';
	d.innerHTML = o;
	with(d.style){
		position = 'absolute';
		visibility = 'hidden';
		top = '1px';
		left = '1px';
		width = banner.big.width + (banner.big.width.indexOf('%') == -1 ? 'px' : '');
		height = banner.big.height + (banner.big.height.indexOf('%') == -1 ? 'px' : '');
		zIndex = 99;
	}
	d.style.display = banner.big.forceReload ? 'none' : 'block';
	banner.ph.document.body.appendChild(d);
	banner.bigobj = d;
	if (banner.closebutton === true) {
		var c = this.closebutton(banner);
		d.appendChild(c);
	}
	this.createCloseFunction(banner);
},

init : function(b){
	b.ph = this.inject(b);
	if (null != b.ph) {
		this.bigban(b)
		b.listener = new Function('screenglide.listener('+b.name+')');
		this.addEvent(b.ph.window, 'scroll', b.listener);
		this.addEvent(b.ph.window, 'resize', b.listener);
		b.listener(); // forse check, banner maight be already visible
		b.disabled = false;
	}
},

show : function(banner){
	if (banner.disabled) return;
	if (banner.timeout) { clearTimeout(banner.timeout); timeout=0; }
	if (banner.shown) return;
	banner.shown = true;
	var pos = this._FindPos(banner.ph.placeholder);
	var align = ((banner.align === 'right') ? 0 : ((banner.align === 'left') ? 1 : 3));
	var valign= ((banner.valign === 'up') ? 0 : ((banner.valign === 'down') ? 1 : 3));
//	var bd = banner.ph.window.top.document.documentElement;
//	if (!bd.clientWidth) bd = banner.ph.window.top.document.body;
	var bd = banner.ph.document.documentElement;
	if (!bd.clientWidth) bd = banner.ph.document.body;
	if (align==3){
		if ((bd.clientWidth/2) < (pos.left+banner.small.width/2)) align = 0;
		else align = 1;
	}
	if (valign==3){
		if ((bd.clientHeight/2) < (pos.top+banner.small.height/2)) valign = 0;
		else valign = 1;
	}
	var dx = align ? 0 : (banner.small.width-banner.big.width); if (isNaN(dx)) dx=0; // to avoid NaN in case of %
	var dy = valign ? 0 : (banner.small.height-banner.big.height); if (isNaN(dy)) dy=0;
	with(banner.bigobj.style){
		left = pos.left + dx + 'px';
		top = pos.top + dy + 'px';
		visibility = 'visible';
	}
	if(banner.big.forceReload)banner.bigobj.style.display = 'block';
	banner.ph.placeholder.style.visibility = 'hidden';
},

do_hide : function(b){
	b.ph.placeholder.style.visibility = 'visible';
	b.bigobj.style.visibility = 'hidden';
	if(b.big.forceReload) b.bigobj.style.display = 'none';
},

hide : function(b){
	if (!b.shown) return;
	b.shown = false;
	b.timeout = setTimeout('screenglide.do_hide('+b.name+')', 500);
},

closebutton : function(banner){
	var d = banner.ph.document.createElement('div');
	with (d.style){
		display = 'block';
		position = 'absolute';
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
		cursor = 'pointer';
	}
	a.innerHTML = '&#1047;&#1072;&#1082;&#1088;&#1099;&#1090;&#1100;';
	d.appendChild(a);
	var show = new Function('screenglide.show('+banner.name+')');
	screenglide.addEvent(d, 'mouseover', show); // avoid mouseout on big component
	screenglide.addEvent(d, 'mouseout', show);
	banner.closefunction = new Function('screenglide.close('+banner.name+'); return false;');
	screenglide.addEvent(a, 'click', banner.closefunction)
	return d;
},

createCloseFunction : function(b){
	b.ph.window['fl_close_'+b.pid] = new Function('{' + b.name + '.closefunction();}');
},

close : function (b){
	b.disabled = true;
	if (b.timeout) { clearTimeout(b.timeout); b.timeout=0; }
	screenglide.do_hide(b); // now force hiding big banner
},

/* Stupid MAC Firefox block */

mousePos : function(evt, ph) {
	var pos = {};
	if (evt.pageX) pos.x = evt.pageX;
	else if (evt.clientX) pos.x = evt.clientX + (ph.document.documentElement.scrollLeft ? ph.document.documentElement.scrollLeft : ph.document.body.scrollLeft);
	else pos.x = null;
	if (evt.pageY) pos.y = evt.pageY;
	else if (evt.clientY) pos.y = evt.clientY + (ph.document.documentElement.scrollTop ? ph.document.documentElement.scrollTop : ph.document.body.scrollTop);
	else pos.y = null;
	return pos;
},

check4mouse : function(evt, banner){
	if (!banner.shown) return; /* we intend to hide banner, do nothing if it was shown */
	var mouse = this.mousePos(evt, banner.ph); /* retrive mouse position */
	var pos = this._FindPos(banner.bigobj); /* retrive bigobj position */
	var w = banner.bigobj.offsetWidth; /* retrive bigobj size */
	var h = banner.bigobj.offsetHeight;
	if ((mouse.x >= pos.left) && (mouse.x <= (pos.left + w)) && (mouse.y >= pos.top) && (mouse.y <= (pos.top + h))) return; /* It is yet OK */
	this.hide(banner);
	return false;
}

}
