/* =========================================================
   PROFILE MODAL
========================================================= */

function openEditProfile() {

    const modal =
        document.getElementById("editProfileModal");

    if (modal) {

        modal.classList.add("active");

        document.body.style.overflow = "hidden";

        const nameInput =
            document.getElementById("name");

        if (nameInput) {

            setTimeout(() => {
                nameInput.focus();
            }, 150);

        }

    }

}


function closeEditProfile() {

    const modal =
        document.getElementById("editProfileModal");

    if (modal) {

        modal.classList.remove("active");

        document.body.style.overflow = "";

    }

}


/* =========================================================
   CLOSE MODAL OUTSIDE CLICK
========================================================= */

document.addEventListener("click", function (event) {

    const modal =
        document.getElementById("editProfileModal");

    if (
        modal &&
        event.target === modal
    ) {

        closeEditProfile();

    }

});


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeEditProfile();

    }

});


/* =========================================================
   DELETE PREDICTION HISTORY
========================================================= */

function confirmDeleteHistory() {

    const selected =
        document.querySelectorAll(
            ".history-checkbox:checked"
        );

    if (selected.length === 0) {

        alert(
            "Please select at least one prediction."
        );

        return false;
    }

    return confirm(
        `Are you sure you want to delete ${selected.length} selected prediction(s)?`
    );

}


/* =========================================================
   LIVE PARTICLES
========================================================= */

function createParticles() {

    const container =
        document.getElementById("particles");

    if (!container) {
        return;
    }

    const particleCount =
        window.innerWidth < 700 ? 35 : 75;

    container.innerHTML = "";

    for (let i = 0; i < particleCount; i++) {

        const particle =
            document.createElement("span");

        particle.className = "particle";

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.top =
            `${Math.random() * 100}%`;

        particle.style.setProperty(
            "--duration",
            `${5 + Math.random() * 8}s`
        );

        particle.style.setProperty(
            "--delay",
            `${Math.random() * -10}s`
        );

        particle.style.setProperty(
            "--opacity",
            `${0.25 + Math.random() * 0.7}`
        );

        particle.style.setProperty(
            "--move-x",
            `${-50 + Math.random() * 100}px`
        );

        const size =
            1 + Math.random() * 3;

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;

        container.appendChild(particle);

    }

}


/* =========================================================
   MOUSE 3D PARALLAX
========================================================= */

function setup3DParallax() {

    const hero =
        document.querySelector(".profile-hero");

    if (!hero) {
        return;
    }

    if (window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches) {
        return;
    }

    if (window.innerWidth <= 700) {
        return;
    }

    document.addEventListener(
        "mousemove",
        function (event) {

            const x =
                (event.clientX / window.innerWidth) - 0.5;

            const y =
                (event.clientY / window.innerHeight) - 0.5;

            const rotateX =
                y * -5;

            const rotateY =
                x * 7;

            hero.style.transform =
                `perspective(1000px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)`;

        }
    );


    document.addEventListener(
        "mouseleave",
        function () {

            hero.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg)";

        }
    );

}


/* =========================================================
   CARD TILT EFFECT
========================================================= */

function setupCardTilt() {

    const cards =
        document.querySelectorAll(
            ".detail-box"
        );

    if (window.innerWidth <= 700) {
        return;
    }

    cards.forEach(function (card) {

        card.addEventListener(
            "mousemove",
            function (event) {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateY =
                    ((x - centerX) / centerX) * 3;

                const rotateX =
                    ((y - centerY) / centerY) * -3;

                card.style.transform =
                    `perspective(700px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-5px)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            function () {

                card.style.transform = "";

            }
        );

    });

}


/* =========================================================
   RANDOM ORB MOVEMENT
========================================================= */

function setupBackgroundMotion() {

    const orbs =
        document.querySelectorAll(
            ".glow-orb"
        );

    if (!orbs.length) {
        return;
    }

    document.addEventListener(
        "mousemove",
        function (event) {

            const mouseX =
                event.clientX / window.innerWidth - 0.5;

            const mouseY =
                event.clientY / window.innerHeight - 0.5;

            orbs.forEach(
                function (orb, index) {

                    const strength =
                        (index + 1) * 12;

                    orb.style.marginLeft =
                        `${mouseX * strength}px`;

                    orb.style.marginTop =
                        `${mouseY * strength}px`;

                }
            );

        }
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createParticles();

        setup3DParallax();

        setupCardTilt();

        setupBackgroundMotion();

    }
);


/* =========================================================
   RECREATE PARTICLES ON RESIZE
========================================================= */

let resizeTimer;

window.addEventListener(
    "resize",
    function () {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(
            function () {

                createParticles();

            },
            250
        );

    }
);


/* =========================================================
   GOJO POWER
   🔵 LEFT | 🟣 CENTER | 🔴 RIGHT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       MOUSE MOVE
    ========================================= */

    document.addEventListener("mousemove", function (e) {

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const x =
            (mouseX / window.innerWidth) * 100;

        const y =
            (mouseY / window.innerHeight) * 100;

        const position =
            mouseX / window.innerWidth;


        /* Mouse position */

        document.documentElement.style.setProperty(
            "--mouse-x",
            `${x}%`
        );

        document.documentElement.style.setProperty(
            "--mouse-y",
            `${y}%`
        );


        /* Activate Gojo */

        document.body.classList.add("gojo-active");


        /* =========================================
           🔵 LEFT = BLUE
        ========================================= */

        if (position < 0.40) {

            document.documentElement.style.setProperty(
                "--gojo-color",
                `
                radial-gradient(
                    circle 500px at ${x}% ${y}%,
                    rgba(0, 160, 255, 1) 0%,
                    rgba(0, 110, 255, 0.85) 18%,
                    rgba(0, 70, 255, 0.55) 35%,
                    rgba(0, 40, 200, 0.25) 55%,
                    transparent 78%
                )
                `
            );

        }


        /* =========================================
           🟣 CENTER = PURPLE
        ========================================= */

        else if (position <= 0.60) {

            document.documentElement.style.setProperty(
                "--gojo-color",
                `
                radial-gradient(
                    circle 500px at ${x}% ${y}%,
                    rgba(255, 0, 255, 1) 0%,
                    rgba(220, 0, 255, 0.88) 18%,
                    rgba(170, 0, 255, 0.60) 35%,
                    rgba(110, 0, 220, 0.28) 55%,
                    transparent 78%
                )
                `
            );

        }


        /* =========================================
           🔴 RIGHT = RED
        ========================================= */

        else {

            document.documentElement.style.setProperty(
                "--gojo-color",
                `
                radial-gradient(
                    circle 500px at ${x}% ${y}%,
                    rgba(255, 0, 45, 1) 0%,
                    rgba(255, 0, 35, 0.88) 18%,
                    rgba(230, 0, 40, 0.60) 35%,
                    rgba(170, 0, 35, 0.28) 55%,
                    transparent 78%
                )
                `
            );

        }

    });


    /* =========================================
       MOUSE LEAVE
    ========================================= */

    document.addEventListener("mouseleave", function () {

        document.body.classList.remove(
            "gojo-active"
        );

        document.documentElement.style.setProperty(
            "--gojo-color",
            "transparent"
        );

    });

});


    /* =========================================
       MOUSE LEAVE
    ========================================= */

    document.addEventListener("mouseleave", function () {

        document.body.classList.remove(
            "gojo-active"
        );

        document.documentElement.style.setProperty(
            "--gojo-color",
            "transparent"
        );

    });

