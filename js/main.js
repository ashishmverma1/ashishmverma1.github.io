function sendMessage(){$("#send-button").css({background:"rgb(51,255,153)"});$("#send-button").css({color:"rgb(75,75,75)"});$("#sendMssgText").css({display:"none"});$("#sentText").css({display:"block"})}$(function(){$("a[href*=#]:not([href=#])").click(function(){if(location.pathname.replace(/^\//,"")==this.pathname.replace(/^\//,"")&&location.hostname==this.hostname){var e=$(this.hash);e=e.length?e:$("[name="+this.hash.slice(1)+"]");if(e.length){$("html,body").animate({scrollTop:e.offset().top},1e3);return false}}})})