/*============== PRELOADER =================*/
function preloader(){
	$("#loader-wrapper").css({opacity:"0"});
	
	setTimeout(function(){        
        $("#loader-wrapper").css({display:"none"});
  }, 1500);
}



/*============== SMOOTH SCROLL =============*/
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});



/*=============== TURING TEST ================*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function turingInit(){
		var turingA, turingB, turingAns, userAns;
		
		turingA = getRandomInt(1, 5);
		turingB = getRandomInt(1, 5);
		turingAns = turingA + turingB;
		
		$("#turing-a").html(turingA);
		$("#turing-b").html(turingB);
		
		
		var canvas = document.getElementById("turing-canvas");
		var ctx = canvas.getContext("2d");
		ctx.font = "italic bold 22px Titillium Web";
		ctx.fillStyle = "rgb(244,244,244)";
		ctx.fillText(turingA + "  +  " + turingB + "  =  ", 2, 18);
		
		
		var turingInputBox = $("#turing-answer");
		turingInputBox.data('oldVal', turingInputBox.val());
		
		turingInputBox.bind("propertychange change click keyup input paste", function(event){
			if (turingInputBox.data('oldVal') != turingInputBox.val()) {
				turingInputBox.data('oldVal', turingInputBox.val());
				
				userAns = parseInt(turingInputBox.val(), 10);
				
				if(userAns == turingAns){
					$("#contact-form").attr("action", "http://formspree.io/ashish_verma_1@yahoo.com");
					$("#send-button").attr("disabled", false);
				} else {
					$("#contact-form").attr("action", "");
					$("#send-button").attr("disabled", true);
				}
			}
    });
}



/*=============== FORM SUBMIT BUTTON =========*/
function sendMessage()
{
	$("#send-button").css({background:"rgb(51,255,153)"});
	$("#send-button").css({color:"rgb(75,75,75)"});
	$("#send-button-text").html("Message Sent!");
}


/*============== ON-LOAD =====================*/
window.onload = function(){
	preloader();
	turingInit();
}
