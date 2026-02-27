window.addEventListener("load", async () => {
  await Clerk.load();

  const signedInView = document.getElementById("signed-in");
  const signedOutView = document.getElementById("signed-out");
  const signOutBtn = document.getElementById("sign-out");

  function render() {
    if (Clerk.user) {
      signedInView.style.display = "block";
      signedOutView.style.display = "none";
    } else {
      signedInView.style.display = "none";
      signedOutView.style.display = "block";
      Clerk.mountSignIn("#clerk-sign-in");
    }
  }

  if (signOutBtn) {
    signOutBtn.addEventListener("click", async () => {
      await Clerk.signOut();
      location.reload(); // force re-eval
    });
  }

  render();
});
