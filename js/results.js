// JavaScript untuk halaman hasil pertandingan
import { ligaData } from "../data/data.js";

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Cek apakah data tersedia
        if (typeof ligaData === 'undefined') {
            throw new Error('Data liga tidak tersedia');
        }

        renderResults();

    } catch (error) {
        console.error('Error loading results data:', error);
        showErrorMessage('Gagal memuat hasil pertandingan. Silakan refresh halaman.');
    }
});

function renderResults() {
    const tbody = document.querySelector('#results-table tbody');
    
    if (!ligaData.recentResults || ligaData.recentResults.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="error-message">Data hasil pertandingan tidak tersedia.</td></tr>';
        return;
    }

    // Urutkan berdasarkan tanggal (terbaru dulu)
    const sortedResults = [...ligaData.recentResults].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    const html = sortedResults.map((result, index) => {
        const dateDisplay = formatDate(result.date);
        const isRecent = index < 3; // 3 hasil terbaru
        
        return `
            <tr class="${isRecent ? 'recent-match' : 'older-match'}">
                <td><strong>${dateDisplay}</strong></td>
                <td class="match-teams">${result.teams}</td>
                <td class="match-score">${result.score}</td>
                <td class="match-time">${result.time || '-'}</td>
                <td class="match-venue">${result.venue}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

function showErrorMessage(message) {
    const tbody = document.querySelector('#results-table tbody');
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="4" class="error-message">${message}</td></tr>`;
    }
}

// Tambahkan style khusus untuk halaman hasil
const additionalStyles = `
<style>
.match-teams {
    font-weight: 500;
    color: #1E90FF;
}

.match-score {
    font-weight: bold;
    color: #4CAF50;
    text-align: center;
    font-size: 1rem;
}

.match-venue {
    color: #666;
    font-size: 0.9rem;
}

.recent-match {
    background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
    border-left: 4px solid #1E90FF;
}

.recent-match .match-score {
    color: #1E90FF;
    background: rgba(30, 144, 255, 0.1);
    padding: 0.5rem;
    border-radius: 5px;
}

.older-match {
    background-color: #fafafa;
}

.recent-match td {
    padding: 1.2rem 0.5rem;
}

/* Highlight untuk hasil terbaru */
.recent-match:first-child {
    box-shadow: 0 2px 10px rgba(30, 144, 255, 0.2);
}

@media (max-width: 768px) {
    .match-teams {
        font-size: 0.85rem;
        line-height: 1.3;
    }
    
    .match-venue {
        font-size: 0.8rem;
    }
    
    .match-score {
        font-size: 0.9rem;
    }
}

/* Animasi untuk hasil terbaru */
@keyframes highlightNew {
    0% { background-color: #fff3e0; }
    50% { background-color: #e8f0ff; }
    100% { background-color: #f8f9ff; }
}

.recent-match {
    animation: highlightNew 2s ease-in-out;
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);