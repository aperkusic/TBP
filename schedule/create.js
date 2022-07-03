let cookie = document.cookie;
let idKorisnik = cookie.split("=").pop();
let fetchedSubjects = "";
getSubjecstLOL();
async function getSubjecstLOL() {
    console.log(idKorisnik);
    await fetch(`http://localhost:3000/subjects?id=${idKorisnik}`)
        .then((res) => res.json())
        .then((resString) => {
            fetchedSubjects = resString.rows;
        });
    render();
}

function reset() {
    window.location.href = "./schedule.html";
}

function render() {
    let html = "";
    html += `
    <div class="center" > 
          <input type="text" style="width:200px" id="myInput" onkeyup="myFunction()" placeholder="Pronađi predmet.." />
            <table style="width:200px" id="tablica">
                <thead>
                    <tr >
                    <th >Predmeti</th>
                     
                    </tr>
                </thead>
                <tbody>`;
    fetchedSubjects.forEach((c) => {
        html += `<tr id="Predmet-${c.id_predmet}">
                            <td>${c.naziv}</td>
                           
                            `;

        html += `</tr>`;
    });

    html += `</tbody>
            </table> </div>`;

    document.getElementById("insert").innerHTML = html;
}

function myFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("tablica");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];

        if (td) {
            txtValue = td.textContent || td.innerText;
            console.log(txtValue);
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
                console.log("Prazno");
            } else {
                tr[i].style.display = "none";
                console.log("None");
            }
        }
    }
}

function dodajNoviPredmet() {
    let subject = $("#newSubject").val();
    let object = {
        id: idKorisnik,
        subject: subject,
    };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(object),
    };
    if (subject != "") {
        fetch(`http://localhost:3000/add/addSubjectByUser`, options)
            .then((res) => res.json())
            .then((resString) => {
                if (resString == "Uspjesno") {
                    $("#newSubject").val("");
                    getSubjecstLOL();
                } else {
                    $("#newSubject").val("");
                    alert("Predmeti ne mogu biti istog naziva!");
                }
            });
    }
}