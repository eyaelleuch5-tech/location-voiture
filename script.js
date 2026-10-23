const flowerPrices = {
    vervaine: 100,
    valley: 150,
    lilies: 200
};

const flowerCategories = {
    vervaine: "Flower1",
    valley: "Flower2",
    lilies: "Flower3"
};

const flowerSelect = document.getElementById("flowers");
const categorySelect = document.getElementById("categorie");
const startDateInput = document.getElementById("dateDebut");
const endDateInput = document.getElementById("dateFin");
const priceInput = document.getElementById("prixTotal");
const calculateButton = document.getElementById("calculatePrice");
const reservationForm = document.getElementById("reservationform");
const message = document.getElementById("message");

// Use today's date as the earliest selectable date.
const today = new Date();
const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

startDateInput.min = localToday;
endDateInput.min = localToday;

// Show a message to the visitor.
function showMessage(text, type) {
    message.textContent = text;
    message.className = `alert alert-${type}`;
}

// Update the minimum end date when the start date changes.
startDateInput.addEventListener("change", function () {
    endDateInput.min = startDateInput.value || localToday;

    if (
        endDateInput.value &&
        endDateInput.value < startDateInput.value
    ) {
        endDateInput.value = "";
    }

    priceInput.value = "";
});

// Automatically choose the corresponding category.
flowerSelect.addEventListener("change", function () {
    categorySelect.value = flowerCategories[flowerSelect.value] || "";
    priceInput.value = "";
});

// Keep the flower and category selections synchronized.
categorySelect.addEventListener("change", function () {
    const flowersByCategory = {
        Flower1: "vervaine",
        Flower2: "valley",
        Flower3: "lilies"
    };

    flowerSelect.value = flowersByCategory[categorySelect.value] || "";
    priceInput.value = "";
});

// Select a flower directly from the catalogue.
document.querySelectorAll("[data-flower]").forEach(function (button) {
    button.addEventListener("click", function () {
        const flower = button.dataset.flower;

        flowerSelect.value = flower;
        categorySelect.value = flowerCategories[flower];
        priceInput.value = "";
    });
});

// Calculate the estimated price.
calculateButton.addEventListener("click", function () {
    const flower = flowerSelect.value;
    const start = startDateInput.value;
    const end = endDateInput.value;

    if (!flower || !start || !end) {
        showMessage(
            "Please select a flower, a start date, and an end date.",
            "warning"
        );
        return;
    }

    if (end < start) {
        showMessage(
            "The end date must be on or after the start date.",
            "danger"
        );
        return;
    }

    const startDate = new Date(start + "T00:00:00");
    const endDate = new Date(end + "T00:00:00");

    // Include both the start date and end date.
    const days = Math.round(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
    ) + 1;

    const total = flowerPrices[flower] * days;

    priceInput.value = total.toLocaleString("en-US");
    showMessage(
        `Estimated total: ${total.toLocaleString("en-US")} DT for ${days} day(s).`,
        "success"
    );
});

// Validate the form before displaying a confirmation.
reservationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!reservationForm.checkValidity()) {
        reservationForm.reportValidity();
        return;
    }

    if (!priceInput.value) {
        showMessage(
            "Please calculate the estimated price before confirming.",
            "warning"
        );
        calculateButton.focus();
        return;
    }

    showMessage(
        "Your reservation details are ready! This demo does not send or save your reservation.",
        "success"
    );
});