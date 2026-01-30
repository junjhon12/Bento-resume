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
                    fetchAndRenderLanguages(repos);
                } else {
                    repContainer.innerHTML = '<p>No starred repositories found.</p>';
                }
            }
        } catch (error) {
            console.error("Github API Error:", error);
            repContainer.innerHTML = '<p>Error loading repositories.</p>';
        }
    };

    const fetchAndRenderLanguages = async (repos) => {
        const container3 = document.querySelector('.container3');
        container3.innerHTML = '<p>Loading languages...</p>'; // Loading state

        try {
            const languagePromises = repos.map(repo =>
                fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`).then(res => res.json())
            );
            const languagesPerRepo = await Promise.all(languagePromises);

            const allLanguages = languagesPerRepo.reduce((acc, langObj) => {
                return acc.concat(Object.keys(langObj));
            }, []);

            const uniqueLanguages = [...new Set(allLanguages)];

            // Simple mapping for devicon names
            const languageMap = {
                'c#': 'csharp',
                'c++': 'cplusplus',
                'html': 'html5',
                'css': 'css3',
            };

            container3.innerHTML = ''; // Clear loading state
            const languagesTitle = document.createElement('p');
            languagesTitle.textContent = "Languages & Technologies";
            languagesTitle.style.textAlign = 'center';
            languagesTitle.style.fontWeight = 'bold';
            languagesTitle.style.width = '100%';
            container3.appendChild(languagesTitle);

            const iconContainer = document.createElement('div');
            iconContainer.className = 'language-icons';
            container3.appendChild(iconContainer);

            uniqueLanguages.forEach(lang => {
                const langLower = lang.toLowerCase();
                const iconName = languageMap[langLower] || langLower;
                
                const img = document.createElement('img');
                img.src = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconName}/${iconName}-original.svg`;
                img.alt = lang;
                img.className = 'language-icon';
                
                img.onerror = () => {
                    img.src = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconName}/${iconName}-plain.svg`;
                    img.onerror = () => {
                        // try to find a wordmark version
                         img.src = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconName}/${iconName}-original-wordmark.svg`;
                         img.onerror = () => {
                            img.src = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconName}/${iconName}-plain-wordmark.svg`;
                            img.onerror = () => {
                                img.style.display = 'none';
                            };
                         };
                    };
                };
                
                iconContainer.appendChild(img);
            });

        } catch (error) {
            console.error("Error fetching languages:", error);
            container3.innerHTML = '<p>Error loading languages.</p>';
        }
    };

    const renderRepo = () => {
        if (repos.length === 0) return;
        const repo = repos[currentIndex];
        const repoName = repo.name.replace(/[-_]/g, " ");

        repContainer.innerHTML = `
            <div class="card">
                <div class="card-content">
                    <h5 style="font-size:1em; text-align:center;">${repoName}</h5>
                    <a href="${repo.html_url}" target="_blank">View Code</a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank">Live Demo</a>` : `<a style="visibility: hidden;">Live Demo</a>`}
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
