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
    // THEME SYSTEM (picker testowy + toggle produkcyjny)
    // ==========================================
    const root = document.documentElement;

    // Zapisane motywy dla light/dark mode
    let lightTheme = localStorage.getItem('lightTheme') || 'light';
    let darkTheme = localStorage.getItem('darkTheme') || 'dark';

    // Obecny wybrany motyw (dla pickera)
    let currentSelectedTheme = localStorage.getItem('theme') || lightTheme;

    // ==========================================
    // THEME PICKER (wersja testowa - do usunięcia)
    // ==========================================
    const themeButtons = document.querySelectorAll('.theme-btn');
    const modeButtons = document.querySelectorAll('.mode-btn');

    // Ustaw zapisany motyw
    if (currentSelectedTheme) {
        if (currentSelectedTheme === 'light') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', currentSelectedTheme);
        }
        // Zaznacz odpowiedni przycisk
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === currentSelectedTheme);
        });
    }

    // Obsługa kliknięć w przyciski motywów (preview)
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.dataset.theme;
            currentSelectedTheme = theme;

            // Ustaw motyw
            if (theme === 'light') {
                root.removeAttribute('data-theme');
            } else {
                root.setAttribute('data-theme', theme);
            }

            // Zapisz jako aktualny
            localStorage.setItem('theme', theme);

            // Zaktualizuj aktywny przycisk
            themeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            console.log('Preview motywu:', theme);
        });
    });

    // Obsługa przycisków sun/moon (ustawianie domyślnych)
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            const activeTheme = currentSelectedTheme;

            if (action === 'set-light-theme') {
                lightTheme = activeTheme;
                localStorage.setItem('lightTheme', activeTheme);
                alert(`Motyw "${activeTheme}" ustawiony jako JASNY (☀️)\n\nBędzie używany po kliknięciu przycisku słońca.`);
                console.log('Light theme ustawiony na:', activeTheme);
            } else if (action === 'set-dark-theme') {
                darkTheme = activeTheme;
                localStorage.setItem('darkTheme', activeTheme);
                alert(`Motyw "${activeTheme}" ustawiony jako CIEMNY (🌙)\n\nBędzie używany po kliknięciu przycisku księżyca.`);
                console.log('Dark theme ustawiony na:', activeTheme);
            }
        });
    });

    // ==========================================
    // THEME TOGGLE (produkcja - po usunięciu pickera)
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Przełącz między light i dark theme
            const currentTheme = root.getAttribute('data-theme') || 'light';
            const isDark = [darkTheme, 'dark', 'navy-dark'].includes(currentTheme);

            const newTheme = isDark ? lightTheme : darkTheme;

            // Ustaw nowy motyw
            if (newTheme === 'light') {
                root.removeAttribute('data-theme');
            } else {
                root.setAttribute('data-theme', newTheme);
            }

            // Zapisz
            localStorage.setItem('theme', newTheme);
            currentSelectedTheme = newTheme;

            console.log('Motyw przełączony na:', newTheme);
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
