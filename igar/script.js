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
  { file: "normal-baseline.mp4", label: "Normal · baseline" },
  { file: "normal-igar.mp4", label: "Normal · IGAR" },
  { file: "contradiction-baseline.mp4", label: "Contradiction · baseline" },
  { file: "contradiction-igar.mp4", label: "Contradiction · IGAR" },
];

const gallery = document.getElementById("demo-gallery");

if (gallery) {
  const fragment = document.createDocumentFragment();

  demoTasks.forEach((task) => {
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
      figure.className = "clip";

      const video = document.createElement("video");
      video.controls = true;
      video.muted = true;
      video.preload = "metadata";
      video.poster = task.poster;
      video.setAttribute("playsinline", "");

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
    fragment.append(article);
  });

  gallery.append(fragment);
}
