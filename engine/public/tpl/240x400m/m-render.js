
if ('undefined' == typeof(kpH)) var kpH=null; // main placeholder, it shold be inserted by banner code
if ('undefined' == typeof(kpd)) var kpd=null; // handle of document containing main polaceholder
if ('undefined' == typeof(knc)) var knc=null; // if the code is new (acync) or old (inline or separate)
if ('undefined' == typeof(kphid)) var kphid = 'kph' + Math.round(Math.random()*1000); // id of kpH
if (null == kpH) {
	knc = 0;
	kpd = parent.document;
	if (kpd != document) {
 		kpH = kpd.getElementById(kphid); //search for placeholder in parent document
 		knc = kpH?1:0;
	}
	if (!knc) {kpd = document;kpH = kpd.getElementById(kphid);} // old code, search in current document
	if (!kpH) {document.write('<div id="'+kphid+'">');kpH = kpd.getElementById(kphid);} // not found, create and take handle

	kpH.style.display = "block";
	kpH.style.margins = 0;

}

// ************************************************

var kstr = '';

if ((typeof __mban != 'undefined') && (__mban.length != 0)){

	kstr += '<style type="text/css">div.blockhover:hover { background:url(http://'+ khost +'/tpl/240x400m/banner-block-hover.gif) top left no-repeat;}</style>';

	kstr += '<div style="display:block; height:400px!important; width:240px!important; _width:240px!important; background:#fff url(http://'+ khost +'/tpl/240x400m//brand-line.gif) bottom left no-repeat; position:relative;">\n';
	kstr +=' <div style="display: block; height: 373px ! important; width: 230px ! important; background: url(http://'+ khost +'/tpl/240x400m/background-240-400.jpg) repeat-y scroll left top transparent; position: relative; font-family: Arial ! important; line-height: 16px !important; letter-spacing: normal !important; padding: 5px;">\n';

	for (var i in __mban) {
		var el = __mban[i];
		if ((typeof el != 'object') || (typeof el.picture == 'undefined'))
			continue;
		kstr += '  <div style="overflow:hidden;background:transparent url(http://'+ khost +'/tpl/240x400m/banner-block.gif) top left no-repeat;">\n';
		kstr += '   <div class="blockhover" style="position:relative; height:122px!important; width:230px; margin-bottom: 4px;">\n';
		kstr += '    <a target="_blank" href="'+ el.banner_url +'">\n';
		kstr += '     <img style="position:absolute; left:5px; top:10px; margin:0 8px 0 0 !important; border:0;" src="'+ el.picture +'"></a>\n';
		kstr += '    </a>\n';
		kstr += '    <h4 style="position:absolute; margin:0; top:15px; left:105px; height:50px; font-weight:normal; width:110px; background:#fff!important; overflow:hidden;text-align:left!important; font-size:12px!important; color:#3080c4!important; text-decoration:underline!important;">\n';
		kstr += '     <a style="font-size:12px!important; height:50px!important; overflow:hidden; color:#3080C4 !important; text-align:left !important; text-decoration:underline !important;" target="_blank" href="'+ el.banner_url +'">'+ el.title +'</a>\n';
		kstr += '    </h4>\n';
		kstr += '   <div style="position:absolute; top:88px; left:5px; width:93px!important; text-align:center!important; color:#ed801f!important; white-space:nowrap!important;font-size:'+((el['class'].indexOf('big')==0)?19:14)+'px!important; line-height:18px!important; font-weight: bold;">'+el.price+'</div>\n';
		kstr += '    <a target="_blank" href="'+ el.banner_url +'" style="position:absolute; top:84px; left:143px; z-index:1000; display:block!important; height:26px!important; width:75px!important; background:url(http://'+ khost +'/tpl/240x400m/banner-buy.gif) 0 0 no-repeat!important; color:#3d8826!important;text-decoration:none!important;"></a>\n';
		kstr += '   </div>\n';
		kstr += '  </div>\n';
	}

kstr += '  <a style="display:block;margin-top:4px;width:90px;height:17px" href="http://market.kavanga.ru" target="_blank"></a>\n';
kstr += ' </div>\n';
kstr += '</div>\n';
}

kpH.innerHTML = kstr;

if (knc) {
    setTimeout("document.close();", 900);
}
