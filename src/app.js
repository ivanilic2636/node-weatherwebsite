const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

/*console.log(__dirname);
console.log(path.join(__dirname,  "../public/index.html"));*/

//The path that you provide to the express.static function is relative to the directory from where you launch your node process.
//If you run the express app from another directory, it’s safer to use the absolute path of the directory that you want to serve:
//Ovako se prosledjuje apsolutan path do public direktorijuma i time je bezbednije definisati jer ukoliko pokrenemo node iz drugog direktorijuma relativan path je razlicit ali apsolutan path poput ovog je uvek isti
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views"); // posto views ima defaultnu lokaciju views folder, sada kad smo promenili u templates moramo aplikaciji reci gde da gleda handlebarove
const partialsPath = path.join(__dirname, "../templates/partials");

const app = express();
const port = process.env.PORT || 3000 //setapovanje porta za heroku. Ukoliko heroku nema port koristi se 3000


//setting up handlebars
app.set("view engine", "hbs"); //Ovako se setuje view engine
app.set("views", viewsPath); //prima lokaciju views-a ukoliko nije defaultan naziv foldera views.(promenili smo u templates)
hbs.registerPartials(partialsPath);//prima lokaciju partialsa(header i footer)

//setting up static directory to serve
app.use(express.static(publicDirectoryPath)); //ovako se setapuju static asseti. Trenutno svi nasi static asseti se nalaze u public folderu

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    title: "Weather App",
    name: "Ivan Ilic",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Ivan Ilic",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Ivan Ilic",
    message: "This is the help page",
  });
});

//app.get definise sta server treba da radi kada se pristupi odredjeni URL.
//Prima dva argumenta, prvi je url a drugi funkcija koja se izvrsava kada se taj url pristupi
//res je response servera kada se ode na ovaj url
// app.get('', (req, res) => {
//     res.send("Hello exrpess")
// })

//Zakomentarisano je jer umesto ovih henlera radi app.use(express.static(publicDirectoryPath)) koji uzima staticke direktorijume iz publica tokom ovog dela sekcije.
// app.get("/help", (req, res) => {
//     res.send("Help page");
// })

// app.get("/about", (req, res) => {
//     res.send("About page");
// })

app.get("/weather", (req, res) => {
  console.log(req.query);
  if (!req.query.address) {
    return res.send({ error: "Error, no address provided" });
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }
   
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }
      return res.send({ location, forecast: forecastData, address: req.query.address });
    });
  });

  // res.send({
  //   address: req.query.address,
  // });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    message: "Sorry, this help article doesn't exist",
    name: "Ivan Ilic",
    title: "The help article doesn't exist page",
  });
});

app.get("*", (req, res) => {
  // Znak * predstavlja sve url-ove koji nikad iznad u kodu nisu navedeni.
  res.render("404", {
    message: "Sorry, this page doesn't exist",
    name: "Ivan Ilic",
    title: "The 404 page",
  });
});

//app.listen pokrece server. Listenuje poseban port(u ovom slucaju 3000).
app.listen(port, () => {
  console.log("Server is up on port " + port);
});
