var knc = 0;
if ('undefined' != typeof(kphid)) {
    var kpd = parent.document;
    if (kpd != document) {
        var kph = kpd.getElementById(kphid);
        knc = kph ? 1 : 0;
    }
}
if (typeof(khost) == 'undefined') {
    var khost = 'b.kavanga.ru';
}

var adfox_object = '';

function myflver(){
 var d, n = navigator, f = 'Shockwave Flash';
 if((n = n.plugins) && n[f]){d = n[f].description}
 else if (window.ActiveXObject) { try { d = (new ActiveXObject((f+'.'+f).replace(/ /g,''))).GetVariable('$version');} catch (e) { try { new ActiveXObject((f+'.'+f+'.6').replace(/ /g,'')); d='WIN 6,0,21,0';} catch (e) {} }}
 return d ? d.replace(/\D+/,'').split(/\D+/) : [0,0];
};

var hasContent = 0; // Ну реально не знаю, как назвать ))) Вобщем если хоть что то в баннере есть, то она равна 1

adfox_object += '<table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0; border:none"><tr style="margin: 0; padding: 0; border:none"><td style="margin: 0; padding: 0; border:none">';

if ( (parseInt(myflver()[0])>=fv) && (0==swf.toUpperCase().indexOf('HTTP://')) ) {
  hasContent = 1;
  var fv = pname + "=" + escape(ref);
  var src = swf + (( -1 == swf.indexOf('?')) ? '?' : '&') + fv;
  adfox_object += '<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" WIDTH='+w+' height='+h+'>';
  adfox_object += '<PARAM NAME=movie VALUE="'+src+'">';
  adfox_object += '<PARAM NAME=flashvars VALUE="'+fv+'">';
  adfox_object += '<PARAM NAME=wmode VALUE="'+wmode+'">';
  adfox_object += '<PARAM NAME=quality VALUE=high>';
  adfox_object += '<PARAM NAME=bgcolor VALUE="'+bgc+'">';
  adfox_object += '<PARAM NAME=menu VALUE=false>';
  adfox_object += '<PARAM NAME=play VALUE=true>';
  adfox_object += '<PARAM NAME=loop VALUE=true>';
//  adfox_object += '<PARAM NAME=scale VALUE=NoScale>';
  adfox_object += '<EMBED src="'+src+'" menu=false flashvars="'+fv+'" wmode="'+wmode+'" quality=high bgcolor="'+bgc+'" swLiveConnect=FALSE play=true loop=true WIDTH='+w+' height='+h+' TYPE="application/x-shockwave-flash" PLUGINSPAGE="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash">';
  adfox_object += '</EMBED></OBJECT><BR>';
}
else if ( (0==gif.toUpperCase().indexOf('HTTP://')) ){
  hasContent = 1;
  adfox_object += '<a href="'+ref+'" target=_blank><img src="'+gif+'" width='+w+' height='+h+' alt="" border=0><br /></a>';
}

if (brand){
adfox_object += '</td></tr><tr style="margin: 0; padding: 0; border:none"><td style="margin: 0; padding: 0; border:none">';
adfox_object += '<div style="height:17px; background:url(http://'+ khost +'/tpl/240x400f/bg.gif) repeat-x;"><a style="display:block; height:17px; background:url(http://'+ khost +'/tpl/240x400f/logo.jpg) no-repeat;" href="'+event1+'@http://kavanga.ru/a/adv_advantages?f=n" target="_blank"></a></div>';
}
adfox_object += '</td></tr></table>';

if (0 == pixel.toUpperCase().indexOf('HTTP://')) adfox_object += '<div style="position: absolute; top: 1px; left: 1px; width: 1px; height: 1px;"><img src="'+pixel+'" width=1 height=1 border=0></div>';

if (knc){
 if (hasContent){
  kph.innerHTML = adfox_object;
  kph.style.display = 'inline';
  kph.style.width = w;
  kph.style.height = h;
 }
 setTimeout("document.close();", 1000);
} else if (hasContent) {
  document.write(adfox_object);
}
