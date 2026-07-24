const demoTasks = [
  {
    title: "Open the middle drawer",
    folder: "task-01-open-middle-drawer",
    model: "π₀",
    normalPrompt: "open the middle drawer of the cabinet",
    modifiedPrompt: "open the yellow middle drawer of the cabinet",
  },
  {
    title: "Put the cream cheese",
    folder: "task-02-put-cream-cheese",
    model: "π₀.₅",
    normalPrompt: "put the cream cheese in the bowl",
    modifiedPrompt: "put the cream cheese in the white bowl",
  },
  {
    title: "Pick up the black bowl I",
    folder: "task-03-pick-up-black-bowl",
    model: "OpenVLA-OFT",
    normalPrompt: "pick up the black bowl in the top drawer of the cabinet and place it on the plate",
    modifiedPrompt: "pick up the black bowl in the top drawer of the cabinet and place it against the plate",
  },
  {
    title: "Pick up the black bowl II",
    folder: "task-04-pick-up-black-bowl",
    model: "OpenVLA-OFT",
    normalPrompt: "pick up the black bowl on the ramekin and place it on the plate",
    modifiedPrompt: "pick up the white bowl on the ramekin and place it on the black plate",
  },
  {
    title: "Pick up the ketchup",
    folder: "task-05-pick-up-ketchup",
    model: "π₀",
    normalPrompt: "pick up the ketchup and place it in the basket",
    modifiedPrompt: "pick up the ketchup and place it in the orange basket",
  },
  {
    title: "Pick up the milk",
    folder: "task-06-pick-up-milk",
    model: "OpenVLA-OFT",
    normalPrompt: "pick up the milk and place it in the basket",
    modifiedPrompt: "pick up the milk and place it under the basket",
  },
  {
    title: "Place the blue cube",
    folder: "task-07-place-blue-cube",
    model: "π₀",
    normalPrompt: "place the blue cube into the open drawer",
    modifiedPrompt: "place the red cube into the open drawer",
    upright: true,
    playbackRate: 2,
  },
];

const demoVariants = [
  {
    file: "normal-baseline.mp4",
    condition: "Normal instruction",
    policy: "Baseline",
    outcome: "Real success",
    classes: [],
  },
  {
    file: "normal-igar.mp4",
    condition: "Normal instruction",
    policy: "IGAR",
    outcome: "Real success",
    classes: ["is-igar"],
  },
  {
    file: "contradiction-baseline.mp4",
    condition: "Modified instruction",
    policy: "Baseline",
    outcome: "Fake success",
    classes: ["is-contradiction"],
  },
  {
    file: "contradiction-igar.mp4",
    condition: "Modified instruction",
    policy: "IGAR",
    outcome: "Deserved failure",
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

  const model = document.createElement("p");
  model.className = "task-model";
  model.textContent = `Model: ${task.model}`;

  const prompts = document.createElement("div");
  prompts.className = "prompt-comparison";

  const normalPrompt = document.createElement("p");
  const normalLabel = document.createElement("strong");
  normalLabel.textContent = "Normal prompt";
  const normalText = document.createElement("span");
  normalText.textContent = task.normalPrompt;
  normalPrompt.append(normalLabel, normalText);

  const modifiedPrompt = document.createElement("p");
  const modifiedLabel = document.createElement("strong");
  modifiedLabel.textContent = "Modified prompt";
  const modifiedText = document.createElement("span");
  modifiedText.textContent = task.modifiedPrompt;
  modifiedPrompt.append(modifiedLabel, modifiedText);

  prompts.append(normalPrompt, modifiedPrompt);
  heading.append(title, model, prompts);

  const grid = document.createElement("div");
  grid.className = "clip-grid";

  demoVariants.forEach((variant) => {
    const figure = document.createElement("figure");
    figure.classList.add("clip", ...variant.classes);
    if (task.upright) figure.classList.add("is-upright");

    const video = document.createElement("video");
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.defaultMuted = true;
    video.preload = "auto";
    video.poster = `assets/videos/demo/${task.folder}/${variant.file.replace(".mp4", ".jpg")}`;
    video.playbackRate = task.playbackRate || 1;
    video.defaultPlaybackRate = task.playbackRate || 1;
    video.addEventListener("loadedmetadata", () => {
      video.playbackRate = task.playbackRate || 1;
    });
    video.setAttribute("playsinline", "");
    video.setAttribute(
      "aria-label",
      `${task.title}: ${variant.condition}, ${variant.policy}, ${variant.outcome}`,
    );

    const source = document.createElement("source");
    source.src = `assets/videos/demo/${task.folder}/${variant.file}`;
    source.type = "video/mp4";

    const caption = document.createElement("figcaption");
    const condition = document.createElement("span");
    condition.className = "clip-condition";
    condition.textContent = variant.condition;

    const policy = document.createElement("span");
    policy.className = "clip-policy";
    policy.textContent = variant.policy;

    const outcome = document.createElement("strong");
    outcome.className = "clip-outcome";
    outcome.textContent = variant.outcome;

    caption.append(condition, policy, outcome);
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
