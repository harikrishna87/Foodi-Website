let modal = document.getElementById("my_modal_3");
let loginForm = document.getElementById("login-form");
let signupForm = document.getElementById("signup-form");

function showModal() {
  modal.showModal();
}

function closeModal() {
  modal.close();
}

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

function showSignUpForm() {
  loginForm.style.display = "none";
  signupForm.style.display = "block";
}

function showLoginForm() {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
}

  const buttons = document.querySelectorAll(".view_more");
  buttons.forEach(button => {
    button.addEventListener("click", function () {
      Swal.fire({
        title: "To View More Products",
        text: "You Need to Login",
        icon: "warning",
        iconColor: "red",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          const modal = document.getElementById("my_modal_3");
          if (modal) {
            modal.showModal();
          } else {
            console.error("Modal element with ID 'loginModal' not found.");
          }
        }
      });
    });
  });
