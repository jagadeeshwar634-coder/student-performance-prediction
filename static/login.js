const introScreen = document.getElementById("introScreen");
const introVideo = document.getElementById("introVideo");
const startIntro = document.getElementById("startIntro");
const loginPage = document.getElementById("loginPage");

if (introScreen && introVideo && loginPage) {

    let introFinished = false;
    let fallbackTimer = null;


    function showLoginPage() {

        if (introFinished) return;

        introFinished = true;

        console.log("🎬 INTRO FINISHED → SHOW LOGIN");

        /* Show login */
        loginPage.classList.add("show");

        /* Fade intro */
        setTimeout(() => {
            introScreen.classList.add("hide");
        }, 200);

        /* Remove intro completely */
        setTimeout(() => {

            if (introScreen) {
                introScreen.remove();
            }

        }, 1500);
    }


    /* =================================
       VIDEO ENDED
    ================================= */

    introVideo.addEventListener("ended", () => {

        console.log("🎬 VIDEO ENDED");

        showLoginPage();

    });


    /* =================================
       VIDEO ERROR
    ================================= */

    introVideo.addEventListener("error", () => {

        console.warn("❌ INTRO VIDEO ERROR");

        showLoginPage();

    });


    /* =================================
       VIDEO LOADED
    ================================= */

    introVideo.addEventListener("loadedmetadata", () => {

        console.log(
            "🎬 Video duration:",
            introVideo.duration
        );

        /*
         * Backup timer.
         * If ended event doesn't fire,
         * login will still appear.
         */

        if (introVideo.duration && isFinite(introVideo.duration)) {

            fallbackTimer = setTimeout(
                showLoginPage,
                (introVideo.duration + 0.5) * 1000
            );
        }

    });


    /* =================================
       TAP TO START
    ================================= */

    if (startIntro) {

        startIntro.addEventListener("click", async () => {

            try {

                introVideo.muted = false;
                introVideo.volume = 1;

                await introVideo.play();

                console.log("🔊 INTRO PLAYING WITH SOUND");

                startIntro.style.opacity = "0";
                startIntro.style.pointerEvents = "none";

                setTimeout(() => {

                    if (startIntro) {
                        startIntro.remove();
                    }

                }, 300);

            } catch (error) {

                console.error(
                    "❌ Video play failed:",
                    error
                );

            }

        });

    }


    /* =================================
       INITIAL AUTOPLAY
    ================================= */

    introVideo.muted = true;

    const playPromise = introVideo.play();

    if (playPromise) {

        playPromise
            .then(() => {

                console.log("🎬 INTRO AUTOPLAY STARTED");

            })
            .catch(() => {

                console.log(
                    "🔊 Autoplay blocked — tap START"
                );

            });

    }

}
  


    /* =====================================================
       LOGIN ELEMENTS
    ===================================================== */

    const loginForm =
        document.getElementById("loginForm");

    const passwordInput =
        document.getElementById("password");

    const togglePassword =
        document.getElementById("togglePassword");

    const message =
        document.getElementById("message");


    /* =====================================================
       MESSAGE
    ===================================================== */

    function showMessage(text, color) {

        if (!message) return;

        message.textContent = text;
        message.style.color = color;

    }


    /* =====================================================
       SHOW / HIDE PASSWORD
    ===================================================== */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener(
            "click",
            () => {

                if (passwordInput.type === "password") {

                    passwordInput.type = "text";

                    togglePassword.textContent = "🙈";

                    togglePassword.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                } else {

                    passwordInput.type = "password";

                    togglePassword.textContent = "👁️";

                    togglePassword.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            }
        );

    }


    /* =====================================================
       3D STUDENT AI — MOUSE MOVEMENT
    ===================================================== */

    const aiCore =
        document.querySelector(".ai-core");

    const aiOrb =
        document.querySelector(".ai-orb");

    const loginCard =
        document.querySelector(".login-card");

    const aiBackground =
        document.querySelector(".ai-background");


    if (aiCore && aiOrb && loginCard) {

        let mouseX = 0;
        let mouseY = 0;

        let currentX = 0;
        let currentY = 0;


        function animateAI() {

            currentX +=
                (mouseX - currentX) * 0.06;

            currentY +=
                (mouseY - currentY) * 0.06;


            /* AI core movement */

            aiCore.style.transform =
                `translate(
                    calc(-50% + ${currentX * 15}px),
                    calc(-50% + ${currentY * 15}px)
                )
                rotateX(${currentY * -4}deg)
                rotateY(${currentX * 5}deg)`;


            /* Orb reacts slightly stronger */

            aiOrb.style.transform =
                `translate(
                    ${currentX * 5}px,
                    ${currentY * 5}px
                )
                scale(${1 + Math.abs(currentX + currentY) * 0.025})`;


            requestAnimationFrame(animateAI);

        }

        animateAI();


        document.addEventListener(
            "mousemove",
            (event) => {

                mouseX =
                    (event.clientX / window.innerWidth - 0.5) * 2;

                mouseY =
                    (event.clientY / window.innerHeight - 0.5) * 2;

            }
        );

    }


    /* =====================================================
       LOGIN CARD — SUBTLE MOUSE PARALLAX
    ===================================================== */

    if (loginCard) {

        document.addEventListener(
            "mousemove",
            (event) => {

                const x =
                    (event.clientX / window.innerWidth - 0.5) * 2;

                const y =
                    (event.clientY / window.innerHeight - 0.5) * 2;


                /*
                    Very small movement.
                    Keeps glass card stable.
                */

                loginCard.style.setProperty(
                    "--mouse-x",
                    `${x * 3}px`
                );

                loginCard.style.setProperty(
                    "--mouse-y",
                    `${y * 3}px`
                );

            }
        );

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const emailInput =
                    document.getElementById("email");

                const email =
                    emailInput
                        ? emailInput.value.trim().toLowerCase()
                        : "";

                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                /* -----------------------------------------
                   VALIDATION
                ----------------------------------------- */

                if (!email || !password) {

                    showMessage(
                        "❌ Please enter both email and password.",
                        "#ff5c7a"
                    );

                    return;

                }


                /* Disable button while logging in */

                const loginButton =
                    loginForm.querySelector(".login-btn");

                if (loginButton) {

                    loginButton.disabled = true;

                    loginButton.style.opacity = "0.7";

                }


                try {

                    /* -------------------------------------
                       CREATE FORM DATA
                    ------------------------------------- */

                    const formData =
                        new FormData();

                    formData.append(
                        "email",
                        email
                    );

                    formData.append(
                        "password",
                        password
                    );


                    console.log(
                        "EMAIL SENT:",
                        email
                    );

                    console.log(
                        "PASSWORD LENGTH:",
                        password.length
                    );


                    /* -------------------------------------
                       FASTAPI LOGIN
                    ------------------------------------- */

                     const response =
                      await fetch(
                        window.location.origin + "/login",
                      {
                        method: "POST",
                         body: formData
                      }
                     );


                    let data;

                     try {
                         data = await response.json();
                     } catch (e) {
                         data = {
                            detail: "Server error. Please check Render logs."
                     };
                  }


                    console.log(
                        "LOGIN STATUS:",
                        response.status
                    );

                    console.log(
                        "LOGIN RESPONSE:",
                        data
                    );


                    /* -------------------------------------
                       LOGIN FAILED
                    ------------------------------------- */

                    if (!response.ok) {

                        showMessage(
                            "❌ " +
                            (
                                data.detail ||
                                "Invalid email or password"
                            ),
                            "#ff5c7a"
                        );


                        if (loginButton) {

                            loginButton.disabled = false;

                            loginButton.style.opacity = "1";

                        }

                        return;

                    }


                    /* -------------------------------------
                       LOGIN SUCCESS
                    ------------------------------------- */

                    showMessage(
                        "✅ Login successful! Redirecting...",
                        "#4ade80"
                    );


                    /* Save current user */

                    sessionStorage.setItem(
                        "currentUser",
                        JSON.stringify({
                            name: data.name,
                            email: data.email
                        })
                    );


                    /* -------------------------------------
                       DASHBOARD REDIRECT
                    ------------------------------------- */

                    setTimeout(
                        () => {

                            window.location.href =
                                "/dashboard";

                        },
                        800
                    );

                }


                catch (error) {

                    console.error(
                        "Login error:",
                        error
                    );


                    showMessage(
                        "❌ Unable to connect to server.",
                        "#ff5c7a"
                    );


                    if (loginButton) {

                        loginButton.disabled = false;

                        loginButton.style.opacity = "1";

                    }

                }

            }
        );

    }


