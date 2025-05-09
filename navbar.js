const navLinks = [
    { text: "Home", href: "index.html" },
    { text: "About Us", href: "about.html" },
    { text: "Contact", href: "contact.html" },
    { text: "Projects", href: "projects.html" },
    { text: "Chat", href: "chat.html" },
    { text: "Partners", href: "partners.html" },
    { text: "Newsletter", href: "newsletter.html" }
];

const nav = document.createElement('nav');

navLinks.forEach(link => {
    const a = document.createElement('a');
    a.textContent = link.text;
    a.href = link.href;
    nav.appendChild(a);
});

document.body.insertBefore(nav, document.body.firstChild);
