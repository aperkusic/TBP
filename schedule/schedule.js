let checkedID = "";
let weekendChecked = false;
let cookie = document.cookie;
let idKorisnik = cookie.split("=").pop();
let typeOfSchedule = "";

fetch(`http://localhost:3000/userId?id=${idKorisnik}`)
    .then((res) => {
        if (!res.ok) {
            throw new Error("Something went wrong");
        }
        return res.json();
    })
    .then((responseString) => {
        console.log(responseString);
        if (responseString.rowCount > 0) {
            getSchedule();
        } else {
            document.body.insertAdjacentHTML("beforeend", createScheduleFormHtml);
            const dateSet = new Date(Date.now());
            document.querySelector(".scheduleDate").value = dateSet
                .toISOString()
                .slice(0, 16);
            document.querySelector(".scheduleDate").min = dateSet
                .toISOString()
                .slice(0, 16);
        }
    })
    .catch((error) => console.log(error));
$(".reset").on("click", () => {
    $("#insert").empty();

    $("#form__create").remove();
    $(".scheduleTable").remove();

    getSchedule();

    $(".createSchedule").css("visibility", "visible");
});
$(".logout__button").on("click", () => {
    document.cookie = "id" + "=; Max-Age=0";
    window.location.href = "../index.html";
});
$(".createSchedule").on("click", () => {
    $("#insert").empty();
    $(".createSchedule").css("visibility", "hidden");

    $("#form__create").remove();

    console.log("click");

    document.body.insertAdjacentHTML("beforeend", createScheduleFormHtml);

    const dateSet = new Date(Date.now());
    document.querySelector(".scheduleDate").value = dateSet
        .toISOString()
        .slice(0, 16);
    document.querySelector(".scheduleDate").min = dateSet
        .toISOString()
        .slice(0, 16);
});
const getSchedule = () => {
    let html = `<div class="schedule__continer">  `;
    console.log(idKorisnik);
    fetch(`http://localhost:3000/schedule?id=${idKorisnik}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Something went wrong");
            }

            return res.json();
        })
        .then((resString) => {
            console.log(resString);
            resString.rows.forEach((el) => {
                html += `<div  class="schedule__card" id="${el.id_raspored}"> 
            <h1 class="titleOfCard" onclick="loadSchedule(${el.id_raspored} ,'show')"> ${el.naziv} </h1>`;

                html += ` <div class="schedule__card-line"> </div>`;

                html += ` <div class="schedule__card__buttons">  <button onclick="loadSchedule(${el.id_raspored} ,'update')" class="btn-UD"><img src="../img/edit.png" alt="edit" width="20px"/></button> `;
                html += `  <button onclick="loadSchedule(${el.id_raspored},'delete','${el.naziv}' )" class="btn-UD"> <img src="../img/delete.png" alt="edit" width="20px"/> </button></div> `;
                html += ` </div>`;
            });
            html += `</div>`;

            document.getElementById("insert").innerHTML = html;
        })
        .catch((error) => console.log(error));
};

let scheduleData;
let max, min, checkWeekend, idRaspored;

async function loadSchedule(idRaspored, option, naziv) {
    console.log("update");
    let weekend = [];
    let time = [];

    await fetch(`http://localhost:3000/getScheduleById?id='${idRaspored}'`)
        .then((res) => res.json())
        .then((resString) => {
            console.log(resString);
            scheduleData = resString;
            resString.rows[0].raspored.forEach((el) => {
                weekend.push(el.id.split("-").shift());
                time.push(el.id.split("-").pop());
            });
        });
    let timeArray = [];
    for (let i = 0; i < time.length; i++) {
        timeArray.push(time[i].split(":").shift());
    }

    const numberArray = timeArray.map((str) => {
        return Number(str);
    });
    max = Math.max(...numberArray);
    min = Math.min(...numberArray);

    checkWeekend = weekend.find((el) => el == "Subota" || el == "Nedjelja");

    if (option == "update") {
        console.log("update");
        updateSchedule(idRaspored);
    }
    if (option == "delete") {
        popUpDelete(idRaspored, naziv);
    }
    if (option == "show") {
        showSchedule(min, max, checkWeekend);
    }
}
const showSchedule = (min, max, weekend) => {
    let html = "";
    console.log(weekend);
    html += `<form  onChange='checkInputs(event)' method='POST' id='scheduleForm'>
        
        <table id='rtable'><thead><tr><th>Sati/dani</th><th>Ponedjeljak</th><th>Utorak</th><th>Srijeda</th><th>Četvrtak</th><th>Petak</th>`;
    if (weekend != undefined) {
        html += "<th> Subota </th><th>Nedjelja</th>";
    }
    for (let i = min; i <= max; i++) {
        if (weekend != undefined) {
            html += `<tr><td> ${i}:00
            </td><td><input disabled id='Ponedjeljak-${i}:00' onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Utorak-${i}:00' disabled onClick='formNoteByDay(event,this)'type='text'></td><td><input disabled id='Srijeda-${i}:00'onClick='formNoteByDay(event,this)' type='text'></td>
            <td><input disabled id='Četvrtak${i}' onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Petak-${i}:00' disabled onClick='formNoteByDay(event,this)' type='text'></td><td><input disabled id='Subota-${i}:00' onClick='formNoteByDay(event,this)' type='text'></td><td><input disabled onClick='formNoteByDay(event,this)' id='Nedjelja-${i}:00' type='text'></td></tr>`;
        } else {
            html += `<tr><td> ${i}:00
            </td><td><input disabled id='Ponedjeljak-${i}:00' onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Utorak-${i}:00' disabled onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Srijeda-${i}:00'disabled onClick='formNoteByDay(event,this)' type='text'></td>
            <td><input disabled id='Četvrtak-${i}:00' onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Petak-${i}:00' disabled  onClick='formNoteByDay(event,this)'type='text'></td><td></tr>`;
        }
    }
    html += ` </form>`;
    document.getElementById("insert").innerHTML = html;

    scheduleData.rows[0].raspored.forEach((elements) => {
        console.log(elements.content);
        document.getElementById(`${elements.id}`).value = elements.content;
        document.getElementById(
            `${elements.id}`
        ).style.backgroundColor = `${elements.importance}`;
    });
};

const popUpDelete = (idRaspored, nazivRasporeda) => {
    let html = `
    <div class="overlay">
        <div class="dialog" >
            <h3>Jeste li sigurni da želite obrisati raspored : " ${nazivRasporeda} "?</h3>
            
            <div class="btn__container">

            <button id="${idRaspored}" onClick="deleteSchedule(event,this)" >Obriši</button>
            <button  onClick="closeDialog(event)">Zatvori</button>
         
            </div>
        </div>
    </div>
    `;

    document.getElementById(`${idRaspored}`).insertAdjacentHTML("afterend", html);
};

function deleteSchedule(event, id) {
    event.preventDefault();
    console.log(id);
    fetch(`http://localhost:3000/deleteSchedule?id='${id.id}'`)
        .then((res) => res.json())
        .then((resString) => {
            console.log(resString);
            if (resString == "Uspjesno") {
                $(".dialog").css("display", "none");
                $(".overlay").css("display", "none");
                getSchedule();
            }
        });
}

const updateSchedule = (idRaspored) => {
    console.log(idRaspored);
    let html = ` <h1 id="titleOfSchedule"></h1><form  onChange='checkInputs(event)' method='POST' id='scheduleForm'><table id='rtable'><thead><tr><th>Sati/dani</th><th>Ponedjeljak</th><th>Utorak</th><th>Srijeda</th><th>Četvrtak</th><th>Petak</th>`;
    html += `<th> Subota </th><th>Nedjelja</th>`;

    html += `</thead>`;
    for (let i = 1; i <= 24; i++) {
        html += `<tr><td> ${i}:00
            </td><td><input id='Ponedjeljak-${i}:00' onclick='formNoteByDay(event,this)' type='text'></td><td><input id='Utorak-${i}:00' onClick='formNoteByDay(event,this)'type='text'></td><td><input id='Srijeda-${i}:00'onClick='formNoteByDay(event,this)' type='text'></td>
            <td><input id='Četvrtak-${i}:00' onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Petak-${i}:00' onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Subota-${i}:00' onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Nedjelja-${i}:00' type='text'></td></tr>`;
    }
    html += ` </form></table>`;
    html += ` <button id="btnScheduleForm" onclick="submitScheduleForm(event,'update', ${idRaspored})" > Azuriraj</button>`;

    document.getElementById("insert").innerHTML = html;

    scheduleData.rows[0].raspored.forEach((elements) => {
        console.log(elements.content);
        document.getElementById(`${elements.id}`).value = elements.content;
        document.getElementById(
            `${elements.id}`
        ).style.backgroundColor = `${elements.importance}`;
    });
};

function generateSchedule(id) {}

const createScheduleFormHtml = `


<form id="form__create">
<ul id="form__ul">
<h1  >Kreiraj raspored</h1>
    <li>
        <label for="scheduleStartAt">Početak rasporeda sati</label><br>
        <input type="number" min="1" max="24" class="scheduleStartAt" />
    </li>
    <li>
        <label for="scheduleEndAt"> Kraj</label><br>
        <input type="number" min="1" max="24" class="scheduleEndAt" />
    </li>
    <li>
    <label for="scheduleDate"> Datum</label><br>
    <input type="datetime-local"  class="scheduleDate" />
</li>
    <li><select name="schedule" onchange="prikazi()" id="scheduleCombobox">
   
 
    <option checked id="default" value="default">Običan</option>
    <option id="school" value="school">Školski</option>
  </select>
    <li>
        <label for="weekend">Vikend</label>
        <input type="checkbox" name="weekend" class="weekend" />
    </li>
  
    
    <button class="btn createSchedule" onClick="createScheduleForm(event)">Kreiraj</button>
</ul>
</form>

<div class="scheduleTable"></div>

`;

function redirect() {
    window.location.href = "./create.html";
}
let scheduleCombobox = "";
let checkBoxSkolski = "";
const promijeni = (id) => {
    console.log("ulazi");
    if (id.id == "sviPredmeti") {
        $("#sviPredmeti").prop("checked", true);
        $("#mojiPredmeti").prop("checked", false);
        checkBoxSkolski = $("#sviPredmeti").val();
    } else {
        $("#sviPredmeti").prop("checked", false);
        $("#mojiPredmeti").prop("checked", true);
        checkBoxSkolski = $("#mojiPredmeti").val();
    }
};
const promijeniBox = (id) => {
    console.log("ulazi");
    if (id.id == "tjedni") {
        $("#tjedni").prop("checked", true);
        $("#mjesecni").prop("checked", false);
        checkBoxSkolski = $("#sviPredmeti").val();
    } else {
        $("#tjedni").prop("checked", false);
        $("#mjesecni").prop("checked", true);
    }
};

const prikazi = () => {
    let value = $("#scheduleCombobox").val();

    if (value == "school") {
        $("#checkboxSkolski").css("display", "flex");
        $("#default").prop("checked", false);
    } else {
        $("#checkboxSkolski").css("display", "none");
        checkBoxSkolski = "";
    }
};

function createScheduleForm(event) {
    event.preventDefault();

    let startAt = document.querySelector(".scheduleStartAt").value;
    let endAt = document.querySelector(".scheduleEndAt").value;
    let date = document.querySelector(".scheduleDate");
    scheduleCombobox = document.querySelector("#scheduleCombobox").value;
    typeOfSchedule = scheduleCombobox;
    if (checkStart(startAt) && checkEnd(startAt, endAt) && date.value != "") {
        createDraft(startAt, endAt, event, date.value);

        $("#form__create").css("display", "none");
    } else {
        console.log("Greška");
        date.style.border = "1px solid red";
    }
}

const checkStart = (startAt) => {
    if (startAt !== null && startAt !== "" && startAt >= 0 && startAt < 24) {
        return true;
    }
    return false;
};

const checkEnd = (startAt, endAt) => {
    if (
        startAt !== null &&
        startAt !== "" &&
        endAt > startAt &&
        endAt < 25 &&
        endAt > 0
    ) {
        return true;
    }
    return false;
};

const createDraft = (startAt, endAt, event, date) => {
    let displayForm = "";
    console.log("datum ->" + date);
    let weekendChecked = document.querySelector(".weekend").checked;

    displayForm += `<form  onChange='checkInputs(event)' method='POST' id='scheduleForm'>
        <input  id="titleOfSchedule" placeholder="Naslov rasporeda"/> <span class="titleOfSchedule">Ima već postoji!</span>
        <table id='rtable'><thead><tr><th>Sati/dani</th><th>Ponedjeljak</th><th>Utorak</th><th>Srijeda</th><th>Četvrtak</th><th>Petak</th>`;
    if (weekendChecked) {
        displayForm += "<th> Subota </th><th>Nedjelja</th>";
    }
    displayForm += "</thead>";

    displayForm += generateTable(startAt, endAt, weekendChecked, event);

    displayForm += `</table> <button id="btnScheduleForm" onclick="submitScheduleForm(event, 'insert')"  disabled=true> Potvrdi</button>
   
    `;

    document.querySelector(".scheduleTable").innerHTML = displayForm;
};

const generateTable = (startAt, endAt, weekendChecked) => {
    return splitHours(startAt, endAt, weekendChecked);
};

const splitHours = (startAt, endAt, weekendChecked) => {
    let displayForm = "";

    for (let i = startAt; i <= endAt; i++) {
        if (weekendChecked) {
            console.log("Treba tu uci");
            displayForm += `<tr><td> ${i}:00
            </td><td><input id='Ponedjeljak-${i}:00' onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Utorak-${i}:00' onClick='formNoteByDay(event,this)'type='text'></td><td><input id='Srijeda-${i}:00'onClick='formNoteByDay(event,this)' type='text'></td>
            <td><input id='Četvrtak${i}' onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Petak-${i}:00' onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Subota-${i}:00' onClick='formNoteByDay(event,this)' type='text'></td><td><input onClick='formNoteByDay(event,this)' id='Nedjelja-${i}:00' type='text'></td></tr>`;
        } else {
            console.log("Islo je tu");
            displayForm += `<tr><td> ${i}:00
            </td><td><input  id='Ponedjeljak-${i}:00' onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Utorak-${i}:00'onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Srijeda-${i}:00' onClick='formNoteByDay(event,this)' type='text'></td>
            <td><input id='Četvrtak-${i}:00' onClick='formNoteByDay(event,this)' type='text'></td><td><input id='Petak-${i}:00'  onClick='formNoteByDay(event,this)'type='text'></td><td></tr>`;
        }
    }
    displayForm += ` </form>`;

    return displayForm;
};
let fetchedSubjects = "";
getSubjecstLOL();
async function getSubjecstLOL() {
    console.log(idKorisnik);
    await fetch(`http://localhost:3000/subjects?id=${idKorisnik}`)
        .then((res) => res.json())
        .then((resString) => {
            fetchedSubjects = resString.rows;
        });
}

function formNoteByDay(event, prop) {
    event.preventDefault();
    console.log(prop.id);
    let text = document.getElementById(`${prop.id}`).value;
    let day = "";
    for (let i = 0; i < prop.id.length; i++) {
        if (prop.id[i] === "-") {
            day += " - ";
        } else {
            day += prop.id[i];
        }
    }
    let html = "";
    if (scheduleCombobox == "default") {
        html += `
        <div class="overlay">
            <div class="dialog" >
                <h3>${day}</h3>
                <textarea class="dialog__text" autofocus> ${text} </textarea>
                <div class="dialog__chk">
                
                    <label  for="vazno">Vazno</label>
                    <input onclick="promijena(this)" type="checkbox" checked name="vazno" id="vazno" />
                    <label for="ne">Ne toliko vazno</label>
                    <input onclick="promijena(this)" type="checkbox" name="ne" id="ne" />
                    <label for="izuzetno">Izuzetno</label>
                    <input onclick="promijena(this)" type="checkbox" name="izuzetno" id="izuzetno" />
                </div>
                <div class="btn__container">
    
                <button id="${prop.id}" onClick="takeNote(event,this)" >Potvrdi</button>
                <button  onClick="closeDialog(event)">Zatvori</button>
               <button id="${prop.id}" onClick="deleteInsert(event,this)">Obrisi</button>
                </div>
            </div>
        </div>
        `;
    } else {
        html += `
        <div class="overlay">
            <div class="dialog" >
                <h3>${day}</h3>

                <input type="text" id="myInput" onkeyup="myFunction()" placeholder="Pronađi predmet.." />
                <table id="tablica">
                    <thead>
                        <tr >
                        <th >Predmeti</th>
                         
                        </tr>
                    </thead>
                    <tbody>`;
        fetchedSubjects.forEach((c) => {
            html += `<tr id="Predmet-${c.id_predmet}"  onclick="postaviPredmet(this,'${c.naziv}')">
                                <td>${c.naziv}</td>
                               
                                `;

            html += `</tr>`;
        });

        html += `</tbody>
                </table>`;

        html += `
       

        <div class="btn__container">
                <button id="${prop.id}" onClick="takeNote(event,this)" >Potvrdi</button>
                <button  onClick="closeDialog(event)">Zatvori</button>
               <button id="${prop.id}" onClick="deleteInsert(event,this)">Obrisi</button>
                </div>
            </div>
        </div>
        `;
    }

    document.getElementById(`${prop.id}`).insertAdjacentHTML("afterend", html);
}
let choosenSubject = "";
let firstTime = "";

function postaviPredmet(id, name) {
    if (firstTime == "") {
        $(`#${id.id}`).css("background", "grey");
        firstTime = id.id;
    } else {
        $(`#${firstTime}`).css("background", "transparent");
        firstTime = id.id;
        $(`#${firstTime}`).css("background", "grey");
    }
    choosenSubject = name;
    console.log(choosenSubject);
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

function deleteInsert(e, id) {
    e.preventDefault;
    document.getElementById(`${id.id}`).value = "";
    if (typeOfSchedule == "default")
        document.getElementById(`${id.id}`).style.backgroundColor = "transparent";
    closeDialog(e);
}
let subjects = [];
async function getSubjects() {
    await fetch(`http://localhost:3000/getSubjects?id='${idKorisnik}'`)
        .then((res) => res.json())
        .then((resString) => {
            console.log(resString);
            if (resString == "Uspjesno") {
                $(".dialog").css("display", "none");
                $(".overlay").css("display", "none");
                getSchedule();
            }
        });
}

function promijena(id) {
    console.log(id.id);
    if (id.id == "vazno") {
        $("#vazno").prop("checked", true);
        $("#ne").prop("checked", false);
        $("#izuzetno").prop("checked", false);
    }
    if (id.id == "ne") {
        $("#vazno").prop("checked", false);
        $("#ne").prop("checked", true);
        $("#izuzetno").prop("checked", false);
    }
    if (id.id == "izuzetno") {
        $("#vazno").prop("checked", false);
        $("#ne").prop("checked", false);
        $("#izuzetno").prop("checked", true);
    }
}

function takeNote(event, prop) {
    event.preventDefault();

    if (document.querySelector(".dialog__text") == null)
        typeOfSchedule = "school";
    else typeOfSchedule = "default";
    if (typeOfSchedule == "school") {
        document.getElementById(`${prop.id}`).value = choosenSubject;
    } else {
        let color = "";

        if ($("#izuzetno").is(":checked")) color = "#ef4242a5";
        if ($("#ne").is(":checked")) color = " #fdc151";
        if ($("#vazno").is(":checked")) color = "#348134ab";

        document.getElementById(`${prop.id}`).value = document
            .querySelector(".dialog__text")
            .value.trim();
        document.getElementById(`${prop.id}`).style.backgroundColor = `${color}`;
    }
    document.querySelector(".overlay").remove();
}
const closeDialog = (event) => {
    event.preventDefault();
    document.querySelector(".overlay").remove();
};

function checkInputs(event) {
    event.preventDefault();

    let naslov = document.getElementById("titleOfSchedule").value;
    let correctForm = true;
    const scheduleForm = document.getElementById("scheduleForm");
    Array.from(scheduleForm.elements).forEach((element) => {
        if (element.value !== "") {
            correctForm = false;
        }
    });
    if (naslov.length > 3) correctForm = false;
    else correctForm = true;
    document.getElementById("btnScheduleForm").disabled = correctForm;
}

function submitScheduleForm(event, opt, idRaspored) {
    let dataArray = [];
    let date = "";
    console.log(opt);
    event.preventDefault();
    let combobox = $("#scheduleCombobox").val();

    const scheduleForm = document.getElementById("scheduleForm");
    if (opt == "insert") date = document.querySelector(".scheduleDate").value;

    const titleOfSchedule = document.getElementById("titleOfSchedule").value;

    Array.from(scheduleForm.elements).forEach((element) => {
        if (element.value !== "" && element.id != "titleOfSchedule") {
            dataArray.push({
                id: element.id,
                content: element.value,
                importance: element.style.backgroundColor,
            });
        }
    });

    if (titleOfSchedule != "") dataArray.push({ title: titleOfSchedule });
    if (date != "") dataArray.push({ date: date });
    if (idRaspored != undefined) dataArray.push({ raspored: idRaspored });
    console.log(combobox);
    if (combobox == "default") dataArray.push({ idvrsta: 1 });
    else dataArray.push({ idvrsta: 2 });
    console.log(dataArray);
    dataArray.push({ idKorisnik: idKorisnik });

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataArray),
    };
    if (opt == "insert") {
        fetch(`http://localhost:3000/data`, options)
            .then((res) => {
                if (!res.ok) {
                    console.log("Nije dobro");
                }
                return res.json();
            })
            .then((responseString) => {
                if (responseString != "Ne postoji") {
                    alert("Uspješno ste unjeli raspored!");
                    getSchedule();
                    $("#scheduleForm").empty();

                    $(".createSchedule").css("visibility", "visible");
                } else {
                    $("#titleOfSchedule").css("border", "1px solid red");
                    $(".titleOfSchedule").css("visibility", "visible");
                    $(".titleOfSchedule").css("color", "red");
                }
            });
    } else {
        fetch(`http://localhost:3000/dataUpdate`, options)
            .then((res) => {
                if (!res.ok) {
                    console.log("Nije dobro");
                }
                return res.json();
            })
            .then((responseString) => {
                alert("Uspješno ste ažurirali raspored!");
                loadSchedule(idRaspored, "update");
            });
    }

    console.log(options.body);
}