const asyncAwaitApproach = {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    
    fetchComments: async function(postId) {
        try {
            const response = await fetch(`${this.baseUrl}/comments?postId=${postId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching comments for post ${postId}:`, error);
            throw error;
        }
    },
    
    fetchPosts: async function() {
        try {
            const response = await fetch(`${this.baseUrl}/posts?_limit=10`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const posts = await response.json();
            
            const postsWithComments = [];
            
            for (const post of posts) {
                const comments = await this.fetchComments(post.id);
                postsWithComments.push({ ...post, comments });
            }
            
            return postsWithComments;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
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
    
    init: async function() {
        const loader = document.getElementById('loader');
        loader.style.display = 'flex';
        
        try {
            const posts = await this.fetchPosts();
            this.renderPosts(posts);
            loader.style.display = 'none';
        } catch (error) {
            console.error('Failed to initialize Async/Await approach:', error);
            loader.style.display = 'none';
            document.getElementById('posts-container').innerHTML = 
                `<div class="error">Failed to load posts. Please try again later.</div>`;
        }
    }
};