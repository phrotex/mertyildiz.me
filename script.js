document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('periodic-table');
    const infoBox = document.getElementById('info-box');
    const loadingOverlay = document.getElementById('loading');
    const legendContainer = document.getElementById('legend');
    
    // Modal Elements
    const mobileModal = document.getElementById('mobile-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    // Mappings for Turkish Translations
    const categoryTranslations = {
        "diatomic nonmetal": "Diatomik Ametal",
        "noble gas": "Soy Gaz",
        "alkali metal": "Alkali Metal",
        "alkaline earth metal": "Toprak Alkali Metal",
        "metalloid": "Yarı Metal",
        "polyatomic nonmetal": "Poliatomik Ametal",
        "post-transition metal": "Geçiş Sonrası Metal",
        "transition metal": "Geçiş Metali",
        "lanthanide": "Lantanit",
        "actinide": "Aktinit",
        "unknown, probably transition metal": "Bilinmeyen",
        "unknown, probably post-transition metal": "Bilinmeyen",
        "unknown, probably metalloid": "Bilinmeyen",
        "unknown, predicted noble gas": "Bilinmeyen"
    };

    const phaseTranslations = {
        "Gas": "Gaz",
        "Solid": "Katı",
        "Liquid": "Sıvı",
        "Unknown": "Bilinmiyor"
    };

    const turkishNames = [
        "Hidrojen", "Helyum", "Lityum", "Berilyum", "Bor", "Karbon", "Azot", "Oksijen", "Flor", "Neon",
        "Sodyum", "Magnezyum", "Alüminyum", "Silisyum", "Fosfor", "Kükürt", "Klor", "Argon", "Potasyum", "Kalsiyum",
        "Skandiyum", "Titanyum", "Vanadyum", "Krom", "Mangan", "Demir", "Kobalt", "Nikel", "Bakır", "Çinko",
        "Galyum", "Germanyum", "Arsenik", "Selenyum", "Brom", "Kripton", "Rubidyum", "Stronsiyum", "İtriyum", "Zirkonyum",
        "Niyobyum", "Molibden", "Teknesyum", "Rutenyum", "Rodyum", "Paladyum", "Gümüş", "Kadmiyum", "İndiyum", "Kalay",
        "Antimon", "Tellür", "İyot", "Ksenon", "Sezyum", "Baryum", "Lantan", "Seryum", "Praseodim", "Neodim",
        "Prometyum", "Samaryum", "Evropiyum", "Gadolinyum", "Terbiyum", "Disprozyum", "Holmiyum", "Erbiyum", "Tulyum", "İterbiyum",
        "Lutesyum", "Hafniyum", "Tantal", "Volfram", "Renyum", "Osmiyum", "İridyum", "Platin", "Altın", "Cıva",
        "Talyum", "Kurşun", "Bizmut", "Polonyum", "Astatin", "Radon", "Fransiyum", "Radyum", "Aktiniyum", "Toryum",
        "Protaktiniyum", "Uranyum", "Neptünyum", "Plütonyum", "Amerisiyum", "Küriyum", "Berkelyum", "Kaliforniyum", "Aynştaynyum", "Fermiyum",
        "Mendelevyum", "Nobelyum", "Lavrensiyum", "Rutherfurdiyum", "Dubniyum", "Seaborgiyum", "Bohriyum", "Hassiyum", "Meitneriyum", "Darmstadtiyum",
        "Röntgenyum", "Kopernikyum", "Nihoniyum", "Flerovyum", "Moskovyum", "Livermoryum", "Tennessin", "Oganesson"
    ];

    // Color definitions for Legend
    const legendColors = {
        "alkali-metal": { name: "Alkali Metal", color: "#ef4444" },
        "alkaline-earth-metal": { name: "Toprak Alkali Metal", color: "#f97316" },
        "transition-metal": { name: "Geçiş Metali", color: "#eab308" },
        "post-transition-metal": { name: "Geçiş Sonrası Metal", color: "#22c55e" },
        "metalloid": { name: "Yarı Metal", color: "#14b8a6" },
        "reactive-nonmetal": { name: "Ametal", color: "#3b82f6" },
        "noble-gas": { name: "Soy Gaz", color: "#8b5cf6" },
        "lanthanide": { name: "Lantanit", color: "#ec4899" },
        "actinide": { name: "Aktinit", color: "#d946ef" },
        "unknown": { name: "Bilinmeyen", color: "#64748b" }
    };

    let elementsData = [];

    // Fetch Element Data
    fetch('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json')
        .then(response => response.json())
        .then(data => {
            elementsData = data.elements;
            renderTable();
            renderLegend();
            loadingOverlay.style.display = 'none';
        })
        .catch(error => {
            console.error('Veri yüklenirken hata oluştu:', error);
            loadingOverlay.innerHTML = '<p>Veriler yüklenemedi. Lütfen internet bağlantınızı kontrol edip sayfayı yenileyin.</p>';
        });

    function getCategoryClass(category) {
        let slug = category.toLowerCase().replace(/,/g, '').replace(/\s+/g, '-');
        // Group similar nonmetals for simpler styling
        if (slug === 'diatomic-nonmetal' || slug === 'polyatomic-nonmetal') {
            return 'reactive-nonmetal';
        }
        if (slug.includes('unknown')) {
            return 'unknown';
        }
        return slug;
    }

    function renderTable() {
        // Add placeholders for La and Ac in the main body
        const laGap = document.createElement('div');
        laGap.className = 'lanthanide-gap';
        laGap.style.gridColumn = 3;
        laGap.style.gridRow = 6;
        laGap.innerHTML = '57-71<br>La-Lu';
        tableContainer.appendChild(laGap);

        const acGap = document.createElement('div');
        acGap.className = 'actinide-gap';
        acGap.style.gridColumn = 3;
        acGap.style.gridRow = 7;
        acGap.innerHTML = '89-103<br>Ac-Lr';
        tableContainer.appendChild(acGap);

        elementsData.forEach(element => {
            const elDiv = document.createElement('div');
            const categoryClass = getCategoryClass(element.category);
            const trName = turkishNames[element.number - 1] || element.name;
            
            elDiv.className = `element ${categoryClass}`;
            
            // Adjust positioning based on xpos and ypos from json
            elDiv.style.gridColumn = element.xpos;
            elDiv.style.gridRow = element.ypos;
            
            elDiv.innerHTML = `
                <span class="number">${element.number}</span>
                <span class="symbol">${element.symbol}</span>
                <span class="name">${trName}</span>
                <span class="mass">${element.atomic_mass.toFixed(2)}</span>
            `;

            // Hover events for Desktop
            elDiv.addEventListener('mouseenter', (e) => {
                if (window.innerWidth <= 1100) return;
                document.querySelectorAll('.element').forEach(el => el.classList.remove('active'));
                elDiv.classList.add('active');
                updateInfoBox(element, trName);
                infoBox.style.display = 'flex';
                positionInfoBox(e);
            });

            elDiv.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 1100) return;
                positionInfoBox(e);
            });

            elDiv.addEventListener('mouseleave', () => {
                if (window.innerWidth <= 1100) return;
                elDiv.classList.remove('active');
                infoBox.style.display = 'none';
            });

            // Click event for Mobile
            elDiv.addEventListener('click', () => {
                openMobileModal(element, trName);
            });

            tableContainer.appendChild(elDiv);
        });
    }

    function translateDiscoverer(text) {
        if (!text) return 'Bilinmiyor';
        let t = text;
        t = t.replace(/Ancient Egypt/gi, "Antik Mısır");
        t = t.replace(/Ancient China/gi, "Antik Çin");
        t = t.replace(/Middle East/gi, "Orta Doğu");
        t = t.replace(/India/gi, "Hindistan");
        t = t.replace(/Prehistoric/gi, "Tarih Öncesi Evreler");
        t = t.replace(/unknown, before/gi, "Bilinmiyor, M.Ö.");
        t = t.replace(/unknown/gi, "Bilinmiyor");
        t = t.replace(/ and /gi, " ve ");
        return t;
    }

    function buildInfoContent(element, trName) {
        const categoryTr = categoryTranslations[element.category] || "Bilinmeyen Kategori";
        const phaseTr = phaseTranslations[element.phase] || "Bilinmiyor";
        const discoveredBy = translateDiscoverer(element.discovered_by);
        
        let melt = element.melt ? element.melt + ' K' : 'Bilinmiyor';
        let boil = element.boil ? element.boil + ' K' : 'Bilinmiyor';

        // Generate an academic Turkish summary
        let trSummary = `<strong>${trName}</strong> (${element.symbol}), atom numarası ${element.number} ve standart atom ağırlığı ${element.atomic_mass} u olan kimyasal bir elementtir. `;
        trSummary += `Periyodik tabloda <strong>${categoryTr}</strong> sınıfında yer alır. `;
        
        if (element.phase !== "Unknown") {
            trSummary += `Oda sıcaklığında genel olarak <strong>${phaseTr.toLowerCase()}</strong> halde bulunur. `;
        }
        
        if (element.discovered_by) {
            trSummary += `Bu elementin keşfi bilim dünyasına <strong>${discoveredBy}</strong> tarafından duyurulmuştur (ya da atfedilmiştir). `;
        }
        
        if (element.electron_configuration) {
            trSummary += `Elektron dizilimi <code>${element.electron_configuration}</code> şeklindedir. `;
        }

        return `
            <div class="info-content">
                <div class="info-header">
                    <div>
                        <div class="info-number">Atom No: ${element.number}</div>
                        <div class="info-name">${trName}</div>
                    </div>
                    <div class="info-symbol">${element.symbol}</div>
                </div>
                <div class="info-details">
                    <div class="detail-item">
                        <span class="detail-label">Kategori</span>
                        <span class="detail-value">${categoryTr}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Atomik Kütle</span>
                        <span class="detail-value">${element.atomic_mass} u</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Faz (Oda Sıc.)</span>
                        <span class="detail-value">${phaseTr}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Keşif</span>
                        <span class="detail-value">${discoveredBy}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Kaynama Noktası</span>
                        <span class="detail-value">${boil}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Erime Noktası</span>
                        <span class="detail-value">${melt}</span>
                    </div>
                </div>
                <div class="info-summary" style="margin-top: 1.5rem; padding-top: 1.5rem; font-size: 0.95rem; line-height: 1.6; border-top: 1px solid var(--border-color);">
                    ${trSummary}
                </div>
            </div>
        `;
    }

    function positionInfoBox(e) {
        if (!infoBox) return;
        let x = e.clientX + 20;
        let y = e.clientY + 20;
        const margin = 20;
        
        // Push left if it overflows right
        if (x + infoBox.offsetWidth > window.innerWidth) {
            x = e.clientX - infoBox.offsetWidth - margin;
        }
        
        // Prevent overflow from left
        if (x < margin) {
            x = margin;
        }

        // Push up if it overflows bottom
        if (y + infoBox.offsetHeight > window.innerHeight) {
            y = e.clientY - infoBox.offsetHeight - margin;
        }
        
        // Prevent overflow from top (the main fix for going off-screen upwards)
        if (y < margin) {
            y = margin;
        }
        
        infoBox.style.left = x + 'px';
        infoBox.style.top = y + 'px';
    }

    function updateInfoBox(element, trName) {
        if (!infoBox) return;
        
        infoBox.innerHTML = buildInfoContent(element, trName);
    }

    function openMobileModal(element, trName) {
        if (window.innerWidth > 1100) return;
        
        modalBody.innerHTML = buildInfoContent(element, trName);
        mobileModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    modalClose.addEventListener('click', () => {
        mobileModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    mobileModal.addEventListener('click', (e) => {
        if (e.target === mobileModal) {
            mobileModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    function renderLegend() {
        Object.keys(legendColors).forEach(key => {
            const item = legendColors[key];
            const div = document.createElement('div');
            div.className = 'legend-item';
            div.innerHTML = `
                <div class="legend-color" style="background-color: ${item.color}"></div>
                <span>${item.name}</span>
            `;
            legendContainer.appendChild(div);
        });
    }
});
