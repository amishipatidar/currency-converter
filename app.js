const BASE_URL = "https://v6.exchangerate-api.com/v6/5a01051867a943975e3780fd/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update exchange rate function
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  try {
    let response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch exchange rates");

    let data = await response.json();

    // Get the rates for both selected currencies
    let fromRate = data.conversion_rates[fromCurr.value];
    let toRate = data.conversion_rates[toCurr.value];

    // Calculate the exchange rate between the two currencies
    let conversionRate = toRate / fromRate;

    // Calculate the final converted amount
    let finalAmount = (amtVal * conversionRate).toFixed(2);

    // Display the result
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rates. Please try again later.";
    console.error(error);
  }
};

// Update flag for selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");

  img.src = newSrc;
};

// Button click event
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Update exchange rate on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
