const profileOverview=document.querySelector("div.overview");
const username="johnson-brandon";
const repoList=document.querySelector("ul.repo-list");

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
    for (repo of repos) {
        const repoItem=document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
}