function flver(){
 var d, n = navigator, f = 'Shockwave Flash';
 if((n = n.plugins) && n[f]){d = n[f].description}
 else if (window.ActiveXObject) { try { d = (new ActiveXObject((f+'.'+f).replace(/ /g,''))).GetVariable('$version');} catch (e) { try { new ActiveXObject((f+'.'+f+'.6').replace(/ /g,'')); d='WIN 6,0,21,0';} catch (e) {} }}
 return d ? d.replace(/\D+/,'').split(/\D+/) : [0,0];
};
function kfn(){
var c = '', d = new Array(237,230,243,236,173,244,236,231,237,234,244);
for (var i=0; i<d.length; i++){c = (d[i] ^ 131) + (i ? ',' : '') + c;}
c='String.fromCharCode('+c+');';
eval('c = ' + c);
return c;
}
function getDim(d){
return('"width='+kD[0]+',height='+(kD[1]+(kbrand?17:0))+',top='+kD[2]+',left='+kD[3]+',scrollbars=no,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=no"');
}
function kcw(url,dim){
var c=kfn();
eval('var r='+c+'("'+url+'","_blank",'+getDim(dim)+',false);');
return r;
}
function addEvent(ePtr, eType, eFunc) {
if (ePtr.addEventListener){ePtr.addEventListener(eType, eFunc, false);}
if (ePtr.attachEvent){ePtr.attachEvent('on' + eType, eFunc);}
}
function removeEvent(ePtr, eType, etFunc) {
if (ePtr.removeEventListener) { ePtr.removeEventListener(eType, eFunc, false); return;}
ePtr.detachEvent('on' + eType, eFunc);
}
var kurl='';
function kInitParams(){
var ppparams=Base64.encode(kreference) + '&' + kD[0] + '&' + kD[1] + '&' + Base64.encode(ktrace) + '&' + Base64.encode(kzeropixel) + '&' + Base64.encode(khost) + '&' + kbrand;
if (kSWF != '' && parseInt(flver()[0])>=flv) {
	kurl = 'http://'+khost+'/tpl/popunder/kppflash64.html?' + Base64.encode(kSWF) + '&' + ppparams;
} else if (kGIF != '') kurl = 'http://'+khost+'/tpl/popunder/kppgif64.html?' + Base64.encode(kGIF) + '&' + ppparams;
	else return false;
return true;
}
function kpopinit(){
if (window['kpoploaded'] === true) return;
if (kcw(kurl,kD)){
    setTimeout('win' + 'dow' + '.foc' + 'us()', 100);
    window['kpoploaded'] = true;
    try{
	removeEvent(document,'click',kpopinit);
	removeEvent(window,'click',kpopinit);
    }catch(e){}
} else{
    addEvent(document,'click',kpopinit);
    addEvent(window,'click',kpopinit);
}
}
var kpopbase64_loaded = 1;
