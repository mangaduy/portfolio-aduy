async function init() {
    try {
        const res = await fetch('config.json');
        const data = await res.json();
        
        document.getElementById('headline').innerText = data.headline;
        document.getElementById('about-text').innerHTML = parseMarkdown(data.about);
        document.getElementById('footer-branding').innerText = data.branding.footer_name;
        window.tallyUrl = data.settings.tally_url;

        if(!data.settings.show_pdf) document.getElementById('pdf-control').style.display = 'none';
        if(!data.settings.show_booking) document.getElementById('btn-booking').style.display = 'none';

        const mainContainer = document.getElementById('dynamic-sections');
        const navList = document.getElementById('nav-list');

        data.sections.forEach(sec => {
            const id = sec.name.toLowerCase().replace(/\s+/g, '-');
            navList.innerHTML += `<li><a href="#${id}">${sec.name}</a></li>`;
            
            const secEl = document.createElement('section');
            secEl.id = id;
            secEl.innerHTML = `<h2>${sec.name}</h2>`;
            
            sec.items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${item.year} — ${item.title}</h3>
                    <p>${parseMarkdown(item.desc)}</p>
                    ${item.video ? `<p class="no-print"><a href="${item.video}" class="inline-link" target="_blank">🔗 Lihat Media</a></p>` : ''}
                `;
                secEl.appendChild(card);
            });
            mainContainer.appendChild(secEl);
        });
    } catch (e) { console.error("Error dimuat Mang!", e); }
}

function parseMarkdown(text) {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="inline-link" target="_blank">$1</a>');
}

init();