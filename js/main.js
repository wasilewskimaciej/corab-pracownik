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

            // Sprawdź czy URL jest zdefiniowany
            if (URL_MICROSOFT) {
                console.log('Przekierowanie do portalu Microsoft: ' + URL_MICROSOFT);
                window.location.href = URL_MICROSOFT;
            } else {
                console.error('URL_MICROSOFT nie jest zdefiniowany!');
                alert('Błąd konfiguracji. Skontaktuj się z administratorem IT.');
            }
        });
    }

    // Obsługa przycisku Non-Microsoft
    if (btnNonMicrosoft) {
        btnNonMicrosoft.addEventListener('click', function(event) {
            event.preventDefault();

            // Sprawdź czy URL jest zdefiniowany
            if (URL_NON_MICROSOFT) {
                console.log('Przekierowanie do portalu (bez MS): ' + URL_NON_MICROSOFT);
                window.location.href = URL_NON_MICROSOFT;
            } else {
                // URL jeszcze nie skonfigurowany - pokaż komunikat
                alert('URL dla pracowników bez konta Microsoft nie został jeszcze skonfigurowany.\n\nSkontaktuj się z działem IT, aby uzyskać link dostępu.');
                console.warn('URL_NON_MICROSOFT nie jest zdefiniowany. Edytuj plik js/main.js aby dodać URL.');
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
    // THEME TOGGLE
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Sprawdź zapisany motyw w localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = root.getAttribute('data-theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            let newTheme;
            if (currentTheme === 'dark') {
                newTheme = 'light';
            } else if (currentTheme === 'light') {
                newTheme = 'dark';
            } else {
                // Brak ustawienia - przełącz na przeciwny do systemowego
                newTheme = prefersDark ? 'light' : 'dark';
            }

            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            console.log('Motyw zmieniony na:', newTheme);
        });
    }

    // Log inicjalizacji (można usunąć w produkcji)
    console.log('Portal Pracownika Corab - JavaScript załadowany');
    console.log('URL Microsoft:', URL_MICROSOFT ? 'Skonfigurowany ✓' : 'Brak ✗');
    console.log('URL Non-Microsoft:', URL_NON_MICROSOFT ? 'Skonfigurowany ✓' : 'Brak ✗');
});

// ==========================================
// INSTRUKCJE DLA ADMINISTRATORA
// ==========================================

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

   Strona automatycznie zaktualizuje się w ciągu 1-2 minut.

3. Jeśli używasz Azure Portal/CLI:
   - Zapisz plik
   - Zip folder c:\pracownikcorab
   - Upload przez Azure Portal lub użyj: az staticwebapp upload

4. Testowanie:
   - Otwórz stronę w przeglądarce
   - Otwórz Developer Tools (F12) → Console
   - Kliknij przycisk - sprawdź czy przekierowanie działa
*/
