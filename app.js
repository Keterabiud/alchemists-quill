window.addEventListener("load", () => {
  if (!window.Clerk) {
    console.error("Clerk failed to load");
    return;
  }

  Clerk.load().then(() => {
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

        if (!document.getElementById("clerk-sign-in").hasChildNodes()) {
          Clerk.mountSignIn("#clerk-sign-in");
        }
      }
    }

    if (signOutBtn) {
      signOutBtn.onclick = async () => {
        await Clerk.signOut();
        location.reload();
      };
    }

    render();
  }).catch(err => {
    console.error("Clerk load error:", err);
  });
});
