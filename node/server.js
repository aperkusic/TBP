const express = require("express");
const cors = require("cors");
const app = express();
app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json()); // <==== parse request body as JSON

const Pool = require("pg").Pool;
const database = new Pool({
    user: "postgres",
    host: "localhost",
    database: "perke",
    password: "postgres",
    port: 5434,
});
app.get("/userId", (req, res) => {
    let id = parseInt(req.query.id);

    database.query(
        `select * from raspored where id_korisnik=${id}`,
        (error, results) => {
            if (error) {
                res.status(200).json("Ne postoji");
            }
            res.status(200).json(results);
        }
    );
});

app.get("/getTitle", (req, res) => {
    database.query(
        `select * from raspored where naziv=${req.query.title}`,
        (error, results) => {
            if (error) {
                res.status(200).json("Ne postoji");
            } else {
                res.status(200).json(results);
            }
        }
    );
});

app.get("/deleteSchedule", (req, res) => {
    database.query(
        `delete from raspored where id_raspored=${req.query.id}`,
        (error, results) => {
            if (error) {
                res.status(200).json("Ne postoji");
            } else {
                res.status(200).json("Uspjesno");
            }
        }
    );
});

app.get("/getScheduleById", (req, res) => {
    database.query(
        `select * from raspored where id_raspored=${req.query.id}`,
        (error, results) => {
            if (error) {
                res.status(200).json("Ne postoji");
            } else {
                res.status(200).json(results);
            }
        }
    );
});
app.get("/userEmail", (req, res) => {
    database.query(
        `select * from korisnik where email =${req.query.email} and lozinka = ${req.query.pass}`,
        (error, results) => {
            if (error) {
                res.status(200).json("Ne postoji");
            } else {
                res.status(200).json(results);
            }
        }
    );
});

app.get("/emailExist", (req, res) => {
    database.query(
        `select * from korisnik where email ='${req.query.email}'`,
        (error, results) => {
            if (error) {
                res.status(200).json("Ne postoji");
            } else {
                res.status(200).json(results);
            }
        }
    );
});

app.get("/subjects", (req, res) => {
    database.query(
        `SELECT * FROM predmet p JOIN korisnik k on p.id_korisnik = k.id_korisnik WHERE p.id_korisnik = ${req.query.id}  `,
        (error, results) => {
            if (error) {
                res.status(200).json("Ne postoji");
            } else {
                res.status(200).json(results);
            }
        }
    );
});

app.post("/add/addSubjectByUser", (req, res) => {
    let id = req.body.id;
    let subject = req.body.subject;

    database.query(
        `INSERT INTO predmet(naziv, id_korisnik) VALUES ('${subject}',${id})`,
        (error, results) => {
            if (error) {
                res.status(200).json("Greska");
            } else {
                res.status(200).json("Uspjesno");
            }
        }
    );
});
app.post("/insert/insertUser", (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let email = req.body.email;
    let password = req.body.password;

    database.query(
        `insert into korisnik (ime, prezime, email,lozinka, id_uloga) values ('${name}','${surname}','${email}','${password}',2);`,
        (error, results) => {
            if (error) {
                res.status(200).json("Greska");
            } else {
                res.status(200).json("Uspjesno");
            }
        }
    );
});

app.get("/schedule", (req, res) => {
    let id = req.query.id;
    console.log(id);
    database.query(
        `select * from raspored where id_korisnik=${id}`,
        (error, results) => {
            if (error) {
                res.status(200).json("Ne postoji");
            } else {
                res.status(200).json(results);
            }
        }
    );
});

app.post("/data", (req, res) => {
    let scheduleName = "";
    let date = "";
    let vrsta = "";
    let idKorisnik = "";
    let array = [];
    for (const element of req.body) {
        if (element.id) {
            array.push({
                id: element.id,
                content: element.content,
                importance: element.importance,
            });
        }
        if (element.date) {
            date = element.date;
        }
        if (element.title) {
            scheduleName = element.title;
        }
        if (element.idvrsta) {
            vrsta = element.idvrsta;
        }
        if (element.idKorisnik) {
            idKorisnik = element.idKorisnik;
        }
    }

    database.query(
        `INSERT INTO raspored(naziv, datum, raspored, id_korisnik, id_vrsta) VALUES('${scheduleName}','${date}','${JSON.stringify(
      array
    )}',${idKorisnik},${vrsta})`,
        (error, results) => {
            if (error) {
                res.status(200).json("Ne postoji");
            } else {
                res.status(200).json(results);
            }
        }
    );
});

app.post("/dataUpdate", (req, res) => {
    let raspored = "";
    let array = [];
    for (const element of req.body) {
        if (element.id) {
            array.push({
                id: element.id,
                content: element.content,
                importance: element.importance,
            });
        }
        if (element.raspored) {
            raspored = element.raspored;
        }
    }

    database.query(
        `UPDATE raspored SET raspored = '${JSON.stringify(
      array
    )}' WHERE id_raspored = ${raspored}`,
        (error, results) => {
            if (error) {
                res.status(200).json("Ne postoji");
            } else {
                res.status(200).json(results);
            }
        }
    );
});

app.listen(3000, () => console.log("Server listening a port 3000"));