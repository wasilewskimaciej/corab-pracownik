# Portal Pracownika Corab

Prosty landing page dla pracowników firmy Corab z dwoma opcjami logowania.

## 📋 Opis projektu

Strona umożliwia pracownikom wybór odpowiedniej metody logowania do systemu SAP Launchpad:
- **Pracownicy z kontem Microsoft** (@corab.com.pl) - logowanie domenowe
- **Pracownicy bez konta Microsoft** - alternatywna metoda logowania

## 🌐 Docelowy URL

Strona będzie dostępna pod adresem: **https://pracownik.corab.pl**

## 📁 Struktura projektu

```
c:\pracownikcorab/
├── index.html              # Główna strona HTML
├── css/
│   └── styles.css         # Style (responsive design)
├── js/
│   └── main.js            # Logika JavaScript (przekierowania)
├── README.md              # Ten plik
└── .gitignore             # Ignorowane pliki dla Git
```

## 🚀 QUICK START - Wdrożenie na Azure Static Web Apps

### Opcja A: Przez GitHub (REKOMENDOWANE)

#### Krok 1: Przyjęcie transfer ownership repo (jeśli developer już je utworzył)

1. Sprawdź email - powinieneś otrzymać zaproszenie do przejęcia repozytorium GitHub
2. Kliknij link w emailu → **Accept transfer**
3. Repozytorium jest teraz w Twojej organizacji lub na Twoim koncie

#### Krok 2: Utworzenie Azure Static Web App

1. **Login do Azure Portal**
   - Przejdź do: https://portal.azure.com
   - Zaloguj się kontem administratora (@corab.com.pl)

2. **Create a resource**
   - Kliknij "+ Create a resource"
   - Wyszukaj: "Static Web App"
   - Kliknij "Create"

3. **Podstawowa konfiguracja:**
   ```
   Basics:
   ├─ Subscription: [Twoja firmowa subscription]
   ├─ Resource Group: "rg-corab-portal" (utwórz nową lub wybierz istniejącą)
   ├─ Name: "corab-employee-portal"
   ├─ Plan type: Free
   ├─ Region: West Europe (najbliżej Polski)
   └─ Source: GitHub
   ```

4. **GitHub configuration:**
   ```
   ├─ Sign in with GitHub (autoryzuj Azure)
   ├─ Organization: [Twoja organizacja lub konto]
   ├─ Repository: employee-portal
   ├─ Branch: main
   ```

5. **Build Details:**
   ```
   ├─ Build Presets: Custom
   ├─ App location: / (root)
   ├─ Api location: (zostaw puste)
   └─ Output location: (zostaw puste)
   ```

6. **Review + Create** → Kliknij "Create"

Azure automatycznie:
- ✅ Utworzy GitHub Action workflow
- ✅ Wdroży stronę
- ✅ Nada URL typu: `https://nice-rock-12345.azurestaticapps.net`

#### Krok 3: Konfiguracja custom domain `pracownik.corab.pl`

1. **W Azure Portal:**
   ```
   Static Web App → Custom domains → + Add
   ├─ Domain Type: Custom domain
   ├─ Domain name: pracownik.corab.pl
   └─ Validation method: CNAME
   ```

2. Azure pokaże wartość CNAME record (np. `nice-rock-12345.2.azurestaticapps.net`)

3. **Konfiguracja DNS:**

   **Jeśli używasz Azure DNS:**
   - Azure Portal → DNS zones → corab.pl
   - + Record set
   - Name: `pracownik`
   - Type: CNAME
   - Alias: `nice-rock-12345.2.azurestaticapps.net` (wartość z kroku 2)
   - TTL: 3600
   - OK

   **Jeśli używasz zewnętrznego DNS (Cloudflare, GoDaddy, etc.):**
   - Zaloguj się do panelu DNS providera
   - Dodaj CNAME record:
     ```
     Type: CNAME
     Name: pracownik
     Value: nice-rock-12345.2.azurestaticapps.net
     TTL: 3600
     ```
   - Zapisz

4. **Weryfikacja (czekaj 5-30 minut):**
   - Azure automatycznie wykryje DNS record
   - Certyfikat SSL zostanie automatycznie wygenerowany
   - Status w Azure Portal zmieni się na "Validated" ✅

5. **Test:**
   ```bash
   # Sprawdź DNS propagation
   nslookup pracownik.corab.pl

   # Otwórz w przeglądarce
   https://pracownik.corab.pl
   ```

#### Krok 4: Nadanie uprawnień developerowi (opcjonalne)

Jeśli chcesz, aby developer mógł również wdrażać zmiany przez Azure Portal:

1. Azure Portal → Static Web App: `corab-employee-portal`
2. Access Control (IAM) → + Add role assignment
3. Role: **Website Contributor** (może tylko deployować content)
4. Members: Wyszukaj `developer@corab.com.pl`
5. Review + assign

Developer będzie mógł:
- ✅ Wdrażać zmiany przez Azure Portal/CLI
- ✅ Widzieć deployment history
- ❌ NIE będzie mógł usunąć zasobu
- ❌ NIE będzie widział kosztów

---

### Opcja B: Przez Azure Portal/CLI (bez GitHub)

#### Krok 1: Utworzenie Azure Static Web App

1. Login do Azure Portal → Create a resource → Static Web App

2. Konfiguracja:
   ```
   Basics:
   ├─ Resource Group: "rg-corab-portal"
   ├─ Name: "corab-employee-portal"
   ├─ Plan type: Free
   ├─ Region: West Europe
   └─ Deployment details: Other (manual)
   ```

3. Review + Create

#### Krok 2: Deployment plików

**Przez Azure CLI:**
```bash
# 1. Zainstaluj Azure CLI (jeśli nie masz)
# https://learn.microsoft.com/cli/azure/install-azure-cli

# 2. Login
az login

# 3. Deploy
az staticwebapp upload \
  --name corab-employee-portal \
  --resource-group rg-corab-portal \
  --source c:\pracownikcorab
```

**Przez Azure Portal:**
```
1. Zip folder: c:\pracownikcorab → corab-portal.zip
2. Azure Portal → Static Web App → Overview → Upload
3. Select file → Upload corab-portal.zip
4. Deploy
```

#### Krok 3: Custom domain (tak samo jak Opcja A - Krok 3)

---

## 🔧 Aktualizacja URL dla przycisku "Pracownik bez konta Microsoft"

Obecnie drugi przycisk ma placeholder. Aby zaktualizować URL:

### Metoda 1: Przez GitHub (jeśli używasz)

1. Otwórz plik `js/main.js` w edytorze
2. Znajdź linię (około linia 18):
   ```javascript
   const URL_NON_MICROSOFT = ''; // ← WPISZ TUTAJ URL
   ```
3. Zmień na:
   ```javascript
   const URL_NON_MICROSOFT = 'https://twoj-nowy-url.com/login';
   ```
4. Zapisz i commit:
   ```bash
   git add js/main.js
   git commit -m "Update: Dodano URL dla pracowników bez MS"
   git push origin main
   ```
5. Strona automatycznie zaktualizuje się w ciągu 1-2 minut (GitHub Action)

### Metoda 2: Przez Azure Portal/CLI

1. Edytuj lokalnie plik `js/main.js`
2. Zmień `const URL_NON_MICROSOFT = ''` na właściwy URL
3. Zapisz
4. Zip folder i upload przez Azure Portal (lub użyj `az staticwebapp upload`)

---

## 👥 Zarządzanie dostępem

### Role Azure dla developerów:

| Role | Uprawnienia | Zalecane? |
|------|-------------|-----------|
| **Website Contributor** | Deploy content TYLKO | ✅ TAK (najbezpieczniejsze) |
| **Static Web App Contributor** | Deploy + settings | ⚠️ Jeśli potrzeba więcej kontroli |
| **Reader** | Tylko odczyt | ❌ Za mało |

### Jak dodać developera:

```
Azure Portal → Static Web App → Access Control (IAM)
→ + Add role assignment
→ Role: Website Contributor
→ Member: developer@corab.com.pl
→ Assign
```

---

## 📊 Monitorowanie i Logi

### Sprawdzanie czy strona działa:

1. **Metrics:**
   - Azure Portal → Static Web App → Monitoring → Metrics
   - Możesz zobaczyć: requests, bandwidth, errors

2. **Activity Log:**
   - Azure Portal → Static Web App → Activity log
   - Zobacz wszystkie deployments i zmiany

3. **Deployment History:**
   - Azure Portal → Static Web App → Environments
   - Zobacz poprzednie wdrożenia (jeśli używasz GitHub)

### Ustawienie alertów:

```
Azure Portal → Static Web App → Alerts
→ + New alert rule
→ Condition: np. "HTTP 4xx errors > 10"
→ Action: Email do IT team
```

---

## 🔍 Testowanie

### Testy lokalne (przed wdrożeniem):

```bash
# Otwórz plik bezpośrednio
start index.html

# Lub użyj prostego serwera (jeśli masz Node.js)
npx serve c:\pracownikcorab
# Otwórz: http://localhost:3000
```

### Testy produkcyjne:

- [ ] Otwórz https://pracownik.corab.pl
- [ ] Sprawdź certyfikat SSL (zielona kłódka)
- [ ] Kliknij przycisk "Pracownik z kontem Microsoft" → sprawdź redirect
- [ ] Kliknij przycisk bez MS → sprawdź komunikat/redirect
- [ ] Test na mobile (telefon)
- [ ] Test na tablet
- [ ] Test w różnych przeglądarkach (Chrome, Edge, Firefox)

---

## ❓ FAQ / Troubleshooting

### Q: Strona nie ładuje się po deployment
**A:**
- Sprawdź czy DNS propagacja się zakończyła: `nslookup pracownik.corab.pl`
- Spróbuj otworzyć brzydki URL Azure: `https://nice-rock-12345.azurestaticapps.net`
- Sprawdź Deployment History w Azure Portal

### Q: SSL nie działa (błąd certyfikatu)
**A:**
- DNS musi być poprawnie skonfigurowany (CNAME record)
- Poczekaj 5-30 minut na propagację DNS
- Azure automatycznie wygeneruje certyfikat po weryfikacji DNS

### Q: Przycisk nie przekierowuje
**A:**
- Otwórz Developer Tools (F12) → Console
- Sprawdź czy są błędy JavaScript
- Sprawdź czy URL jest poprawnie ustawiony w `js/main.js`

### Q: Jak cofnąć deployment (rollback)?
**A:**
- **Z GitHub:** `git revert HEAD` + `git push` → auto-deploy poprzedniej wersji
- **Bez GitHub:** Upload poprzedniej wersji ZIP przez Azure Portal

### Q: Ile to kosztuje?
**A:**
- **$0/miesiąc** - Free tier Azure Static Web Apps
- Limit: 100GB bandwidth/miesiąc (więcej niż potrzeba dla landing page)
- Custom domain + SSL: darmowe

### Q: Co jeśli potrzebujemy więcej funkcji?
**A:**
- Azure Static Web Apps wspiera Azure Functions (serverless backend)
- Nadal w Free tier (do limitu)
- Można dodać authentication, API endpoints, etc.

---

## 📞 Kontakt / Wsparcie

**W razie problemów:**
- Developer: [developer@corab.com.pl](mailto:developer@corab.com.pl)
- IT Support: [it@corab.com.pl](mailto:it@corab.com.pl)

**Dokumentacja Azure Static Web Apps:**
- https://learn.microsoft.com/azure/static-web-apps/

---

## 📝 Changelog

### v1.0.0 (2026-01-28)
- ✅ Inicial release
- ✅ Dwa przyciski logowania
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Instrukcje dla użytkowników
- ✅ Placeholder dla URL bez MS (do uzupełnienia)

---

**© 2026 Corab** | Portal Pracownika
