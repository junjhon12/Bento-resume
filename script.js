document.addEventListener('DOMContentLoaded', () => {
    const repContainer = document.getElementById('rep');
    const leftBtn = document.querySelector('.left.btn');
    const rightBtn = document.querySelector('.right.btn');
    const username = 'junjhon12';
    let repos = [];
    let currentIndex = 0;

    const fetchRepos = async () => {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/starred?sort=updated`);
            let data = await response.json();
            if (Array.isArray(data)) {
                // SAFETY CHECK: specifically look for repos owned by YOU (junjhon12)
                repos = data.filter(repo => repo.owner.login.toLowerCase() === username.toLowerCase());
                if (repos.length > 0) {
                    renderRepo();
                } else {
                    repContainer.innerHTML = '<p>No starred repositories found.</p>';
                }
            }
        } catch (error) {
            console.error("Github API Error:", error);
            repContainer.innerHTML = '<p>Error loading repositories.</p>';
        }
    };

    const renderRepo = () => {
        if (repos.length === 0) return;
        const repo = repos[currentIndex];
        const repoName = repo.name.replace(/[-_]/g, " ");
        const repoDesc = repo.description ? (repo.description.length > 100 ? repo.description.substring(0, 100) + "..." : repo.description) : "No description provided.";
        const repoImage = `https://placehold.co/600x400/ff6b6b/white?text=${repo.language || 'Code'}`;

        repContainer.innerHTML = `
            <div class="card">
                <div class="card-img"><img src="${repoImage}" alt="${repoName}"></div>
                <div class="card-content">
                    <h5 style="font-size:10px; text-align:center;">${repoName}</h5>
                    <a href="${repo.html_url}" target="_blank">View Code</a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank">Live Demo</a>` : ''}
                </div>
            </div>
        `;
    };

    leftBtn.addEventListener('click', () => {
        if (repos.length === 0) return;
        currentIndex = (currentIndex === 0) ? repos.length - 1 : currentIndex - 1;
        renderRepo();
    });

    rightBtn.addEventListener('click', () => {
        if (repos.length === 0) return;
        currentIndex = (currentIndex === repos.length - 1) ? 0 : currentIndex + 1;
        renderRepo();
    });

    fetchRepos();
});
