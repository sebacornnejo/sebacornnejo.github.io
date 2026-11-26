const form = document.querySelector("#contact-form");
const status = document.querySelector("#contact-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = new FormData(form);
  const subject = encodeURIComponent(fields.get("subject").trim());
  const body = encodeURIComponent([
    fields.get("message").trim(),
    "",
    fields.get("full_name").trim(),
    fields.get("email_address").trim()
  ].join("\r\n"));
  status.textContent = "Send the draft from your email app. You can also use the address below.";
  window.location.href = `${form.action}?subject=${subject}&body=${body}`;
});
