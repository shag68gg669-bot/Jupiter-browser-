const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('keydown', (event) => {

    if (event.key === 'Enter') {
        const query = searchBar.value.trim();
        if (query) {
            window.location.href = `https://www.duckduckgo.com/?q=${encodeURIComponent(query)}`;
        }
    }
    
});