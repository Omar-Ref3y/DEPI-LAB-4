document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search');
    const usernameInput = document.getElementById('username');
    const profileContainer = document.getElementById('profile-container');

    searchButton.addEventListener('click', () => {
        searchGitHubUser();
    });

    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchGitHubUser();
        }
    });

    function searchGitHubUser() {
        const username = usernameInput.value.trim();
        
        if (username === '') {
            showError('Please enter a username');
            return;
        }

        profileContainer.innerHTML = '<div class="loading">Loading...</div>';
        profileContainer.style.display = 'block';

        fetch(`https://api.github.com/users/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }
                return response.json();
            })
            .then(user => {
                displayUserProfile(user);
            })
            .catch(error => {
                showError(`Error: ${error.message}`);
            });
    }

    function displayUserProfile(user) {
        const createdAt = new Date(user.created_at);
        const formattedDate = createdAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const profileHTML = `
            <div class="profile">
                ${user.message ? `<div class="error-message">${user.message}</div>` : ''}
                <div class="profile-header">
                    <img src="${user.avatar_url}" alt="${user.login}'s avatar" class="avatar">
                    <div class="profile-info">
                        <h2 class="profile-name">${user.name || user.login}</h2>
                        <p class="profile-username">@${user.login}</p>
                        <p class="profile-joined">Joined ${formattedDate}</p>
                        ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ''}
                    </div>
                </div>
                
                <div class="profile-stats">
                    <div class="stat">
                        <div class="stat-value">${user.public_repos}</div>
                        <div class="stat-name">Repositories</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${user.followers}</div>
                        <div class="stat-name">Followers</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${user.following}</div>
                        <div class="stat-name">Following</div>
                    </div>
                </div>
                
                <div class="profile-links">
                    ${user.blog ? `<a href="${user.blog}" target="_blank" class="profile-link">🔗 ${user.blog}</a>` : ''}
                    ${user.html_url ? `<a href="${user.html_url}" target="_blank" class="profile-link">🐙 GitHub Profile</a>` : ''}
                    ${user.twitter_username ? `<a href="https://twitter.com/${user.twitter_username}" target="_blank" class="profile-link">🐦 @${user.twitter_username}</a>` : ''}
                    ${user.company ? `<div class="profile-link">🏢 ${user.company}</div>` : ''}
                    ${user.location ? `<div class="profile-link">📍 ${user.location}</div>` : ''}
                    ${user.email ? `<a href="mailto:${user.email}" class="profile-link">✉️ ${user.email}</a>` : ''}
                </div>
            </div>
        `;

        profileContainer.innerHTML = profileHTML;
        profileContainer.style.display = 'block';
    }

    function showError(message) {
        profileContainer.innerHTML = `<div class="error-message">${message}</div>`;
        profileContainer.style.display = 'block';
    }
});