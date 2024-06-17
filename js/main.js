const githubName = "fastuptime";

async function listHtml() {
  let repos = await getRepos();
  repoList = document.getElementById("repo-list");
  if (!Array.isArray(repos)) {
    repoList.innerHTML = `
            <div class="repo-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
                <h3 class="text-xl font-semibold text-gray-800">
                    ${repos.message || "Something went wrong. Please try again later."}
                </h3>
            </div>
        `;
    repoList.style =
      "display: flex; justify-content: center; align-items: center;";
    return;
  }
  repos.forEach((repo) => {
    const repoItem = document.createElement("div");
    repoItem.className =
      "repo-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg";
    repoItem.id = `repoName-${repo.name}`;
    repoItem.innerHTML = `
          <a href="${repo.html_url}" target="_blank" class="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 rounded-bl-lg rounded-tr-lg text-xs font-semibold" title="View on GitHub" style="display: none;" id="view-on-github-${repo.id}">View on GitHub</a>
          <h3 class="text-xl font-semibold text-gray-800">${repo.name.split("_").join(" ")}</h3>
          <p class="text-gray-600 mt-2">${repo.description || "No description provided."}</p>
          <div class="flex items-center mt-4">
            <h4 class="text-gray-800 text-sm font-semibold mr-2">Language:</h4>
            <span class="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">${repo.language || "No language"}</span>
          </div>
            <div class="flex flex-wrap mt-4">
                <h4 class="text-gray-800 text-sm font-semibold mr-2">Topics:</h4>
                ${repo.topics.map((topic) => `<span class="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full mr-2 mb-2">${topic}</span>`).join("")}
            </div>
          <div class="text-sm text-gray-500 mt-4">
            <span class="ml-2">⭐ ${repo.stargazers_count}</span>
            <span class="ml-2">🍴 ${repo.forks_count}</span>
            <span class="ml-2">👁️ ${repo.watchers_count}</span>
            <span class="ml-2">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
          </div>
        `;
    repoList.appendChild(repoItem);
  });
}

function getRepos() {
  return fetch(
    `https://api.github.com/users/${githubName}/repos?sort=create&direction=desc`,
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error(error));
}

function getRepoDetails(repoName) {
  return fetch(`https://api.github.com/repos/${githubName}/${repoName}`)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error(error));
}

document.addEventListener("DOMContentLoaded", () => {
  listHtml();

  document.addEventListener("mouseover", (e) => {
    if (
      e.target.className ===
      "repo-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg"
    ) {
      e.target.querySelector("a").style = "display: block;";
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (
      e.target.className ===
      "repo-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg"
    ) {
      setTimeout(() => {
        e.target.querySelector("a").style = "display: none;";
      }, 1000);
    }
  });
  function b64DecodeUnicode(str) {
    return decodeURIComponent(
      atob(str)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
  }
  document.addEventListener("click", (e) => {
    let id = e.target.parentElement.id;
    if (id) {
      let repoName = id.split("-")[1];
      if (id.includes("repoName")) {
        document.getElementById("projects").style = "display: none;";
        document.getElementById("projectDetails").style = "display: block;";
        document.getElementById("projectDetailsContent").innerHTML = `
                <button class="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-semibold" id="backButton"><i class="fas fa-arrow-left"></i> Back</button>
                    <div class="flex items-center justify-between mt-4 mb-4">
                        <h2 class="text-2xl font-semibold text-gray-800" style="text-transform: capitalize; text-align: center; width: 100%;">${repoName.split("_").join(" ")}</h2>
                    </div>
                    <div class="flex items-center mt-4">
                        <h4 class="text-gray-800 text-sm font-semibold mr-2">Topics:</h4>
                        <div id="topics"></div>
                    </div>
                    <div class="flex items-center mt-4">
                        <h4 class="text-gray-800 text-sm font-semibold mr-2">Languages:</h4>
                        <div id="languages"></div>
                    </div>
                    <div class="flex items-center mt-4">
                        <h4 class="text-gray-800 text-sm font-semibold mr-2">Links:</h4>
                        <a href="#" target="_blank" id="view-on-github"><i class="fab fa-github text-gray-800 text-sm mr-2"></i></a>
                        <a href="#" target="_blank" id="view-live"><i class="fas fa-external-link-alt text-gray-800 text-sm mr-2"></i></a>
                    </div>
                    <div class="flex items center mt-4">
                        <h4 class="text-gray-800 text-sm font-semibold mr-2">Readme:</h4>
                        <div id="readme" class="mt-2 text-gray-600 text-sm"></div>
                    </div>
                    <hr class="my-4">
                    <div class="flex items-center mt-4">
                        <h4 class="text-gray-800 text-sm font-semibold mr-2">Stats:</h4>
                        <div class="text-sm text-gray-500">
                            <span class="ml-2">⭐ <span id="stars"></span></span>
                            <span class="ml-2">🍴 <span id="forks"></span></span>
                            <span class="ml-2">👁️ <span id="watchers"></span></span>
                            <span class="ml-2">Updated: <span id="updated"></span></span>
                        </div>
                    </div>
                    <div class="flex items-center mt-4">
                        <h4 class="text-gray-800 text-sm font-semibold mr-2">Contributors:</h4>
                        <div id="contributors"></div>
                    </div>
                `;

        document.getElementById("backButton").addEventListener("click", () => {
          location.reload();
        });

        getRepoDetails(repoName).then((repo) => {
          let topics = document.getElementById("topics");
          let languages = document.getElementById("languages");
          let readme = document.getElementById("readme");
          let viewOnGithub = document.getElementById("view-on-github");
          let viewLive = document.getElementById("view-live");
          let stars = document.getElementById("stars");
          let forks = document.getElementById("forks");
          let watchers = document.getElementById("watchers");

          viewOnGithub.href = repo.html_url;
          viewLive.href = repo.homepage;
          stars.innerHTML = repo.stargazers_count;
          forks.innerHTML = repo.forks_count;
          watchers.innerHTML = repo.watchers_count;
          topics.innerHTML = repo.topics
            .map(
              (topic) =>
                `<span class="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full mr-2 mb-2">${topic}</span>`,
            )
            .join("");
          languages.innerHTML = `<span class="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full mr-2 mb-2">${repo.language}</span>`;
          fetch(
            `https://api.github.com/repos/${githubName}/${repoName}/contents/README.md`,
          )
            .then((response) => response.json())
            .then((data) => {
              data = data.content;
              let converter = new showdown.Converter();
              html = converter.makeHtml(b64DecodeUnicode(data));
              readme.innerHTML = html;
            })
            .catch((error) => console.error(error));
        });
      }
    }
  });
});
