ar k_l = document.createElement('script');
k_l.type="text/javascript"; k_l.src=('https:' == document.location.protocol ? 'https://' : 'http://') + '%host%/tpl/kline/kline.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(k_l, s);
var banner2132811 = {
	name:	"banner2132811",
	khost:	"b.kavanga.ru",
	kphid:	typeof(kphid) != 'undefined' ? kphid : "k_inline_div_2132811",
	fv:		parseInt("8"),
	link:	"http://medialand.ru",
	zeropixel: ["http://localhost/event","http://ad.adriver.ru/cgi-bin/event.cgi?"],
	small:	{
		gif:	"http://localhost/banners/kline/mts121_760x60v1.gif",
		swf:	"http://localhost/banners/kline/mts121_760x60v1.swf",
		width:	"100%",
		height:	"60",
		bgc:	"#FFFFFF",
		wmode:	"opaque"
	},
	big:	{
		gif:	"",
		swf:	"http://localhost/banners/kline/mts121_760x300v4.swf",
		width:	"100%",
		height:	"300",
		bgc:	"#FFFFFF",
		wmode:	"opaque",
		forceReload:	false /* Set it to true if a lagre flash should be re-started when appear (display: none/block used)*/
	}
}

function init2132811(){
	if (typeof(kline) != 'undefined') {kline.init(banner2132811);}
	else {setTimeout('init2132811();', 50);}
}

init2132811();

