
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

if ((typeof __tban != 'undefined') && (__tban.length != 0)){

	//kstr += '<div style="display:block; width:240px !important; _width: 240px !important; position: relative;">\n';

	for (var i in __tban) {
		var el = __tban[i];
		if ((typeof(el) != 'object'))
			continue;
		switch (el.type){
			case 0:	
					var price = !(el.price.indexOf('%') == 0 || el.price == '');
					var oprice = price && !(el.oprice.indexOf('%') == 0 || el.oprice == ''); // old price is available only when price is specified
					kstr += '<table style="overflow: hidden; width: 100%; height: 129px !important; border: 1px solid #b8b8b8; display: block; margin: 2px 2px 2px 2px; border-radius:3px; -webkit-border-radius:3px; -moz-border-radius:3px; -khtml-border-radius: 3px;"><tbody><tr>\n';
					kstr += '<td style="width : 100px; height: 120px; margin: 4px;">\n';
					kstr += '<a href="'+el.banner_url+'" target="_blank" style="text-decoration:none;"><img width=100 height=120 border=0 src="'+el.picture+'"></a></td>\n';
					kstr += '<td style="width: 100%; height: 120px; margin: 4px 8px 8px 4px; font-size:12px!important; line-height:16px!important; font-family: Arial ! important; color:#116cb2!important;">\n';
					kstr += '<a href="'+el.banner_url+'" target="_blank" style="text-decoration:none;">\n';
					kstr += '<div style="width: 100%; height: ' + (oprice ? 64 : (price ? 84 : 115)) + 'px; overflow: hidden; text-align: left; text-decoration: underline;">'+el.text+'</div>\n';
					if (oprice) kstr += '<div style="width: 100%; margin: 12px 0 2px 0; overflow: hidden; text-decoration:line-through; font-size:14px!important; line-height:16px!important;  color: #999999;">'+el.oprice+'</div>\n';
					if (price) kstr += '<div style="float: bottom; width: 110px; margin: 6px 0 0 0; color: #ed801f; font-size: 18px !important; line-height: 20px !important; font-weight: bold; text-decoration:none;">'+el.price+'</div>\n';
					kstr += '</a>\n';
					kstr += '</td>\n';
					kstr += '</tr></tbody></table>\n';
					break;
			case 1:	
					kstr += '<div style="width: 234px; height: 129px; border: 1px solid #b8b8b8; display: block; margin: 2px 2px 2px 2px; border-radius:3px; -webkit-border-radius:3px; -moz-border-radius:3px; -khtml-border-radius: 3px; background: url('+el.picture+') top left no-repeat;">\n';
					kstr += ' <a href="'+el.banner_url+'" target="_blank"  style="text-decoration:none;">\n';
					kstr += ' <div style="width: '+(234-el.m.left-el.m.right)+'px; height: '+(129-el.m.top-el.m.bottom)+'px; margin: '+el.m.top+'px '+el.m.right+'px '+el.m.bottom+'px '+el.m.left+'px; overflow: hidden; font-size:12px!important; font-family: Arial ! important; color:'+el.color+'!important;text-decoration:none; text-align: left;">'+el.text+'</div>\n';
					kstr += '</a>\n';
					kstr += '</div>\n';

					break;
		}
	}

}

kpH.innerHTML = kstr;

if (knc) {
    setTimeout("document.close();", 900);
}
