// Main JavaScript untuk halaman utama
import { ligaData } from '../data/data.js';

document.addEventListener("DOMContentLoaded", function () {
  try {
    // Cek apakah data tersedia
    if (typeof ligaData === "undefined") {
      throw new Error("Data liga tidak tersedia");
    }

    // Render semua komponen
    renderNextMatches();
    renderStandings();
    renderTopScorers();
    renderRedCards();
    renderYellowCards();
    renderTeamLinks();
    initializeTabs();
  } catch (error) {
    console.error("Error loading data:", error);
    showErrorMessage("Gagal memuat data liga. Silakan refresh halaman.");
  }
});

// Render pertandingan mendatang
function renderNextMatches() {
  const container = document.getElementById("next-matches");

  if (!ligaData.nextMatch || ligaData.nextMatch.length === 0) {
    container.innerHTML =
      '<div class="error-message">Tidak ada pertandingan mendatang saat ini.</div>';
    return;
  }

  const html = ligaData.nextMatch
    .map(
      (match) => `
        <div class="next-match-card">
            <h4>${match.teams}</h4>
            <p><strong>Tanggal:</strong> ${formatDate(match.date)}</p>
            <p><strong>Waktu:</strong> ${match.time}</p>
            <p><strong>Venue:</strong> ${match.venue}</p>
        </div>
    `
    )
    .join("");

  container.innerHTML = html;
}



function renderStandings() {
  const tbody = document.querySelector("#standings-table tbody");

  if (!ligaData.standings || ligaData.standings.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="10" class="error-message">Data klasemen tidak tersedia.</td></tr>';
    return;
  }

  // Urutkan berdasarkan poin, selisih gol, gol masuk
  const sortedStandings = [...ligaData.standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const goalDiffA = a.gf - a.ga;
    const goalDiffB = b.gf - b.ga;
    if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
    return b.gf - a.gf;
  });

  const html = sortedStandings
    .map((team, index) => {
      const position = index + 1;
      const positionClass =
        position <= 4 ? `position-${position}` : "position-regular";

      const teamProfile = getTeamProfile(team.team);
      // Use team-specific logo or default logo
      const logoSrc = teamProfile && teamProfile.profile.logo 
        ? teamProfile.profile.logo 
        : `images/logos/default-logo.png`;

      const teamLink = teamProfile
        ? `team-profiles/team-profile-${slugify(team.team)}.html`
        : "#";

      return `
              <tr>
                  <td>
                      <div class="position-circle ${positionClass}">${position}</div>
                  </td>
                  <td class="team-cell">
                      <img src="${logoSrc}" 
                           alt="Logo ${team.team}" 
                           class="team-logo">
                      <a href="${teamLink}" class="team-name">${team.team}</a>
                  </td>
                  <td>${team.played}</td>
                  <td>${team.won}</td>
                  <td>${team.drawn}</td>
                  <td>${team.lost}</td>
                  <td>${team.gf}</td>
                  <td>${team.ga}</td>
                  <td class="${
                    team.gf - team.ga >= 0 ? "positive-gd" : "negative-gd"
                  }">${team.gf - team.ga >= 0 ? "+" : ""}${
        team.gf - team.ga
      }</td>
                  <td><strong>${team.points}</strong></td>
              </tr>
          `;
    })
    .join("");

  tbody.innerHTML = html;

  // Update bracket dengan top 4 tim
  renderBracket();
}

// Render top skor
function renderTopScorers() {
  const tbody = document.getElementById("top-scorers-list");

  if (!ligaData.topScorers || ligaData.topScorers.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="error-message">Data top skor tidak tersedia.</td></tr>';
    return;
  }

  const sortedScorers = [...ligaData.topScorers].sort(
    (a, b) => b.goals - a.goals
  );

  const html = sortedScorers
    .map(
      (scorer) => `
        <tr>
            <td><strong>${scorer.player}</strong></td>
            <td>${scorer.team}</td>
            <td><strong>${scorer.goals}</strong></td>
        </tr>
    `
    )
    .join("");

  tbody.innerHTML = html;
}

// Render kartu merah
function renderRedCards() {
  const tbody = document.getElementById("red-cards-list");

  if (!ligaData.redCards || ligaData.redCards.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="loading-message">Tidak ada kartu merah tercatat.</td></tr>';
    return;
  }

  const sortedCards = [...ligaData.redCards].sort((a, b) => b.count - a.count);

  const html = sortedCards
    .map(
      (card) => `
        <tr>
            <td><strong>${card.player}</strong></td>
            <td>${card.team}</td>
            <td><span style="color: #f44336;"><strong>${card.count}</strong></span></td>
        </tr>
    `
    )
    .join("");

  tbody.innerHTML = html;
}

// Render kartu kuning
function renderYellowCards() {
  const tbody = document.getElementById("yellow-cards-list");

  if (!ligaData.yellowCards || ligaData.yellowCards.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="loading-message">Tidak ada kartu kuning tercatat.</td></tr>';
    return;
  }

  const sortedCards = [...ligaData.yellowCards].sort(
    (a, b) => b.count - a.count
  );

  const html = sortedCards
    .map(
      (card) => `
        <tr>
            <td><strong>${card.player}</strong></td>
            <td>${card.team}</td>
            <td><span style="color: #ff9800;"><strong>${card.count}</strong></span></td>
        </tr>
    `
    )
    .join("");

  tbody.innerHTML = html;
}

// Render link tim
function renderTeamLinks() {
  const container = document.getElementById("team-links");

  if (!ligaData.teams || ligaData.teams.length === 0) {
    container.innerHTML =
      '<div class="error-message">Data tim tidak tersedia.</div>';
    return;
  }

  const html = `<div class="team-links-grid">` +
    ligaData.teams
      .map(
        (team) => `
          <a href="team-profiles/team-profile-${slugify(
            team.name
          )}.html" class="team-link-item">
              <img src="${team.profile.logo || 'images/logos/default-logo.png'}" alt="Logo ${team.name}" class="team-link-logo">
              <span>${team.name}</span>
          </a>
      `
      )
      .join("") +
    `</div>`;

  container.innerHTML = html;
}

// Initialize tabs functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      this.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
    });
  });
}

// Render bracket playoff
function renderBracket() {
  if (!ligaData.standings || ligaData.standings.length < 4) {
    return;
  }

  // Urutkan berdasarkan poin untuk mendapatkan top 4
  const sortedStandings = [...ligaData.standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const goalDiffA = a.gf - a.ga;
    const goalDiffB = b.gf - b.ga;
    if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
    return b.gf - a.gf;
  });

  // Update bracket dengan nama tim top 4
  const team1Element = document.getElementById("team-1");
  const team2Element = document.getElementById("team-2");
  const team3Element = document.getElementById("team-3");
  const team4Element = document.getElementById("team-4");

  if (team1Element) team1Element.textContent = `1. ${sortedStandings[0].team}`;
  if (team2Element) team2Element.textContent = `2. ${sortedStandings[1].team}`;
  if (team3Element) team3Element.textContent = `3. ${sortedStandings[2].team}`;
  if (team4Element) team4Element.textContent = `4. ${sortedStandings[3].team}`;
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("id-ID", options);
}

function getTeamProfile(teamName) {
  if (!ligaData.teams) return null;
  return ligaData.teams.find((team) => team.name === teamName);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Hapus karakter khusus
    .replace(/[\s_-]+/g, "-") // Ganti spasi dan underscore dengan dash
    .replace(/^-+|-+$/g, ""); // Hapus dash di awal dan akhir
}

function showErrorMessage(message) {
  const errorHtml = `<div class="error-message">${message}</div>`;

  // Tampilkan error di semua container utama
  const containers = [
    "next-matches",
    "standings-table tbody",
    "top-scorers-list",
    "red-cards-list",
    "yellow-cards-list",
    "team-links",
  ];

  containers.forEach((selector) => {
    const element =
      document.querySelector(`#${selector}`) ||
      document.querySelector(selector);
    if (element) {
      if (element.tagName === "TBODY") {
        element.innerHTML = `<tr><td colspan="10">${errorHtml}</td></tr>`;
      } else {
        element.innerHTML = errorHtml;
      }
    }
  });
}
