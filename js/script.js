const profileOverview=document.querySelector("div.overview");
const username="johnson-brandon";
const repoList=document.querySelector("ul.repo-list");
const repoContainer=document.querySelector(".repos");
const repoDataContainer=document.querySelector(".repo-data");
const viewAllReposButton=document.querySelector(".view-repos");
const filterInput=document.querySelector("input.filter-repos");

// Collects user info from GitHub
const getData=async function () {
    const userInfo = await fetch(
        `https://api.github.com/users/${username}`
    );
    const data = await userInfo.json();
    // console.log(data);
    displayUserInfo(data);
};
getData();

//Displays user profile data on page
const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML=`
        <figure>
        <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Bio:</strong> ${data.bio}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div>
        `;
    profileOverview.append(div);
    fetchRepos();
};

// Collects repo data sorted by last updated and limits to 100 per page
const fetchRepos = async function () {
    const listRepos = await fetch (
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
    );
    const repoData = await listRepos.json();
    displayRepos(repoData);
};

// Displays repo data on page
const displayRepos = function (repos) {
    filterInput.classList.remove("hide");

    for (const repo of repos) {
        const repoItem=document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
       getRepoInfo(repoName);
    }
});

//grab information about all repos
const getRepoInfo = async function (repoName) {
    const fetchRepoInfo = await fetch (
        `https://api.github.com/repos/${username}/${repoName}`
    );
    const repoInfo = await fetchRepoInfo.json();
    // console.log(repoInfo);

    //grab languages
    const fetchLanguages = await fetch (repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    // console.log(languageData);

    //create new array of languages used
    const languages = [];
    for (const language in languageData) {
        languages.push(language);
        // console.log(languages);
    }

    displayRepoInfo(repoInfo, languages);
};

// compile repo details and append to page
const displayRepoInfo = function (repoInfo, languages) {
    repoDataContainer.innerText = "";
    const div = document.createElement("div");
    div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoDataContainer.append(div);
    repoDataContainer.classList.remove("hide");
    repoContainer.classList.add("hide");
    viewAllReposButton.classList.remove("hide");
};

viewAllReposButton.addEventListener("click", function () {
    repoContainer.classList.remove("hide");
    repoDataContainer.classList.add("hide");
    viewAllReposButton.classList.add("hide");
});

// Add dynamic search function
filterInput.addEventListener("input", function (e) {
    const searchText = e.target.value;
    console.log(searchText);

    const repos = document.querySelectorAll(".repo");
    const searchTextLower = searchText.toLowerCase();

    for (const repo of repos) {
        const repoTextLower = repo.innerText.toLowerCase();
        if (repoTextLower.includes(searchTextLower)) {
            repo.classList.remove("hide");
        } else {repo.classList.add("hide");
    }
    }
});