img1 = new Image(1600,900);
img1.src = "img/bg.jpg";

$(document).ready(function() {
	$("#loader-wrapper").css({opacity:"0"});
	
	setTimeout(function(){        
        $("#loader-wrapper").css({display:"none"});
    }, 1500);
});