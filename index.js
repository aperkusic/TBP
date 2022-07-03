$(document).ready(function() {
    document
        .querySelector(".loggin__button")
        .addEventListener("click", function(event) {
            event.preventDefault();
            let email = $("#email-login").val();
            let pass = $("#password-login").val();
            if (email != "" && pass != "") {
                fetch(
                        `http://localhost:3000/userEmail?email='${email.trim()}'&pass='${pass.trim()}'`
                    )
                    .then((res) => res.json())
                    .then((resString) => {
                        console.log(resString);
                        if (resString.rowCount > 0) {
                            document.cookie = `id=${resString.rows[0].id_korisnik}`;
                            window.location.href = "./schedule/schedule.html";
                        }
                    });
            } else {
                alert("Email ili lozinka nisu ispravni");
            }
        });
    document
        .querySelector(".password__button")
        .addEventListener("click", function(event) {
            event.preventDefault();
            console.log("Stisnuo sam");
            let ime = $("#name-signup").val();
            let prezime = $("#surname-signup").val();
            let email = $("#email-signup").val();
            let lozinka = $("#password-signup").val();
            let object = {
                name: ime,
                surname: prezime,
                email: email,
                password: lozinka,
            };
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(object),
            };
            fetch(`http://localhost:3000/insert/insertUser`, options)
                .then((res) => res.json())
                .then((resString) => {
                    console.log(resString);
                    if (resString == "Uspjesno") {
                        fetch(
                                `http://localhost:3000/userEmail?email='${email.trim()}'&pass='${lozinka.trim()}'`
                            )
                            .then((res) => res.json())
                            .then((resUser) => {
                                console.log(resUser);
                                document.cookie = `id=${resUser.rows[0].id_korisnik}`;
                                window.location.href = "./schedule/schedule.html";
                            });
                    }
                });
        });
});

const loginCard = () => {
    document.getElementById("card-intro").style.display = "none";
    document.getElementById("card-login").style.display = "flex";
};

const signupCard = () => {
    $(".password__button").prop("disabled", true);

    $("#email-signup").keyup(function() {
        let mail = $("#email-signup").val();
        if (EmailRegex.test(mail)) {
            fetch(`http://localhost:3000/emailExist?email=${mail}`)
                .then((response) => response.json())
                .then((res) => {
                    if (res.rowCount > 0) {
                        $("#email-signup").css("border", "1px solid red");
                    } else {
                        console.log("ulazi");
                        emailProvjera = true;
                        $("#email-signup").css("border", "1px solid green");
                        provjera();
                    }
                });
        } else {
            $("#email").css("border", "1px solid red");
        }
    });
    $("#name-signup").keyup(function() {
        let ime = $("#name-signup").val();

        if (ImeIprezimeRegex.test(ime)) {
            $("#name-signup").css("border", "1px solid green");
            imeProvjera = true;
            provjera();
        } else $("#name-signup").css("border", "1px solid red");
    });
    $("#surname-signup").keyup(function() {
        let prezime = $("#surname-signup").val();
        if (ImeIprezimeRegex.test(prezime)) {
            $("#surname-signup").css("border", "1px solid green");
            prezimeProvjera = true;
            provjera();
        } else $("#surname-signup").css("border", "1px solid red");
    });

    $("#password-signup").keyup(function() {
        let lozinka = $("#password-signup").val();
        if (LozinkaRegex.test(lozinka)) {
            $("#password-signup").css("border", "1px solid green");
            lozinkaProvjera = true;
            provjera();
        } else $("#password-signup").css("border", "1px solid red");
    });

    document.getElementById("card-intro").style.display = "none";
    document.getElementById("card-signup").style.display = "flex";
};

let ImeIprezimeRegex = /^[A-Z][a-zA-ZščćđžŠČĆŽĐ]{2,45}$/;
let LozinkaRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
let EmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

let emailProvjera = false;
let imeProvjera = false;
let prezimeProvjera = false;
let lozinkaProvjera = false;

function provjera() {
    let ime = $("#name-signup").val();
    let prezime = $("#surname-signup").val();
    let email = $("#email-signup").val();
    let lozinka = $("#password-signup").val();

    if (ime != "" && prezime != "" && email != "" && lozinka != "") {
        if (imeProvjera && prezimeProvjera && emailProvjera && lozinkaProvjera) {
            $(".password__button").prop("disabled", false);
        }
    }
}