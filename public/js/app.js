// fetch("http://localhost:3000/weather?address=Boston").then((response) => {
//   response.json().then((data) => {
//     if (data.error) {
//       console.log("Something went wrong");
//     } else {
//       console.log(data);
//     }
//   });
// });

const weatherForm = document.querySelector("form");
const inputForm = document.querySelector("input");
const errorMessage = document.querySelector(".error");
const successMessage = document.querySelector(".success");

weatherForm.addEventListener("submit", (e) => {
    errorMessage.textContent="Loading...";
    successMessage.textContent = "";
  e.preventDefault();
  const searchValue = inputForm.value;

  // fetch("http://localhost:3000/weather?address=" + searchValue).then(
    fetch("/weather?address=" + searchValue).then( /*Za heroku se ovako setapuje jer ne znamo na kom smo portu i nije localhost vise */
  (response) => {
      response.json().then((data) => {
        if (data.error) {
          errorMessage.textContent = data.error;
          successMessage.textContent = "";
          console.log("Something went wrong");
        } else {
          errorMessage.textContent = data.location;
          successMessage.textContent = data.forecast.description + ", feels like its " + data.forecast.feels_like_temperature+ " degrees but actually its " + data.forecast.temperature + " degrees." + "The humidity is: "+ data.forecast.humidity;
        }
      });
    }
  );
});
