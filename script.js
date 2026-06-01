async function init() {
    try {
        const res = await fetch('config.json');
        const data = await res.json();

        document.getElementById('headline').innerText = data.headline;
        document.getElementById('about-text').innerHTML = parseMarkdown(data.about);
        document.getElementById('footer-branding').innerText = data.branding.footer_name;
        document.getElementById('user-name').innerText = data.branding.footer_name;
        document.getElementById('copyright-text').innerText = data.branding.copyright || "© 2026 Mang Aduy";
        
        if(data.branding.photo) {
            const img = document.getElementById('profile-photo');
            img.src = data.branding.photo;
            img.style.display = 'block';
        }

        if(data.social) renderSocial(data.social);

        if(!data.settings.show_pdf) document.getElementById('pdf-control').style.display = 'none';
        if(!data.settings.show_booking) {
            document.getElementById('btn-booking').style.display = 'none';
            document.getElementById('btn-booking-top').style.display = 'none';
        }

        const mainContainer = document.getElementById('dynamic-sections');

        data.sections.forEach(sec => {
            const id = sec.name.toLowerCase().replace(/\s+/g, '-');

            const header = document.createElement('div');
            header.className = 'accordion-header';
            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', 'false');
            header.innerHTML = `<h2>${sec.name}</h2><span class="accordion-arrow">▶</span>`;

            const body = document.createElement('div');
            body.className = 'accordion-body';
            body.id = id;

            sec.items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${item.year} — ${item.title}</h3>
                    <p>${parseMarkdown(item.desc)}</p>
                    ${item.video ? `<p class="no-print"><a href="${item.video}" class="inline-link" target="_blank">▶ See Work</a></p>` : ''}
                `;
                body.appendChild(card);
            });

            header.addEventListener('click', () => {
                const isOpen = body.classList.contains('open');
                body.classList.toggle('open', !isOpen);
                header.classList.toggle('open', !isOpen);
                header.setAttribute('aria-expanded', !isOpen);
            });

            mainContainer.appendChild(header);
            mainContainer.appendChild(body);
        });

    } catch (e) { console.error("Data error Mang!", e); }
}

function parseMarkdown(text) {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="inline-link" target="_blank">$1</a>');
}

function renderSocial(social) {
    const links = [
        { key: 'instagram', label: 'Instagram' },
        { key: 'threads', label: 'Threads' },
        { key: 'tiktok', label: 'TikTok' },
        { key: 'youtube', label: 'YouTube' },
        { key: 'linkedin', label: 'LinkedIn' },
        { key: 'email', label: 'Email' }
    ];
    const html = links
        .filter(s => social[s.key])
        .map(s => `<a href="${social[s.key]}" class="social-link" target="_blank">${s.label}</a>`)
        .join('');
    const el = document.createElement('div');
    el.id = 'social-links';
    el.innerHTML = html;
    document.querySelector('footer .container').prepend(el);
}

init();
