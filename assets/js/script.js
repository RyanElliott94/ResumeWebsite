var firebaseConfig = {
    apiKey: "AIzaSyC4Lje66T1d-8ftmL3gbMGCBzJGyRl1Zs0",
    authDomain: "resume-website-82d49.firebaseapp.com",
    databaseURL: "https://resume-website-82d49.firebaseio.com/",
    projectId: "resume-website-82d49",
    storageBucket: "resume-website-82d49.appspot.com",
    messagingSenderId: "243297998276",
    appId: "1:243297998276:web:8eb168a1511fd9a3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

	var colours = [
		"#66a0ff",
		"#aa66ff",
		"#ff66b7",
		"#fc5f5f",
		"#97ff87",
		"#4cffb4",
		"#fffc70",
		"#a8f3f7"
		];

		var ele = {
			navBar: $(".navbar"),
			navLinks: $(".nav-link,.navbar-brand"),
			mainContent: $(".main-content"),
			aboutContainer: $(".about-container"),
			welcomeContainer: $(".welcome-container"),
			showTextBtn0: $(".showText-btn-0"),
			hideTextBtn0: $(".hideText-btn-0"),
			hideTextBtn1: $(".hideText-btn-1"),
			showTextBtn1: $(".showText-btn-1"),
			hideShowText0: $(".hideShow-0"),
			hideShowText1: $(".hideShow-1"),
			navRegister: $("#nav-signup"),
			navLogin: $("#nav-login"),
			navLogout: $("#nav-logout")
		};

		checkUserState();

		function checkUserState() {
		firebase.auth().onAuthStateChanged(function(user) {
		  if(user){
		    ele.navLogout.css({display:"block"});
		    ele.navLogout.on("click", signOut);
		  }else{
		  	ele.navRegister.css({display:"block"});
		  	ele.navLogin.css({display:"block"});
		  }
		});
		}


		function signOut() {
        firebase.auth().signOut().then(function () {
            console.log("Signed out!!");
            hideLoggedOutBtns();
        }).catch(function (error) {

        });
    }
    
		$(document).ready(function(){
		// 	$("body").css("background", colours[Math.floor(Math.random() * colours.length)]);
		initClickFuncs();
		initAnimantion();
			var doc = document.head.innerHTML;

		});

		function initClickFuncs(){
			ele.showTextBtn0.on("click", toggleFirstPara);
		    ele.hideTextBtn0.on("click", toggleFirstPara);
		    ele.showTextBtn1.on("click", toggleSecondPara);
		    ele.hideTextBtn1.on("click", toggleSecondPara);

		//     $(".squares div").on("click", function(){
		//       switch(this.id){
		// 		case "square-0":
		//         ele.projText.fadeIn(500);
		//         ele.currentProjText.fadeToggle(500);
		//         ele.squares.fadeToggle(500);
		// 		break;
		// 		case "square-1":
		//         ele.projText.fadeToggle(500);
		//         ele.comingProjText.fadeToggle(500);
		//         ele.squares.fadeToggle(500);
		// 		break;
		// 		case "square-2":
		//         ele.projText.fadeToggle(500);
		//         ele.futureProjText.fadeToggle(500);
		//         ele.squares.fadeToggle(500);
		// 		break;
		// 		case "square-3":
		//         ele.projText.fadeToggle(500);
		//         ele.plansProjText.fadeToggle(500);
		//         ele.squares.fadeToggle(500);
		// 		break;
		// 	}
		// });

		$(".proj-text button").on("click", function(){
			switch(this.id){
				case "proj-txt-btn-0":
				ele.projText.fadeToggle(500);
				ele.currentProjText.fadeToggle(500);
				break;
				case "proj-txt-btn-1":
				ele.projText.fadeToggle(500);
				ele.comingProjText.fadeToggle(500);
				break;
				case "proj-txt-btn-2":
				ele.projText.fadeToggle(500);
				ele.futureProjText.fadeToggle(500);
				break;
				case "proj-txt-btn-3":
				ele.projText.fadeToggle(500);
				ele.plansProjText.fadeToggle(500);
				break;
			}
		});
		}

		function toggleFirstPara(){
			if(ele.hideShowText0.is(":hidden")){
			ele.hideShowText0.slideToggle(1200, function(){
		    ele.showTextBtn0.fadeToggle(1200);
			});
			}else{
				hideFirstPara();
			}
		}


		function toggleSecondPara(){
			if(ele.showTextBtn1.is(":hidden")){
			ele.hideShowText1.slideToggle(1200, function(){
		    ele.showTextBtn1.fadeToggle(1200);
			});
			}else{
				hideSecondPara();
			}
		}

		function hideFirstPara(){
		ele.showTextBtn0.fadeToggle(1300);
		ele.hideShowText0.slideToggle(1300);
		}

		function hideSecondPara(){
		ele.showTextBtn1.fadeToggle(1300);
		ele.hideShowText1.slideToggle(1300);
		}

		function initAnimantion(){
		$(".udemy").slideToggle(1300);
		ele.aboutContainer.slideToggle(1300);
		ele.welcomeContainer.fadeToggle(1300);
		$(".card").slideToggle(1300);
		}

		// 	function oldCSSCode(){

	// 		var customCSS = {
	// 	mainContent: {
	// 		background: "#EEEEEE"
	// 	},

	// 	squaresCSS: {
	// 	    fontSize: "1.5rem",
	// 	    lineHeight: "1.5"
	// 	    },

	// 	 ProjTextCSS: {
	// 	    background: "#EEEEEE",
	// 	    // position: "absolute",
	// 	    top: "50%",
	// 	    left: "10%",
	// 	    marginTop: "200px",
	// 	    marginLeft: "-100px"
	// 	    },

	// 	 navBarCSS: {
	// 	 	backgroundColor: "#69D4AC",
	// 	 	fontSize: "1rem"
	// 	 },
		 
	// 	 bodyCSS: {
	// 	 	backgroundColor: "#363A47",
	// 	 	fontFamily: "'Quicksand', sans-serif",
	// 		fontWeight: 400,
	// 		fontSize: ".9rem",
	// 		color: "#464646",
	// 	 }
	// 	};


	// 		function initCSS(){
	// 		ele.mainContent.css(customCSS.mainContent);
	// 		ele.navBar.css(customCSS.navBarCSS);
	// 		ele.modBody.css(customCSS.bodyCSS);
	// 		ele.squares.css(customCSS.squaresCSS);
	// 		ele.projText.css(customCSS.ProjTextCSS);
	// 		ele.navLinks.css({color:"white"})
	// 		ele.navBtnsLinks.hover(
 //            function(){
 //            $(this).css({color:'#464646'});
 //            },
 //            function(){
 //            $(this).css({color:'white'});
 //            });
	// 	}
	// }