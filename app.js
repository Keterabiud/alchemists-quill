// TEST APP.JS — DO NOT KEEP

window.addEventListener("load", async () => {
  console.log("Page loaded");

  if (!window.Clerk) {
    console.error("❌ Clerk SDK NOT found");
    return;
  }

  console.log("✅ Clerk SDK found");

  await Clerk.load({
    publishableKey: "pk_test_Z2VudGxlLWxhYnJhZG9yLTI5LmNsZXJrLmFjY291bnRzLmRldiQ"
  });

  console.log("✅ Clerk initialized");

  const el = document.getElementById("clerk-sign-in");

  if (!el) {
    console.error("❌ #clerk-sign-in not found");
    return;
  }

  console.log("✅ Mounting sign-in");

  Clerk.mountSignIn(el);

  Clerk.addListener(({ user }) => {
    if (user) {
      console.log("✅ User signed in");
      document.getElementById("login-gate").style.display = "none";
      document.getElementById("main-site").style.display = "block";
    }
  });
});
