/**
 * Portal Pracownika Corab - Main JavaScript
 *
 * Obsługuje przekierowania dla dwóch typów logowania:
 * 1. Pracownicy z kontem Microsoft (@corab.pl)
 * 2. Pracownicy bez konta Microsoft
 */

// ==========================================
// KONFIGURACJA URL - EDYTUJ TUTAJ
// ==========================================

// URL dla pracowników z kontem Microsoft
const URL_MICROSOFT = 'https://corab-3mqbkjzg.launchpad.cfapps.eu10.hana.ondemand.com/site?siteId=8b2d7e40-3df6-42a5-900e-48ea12ae145c#Shell-home';

// TODO: Uzupełnić URL dla pracowników bez konta Microsoft
// Po otrzymaniu URL od administratora, zmień poniższy wiersz:
const URL_NON_MICROSOFT = ''; // ← WPISZ TUTAJ URL

// ==========================================
// MAIN LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Pobierz elementy przycisków
    const btnMicrosoft = document.getElementById('btn-microsoft');
    const btnNonMicrosoft = document.getElementById('btn-non-microsoft');

    // Obsługa przycisku Microsoft
    if (btnMicrosoft) {
        btnMicrosoft.addEventListener('click', function(event) {
            event.preventDefault();

            if (URL_MICROSOFT) {
                window.location.href = URL_MICROSOFT;
            } else {
                alert('Błąd konfiguracji. Skontaktuj się z administratorem IT.');
            }
        });
    }

    // Obsługa przycisku Non-Microsoft
    if (btnNonMicrosoft) {
        btnNonMicrosoft.addEventListener('click', function(event) {
            event.preventDefault();

            if (URL_NON_MICROSOFT) {
                window.location.href = URL_NON_MICROSOFT;
            } else {
                alert('URL dla pracowników bez konta Microsoft nie został jeszcze skonfigurowany.\n\nSkontaktuj się z działem IT, aby uzyskać link dostępu.');
            }
        });
    }

    // Keyboard navigation support (Enter key)
    document.querySelectorAll('.btn').forEach(function(button) {
        button.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                button.click();
            }
        });
    });

    // ==========================================
    // THEME TOGGLE (silver / abyss)
    // ==========================================
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    const LIGHT_THEME = 'silver';
    const DARK_THEME = 'abyss';

    // Odczytaj zapisany stan
    let toggleState = localStorage.getItem('toggleState') || 'light';
    const currentTheme = toggleState === 'light' ? LIGHT_THEME : DARK_THEME;
    root.setAttribute('data-theme', currentTheme);

    // Ustaw widoczność ikon
    function updateToggleIcon() {
        if (toggleState === 'light') {
            root.style.setProperty('--light-icon-display', 'inline');
            root.style.setProperty('--dark-icon-display', 'none');
        } else {
            root.style.setProperty('--light-icon-display', 'none');
            root.style.setProperty('--dark-icon-display', 'inline');
        }
    }

    updateToggleIcon();

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            toggleState = toggleState === 'light' ? 'dark' : 'light';
            localStorage.setItem('toggleState', toggleState);

            const newTheme = toggleState === 'light' ? LIGHT_THEME : DARK_THEME;
            root.setAttribute('data-theme', newTheme);

            updateToggleIcon();
        });
    }
});

/*
INSTRUKCJA AKTUALIZACJI URL:

1. Aby zmienić URL dla pracowników bez konta Microsoft:
   - Otwórz ten plik: js/main.js
   - Znajdź linię: const URL_NON_MICROSOFT = '';
   - Wpisz URL w cudzysłowie: const URL_NON_MICROSOFT = 'https://twoj-url.com';
   - Zapisz plik

2. Jeśli używasz GitHub:
   git add js/main.js
   git commit -m "Update: Dodano URL dla pracowników bez MS"
   git push origin main
*/
