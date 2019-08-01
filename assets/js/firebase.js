const firebaseConfig = {
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

$(document).ready(() => {
    const Elements = {
        userEmail: $(".email-text-box"),
        userPass: $(".pass-text-box"),
        username: $(".username-text-box"),
        userRegister: $("#signup"),
        userLogin: $("#login"),
        navRegister: $("#nav-signup"),
        navLogin: $("#nav-login"),
        navLogout: $("#nav-logout"),
        submitComment: $(".sub-comment-btn"),
        messageBox: $(".messageBox"),
        titleBox: $(".titleBox"),
        typeComment: $(".comment"),
        registerContent: $(".register-cont"),
        commentTitle: $(".titleBody"),
        commentMessage: $(".commentBody"),
        submittedDate: $(".dateBody"),
        slides: $('.carousel'),
        prevSlide: $("#back"),
        finishProfile: $("#finish"),
        imgPick: $("#profile-pic"),
        profilePic: $("#file"),
        guestLogin: $("#guest"),
        listView: $(".commentForm"),
        errorAlert: $(".alert"),
        uploadingAlert: $(".uploading"),
        plusIcon: "assets/imgs/icons/choose-pic.png",
        defaultPic: "https://i.stack.imgur.com/l60Hf.png",
        storageRef: firebase.storage().ref('profilePictures/'),
        commentsRef: firebase.database().ref('/comments'),
        userRef: firebase.database().ref('/users')
    };

    let UserInformation = {
        displayName: "d",
        photoURL: "d",
        userEmail: "d",
        userID: "d",
        isAnon: false
    };

    let currentUser;
    const database = firebase.database();
    const storage = firebase.storage();
    let clonedNode;
    let listCount = [];
    let isNewUser;
    let userRef;
    let userData;
    let userKey;
    let isAnonymous;
    let hasPhoto;

    Elements.slides.fadeToggle(1500);

    Elements.guestLogin.on("click", () => {
        signInAsGuest();
    });


    Elements.commentsRef.on("child_added",(snapshot) => {
        const data = snapshot.val();
        const key = snapshot.key;
        if (data.photoURL) {
            hasPhoto = true;
        } else {
            hasPhoto = false;
        }
        Elements.titleBox.val("");
        Elements.messageBox.val("");
        createListItem(data.title, data.message, key, data, hasPhoto);
    });

    Elements.userRef.on("child_added",(snapshot) => {
        userData = snapshot.val();
        userKey = snapshot.key;
    });

    let createListItem = (title, comment, key, data, hasPhoto) => {
        clonedNode = $('.listView:last').clone();
        clonedNode.find('.titleBody:first-child').text(title);
        clonedNode.find('.commentBody:first-child').text(comment);
        clonedNode.find('.dateBody:last-child').text(`Submitted by ${data.displayName}  | ${moment(data.postedAt).fromNow()}`);
        if (hasPhoto) {
            clonedNode.find('.profilePicture:first-child').attr("src", data.photoURL);
        } else {
            clonedNode.find('.profilePicture:first-child').attr("src", Elements.defaultPic);
        }
        clonedNode.insertAfter('.listView:last');
        clonedNode.css({
            display: "block"
        });

        const deleteRef = firebase.database().ref('/comments/' + key);
        const user = firebase.auth().currentUser;
        if (user && data.userID === UserInformation.userID) {
            clonedNode.find(".close").on("click", function() {
                deleteRef.remove();
                $(this).closest(".listView").remove();
            });
            clonedNode.find(".close").css({
                display: "block"
            });
        } else {
            clonedNode.find(".close").css({
                display: "none"
            });
        }
    }


    const uploadProfilePicture = (file) => {
        const user = firebase.auth().currentUser;
        const metadata = {
            contentType: 'image/*'
        };

        let uploadTask = Elements.storageRef.child(user.uid).put(file, metadata);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
               Elements.uploadingAlert.css({display:"block"});
               Elements.uploadingAlert.text(`Uploading: ${Math.round(progress)}% complete.`);
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/unknown':
                        break;
                }
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    user.updateProfile({
                        photoURL: downloadURL,
                    }).then(function () {
                        Elements.profilePic.attr("src", downloadURL);
                        Elements.profilePic.attr("width", "200px");
                        Elements.profilePic.attr("height", "200px");
                    }).catch(function (error) {});
                });
            });
    }

    Elements.submitComment.on("click", () => {
        if (UserInformation.isAnon) {
            Elements.commentsRef.push().set({
                displayName: "Anon",
                userID: UserInformation.userID,
                title: Elements.titleBox.val(),
                message: Elements.messageBox.val(),
                postedAt: firebase.database.ServerValue.TIMESTAMP
            });
        } else {
            Elements.commentsRef.push().set({
                displayName: UserInformation.displayName,
                photoURL: UserInformation.photoURL,
                userID: UserInformation.userID,
                userEmail: UserInformation.userEmail,
                title: Elements.titleBox.val(),
                message: Elements.messageBox.val(),
                postedAt: firebase.database.ServerValue.TIMESTAMP
            });
        }
    });

    Elements.finishProfile.on("click", () => {
        const user = firebase.auth().currentUser;
        	user.updateProfile({
            displayName: Elements.username.val(),
        }).then(function () {
            setUserInfo(user);
            showSignedInBtns();
        }).catch(function (error) {});
    });

    Elements.profilePic.on("click", function() {
        Elements.imgPick.focus().trigger('click');
        Elements.imgPick.on('change',(evt) => {
            let firstFile = evt.target.files[0];
            uploadProfilePicture(firstFile);
        });
    });

    firebase.auth().onAuthStateChanged(user => {
    	Elements.slides.carousel('pause');
        if (isNewUser) {
            currentUser = user.currentUser;
            setUserInfo(user);
            Elements.slides.carousel('next');
            Elements.userEmail.text("");
            Elements.userPass.text("");
        } else if (user) {
            currentUser = user.currentUser;
            setUserInfo(user);
            Elements.userEmail.text("");
            Elements.userPass.text("");
            showSignedInBtns();
        } else {
            hideLoggedOutBtns();
        }
    });

    var setUserInfo = (user) => {
        UserInformation.displayName = user.displayName;
        UserInformation.photoURL = user.photoURL;
        UserInformation.userEmail = user.email;
        UserInformation.userID = user.uid;
        UserInformation.isAnon = user.isAnonymous;
    }


    Elements.userRegister.on("click", signUp);


    Elements.prevSlide.on("click", () => {
        Elements.slides.carousel('prev');
    });

    var showSignedInBtns = () => {
        Elements.slides.remove();
        Elements.navLogout.css({
            display: "block"
        });
        Elements.typeComment.css({
            display: "block"
        });
        Elements.navRegister.css({
            display: "none"
        });
        Elements.navLogin.css({
            display: "none"
        });
        Elements.navLogout.on("click", signOut);
    }

    var hideLoggedOutBtns = () => {
        Elements.slides.insertAfter(".main");
        Elements.typeComment.css({
            display: "none"
        });
        Elements.navRegister.css({
            display: "block"
        });
        Elements.navLogin.css({
            display: "block"
        });
        Elements.navLogout.css({
            display: "none"
        });
        Elements.userLogin.on("click", signIn);
    }

    function signUp(){
        firebase.auth().createUserWithEmailAndPassword(Elements.userEmail.val(), Elements.userPass.val()).then(user => {
            Elements.userEmail.text("");
            Elements.userPass.text("");
            isNewUser = true;
        }).catch(error => {
            if (error.code == 'auth/email-already-in-use') {
                Elements.errorAlert.css({
                    display: "block"
                });
                Elements.errorAlert.toggleClass(".error");
                Elements.errorAlert.text("Sorry, This Email-Address already exists! Please try again.");
            }
        });
    }

    const signIn = () => {
        firebase.auth().signInWithEmailAndPassword(Elements.userEmail.val(), Elements.userPass.val()).then(user => {
            Elements.userEmail.text("");
            Elements.userPass.text("");
            isNewUser = false;
            setUserInfo(user);
        }).catch(error => {

            // I should've done this with switch but it does the same thing so I'll leave it!
            if (error.code === 'auth/invalid-email') {
                Elements.errorAlert.css({
                    display: "block"
                });
                Elements.errorAlert.toggleClass(".error");
                Elements.errorAlert.text("Sorry, This Email-Address is not valid! Please try again.");
            } else if (error.code === 'auth/user-not-found') {
                Elements.errorAlert.css({
                    display: "block"
                });
                Elements.errorAlert.toggleClass(".error");
                Elements.errorAlert.text("Sorry, I don't seem to be able to find you! Please try again.");
            } else if (error.code === 'auth/wrong-password') {
                Elements.errorAlert.css({
                    display: "block"
                });
                Elements.errorAlert.toggleClass(".error");
                Elements.errorAlert.text("Sorry, That password doesn't quite match! Please try again.");
            }
        });
    }

    const signInAsGuest = () => {
        firebase.auth().signInAnonymously().then((user) => {
            console.log("Hello Anon!!");
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/operation-not-allowed') {
                alert('You must enable Anonymous auth in the Firebase Console.');
            } else {
                console.error(error);
            }
        });
    }

   const signOut = () => {
        firebase.auth().signOut().then(function() {
            console.log("Signed out!!");
            hideLoggedOutBtns();
            Elements.slides.carousel('pause');
            clearData();
        }).catch(function (error) {

        });
    }

    const clearData = () => {
        UserInformation.displayName = "";
        UserInformation.photoURL = "";
        UserInformation.userEmail = "";
        UserInformation.userID = "";
        UserInformation.isAnon = "";
        Elements.userEmail.text("");
        Elements.userPass.text("");
    }
});