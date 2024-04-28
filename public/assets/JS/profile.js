let update = document.getElementById("update-details");
let userName = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let conformPassword = document.getElementById("conformPassword");
// console.log(update);
update.addEventListener("click", function () {
  console.log("ll", user);
  email.value = user.email;
  userName.value = user.userName;
});
