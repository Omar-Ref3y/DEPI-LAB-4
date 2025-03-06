document.addEventListener('DOMContentLoaded', () => {
    const promiseBtn = document.getElementById('promiseBtn');
    const asyncBtn = document.getElementById('asyncBtn');
    
    promiseApproach.init();
    
    promiseBtn.addEventListener('click', () => {
        if (!promiseBtn.classList.contains('active')) {
            promiseBtn.classList.add('active');
            asyncBtn.classList.remove('active');
            
            document.getElementById('posts-container').innerHTML = '';
            document.getElementById('loader').style.display = 'flex';
            
            promiseApproach.init();
        }
    });
    
    asyncBtn.addEventListener('click', () => {
        if (!asyncBtn.classList.contains('active')) {
            asyncBtn.classList.add('active');
            promiseBtn.classList.remove('active');
            
            document.getElementById('posts-container').innerHTML = '';
            document.getElementById('loader').style.display = 'flex';
            
            asyncAwaitApproach.init();
        }
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .error {
            background-color: #ffdddd;
            color: #ff0000;
            padding: 1rem;
            border-radius: 4px;
            text-align: center;
            margin: 1rem 0;
        }
    `;
    document.head.appendChild(style);
});