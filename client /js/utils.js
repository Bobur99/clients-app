import { contactTooltip } from "./createTooltip.js";
import { svgEmail, svgFb, svgOther, svgPhone, svgVk } from "./svg.js";

export const createContactLink = (type, value, element, svg, item) => {
  const setTooltip = contactTooltip(type, value)
  element = document.createElement("a");
  element.classList.add("contacts__link");
  element.innerHTML = svg;

  if (type === "Email") {
    element.href = `mailto:${value.trim()}`;
  } else if (type === "Телефон") {
    element.href = `tel:${value.trim()}`;
    setTooltip.tooltipValue.style.color = 'var(--color-white)'
    setTooltip.tooltipValue.style.textDecoration = 'none'
  } else {
    element.href = value.trim();
  }

  element.append(setTooltip.tooltip)
  item.append(element);
};

export const createContactItemByType = (type, value, item) => {
  switch (type) {
    case "Телефон":
      let phone;
      createContactLink(type, value, phone, svgPhone, item);
      break
    case "Facebook":
      let fb;
      createContactLink(type, value, fb, svgFb, item);
      break
    case "Vk":
      let vk;
      createContactLink(type, value, vk, svgVk, item);
      break
    case "Email":
      let email;
      createContactLink(type, value, email, svgEmail, item);
      break
    case "Другое":
      let other;
      createContactLink(type, value, other, svgOther, item);
      break

    default:
      break;
  }
};

export const formatDate = (data) => {
  const newDate = new Date(data);

  const correctDate = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const resultDate = newDate.toLocaleString("ru", correctDate);

  return resultDate;
};

export const formatTime = (data) => {
  const newDate = new Date(data);

  const correctTime = {
    hour: "numeric",
    minute: "numeric",
  };

  const resultTime = newDate.toLocaleString("ru", correctTime);

  return resultTime;
};

let lastValidNumericId = 0;
const idCache = {}; // Хранит соответствие objectId → displayId

export function getClientDisplayId(objectId) {
  if (idCache[objectId]) {
    return idCache[objectId];
  }

  const idPart = objectId.slice(0, 6); // вместо substr
  let displayId;

  if (/^\d+$/.test(idPart)) {
    displayId = idPart;
    lastValidNumericId = parseInt(idPart, 10);
  } else {
    const nextId = lastValidNumericId + 1;
    displayId = nextId.toString().padStart(6, "0"); // 6 цифр
    lastValidNumericId = nextId;
  }

  idCache[objectId] = displayId;

  return displayId;
}

