"use strict";

/* ==========================================================================
   KOMA BEAUTY — script du site
   1) CONFIG : la seule zone à modifier pour renseigner WhatsApp, prix, photos.
   2) Données produits (d’après le catalogue de référence).
   3) Fonctionnement : recherche, filtres, fiches détaillées, contact.
   ========================================================================== */

/* ---------- 1. CONFIGURATION (À PERSONNALISER) ---------- */
const CONFIG = {
  // Numéros WhatsApp : format international, chiffres uniquement, sans « + », sans espaces, sans le 0 du début.
  // Exemples de format : Sénégal 221771234567, Maroc 212612345678.
  // Un numéro vide est ignoré. Tant qu’aucun numéro n’est renseigné, les boutons de commande
  // sont masqués ou affichent « Contact bientôt disponible ».
  whatsappContacts: [
    { label: "Sénégal", number: "221789924266" },

  ],

  currency: "FCFA",

  // Coordonnées facultatives : elles ne s’affichent que si elles sont renseignées.
  instagramUrl: "", // adresse complète, par exemple https://www.instagram.com/votre-compte
  phone: "",
  email: "",
  deliveryInfo: "", // texte libre : livraison, frais, délais... (rien n’est affiché si vide)

  // Prix : associez l’identifiant du produit à son prix. Sans prix, le site affiche « Prix sur demande ».
  // Exemple : prices: { "savon-noir-beldi-classique": 45, "huile-d-argan": 120 }
  prices: {},

  // Photos : associez l’identifiant du produit au chemin de sa photo (à placer dans le dossier assets/).
  // Exemple : images: { "huile-d-argan": "assets/huile-d-argan.jpg" }
  images: {},

  // Photo d’ambiance de la bannière d’accueil (facultatif), par exemple "assets/accueil.jpg"
  heroImage: ""
};

/* ---------- 2. DONNÉES ---------- */
const CATEGORIES = [
  {
    id: "corps",
    label: "Corps et rituel hammam",
    text: "Savons noirs, ghassoul, eaux florales, huiles et gant kessa."
  },
  {
    id: "cheveux",
    label: "Soins capillaires",
    text: "Huiles, crème sans rinçage, masque, gel d’aloe vera et poudre."
  },
  {
    id: "accessoires",
    label: "Accessoires",
    text: "Gant de hammam et voile pashmina."
  }
];

/*
  rinse : { type: "rincer" | "sans-rincage" | "selon-emballage", label: "..." }
  Renseigné uniquement lorsque le catalogue de référence le précise.
*/
const A_RINCER = { label: "À rincer" };

const PRODUCTS = [
  {
    id: "savon-noir-beldi-classique",
    name: "Savon noir beldi classique",
    categories: ["corps"],
    usage: "Nettoie la peau et la prépare à l’exfoliation du rituel hammam.",
    mode: "Sur peau humide, étaler une fine couche sur le corps, laisser poser 5 à 10 minutes selon l’étiquette, rincer, puis utiliser doucement le gant kessa. En général, une fois par semaine suffit.",
    precautions: "Éviter les yeux, la peau irritée ou fraîchement épilée. Ne pas frotter fort.",
    rinse: A_RINCER
  },
  {
    id: "savon-noir-carotte",
    name: "Savon noir à la carotte",
    categories: ["corps"],
    usage: "Variante du savon beldi pour le nettoyage du corps.",
    mode: "Utiliser comme le savon noir, selon les instructions du fabricant, et rincer abondamment.",
    precautions: "La présence de carotte ne garantit pas d’effet éclaircissant. Faire un test cutané.",
    rinse: A_RINCER
  },
  {
    id: "savon-noir-argan",
    name: "Savon noir à l’argan",
    categories: ["corps"],
    usage: "Nettoyage du corps avant exfoliation, avec une formule enrichie selon le fabricant.",
    mode: "Appliquer sur peau humide, laisser poser brièvement si l’étiquette le permet, rincer, puis exfolier délicatement avec le gant.",
    precautions: "Vérifier la composition réelle et éviter les zones sensibles.",
    rinse: A_RINCER
  },
  {
    id: "savon-noir-citron",
    name: "Savon noir au citron",
    categories: ["corps"],
    usage: "Nettoyage du corps ; formule parfumée ou enrichie selon le fournisseur.",
    mode: "Utiliser sur le corps humide selon l’étiquette et rincer complètement.",
    precautions: "Les agrumes peuvent irriter certaines peaux. Éviter le visage et l’exposition solaire si la formule contient des huiles essentielles d’agrumes.",
    rinse: A_RINCER
  },
  {
    id: "savon-noir-curcuma",
    name: "Savon noir au curcuma",
    categories: ["corps"],
    usage: "Nettoyage du corps, version au curcuma.",
    mode: "Appliquer sur peau humide selon l’étiquette, rincer et hydrater après le rituel.",
    precautions: "Peut tacher les tissus et certaines surfaces. Faire un test cutané.",
    rinse: A_RINCER
  },
  {
    id: "savon-noir-aloe-vera",
    name: "Savon noir à l’aloe vera",
    categories: ["corps"],
    usage: "Nettoyage du corps, avec aloe vera si présent dans la formule.",
    mode: "Appliquer selon les indications du fabricant, puis rincer abondamment.",
    precautions: "L’aloe ne rend pas automatiquement le produit adapté à toutes les peaux.",
    rinse: A_RINCER
  },
  {
    id: "ghassoul-rhassoul",
    name: "Ghassoul / rhassoul marocain",
    categories: ["corps"],
    usage: "Argile lavante utilisée pour la peau et parfois les cheveux.",
    mode: "Mélanger la poudre avec un peu d’eau jusqu’à obtenir une pâte. Appliquer brièvement sur peau ou cheveux humides, puis rincer très abondamment.",
    precautions: "Ne pas laisser sécher jusqu’à craqueler. Peut dessécher les cheveux très secs : l’utiliser alors moins souvent.",
    rinse: A_RINCER
  },
  {
    id: "poudre-nila-bleue",
    name: "Poudre de nila bleue",
    categories: ["corps"],
    usage: "Poudre cosmétique traditionnelle utilisée dans certains soins du corps.",
    mode: "Uniquement selon les indications d’un produit cosmétique identifié. Mélanger une petite quantité si le fabricant le recommande.",
    precautions: "Composition et qualité variables. Ne pas avaler, éviter les yeux et ne pas utiliser une poudre sans étiquette claire. Aucun effet de blanchiment n’est promis.",
    rinse: null
  },
  {
    id: "eau-de-rose",
    name: "Eau de rose",
    categories: ["corps"],
    usage: "Eau florale pour rafraîchir la peau et compléter une routine.",
    mode: "Appliquer avec des mains propres ou un coton sur peau propre, si la formule est prévue pour le visage.",
    precautions: "Vérifier qu’elle est cosmétique et sans ingrédients irritants. Arrêter en cas de réaction.",
    rinse: null
  },
  {
    id: "huile-d-argan",
    name: "Huile d’argan",
    categories: ["corps"],
    usage: "Huile de finition pour adoucir la peau ou apporter de la souplesse aux longueurs.",
    mode: "Visage et corps : quelques gouttes sur peau légèrement humide. Cheveux : petite quantité sur les longueurs et les pointes, ou en bain avant shampoing.",
    precautions: "Vérifier qu’il s’agit d’une huile cosmétique et le type de formule. Éviter les yeux.",
    rinse: null
  },
  {
    id: "gant-de-hammam-kessa",
    name: "Gant de hammam / kessa",
    categories: ["corps", "accessoires"],
    usage: "Exfolie mécaniquement la peau dans le rituel hammam.",
    mode: "Après avoir rincé le savon noir, passer doucement sur peau humide, sans insister sur la même zone. Rincer et sécher le gant après usage.",
    precautions: "Ne pas partager. Éviter le visage, la peau irritée, l’eczéma, les coups de soleil ou une épilation récente.",
    rinse: null
  },
  {
    id: "huile-de-figue-de-barbarie",
    name: "Huile de figue de barbarie",
    categories: ["corps"],
    usage: "Huile cosmétique concentrée utilisée en petite quantité pour le soin du visage.",
    mode: "Appliquer 1 à 2 gouttes selon la tolérance, sur peau propre, en évitant les yeux. Suivre l’étiquette du flacon.",
    precautions: "Prix et composition variables. Vérifier l’origine, l’INCI et la pureté annoncée.",
    rinse: null
  },
  {
    id: "fleur-d-oranger",
    name: "Fleur d’oranger / eau de fleur d’oranger",
    categories: ["corps"],
    usage: "Eau florale parfumée, utilisée pour rafraîchir la peau si le produit est cosmétique.",
    mode: "Vaporiser ou appliquer sur peau propre selon les instructions.",
    precautions: "Ne pas confondre eau alimentaire et eau cosmétique. Vérifier les ingrédients et éviter les yeux.",
    rinse: null
  },
  {
    id: "ambre-de-sidre",
    name: "Ambre de sidre",
    categories: ["corps"],
    usage: "Produit parfumé ou soin, selon la référence exacte du fournisseur.",
    mode: "Dépend de la composition : suivre strictement l’étiquette et le mode d’emploi fourni.",
    precautions: "Le nom peut désigner des produits différents. Confirmez la composition auprès de KOMA BEAUTY avant l’achat et suivez l’usage réel indiqué.",
    rinse: null
  },
  {
    id: "huile-de-nigelle",
    name: "Huile de nigelle",
    categories: ["cheveux"],
    usage: "Huile de soin pour la peau ou les cheveux, selon la formule.",
    mode: "Faire un test sur une petite zone. Pour les cheveux, appliquer une petite quantité sur le cuir chevelu ou les longueurs avant lavage, si elle est bien tolérée.",
    precautions: "Peut irriter certaines personnes. Ne constitue pas un traitement médical.",
    rinse: null
  },
  {
    id: "huile-de-ricin",
    name: "Huile de ricin",
    categories: ["cheveux"],
    usage: "Huile épaisse utilisée surtout en petite quantité sur les longueurs et les pointes.",
    mode: "Réchauffer quelques gouttes entre les mains, appliquer sur les longueurs ou mélanger à une huile plus légère, puis laver si nécessaire.",
    precautions: "Éviter d’en mettre trop près des yeux. Arrêter en cas de démangeaisons ou d’irritation.",
    rinse: null
  },
  {
    id: "huile-de-coco",
    name: "Huile de coco",
    categories: ["cheveux"],
    usage: "Soin avant shampoing pour aider à assouplir les longueurs, selon les cheveux.",
    mode: "Appliquer une petite quantité sur les longueurs, laisser poser selon la tolérance, puis laver. Tester d’abord sur une mèche.",
    precautions: "Peut alourdir certains cheveux ou ne pas convenir à tous les cuirs chevelus.",
    rinse: null
  },
  {
    id: "poudre-de-sidre",
    name: "Poudre de sidre",
    categories: ["cheveux"],
    usage: "Poudre végétale utilisée dans certaines routines capillaires comme pâte lavante ou masque.",
    mode: "Mélanger avec de l’eau selon les instructions du fournisseur, appliquer brièvement, puis rincer très soigneusement.",
    precautions: "Vérifier la composition et la finesse de la poudre. Éviter d’inhaler la poussière.",
    rinse: A_RINCER
  },
  {
    id: "creme-sans-rincage",
    name: "Crème sans rinçage (leave-in)",
    categories: ["cheveux"],
    usage: "Aide à démêler, adoucir et faciliter le coiffage, sans rinçage.",
    mode: "Après le lavage, appliquer une petite quantité sur cheveux humides, surtout sur les longueurs. Démêler par sections et ne pas rincer, sauf indication contraire.",
    precautions: "Respecter la quantité recommandée. Éviter le cuir chevelu si le produit l’alourdit.",
    rinse: { label: "Sans rinçage" }
  },
  {
    id: "masque-hydratant-capillaire",
    name: "Masque hydratant capillaire",
    categories: ["cheveux"],
    usage: "Soin après shampoing pour rendre les cheveux plus doux et plus faciles à coiffer.",
    mode: "Appliquer sur cheveux propres et humides, laisser poser le temps indiqué sur l’emballage, puis rincer si le masque est à rincer.",
    precautions: "Ne pas confondre masque à rincer et soin sans rinçage.",
    rinse: { label: "Rinçage : selon l’emballage" }
  },
  {
    id: "gel-d-aloe-vera",
    name: "Gel d’aloe vera",
    categories: ["cheveux"],
    usage: "Gel coiffant léger ou soin hydratant, selon la formulation.",
    mode: "Appliquer une petite quantité sur cheveux humides, ou sur la peau si le produit est prévu pour cet usage.",
    precautions: "Vérifier les conservateurs et la destination du produit. Faire un test cutané.",
    rinse: null
  },
  {
    id: "voile-pashmina",
    name: "Voile pashmina",
    categories: ["accessoires"],
    usage: "Accessoire textile pour compléter une tenue ou à offrir en cadeau.",
    mode: "Porter autour du cou ou sur les épaules. Suivre les consignes d’entretien du tissu.",
    precautions: "La composition varie : vérifiez l’étiquette du tissu. L’appellation « pashmina pur » n’est pas garantie sans preuve du fournisseur.",
    rinse: null
  }
];

/* ---------- Outils ---------- */
const $ = (selector) => document.querySelector(selector);

/** Crée un élément avec une classe et un texte (le texte est inséré sans interprétation HTML). */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** Minuscules sans accents, pour une recherche tolérante (« fleur d oranger » trouve « Fleur d’oranger »). */
function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function categoryLabel(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.label : id;
}

/** Prix affiché de façon cohérente : « Prix sur demande » tant qu’aucun prix n’est renseigné. */
function priceLabel(productId) {
  const price = CONFIG.prices[productId];
  if (price === undefined || price === null || price === "") return "Prix sur demande";
  if (typeof price === "number") return price.toLocaleString("fr-FR") + " " + CONFIG.currency;
  return String(price);
}

/** Numéros WhatsApp renseignés et valides (au moins 8 chiffres). */
function whatsappContacts() {
  return CONFIG.whatsappContacts
    .map((c) => ({ label: c.label, digits: String(c.number || "").replace(/\D/g, "") }))
    .filter((c) => c.digits.length >= 8);
}

function whatsappUrl(digits, message) {
  return "https://wa.me/" + digits + "?text=" + encodeURIComponent(message);
}

function orderMessage(product) {
  return "Bonjour KOMA BEAUTY, je souhaite commander : " + product.name +
    ". Pouvez-vous me confirmer le prix et la disponibilité ?";
}

/** Crée un lien WhatsApp réel. Avec plusieurs numéros, le libellé indique le pays. */
function whatsappLink(contact, message, text, many, className) {
  const link = el("a", className, many ? text + " " + contact.label : text);
  link.href = whatsappUrl(contact.digits, message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute(
    "aria-label",
    (many ? text + " " + contact.label : text) + " (ouvre WhatsApp dans un nouvel onglet)"
  );
  return link;
}

/** Boutons « Commander sur WhatsApp » : un par numéro renseigné (liste vide si aucun). */
function orderLinks(product, className) {
  const contacts = whatsappContacts();
  const many = contacts.length > 1;
  return contacts.map((c) =>
    whatsappLink(c, orderMessage(product), "Commander sur WhatsApp", many, className)
  );
}

/** Emplacement photo : photo fournie si elle existe, sinon espace explicite « Image temporaire ». */
function photoElement(product) {
  const wrap = el("div", "photo");
  wrap.dataset.cat = product.categories[0];
  const src = CONFIG.images[product.id];

  if (src) {
    const img = el("img");
    img.src = src;
    img.alt = product.name + " — photo du produit";
    img.loading = "lazy";
    wrap.append(img);
  } else {
    wrap.setAttribute("role", "img");
    wrap.setAttribute("aria-label", "Emplacement photo pour " + product.name + " : image temporaire, photo de la marque à ajouter");
    wrap.append(el("span", "photo-title", "Photo du produit à ajouter"), el("span", "photo-tag", "Image temporaire"));
  }
  return wrap;
}

/* ---------- Catalogue : état, filtres et affichage ---------- */
const state = { query: "", category: "all" };

function matches(product) {
  const inCategory = state.category === "all" || product.categories.includes(state.category);
  const query = normalize(state.query);
  return inCategory && (!query || normalize(product.name).includes(query));
}

function renderCard(product) {
  const card = el("article", "card");
  card.append(photoElement(product));
  card.append(el("p", "card-cat", categoryLabel(product.categories[0])));
  card.append(el("h3", "", product.name));
  card.append(el("p", "card-desc", product.usage));
  card.append(el("p", "card-price", priceLabel(product.id)));

  const actions = el("div", "card-actions");
  const more = el("button", "btn btn-primary", "Découvrir");
  more.type = "button";
  more.setAttribute("aria-label", "Découvrir la fiche : " + product.name);
  more.addEventListener("click", () => openProduct(product));
  actions.append(more);

  // Sur la carte, le bouton WhatsApp n'apparaît que s'il y a un seul numéro ;
  // avec plusieurs numéros, le choix du pays se fait dans la fiche produit.
  const orders = orderLinks(product, "btn btn-ghost");
  if (orders.length === 1) actions.append(orders[0]);

  card.append(actions);
  return card;
}

function renderProducts() {
  const grid = $("#product-grid");
  const visible = PRODUCTS.filter(matches);
  grid.replaceChildren(...visible.map(renderCard));

  $("#empty-state").hidden = visible.length > 0;
  $("#results-status").textContent =
    visible.length === 0
      ? "Aucun produit affiché."
      : visible.length === 1
        ? "1 produit affiché."
        : visible.length + " produits affichés.";
}

function renderFilters() {
  const container = $("#filters");
  const options = [{ id: "all", label: "Tout afficher" }].concat(CATEGORIES);

  container.replaceChildren(
    ...options.map((option) => {
      const button = el("button", "chip", option.label);
      button.type = "button";
      button.dataset.category = option.id;
      button.setAttribute("aria-pressed", String(state.category === option.id));
      button.addEventListener("click", () => setCategory(option.id));
      return button;
    })
  );
}

function setCategory(id) {
  state.category = id;
  renderFilters();
  renderProducts();
}

function renderCategoryTiles() {
  const grid = $("#category-grid");
  grid.replaceChildren(
    ...CATEGORIES.map((category) => {
      const count = PRODUCTS.filter((p) => p.categories.includes(category.id)).length;
      const tile = el("button", "category-tile");
      tile.type = "button";
      tile.append(
        el("span", "tile-name", category.label),
        el("span", "tile-text", category.text),
        el("span", "tile-count", count + (count > 1 ? " produits" : " produit"))
      );
      tile.setAttribute("aria-label", "Afficher la catégorie " + category.label + " (" + count + (count > 1 ? " produits)" : " produit)"));
      tile.addEventListener("click", () => {
        setCategory(category.id);
        $("#catalogue").scrollIntoView();
      });
      return tile;
    })
  );
}

function resetFilters() {
  state.query = "";
  state.category = "all";
  $("#search-input").value = "";
  renderFilters();
  renderProducts();
}

/* ---------- Fiche détaillée ---------- */
const dialog = $("#product-dialog");

function openProduct(product) {
  $("#dialog-photo").replaceChildren(photoElement(product));
  $("#dialog-cat").textContent = product.categories.map(categoryLabel).join(" · ");
  $("#dialog-title").textContent = product.name;
  $("#dialog-price").textContent = priceLabel(product.id);
  $("#dialog-usage").textContent = product.usage;
  $("#dialog-mode").textContent = product.mode;
  $("#dialog-precautions").textContent = product.precautions;

  // Étiquette « à rincer / sans rinçage », seulement si le catalogue le précise
  const badges = $("#dialog-badges");
  badges.replaceChildren();
  if (product.rinse) badges.append(el("span", "badge", product.rinse.label));

  const actions = $("#dialog-actions");
  actions.replaceChildren();
  const orders = orderLinks(product, "btn btn-primary");
  if (orders.length > 0) {
    actions.append(...orders);
  } else {
    const soon = el("button", "btn", "Contact bientôt disponible");
    soon.type = "button";
    soon.disabled = true;
    actions.append(soon);
  }

  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
  dialog.querySelector(".dialog-scroll").scrollTop = 0;
}

function closeDialog() {
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

/* ---------- Contact, coordonnées et prix ---------- */
function renderContact() {
  const actions = $("#contact-actions");
  const generic = "Bonjour KOMA BEAUTY, j’aimerais avoir des informations sur vos produits.";
  const contacts = whatsappContacts();

  if (contacts.length > 0) {
    const many = contacts.length > 1;
    actions.replaceChildren(
      ...contacts.map((c) => whatsappLink(c, generic, "Écrire sur WhatsApp", many, "btn btn-primary"))
    );
  } else {
    const soon = el("button", "btn", "Contact bientôt disponible");
    soon.type = "button";
    soon.disabled = true;
    actions.replaceChildren(soon);
  }

  // Autres coordonnées : seulement si elles sont fournies
  const items = [];
  if (CONFIG.phone) {
    const a = el("a", "", CONFIG.phone);
    a.href = "tel:" + CONFIG.phone.replace(/[^\d+]/g, "");
    items.push(["Téléphone : ", a]);
  }
  if (CONFIG.email) {
    const a = el("a", "", CONFIG.email);
    a.href = "mailto:" + CONFIG.email;
    items.push(["E-mail : ", a]);
  }
  if (/^https?:\/\//i.test(CONFIG.instagramUrl || "")) {
    const a = el("a", "", "Instagram");
    a.href = CONFIG.instagramUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", "Instagram de KOMA BEAUTY (nouvel onglet)");
    items.push(["", a]);
  }

  const build = () =>
    items.map(([label, link]) => {
      const li = el("li");
      if (label) li.append(label);
      li.append(link.cloneNode(true));
      return li;
    });

  $("#contact-list").replaceChildren(...build());
  $("#footer-contact").replaceChildren(...build());

  // Livraison : texte fourni uniquement
  const delivery = $("#delivery-info");
  if (CONFIG.deliveryInfo) {
    delivery.textContent = CONFIG.deliveryInfo;
    delivery.hidden = false;
  }

  // Note sur les prix : seulement si aucun prix n’est renseigné
  const hasPrices = Object.keys(CONFIG.prices).length > 0;
  $("#price-note").textContent = hasPrices ? "" : "Les prix sont communiqués sur demande.";
}

/* ---------- Logo, bannière et menu mobile ---------- */
function initLogoFallback() {
  const img = document.querySelector(".brand img");
  if (!img) return;
  const fallback = () => {
    const text = el("span", "brand-text", "Koma Beauty");
    img.replaceWith(text);
  };
  img.addEventListener("error", fallback, { once: true });
  if (img.complete && img.naturalWidth === 0) fallback();
}

function initHero() {
  if (!CONFIG.heroImage) return;
  const hero = $("#hero-visual");
  const img = el("img");
  img.src = CONFIG.heroImage;
  img.alt = "Ambiance KOMA BEAUTY";
  hero.prepend(img);
  hero.classList.add("has-photo");
  hero.removeAttribute("aria-label");
  hero.removeAttribute("role");
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = $("#site-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}

/* ---------- Bouton WhatsApp flottant ---------- */
// Un seul numéro : ouvre WhatsApp directement. Plusieurs : mène à la section contact, où chaque pays a son bouton.
function renderFloatingWhatsApp() {
  const contacts = whatsappContacts();
  if (contacts.length === 0) return;

  const link = el("a", "whatsapp-float", "WhatsApp");
  if (contacts.length === 1) {
    link.href = whatsappUrl(contacts[0].digits, "Bonjour KOMA BEAUTY, j’aimerais avoir des informations sur vos produits.");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "Nous contacter sur WhatsApp (ouvre WhatsApp dans un nouvel onglet)");
  } else {
    link.href = "#contact";
    link.setAttribute("aria-label", "Voir les contacts WhatsApp");
  }
  document.body.append(link);
}

/* ---------- Démarrage ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initLogoFallback();
  initHero();
  initNav();

  renderCategoryTiles();
  renderFilters();
  renderProducts();
  renderContact();
  renderFloatingWhatsApp();

  $("#search-input").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderProducts();
  });
  $("#reset-filters").addEventListener("click", resetFilters);

  $("#dialog-close").addEventListener("click", closeDialog);
  // Un clic sur le fond sombre ferme la fiche
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
});
