document.addEventListener('DOMContentLoaded', () => {
    // 1. HISTORIAL DE REFERENCIA - ÚLTIMOS 10 SORTEOS
    const ultimos10Sorteos = [
        { fecha: "Viernes, 25 Sep 2026", numeros: [10, 12, 15, 38, 49], estrellas: [10, 12] },
        { fecha: "Martes, 22 Sep 2026", numeros: [3, 11, 24, 35, 42], estrellas: [2, 7] },
        { fecha: "Viernes, 18 Sep 2026", numeros: [6, 14, 25, 30, 44], estrellas: [2, 3] },
        { fecha: "Martes, 15 Sep 2026", numeros: [9, 18, 27, 33, 41], estrellas: [5, 8] },
        { fecha: "Viernes, 12 Sep 2026", numeros: [2, 16, 22, 37, 48], estrellas: [1, 9] },
        { fecha: "Martes, 8 Sep 2026", numeros: [13, 17, 33, 35, 39], estrellas: [7, 12] },
        { fecha: "Viernes, 4 Sep 2026", numeros: [5, 19, 27, 46, 50], estrellas: [4, 12] },
        { fecha: "Martes, 1 Sep 2026", numeros: [10, 23, 37, 47, 49], estrellas: [3, 5] },
        { fecha: "Viernes, 28 Ago 2026", numeros: [4, 14, 28, 42, 45], estrellas: [6, 9] },
        { fecha: "Martes, 25 Ago 2026", numeros: [8, 12, 30, 47, 48], estrellas: [4, 11] }
    ];

    function renderLast10Table() {
        const tableBody = document.getElementById('last10TableBody');
        tableBody.innerHTML = '';
        ultimos10Sorteos.forEach(sorteo => {
            let tr = document.createElement('tr');
            let numsHtml = '<div class="mini-balls-row">';
            sorteo.numeros.forEach(n => numsHtml += `<span class="ball-sm">${n}</span>`);
            sorteo.estrellas.forEach(s => numsHtml += `<span class="star-sm">${s}</span>`);
            numsHtml += '</div>';

            tr.innerHTML = `<td><b>${sorteo.fecha}</b></td><td>${numsHtml}</td>`;
            tableBody.appendChild(tr);
        });
    }
    renderLast10Table();

    // PESTAÑAS GENERADOR
    const tabAuto = document.getElementById('tabAuto');
    const tabManual = document.getElementById('tabManual');
    const panelAuto = document.getElementById('panelAuto');
    const panelManual = document.getElementById('panelManual');

    tabAuto.addEventListener('click', () => {
        tabAuto.classList.add('active');
        tabManual.classList.remove('active');
        panelAuto.style.display = 'block';
        panelManual.style.display = 'none';
    });

    tabManual.addEventListener('click', () => {
        tabManual.classList.add('active');
        tabAuto.classList.remove('active');
        panelManual.style.display = 'block';
        panelAuto.style.display = 'none';
    });

    // GENERADOR AUTOMÁTICO / MANUAL
    const btnGenerate = document.getElementById('btnGenerate');
    const btnApplyManual = document.getElementById('btnApplyManual');
    const generatedNumbersContainer = document.getElementById('generatedNumbers');
    const generatedStarsContainer = document.getElementById('generatedStars');
    const generatedAnalysisBox = document.getElementById('generatedAnalysisBox');
    const btnSaveTicket = document.getElementById('btnSaveTicket');

    let currentTicket = { numbers: [], stars: [] };

    function processTicket(numbers, stars) {
        numbers.sort((a, b) => a - b);
        stars.sort((a, b) => a - b);
        currentTicket = { numbers, stars };
        renderCurrentTicket();
        analyzeTicket();
    }

    btnGenerate.addEventListener('click', () => {
        let numbers = [];
        while(numbers.length < 5) {
            let r = Math.floor(Math.random() * 50) + 1;
            if(!numbers.includes(r)) numbers.push(r);
        }
        let stars = [];
        while(stars.length < 2) {
            let r = Math.floor(Math.random() * 12) + 1;
            if(!stars.includes(r)) stars.push(r);
        }
        processTicket(numbers, stars);
    });

    btnApplyManual.addEventListener('click', () => {
        const cNums = document.querySelectorAll('.custom-num');
        const cStars = document.querySelectorAll('.custom-star');

        let numbers = Array.from(cNums).map(i => parseInt(i.value)).filter(n => !isNaN(n));
        let stars = Array.from(cStars).map(i => parseInt(i.value)).filter(s => !isNaN(s));

        if(numbers.length !== 5 || stars.length !== 2) {
            alert('Introduce 5 números (1-50) y 2 estrellas (1-12).');
            return;
        }

        if(numbers.some(n => n < 1 || n > 50) || stars.some(s => s < 1 || s > 12)) {
            alert('Rango incorrecto: Números 1-50, Estrellas 1-12.');
            return;
        }

        processTicket(numbers, stars);
    });

    function renderCurrentTicket() {
        generatedNumbersContainer.innerHTML = '';
        generatedStarsContainer.innerHTML = '';

        currentTicket.numbers.forEach(n => {
            const span = document.createElement('span');
            span.className = 'ball';
            span.textContent = n;
            generatedNumbersContainer.appendChild(span);
        });

        currentTicket.stars.forEach(s => {
            const span = document.createElement('span');
            span.className = 'star';
            span.textContent = s;
            generatedStarsContainer.appendChild(span);
        });
    }

    function analyzeTicket() {
        let allRecentNumbers = ultimos10Sorteos.flatMap(s => s.numeros);
        let allRecentStars = ultimos10Sorteos.flatMap(s => s.estrellas);

        let matchedNums = currentTicket.numbers.filter(n => allRecentNumbers.includes(n));
        let matchedStars = currentTicket.stars.filter(s => allRecentStars.includes(s));

        generatedAnalysisBox.style.display = 'block';
        generatedAnalysisBox.innerHTML = `
            <strong>🪄 Veredicto de los Duendes frente a los últimos 10 sorteos:</strong><br>
            • <b>Coincidencias recientes:</b> ${matchedNums.length > 0 ? matchedNums.join(', ') + ` (${matchedNums.length} nºs en el histórico)` : 'Ninguno (¡fresca de duende!)'}<br>
            • <b>Estrellas repetidas:</b> ${matchedStars.length > 0 ? matchedStars.join(', ') : 'Ninguna'}<br>
            • 🧚 <i>¡Combinación lista para jugarse!</i>
        `;
    }

    // 2. APUESTAS GUARDADAS Y SINCRONIZACIÓN CON EL REGISTRO
    let savedTickets = JSON.parse(localStorage.getItem('euromillones_saved')) || [];
    const savedTicketsList = document.getElementById('savedTicketsList');
    const playBetSelect = document.getElementById('playBetSelect');
    const customBetNameContainer = document.getElementById('customBetNameContainer');

    btnSaveTicket.addEventListener('click', () => {
        if(currentTicket.numbers.length === 0) {
            alert('Primero genera o introduce una combinación.');
            return;
        }
        savedTickets.push(currentTicket);
        localStorage.setItem('euromillones_saved', JSON.stringify(savedTickets));
        renderSavedTickets();
        updateBetSelectOptions();
        alert('¡Combinación guardada con éxito!');
    });

    function renderSavedTickets() {
        if(savedTickets.length === 0) {
            savedTicketsList.innerHTML = `<p class="empty-msg">No hay tesoros guardados todavía.</p>`;
            return;
        }

        savedTicketsList.innerHTML = '';
        savedTickets.forEach((ticket, index) => {
            const item = document.createElement('div');
            item.className = 'saved-item';
            
            let numsHtml = '<div class="saved-numbers">';
            ticket.numbers.forEach(n => numsHtml += `<span class="ball-sm">${n}</span>`);
            ticket.stars.forEach(s => numsHtml += `<span class="star-sm">${s}</span>`);
            numsHtml += '</div>';

            item.innerHTML = `
                <span><b>#${index + 1}</b></span>
                ${numsHtml}
                <button class="btn secondary" onclick="deleteTicket(${index})" style="padding: 4px 8px; font-size: 0.7rem; min-height:30px;"><i class="fa-solid fa-trash"></i></button>
            `;
            savedTicketsList.appendChild(item);
        });
    }

    window.deleteTicket = function(index) {
        savedTickets.splice(index, 1);
        localStorage.setItem('euromillones_saved', JSON.stringify(savedTickets));
        renderSavedTickets();
        updateBetSelectOptions();
    }

    function updateBetSelectOptions() {
        playBetSelect.innerHTML = '';
        
        const fixedOpt = document.createElement('option');
        fixedOpt.value = "Apuesta Fija Semanal (6, 9, 23, 25, 50 | ⭐ 3, 9)";
        fixedOpt.textContent = "⭐ Apuesta Fija (6, 9, 23, 25, 50 | ⭐ 3, 9)";
        playBetSelect.appendChild(fixedOpt);

        savedTickets.forEach((t, i) => {
            const opt = document.createElement('option');
            let txt = `Guardada #${i+1}: ${t.numbers.join(', ')} | ⭐ ${t.stars.join(', ')}`;
            opt.value = txt;
            opt.textContent = txt;
            playBetSelect.appendChild(opt);
        });

        const customOpt = document.createElement('option');
        customOpt.value = "CUSTOM";
        customOpt.textContent = "✏️ Otra combinación / Peña / Múltiple...";
        playBetSelect.appendChild(customOpt);
    }

    playBetSelect.addEventListener('change', () => {
        if(playBetSelect.value === 'CUSTOM') {
            customBetNameContainer.style.display = 'block';
        } else {
            customBetNameContainer.style.display = 'none';
        }
    });

    updateBetSelectOptions();

    // Exportar e Importar JSON
    document.getElementById('btnExportJson').addEventListener('click', () => {
        if(savedTickets.length === 0) {
            alert('No hay apuestas que descargar.');
            return;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedTickets, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "mis_apuestas_tocaracom.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    document.getElementById('importJsonFile').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    savedTickets = importedData;
                    localStorage.setItem('euromillones_saved', JSON.stringify(savedTickets));
                    renderSavedTickets();
                    updateBetSelectOptions();
                    alert('¡Apuestas cargadas desde el JSON!');
                } else {
                    alert('El JSON no tiene formato válido.');
                }
            } catch (err) {
                alert('Error al leer el JSON.');
            }
        };
        reader.readAsText(file);
    });

    renderSavedTickets();

    // 3. ANÁLISIS APUESTA FIJA
    const btnAnalyzeFixed = document.getElementById('btnAnalyzeFixed');
    const fixedAnalysisResult = document.getElementById('fixedAnalysisResult');

    function analyzeFixedBet() {
        const numInputs = document.querySelectorAll('.f-num');
        const starInputs = document.querySelectorAll('.f-star');
        
        let numbers = Array.from(numInputs).map(input => parseInt(input.value)).filter(n => !isNaN(n));
        let stars = Array.from(starInputs).map(input => parseInt(input.value)).filter(s => !isNaN(s));

        if (numbers.length !== 5 || stars.length !== 2) {
            fixedAnalysisResult.innerHTML = `<span style="color: #ef4444;">Introduce tu amuleto completo.</span>`;
            return;
        }

        let allRecentNumbers = ultimos10Sorteos.flatMap(s => s.numeros);
        let matchDetails = numbers.map(n => {
            let count = allRecentNumbers.filter(num => num === n).length;
            return `Nº <b>${n}</b>: ${count}v`;
        });

        fixedAnalysisResult.innerHTML = `
            <strong>🔮 Análisis de tu Amuleto Fijo:</strong><br>
            • ${matchDetails.join(' | ')}<br>
            • <i>Mantén la constancia semanal con tus números de cabecera.</i>
        `;
    }

    btnAnalyzeFixed.addEventListener('click', analyzeFixedBet);
    analyzeFixedBet();

    // 4. REGISTRO Y CONTABILIDAD DE JUGADAS (APP STYLE)
    let playRecords = JSON.parse(localStorage.getItem('euromillones_finance')) || [];
    const btnAddPlayRecord = document.getElementById('btnAddPlayRecord');
    const playDateInput = document.getElementById('playDate');
    const playSpentInput = document.getElementById('playSpent');
    const playWonInput = document.getElementById('playWon');
    const playBetCustomInput = document.getElementById('playBetCustom');
    const financeRecordsList = document.getElementById('financeRecordsList');
    const customCostWrap = document.getElementById('customCostWrap');
    
    const totalSpentEl = document.getElementById('totalSpent');
    const totalWonEl = document.getElementById('totalWon');
    const totalNetEl = document.getElementById('totalNet');

    playDateInput.valueAsDate = new Date();

    const costBtns = document.querySelectorAll('.cost-btn');
    costBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            costBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const costVal = btn.getAttribute('data-cost');
            if(costVal === 'custom') {
                customCostWrap.style.display = 'block';
            } else {
                customCostWrap.style.display = 'none';
                playSpentInput.value = parseFloat(costVal).toFixed(2);
            }
        });
    });

    btnAddPlayRecord.addEventListener('click', () => {
        const date = playDateInput.value;
        const spent = parseFloat(playSpentInput.value);
        const won = parseFloat(playWonInput.value) || 0;

        let betName = playBetSelect.value;
        if(betName === 'CUSTOM') {
            betName = playBetCustomInput.value.trim() || 'Apuesta Personalizada / Peña';
        }

        if(!date || isNaN(spent) || spent <= 0) {
            alert('Indica una fecha y un coste invertido válido.');
            return;
        }

        playRecords.push({ date, betName, spent, won, net: won - spent });
        localStorage.setItem('euromillones_finance', JSON.stringify(playRecords));
        renderFinanceRecords();

        playWonInput.value = '0.00';
        playBetCustomInput.value = '';
    });

    function renderFinanceRecords() {
        if(playRecords.length === 0) {
            financeRecordsList.innerHTML = `<p class="empty-msg">No has registrado jugadas todavía. ¡Apunta tu primera apuesta!</p>`;
            totalSpentEl.textContent = "0.00 €";
            totalWonEl.textContent = "0.00 €";
            totalNetEl.textContent = "0.00 €";
            return;
        }

        financeRecordsList.innerHTML = '';
        let tSpent = 0, tWon = 0, tNet = 0;

        playRecords.slice().reverse().forEach((rec, revIndex) => {
            const realIndex = playRecords.length - 1 - revIndex;
            tSpent += rec.spent;
            tWon += rec.won;
            tNet += rec.net;

            const card = document.createElement('div');
            card.className = 'record-card-item';

            const isWinner = rec.net >= 0;
            const badgeClass = isWinner ? 'badge-green' : 'badge-red';

            card.innerHTML = `
                <div class="record-top-row">
                    <span class="record-date"><i class="fa-solid fa-calendar-day"></i> ${rec.date}</span>
                    <button class="btn secondary" onclick="deleteFinanceRecord(${realIndex})" style="padding: 2px 8px; font-size: 0.7rem; min-height: 28px;"><i class="fa-solid fa-trash"></i></button>
                </div>
                <div class="record-bet-title">${rec.betName}</div>
                <div class="record-stats-row">
                    <span>Invertido: <b>${rec.spent.toFixed(2)} €</b></span>
                    <span>Premio: <b style="color: var(--accent);">${rec.won.toFixed(2)} €</b></span>
                    <span class="record-badge ${badgeClass}">${rec.net >= 0 ? '+' : ''}${rec.net.toFixed(2)} €</span>
                </div>
            `;
            financeRecordsList.appendChild(card);
        });

        totalSpentEl.textContent = tSpent.toFixed(2) + " €";
        totalWonEl.textContent = tWon.toFixed(2) + " €";
        totalNetEl.textContent = tNet.toFixed(2) + " €";
        totalNetEl.className = `stat-highlight ${tNet >= 0 ? 'won-color' : 'spent-color'}`;
    }

    window.deleteFinanceRecord = function(index) {
        playRecords.splice(index, 1);
        localStorage.setItem('euromillones_finance', JSON.stringify(playRecords));
        renderFinanceRecords();
    }

    renderFinanceRecords();
});