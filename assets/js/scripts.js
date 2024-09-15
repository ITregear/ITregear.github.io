async function changeTab(pageName) {
    const content = document.getElementById('content');

    try {
        const response = await fetch(`pages/${pageName}.html`);

        if (response.ok) {
            const data = await response.text();
            content.innerHTML = data;
        } else {
            content.innerHTML = '<p>Error loading the content.</p>';
        }
    } catch (error) {
        console.error('Error fetching the content:', error);
        content.innerHTML = '<p>Error loading the content.</p>';
    }
}