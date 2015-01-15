window.onload = function(){
	$("#loader-wrapper").css({opacity:"0"});
	
	setTimeout(function(){        
        $("#loader-wrapper").css({display:"none"});
    }, 1500);
}
