const promiseApproach = {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    
    fetchPosts: function() {
        return fetch(`${this.baseUrl}/posts?_limit=10`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(posts => {
                const commentPromises = posts.map(post => {
                    return this.fetchComments(post.id)
                        .then(comments => {
                            return { ...post, comments };
                        });
                });
                
                return Promise.all(commentPromises);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                throw error;
            });
    },
    
    fetchComments: function(postId) {
        return fetch(`${this.baseUrl}/comments?postId=${postId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error(`Error fetching comments for post ${postId}:`, error);
                throw error;
            });
    },
    
    renderPosts: function(posts) {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';
        
        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            
            const postHeader = document.createElement('div');
            postHeader.className = 'post-header';
            
            const postTitle = document.createElement('h2');
            postTitle.className = 'post-title';
            postTitle.textContent = post.title;
            
            postHeader.appendChild(postTitle);
            
            const postBody = document.createElement('div');
            postBody.className = 'post-body';
            postBody.textContent = post.body;
            
            const commentsSection = document.createElement('div');
            commentsSection.className = 'comments-section';
            
            const commentsToggle = document.createElement('div');
            commentsToggle.className = 'comments-toggle';
            
            const commentsTitle = document.createElement('h3');
            commentsTitle.textContent = `Comments (${post.comments.length})`;
            
            const toggleIcon = document.createElement('i');
            toggleIcon.className = 'fas fa-chevron-down';
            
            commentsToggle.appendChild(commentsTitle);
            commentsToggle.appendChild(toggleIcon);
            
            const commentsList = document.createElement('div');
            commentsList.className = 'comments-list';
            
            post.comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                
                const commentName = document.createElement('div');
                commentName.className = 'comment-name';
                commentName.textContent = comment.name;
                
                const commentEmail = document.createElement('div');
                commentEmail.className = 'comment-email';
                commentEmail.textContent = comment.email;
                
                const commentBody = document.createElement('div');
                commentBody.className = 'comment-body';
                commentBody.textContent = comment.body;
                
                commentElement.appendChild(commentName);
                commentElement.appendChild(commentEmail);
                commentElement.appendChild(commentBody);
                
                commentsList.appendChild(commentElement);
            });
            
            commentsToggle.addEventListener('click', () => {
                commentsList.classList.toggle('show');
                toggleIcon.classList.toggle('fa-chevron-down');
                toggleIcon.classList.toggle('fa-chevron-up');
            });
            
            commentsSection.appendChild(commentsToggle);
            commentsSection.appendChild(commentsList);
            
            postCard.appendChild(postHeader);
            postCard.appendChild(postBody);
            postCard.appendChild(commentsSection);
            
            postsContainer.appendChild(postCard);
        });
    },
    
    init: function() {
        const loader = document.getElementById('loader');
        loader.style.display = 'flex';
        
        this.fetchPosts()
            .then(posts => {
                this.renderPosts(posts);
                loader.style.display = 'none';
            })
            .catch(error => {
                console.error('Failed to initialize Promise approach:', error);
                loader.style.display = 'none';
                document.getElementById('posts-container').innerHTML = 
                    `<div class="error">Failed to load posts. Please try again later.</div>`;
            });
    }
};