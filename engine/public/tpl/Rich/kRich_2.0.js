// Kavanga RichMedia script
// Copyright (c) Dmitry Klavdiev klavdiev@kavanga.ru
// last changed at 12.07.10 18:53

//window.onerror = function () {return true};

// global variables
if (typeof(kzeropixel) == 'undefined') { var kzeropixel = '';}
var kwmode = 'transparent'; // keep in mind for opera does not like transparency
var k_timer=0;
var k_frame=15;
var k_frames=30;
var k_tout = 700;

// common functions
function myflver(){
 var d, n = navigator, f = 'Shockwave Flash';
 if((n = n.plugins) && n[f]){d = n[f].description}
 else if (window.ActiveXObject) { try { d = (new ActiveXObject((f+'.'+f).replace(/ /g,''))).GetVariable('$version');} catch (e) { try { new ActiveXObject((f+'.'+f+'.6').replace(/ /g,'')); d='WIN 6,0,21,0';} catch (e) {} }}
 return d ? d.replace(/\D+/,'').split(/\D+/) : [0,0];
};

function addEvent(ePtr, eventType, eventFunc) {
 if (ePtr.addEventListener){ePtr.addEventListener(eventType, eventFunc, false);}
 if (ePtr.attachEvent){ePtr.attachEvent('on' + eventType, eventFunc);}
}

function getBodyScrollTop() {
    return self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
}

function getBodyScrollLeft() {
    return self.pageXOffset || (document.documentElement && document.documentElement.scrollLeft) || (document.body && document.body.scrollLeft);
}

function my_winsize(){
 var g = new Object(); g.width = 0; g.height = 0;
 var db = document.body; de = document.documentElement;
 try{ 
  if (window.innerWidth == undefined) throw(new Error(-22,''));
  g.width = window.innerWidth;
  g.height = window.innerHeight;
  if(self.outerWidth == g.cw || db.clientWidth == db.scrollWidth){ 	
	g.width = db.clientWidth;
  }
 }catch(e){ try{
  if (de && de.clientHeight){
	g.width = de.clientWidth;
	g.height = de.clientHeight;
  } else {
	g.width = db.clientWidth;
	g.height = db.clientHeight;
  }
 }catch(e) {}}
 g.scrollLeft=getBodyScrollLeft();;
 g.scrollTop=getBodyScrollTop();;
 return g;
}

//======================================

function kObj(id, src, width, height, wmode, quality, link){
  var ret = '';
  var s = (typeof(link) == 'undefined' || link == '') ? '' : ((src.indexOf('?') == -1) ? '?' : '&'); 
  ret  = '<object id="' + id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="' + width + '" height="' + height + '">\n';
  ret  += '<param name="movie" value="' + src + ((s == '') ? '' : s + 'link1=' + escape(link)) +'" />\n';
  ret  += (s == '') ? '' : ('<param name="flashvars" value="' + 'link1=' + escape(link) + '" />\n');
  ret  += '<param name="play" value="true" />\n';
  ret  += '<param name="loop" value="false" />\n';
  ret  += '<param name="allowScriptAccess" value="always" />\n';
  ret  += '<param name="wmode" value="' + wmode + '" />\n';
  ret  += '<param name="quality" value="' + quality + '" />\n';
  ret  += '<param name="menu" value="false" />\n';
  ret  += '<embed name="' + id + '" type="application/x-shockwave-flash" src="' + src + ((s == '') ? '' : s + 'link1=' + escape(link)) + '" width="' + width + '" height="' + height + '" play="true" loop="false" wmode="' + wmode + '" allowScriptAccess="always" ' + ((s == '') ? '' : 'flashvars="' + 'link1=' + escape(link) +'" ') + 'quality=' + quality + ' menu="false" pluginspage="http://www.macromedia.com/go/getflashplayer" />\n';
  ret  += '</object>';
  return ret;
}

var klist = new Array();

function set(v,d){return ('undefined' == typeof(v) ? d : v);}

function kobject(id, src, width, height, x, y, IsAbs, wmode, quality, link){
	this.id = id;
	this.src = set(src, '');
	this.width = set(width, 1);
	this.height = set(height, 1);
	this.x = set(x, 0.5);
	this.y = set(y, 0.5);
	this.IsAbs = set(IsAbs, false);
	this.wmode = set(wmode, 'transparent');
	this.quality = set(quality, 'best');
	this.link = set(link, '');
	this.reposition = kSetPosition;
	this.hide = khide;
	return this;
}


// RichMedia specific functions
function kbe__callEvent(number){ // rewrite!
 (new Image).src = ktrace;
 if (kzeropixel.toUpperCase().indexOf('HTTP://')==0) (new Image).src = kzeropixel
}

function callEvent(number)
{
    kbe__callEvent(number);
}


function khide(){
	for (var i = 0; i < klist.length; ++i) try {
		var handle = document.getElementById(klist[i].id);
		handle.parentNode.removeChild(handle);
	} catch(e){}// potentialy dangerous in firefox
}

function kCommand(pCmd, pArgs){
	if (pCmd == 'kill') {
		khide();
		return;
	}
	if (pCmd == 'start') {
		var j = parseInt(pArgs);
		if (!(isNaN(j)) && j >= 0 && j < klist.length){
			var p = k_newpos(klist[j].width,klist[j].height,klist[j].x,klist[j].y,klist[j].IsAbs);
			for (var i = 0; i < klist.length; ++i){
				var d = document.getElementById(klist[i].id);
				d.style.visibility = ((i == j) ? 'visible' : 'hidden');
				d.style.display = ((i == j) ? 'block' : 'none'); // thios will make start movie from beginning
				k_repos(klist[i].id, (i==j) ? p.left : 0, (i==j)? p.top : 0);
			}
		}
		return;
	}
	if (pCmd == 'click') {
		var link = kreference;
		if (typeof(pArgs) != 'undefined' && pArgs.toUpperCase().indexOf("HTTP://") == 0) link += '&rleurl=' + escape(pArgs);
		window.open(link);
		setTimeout('khide();',100);
		return;
	}
}

function kclick(){ // for compatibility with old movie versions
	kCommand("click");
}

function fl_Command(a, b){ // for AdRiver compatibility...
	kCommand(a, b);
}

function k_newpos(w,h,xpos,ypos,isabs){
  var pos = new Object();
  var x=xpos, y=ypos; 
  var g = my_winsize(); 
  if (!isabs){
    x = Math.round(g.width*xpos-w/2); 
    if (x+w>g.width){x=g.width-w;} if (x<0){x=0;}
    y=Math.round(g.height*ypos-h/2);
    if (y+h>g.height){y=g.height-h;} if (y<0){y=0;}
  }
  pos.left = g.scrollLeft + x;
  pos.top = g.scrollTop + y;
  return pos;
}

function k_inplace(divid, newx, newy){
  var res = true;
  var o=document.getElementById(divid);
  if(o){res = (o.style.left == newx) && (o.style.top == newy);}
  return res;
}

function k_repos(divid, x, y){
  var o=document.getElementById(divid);
  if(o){
   o.style.left = x + 'px';
   o.style.top = y + 'px';
  }
}

function k_getpos(divid){
  var pos = new Object(); pos.left=0; pos.top=0;
  var o=document.getElementById(divid);
  if(o){
   pos.left = parseInt(o.style.left);
   pos.top = parseInt(o.style.top);
  }
  return pos;
}

function k_animate(divid, dx, dy, newx, newy){
  if (k_timer) {clearTimeout(k_timer); k_timer = 0;}
  if (!k_inplace(divid, newx, newy)) { 
	var c = k_getpos(divid); 
	if (Math.abs(dx) > Math.abs(newx-c.left)) {dx=newx-c.left;}
	if (Math.abs(dy) > Math.abs(newy-c.top)) {dy=newy-c.top;}
    k_repos(divid, c.left+dx, c.top+dy); 
	k_timer=setTimeout('k_animate("'+divid+'",'+dx+','+dy+','+newx+','+newy+')', k_frame);
  } 
}

function kreposition(divid,w,h,xpos,ypos,isabs){
  if (k_timer) {clearTimeout(k_timer);}
  var p = k_newpos(w,h,xpos,ypos,isabs);
  var c = k_getpos(divid);
  var dx = Math.round((p.left-c.left)/k_frames);var dy=Math.round((p.top-c.top)/k_frames);
	k_timer=setTimeout('k_animate("'+divid+'",'+dx+','+dy+','+p.left+','+p.top+')', k_tout);
}

function kSetPosition(){
  with(this){kreposition(id,width,height,x,y,IsAbs);}
}
function kSetAllPositions(){
	for (var i = 0; i< klist.length; ++i) {
		try{if (document.getElementById(klist[i].id).style.visibility == 'visible') klist[i].reposition();}catch(e){} // fucking IE
	}
}

function k_init(){
//	var ua = navigator.userAgent;
//	if ((ua.indexOf('X11;')!=-1) || (ua.indexOf('Linux')!=-1)) {kwmode='window'}; // transparent wmode does not work under Linux

	for (var i = 0; i < klist.length; ++i){
		var o = klist[klist.length - i - 1];
		var s = kObj('kcflash'+o.id, o.src, o.width, o.height, o.wmode, o.quality, o.link);
		s+= '<script language=VBScript\>\n';
		s+= 'on error resume next\n';
		s+= 'Sub kcflash' + o.id + '_FSCommand(ByVal pCmd, ByVal pArgs)\n';
		s+= '  call kCommand(pCmd, pArgs)\n';
		s+= 'end sub\n';
		s+= '<\/SCRIPT\>\n';
		s+= '<script type="text/javascript" language="JavaScript">\n';
		s+= 'function kcflash'+o.id+'_DoFSCommand(pCmd, pArgs){\n';
//		s+= ' alert("c: " + pCmd + " a: " + pArgs);\n';
		s+= ' kCommand(pCmd, pArgs);\n';
		s+= '}<\/script>\n';

		var d = document.createElement('div');
		d.id = o.id;
		d.style.position = 'absolute';
		d.style.visibility = 'hidden';
		d.style.display = 'none';
		d.style.width = o.width+'px';
		d.style.height = o.height+'px';
		d.style.zIndex = '99';
		d.style.left = '1';
		d.style.top = '1';
		d.innerHTML = s;
		document.body.appendChild(d);
	}

}

var kRich_v2 = "2.0.0"; // This is a last line of the script/ I shell check if it is loaded by checking this variable
