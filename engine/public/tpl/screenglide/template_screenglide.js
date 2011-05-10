/*screenglide %banner%*/
document.write('<script type="text/javascript" src="http://%khost%/screenglide/screenglide.js"><\/script>');
document.write('<div id="k_inline_div_%place%" style="display: none"></div>');
var banner%place% = {
   name: "banner%place%",
   khost:"%host%",
   kphid:typeof(kphid) != 'undefined' ? kphid : "k_inline_div_%place%",
   fv: parseInt("%_01fv%"),
   link: "%banner_url%",
   valign: "%_02valign%", /*possible values down, up, auto*/
   align: "%_03align%", /*possible values left, right, auto*/
   zeropixel: ["http://%host%/event?event=3&place=%place%&net=%net%&flight=%flight%&banner=%banner%","%_04zeropixel%"],
   small: {
      gif: "%_05plug%",
      swf: "%_06sswf%",
      width: "%_07swidth%",
      height: "_08%sheight%",
      bgc: "%_08sbgc%",
      wmode: "_09%swmode%"
   },
   big: {
      gif: "",
      swf: "%_09bswf%",
      width: "%_10bwidth%",
      height: "%_11bheight%",
      bgc: "%_12bbgc%",
      wmode: "%_13bwmode%",
      forceReload: %_14force% /* Set it to true if a lagre flash should be re-started when appear (display: none/block used)*/
   },
   closebutton: %_15closebutton%,
   timeout: 0 /* Uneditable parameter */
}

if (isNaN(banner%place%.fv)) banner%place%.fv = 8;

function init%placed%(){
   if (typeof(screenglide) != 'undefined' && document.getElementById("k_inline_div_%place%") != null) {screenglide.init(banner%place%);}
   else {setTimeout('init%place%();', 50);}
}

init%place%();
