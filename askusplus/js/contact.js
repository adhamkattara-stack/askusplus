import { supabase } from "./supabase.js";


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const submitBtn = form.querySelector("button");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";

    const name = document.getElementById("contactName").value;
    const email = document.getElementById("contactEmail").value;
    const countryCode = document.getElementById("contactCountryCode").value;
    const phone = document.getElementById("contactPhone").value;
    const service = document.getElementById("contactService").value;
    const message = document.getElementById("contactMessage").value;

    // 1️⃣ Save to Supabase
    const { error } = await supabase.from("contacts").insert([
      {
        name,
        email,
        phone: countryCode + phone,
        service,
        message
      }
    ]);

    if (error) {
      console.error(error);
      alert("❌ Something went wrong");
      submitBtn.disabled = false;
      submitBtn.innerText = "Send Message";
      return;
    }

    // 2️⃣ Send Email
    try {
      await emailjs.send(
        "service_3rorpob",
        "template_25cs78a",
        {
          name,
          email,
          phone: countryCode + phone,
          service,
          message
        }
      );
    } catch (err) {
      console.error("EmailJS Error:", err);
    }

    // SUCCESS
    alert("✅ Message sent successfully");
    form.reset();
    submitBtn.innerText = "Sent ✔";

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = "Send Message";
    }, 2000);
  });
});
