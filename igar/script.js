const demoTasks = [
  {
    title: "Open the middle drawer",
    folder: "task-01-open-middle-drawer",
    model: "π₀",
    normalInstruction: "open the middle drawer of the cabinet",
    icbenchInstruction: "open the yellow middle drawer of the cabinet",
  },
  {
    title: "Put the cream cheese",
    folder: "task-02-put-cream-cheese",
    model: "π₀.₅",
    normalInstruction: "put the cream cheese in the bowl",
    icbenchInstruction: "put the cream cheese in the white bowl",
  },
  {
    title: "Pick up the black bowl I",
    folder: "task-03-pick-up-black-bowl",
    model: "OpenVLA-OFT",
    normalInstruction: "pick up the black bowl in the top drawer of the cabinet and place it on the plate",
    icbenchInstruction: "pick up the black bowl in the top drawer of the cabinet and place it against the plate",
  },
  {
    title: "Pick up the black bowl II",
    folder: "task-04-pick-up-black-bowl",
    model: "OpenVLA-OFT",
    normalInstruction: "pick up the black bowl on the ramekin and place it on the plate",
    icbenchInstruction: "pick up the white bowl on the ramekin and place it on the black plate",
  },
  {
    title: "Pick up the ketchup",
    folder: "task-05-pick-up-ketchup",
    model: "π₀",
    normalInstruction: "pick up the ketchup and place it in the basket",
    icbenchInstruction: "pick up the ketchup and place it in the orange basket",
  },
  {
    title: "Pick up the milk",
    folder: "task-06-pick-up-milk",
    model: "OpenVLA-OFT",
    normalInstruction: "pick up the milk and place it in the basket",
    icbenchInstruction: "pick up the milk and place it under the basket",
  },
  {
    title: "Place the blue cube",
    folder: "task-07-place-blue-cube",
    model: "π₀",
    normalInstruction: "place the blue cube into the open drawer",
    icbenchInstruction: "place the red cube into the open drawer",
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
    condition: "ICBench instruction",
    policy: "Baseline",
    outcome: "Fake success",
    classes: ["is-contradiction"],
  },
  {
    file: "contradiction-igar.mp4",
    condition: "ICBench instruction",
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

  const instructions = document.createElement("div");
  instructions.className = "instruction-comparison";

  const normalInstruction = document.createElement("p");
  const normalLabel = document.createElement("strong");
  normalLabel.textContent = "Normal instruction";
  const normalText = document.createElement("span");
  normalText.textContent = task.normalInstruction;
  normalInstruction.append(normalLabel, normalText);

  const icbenchInstruction = document.createElement("p");
  const icbenchLabel = document.createElement("strong");
  icbenchLabel.textContent = "ICBench instruction";
  const icbenchText = document.createElement("span");
  icbenchText.textContent = task.icbenchInstruction;
  icbenchInstruction.append(icbenchLabel, icbenchText);

  instructions.append(normalInstruction, icbenchInstruction);
  heading.append(title, model, instructions);

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
        copyButton.textContent = "Copy";
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
