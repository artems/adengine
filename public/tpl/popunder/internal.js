// width, height, reference, creative, brandline
if ('undefined' == typeof(kbrand)) var kbrand = 0;
if ('undefined' == typeof(khost)) var khost = 'b.kavanga.ru';
var fv = 'link1=' + escape(reference) + '&target=_blank';
var s = creative.indexOf('?') != -1 ? '&' : '?';
var str = '';
str += '<table border=0 height=100% width=100% cellspacing="0" cellpadding="0" valign="top" align="left"><tr>';
str += '<td valign="top" align="left" height="'+height+'" width="'+width+'">';
str += '<object id="kcflash" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://active.macromedia.com/flash2/cabs/swflash.cab#version=4,0,0,0" width="'+width+'" height="'+height+'">';
str += '<param name="movie" value="' + creative + s + fv +'"';
str += '<param name="quality" value="high">';
str += '<param name="allowscriptaccess" value="always">';
str += '<param name="flashvars" value="' + fv + '">';
str += '<embed src="'+ creative + s + fv +'" name="kcflash" quality="high" allowscriptaccess="always" width="'+width+'" height="'+height+'" flashvars="'+ fv +'" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash">';
str += '</embed></object>';
if (kbrand){
str += '</td></tr><tr style="margin: 0; padding: 0; border:none"><td style="margin: 0; padding: 0; border:none">';
str += '<div style="height:17px; background:url(http://'+ khost +'/tpl/240x400f/bg.gif) repeat-x;"><a style="display:block; height:17px; background:url(http://'+ khost +'/tpl/240x400f/logo.jpg) no-repeat;" href="http://kavanga.ru/a/adv_advantages?f=n" target="_blank"></a></div>';
}
str += '</td></tr>';
str += '</table>';

document.write(str);