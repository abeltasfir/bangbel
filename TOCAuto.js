document.addEventListener("DOMContentLoaded", function () {
  const tocContainer = document.getElementById("tocContent");
  if (!tocContainer) return;

  // Ambil elemen konten artikel (ganti selektor jika class-nya berbeda)
  const article = document.querySelector(".post-body, .entry-content, .post-entry, article");
  if (!article) return;

  const headings = article.querySelectorAll("h2, h3");
  const tocList = document.createElement("ul");
  let currentSubList = null;

  headings.forEach(heading => {
    let text = heading.textContent.trim();
    let id = text.toLowerCase().replace(/[^a-z0-9]/g, ""); // id satu kata
    heading.setAttribute("id", id);

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute("href", "#" + id);
    a.textContent = text;
    li.appendChild(a);

    if (heading.tagName === "H2") {
      tocList.appendChild(li);
      currentSubList = document.createElement("ul");
      li.appendChild(currentSubList);
    } else if (heading.tagName === "H3" && currentSubList) {
      currentSubList.appendChild(li);
    }
  });

  tocContainer.appendChild(tocList);
});
