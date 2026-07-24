const demoTasks = [
  {
    title: "Open the middle drawer",
    folder: "task-01-open-middle-drawer",
    note: "Drawer manipulation under normal and contradictory language.",
    poster: "assets/figures/motion.png",
  },
  {
    title: "Put the cream cheese",
    folder: "task-02-put-cream-cheese",
    note: "Object placement with visual priors held fixed.",
    poster: "assets/figures/supp_heatmap_combined.png",
  },
  {
    title: "Pick up the black bowl I",
    folder: "task-03-pick-up-black-bowl",
    note: "Attribute contradiction for a target object.",
    poster: "assets/figures/heatmap.png",
  },
  {
    title: "Pick up the black bowl II",
    folder: "task-04-pick-up-black-bowl",
    note: "A second rollout for the same object family.",
    poster: "assets/figures/motion.png",
  },
  {
    title: "Pick up the ketchup",
    folder: "task-05-pick-up-ketchup",
    note: "Contradictory instructions with visually plausible execution paths.",
    poster: "assets/figures/supp_v2_affordance_comparison.png",
  },
  {
    title: "Pick up the milk",
    folder: "task-06-pick-up-milk",
    note: "Comparing baseline and recalibrated policies.",
    poster: "assets/figures/supp_heatmap_combined.png",
  },
  {
    title: "Place the blue cube",
    folder: "task-07-place-blue-cube",
    note: "Real-world inspired cube placement behavior.",
    poster: "assets/figures/realworld.png",
  },
];

const demoVariants = [
  { file: "normal-baseline.mp4", label: "Normal / Baseline", classes: [] },
  { file: "normal-igar.mp4", label: "Normal / IGAR", classes: ["is-igar"] },
  {
    file: "contradiction-baseline.mp4",
    label: "Contradiction / Baseline",
    classes: ["is-contradiction"],
  },
  {
    file: "contradiction-igar.mp4",
    label: "Contradiction / IGAR",
    classes: ["is-contradiction", "is-igar"],
  },
];

const gallery = document.getElementById("demo-gallery");
const tabs = document.getElementById("demo-tabs");
const select = document.getElementById("demo-select");

function createDemo(task) {
  const article = document.createElement("article");
  article.className = "demo-task";

  const heading = document.createElement("div");
  heading.className = "task-heading";

  const title = document.createElement("h3");
  title.textContent = task.title;

  const note = document.createElement("p");
  note.textContent = task.note;

  heading.append(title, note);

  const grid = document.createElement("div");
  grid.className = "clip-grid";

  demoVariants.forEach((variant) => {
    const figure = document.createElement("figure");
    figure.classList.add("clip", ...variant.classes);

    const video = document.createElement("video");
    video.controls = true;
    video.muted = true;
    video.preload = "metadata";
    video.poster = task.poster;
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-label", `${task.title}: ${variant.label}`);

    const source = document.createElement("source");
    source.src = `assets/videos/demo/${task.folder}/${variant.file}`;
    source.type = "video/mp4";

    const caption = document.createElement("figcaption");
    caption.textContent = variant.label;

    video.append(source);
    figure.append(video, caption);
    grid.append(figure);
  });

  article.append(heading, grid);
  return article;
}

function showDemo(index) {
  if (!gallery || !tabs || !select) return;

  gallery.replaceChildren(createDemo(demoTasks[index]));
  select.value = String(index);

  tabs.querySelectorAll(".demo-tab").forEach((tab, tabIndex) => {
    tab.setAttribute("aria-selected", String(tabIndex === index));
    tab.tabIndex = tabIndex === index ? 0 : -1;
  });
}

if (gallery && tabs && select) {
  const tabFragment = document.createDocumentFragment();
  const optionFragment = document.createDocumentFragment();

  demoTasks.forEach((task, index) => {
    const tab = document.createElement("button");
    tab.className = "demo-tab";
    tab.type = "button";
    tab.role = "tab";
    tab.textContent = task.title;
    tab.setAttribute("aria-selected", "false");
    tab.addEventListener("click", () => showDemo(index));
    tabFragment.append(tab);

    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = task.title;
    optionFragment.append(option);
  });

  tabs.append(tabFragment);
  select.append(optionFragment);
  select.addEventListener("change", (event) => showDemo(Number(event.target.value)));
  showDemo(0);
}

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav nav");

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("open");
  document.body.classList.remove("nav-open");
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    siteNav.classList.toggle("open", willOpen);
    document.body.classList.toggle("nav-open", willOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

const copyButton = document.querySelector(".copy-button");
const bibtex = document.getElementById("bibtex");

if (copyButton && bibtex) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(bibtex.textContent);
      copyButton.textContent = "Copied";
      copyButton.classList.add("copied");
      window.setTimeout(() => {
        copyButton.textContent = "Copy BibTeX";
        copyButton.classList.remove("copied");
      }, 1800);
    } catch {
      copyButton.textContent = "Select to copy";
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(bibtex);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
}

const navLinks = Array.from(document.querySelectorAll(".site-nav nav a"));
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && observedSections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { rootMargin: "-25% 0px -60% 0px", threshold: [0.01, 0.25, 0.5] },
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}
