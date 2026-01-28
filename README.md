# Portal Pracownika Corab

Prosty landing page dla pracowników firmy Corab z dwoma opcjami logowania.

## 📋 Opis projektu

Strona umożliwia pracownikom wybór odpowiedniej metody logowania do systemu SAP Launchpad:
- **Pracownicy z kontem Microsoft** (domena firmowa) - logowanie domenowe
- **Pracownicy bez konta Microsoft** - alternatywna metoda logowania

## 🌐 Docelowy URL

Strona będzie dostępna pod adresem: **https://pracownik.corab.pl**

## 🔒 Bezpieczeństwo

**WAŻNE:** Strona wymaga dostępu przez VPN/IPsec z konkretnego adresu IP.

### Konfiguracja IP Whitelisting w Azure Static Web Apps

Azure Static Web Apps nie ma natywnego IP whitelisting w Free tier. Zalecane opcje:

#### Opcja 1: Azure Front Door + Static Web Apps (zalecane)
```
1. Azure Portal → Create Azure Front Door (Standard/Premium)
2. Dodaj Backend: Twój Static Web App URL
3. Security → WAF Policy → Custom rules
4. Add rule: IP restriction
   - Name: "AllowCorporateIP"
   - Rule type: Match
   - Match variable: RemoteAddr
   - Operator: IPMatch
   - IP addresses: [TWÓJ_IP_FIRMOWY]
   - Action: Allow
5. Set default action: Block
```

**Koszt:** ~$35/miesiąc (Standard tier)

#### Opcja 2: Azure Application Gateway + Static Web Apps
```
1. Azure Portal → Create Application Gateway
2. Backend pool → Add Static Web App
3. NSG (Network Security Group):
   - Inbound rule: Allow port 443 from [TWÓJ_IP]
   - Deny all other traffic
```

**Koszt:** ~$140/miesiąc

#### Opcja 3: Cloudflare (tańsza alternatywa)
```
1. Cloudflare → Add site
2. DNS: Point pracownik.corab.pl to Cloudflare proxy
3. Security → WAF → Firewall Rules:
   - Action: Block
   - When: IP Address is not [TWÓJ_IP]
```

**Koszt:** $20/miesiąc (Pro plan) lub $200/miesiąc (Business - zalecane dla firm)

### Rekomendacja dla środowiska VPN/IPsec

**NAJLEPSZA OPCJA: Nie używać Azure Static Web Apps, tylko Azure Web App z VNET integration**

```
Azure Web App (Linux) + App Service Plan B1
- Koszt: ~$13/miesiąc
- Pełne wsparcie dla IP restrictions (wbudowane, darmowe)
- VNET integration
- Private Endpoints
```

**Konfiguracja IP Restriction w Azure Web App:**
```
1. Azure Portal → Create Web App
2. Deployment: Upload ZIP lub GitHub
3. Networking → Access restriction
4. + Add rule:
   - Name: "Corporate VPN"
   - Priority: 100
   - Action: Allow
   - IP address block: [TWÓJ_IP]/32
5. Set default: Deny all
```

**To rozwiązanie:**
- ✅ Natywny IP whitelist (bez dodatkowych kosztów)
- ✅ Działa z VPN/IPsec out-of-the-box
- ✅ SSL/custom domain included
- ✅ ~$13/miesiąc (vs $35-200 dla Front Door/Cloudflare)

---

## 📁 Struktura projektu

```
c:\pracownikcorab/
├── index.html              # Główna strona HTML
├── css/
│   └── styles.css         # Style (responsive design)
├── js/
│   └── main.js            # Logika JavaScript (przekierowania)
├── img/
│   ├── logo-corab.png     # Logo firmy
│   └── favicon-white.png  # Favicon
├── README.md              # Ten plik
└── .gitignore             # Ignorowane pliki dla Git
```

---

## 🚀 Wdrożenie - Opcja A: Azure Web App (zalecane dla VPN/IP restriction)

### Krok 1: Utworzenie Azure Web App

```bash
# 1. Login do Azure
az login

# 2. Utwórz resource group (jeśli nie istnieje)
az group create --name rg-corab-portal --location westeurope

# 3. Utwórz App Service Plan (B1 - basic)
az appservice plan create \
  --name plan-corab-portal \
  --resource-group rg-corab-portal \
  --sku B1 \
  --is-linux

# 4. Utwórz Web App
az webapp create \
  --name corab-employee-portal \
  --resource-group rg-corab-portal \
  --plan plan-corab-portal \
  --runtime "NODE:18-lts"

# 5. Deploy statycznych plików
cd c:\pracownikcorab
az webapp up \
  --name corab-employee-portal \
  --resource-group rg-corab-portal \
  --html
```

### Krok 2: Konfiguracja IP Restriction

**Przez Azure Portal:**
```
1. Azure Portal → Web App: corab-employee-portal
2. Networking → Inbound Traffic → Access restriction
3. + Add rule:
   - Name: "Corporate VPN Access"
   - Priority: 100
   - Action: Allow
   - IP address block: [TWÓJ_FIRMOWY_IP]/32
4. Save
5. Ustaw default action: Deny (odmowa dla wszystkich innych IP)
```

**Przez Azure CLI:**
```bash
az webapp config access-restriction add \
  --resource-group rg-corab-portal \
  --name corab-employee-portal \
  --rule-name "Corporate VPN" \
  --action Allow \
  --ip-address [TWÓJ_IP]/32 \
  --priority 100
```

### Krok 3: Custom Domain

```
1. Azure Portal → Web App → Custom domains
2. + Add custom domain
3. Domain: pracownik.corab.pl
4. Validation:
   - Type: CNAME
   - Name: pracownik
   - Value: corab-employee-portal.azurewebsites.net
5. Add (po weryfikacji DNS)
6. SSL/TLS settings → Add binding
   - Domain: pracownik.corab.pl
   - TLS/SSL type: SNI SSL (darmowy managed certificate)
```

---

## 🚀 Wdrożenie - Opcja B: Azure Static Web Apps (prostsze, ale wymaga Front Door dla IP restriction)

### Przez GitHub (zalecane dla updates)

1. **Przyjęcie transfer ownership repo (jeśli developer utworzył)**
   - Sprawdź email → Accept transfer

2. **Utworzenie Azure Static Web App**
   ```
   Azure Portal → Create Static Web App
   - Resource Group: rg-corab-portal
   - Name: corab-employee-portal
   - Region: West Europe
   - Source: GitHub
   - Organization: [Twoja org]
   - Repository: corab-pracownik
   - Branch: main
   - Build Presets: Custom
   - App location: / (root)
   ```

3. **Custom domain**
   ```
   Static Web App → Custom domains
   - Add: pracownik.corab.pl
   - CNAME: [generated-url].azurestaticapps.net
   ```

4. **IP Restriction - wymaga Azure Front Door (Opcja 1 z sekcji Bezpieczeństwo)**

### Przez Azure Portal/CLI (bez GitHub)

```bash
# 1. Utwórz Static Web App (manual deployment)
az staticwebapp create \
  --name corab-employee-portal \
  --resource-group rg-corab-portal \
  --location westeurope

# 2. Deploy plików
az staticwebapp upload \
  --name corab-employee-portal \
  --resource-group rg-corab-portal \
  --source c:\pracownikcorab
```

---

## 🔧 Aktualizacja URL dla przycisku "Pracownik bez konta Microsoft"

Obecnie drugi przycisk ma placeholder. Aby zaktualizować:

1. Otwórz `js/main.js`
2. Znajdź linię (~18):
   ```javascript
   const URL_NON_MICROSOFT = ''; // ← WPISZ TUTAJ URL
   ```
3. Zmień na:
   ```javascript
   const URL_NON_MICROSOFT = 'https://twoj-url-dla-nie-ms-uzytkownikow';
   ```

### Deployment aktualizacji:

**Azure Web App:**
```bash
cd c:\pracownikcorab
az webapp up --name corab-employee-portal --resource-group rg-corab-portal --html
```

**Azure Static Web Apps (GitHub):**
```bash
git add js/main.js
git commit -m "Update: URL dla pracowników bez MS"
git push origin main
# Auto-deploy w 1-2 min
```

**Azure Static Web Apps (manual):**
```bash
az staticwebapp upload \
  --name corab-employee-portal \
  --resource-group rg-corab-portal \
  --source c:\pracownikcorab
```

---

## 👥 Zarządzanie dostępem

### Role Azure dla developerów:

| Role | Uprawnienia | Zalecane? |
|------|-------------|-----------|
| **Website Contributor** | Deploy content TYLKO | ✅ TAK (najbezpieczniejsze) |
| **Web App Contributor** | Deploy + settings | ⚠️ Jeśli potrzeba więcej kontroli |
| **Reader** | Tylko odczyt | ❌ Za mało |

### Jak dodać developera:

```
Azure Portal → Web App/Static Web App → Access Control (IAM)
→ + Add role assignment
→ Role: Website Contributor
→ Member: [email developera]
→ Assign
```

---

## 🔍 Testowanie

### Testy lokalne:

```bash
# Otwórz plik bezpośrednio
start index.html

# Lub użyj prostego serwera (jeśli masz Node.js)
npx serve c:\pracownikcorab
# Otwórz: http://localhost:3000
```

### Testy produkcyjne:

- [ ] Połącz się z VPN firmowym
- [ ] Otwórz https://pracownik.corab.pl
- [ ] Sprawdź certyfikat SSL (zielona kłódka)
- [ ] Sprawdź czy strona NIE działa bez VPN (test IP restriction)
- [ ] Kliknij przycisk "Pracownik z kontem Microsoft" → sprawdź redirect
- [ ] Kliknij przycisk bez MS → sprawdź komunikat/redirect
- [ ] Test na mobile (przez VPN)
- [ ] Test w różnych przeglądarkach (Chrome, Edge, Firefox)

---

## 📊 Monitorowanie

### Azure Web App / Static Web App:

1. **Metrics:**
   - Azure Portal → Resource → Monitoring → Metrics
   - Zobacz: requests, response time, errors

2. **Logs:**
   - Azure Portal → Resource → Monitoring → Log Stream
   - Real-time logs

3. **Alerts:**
   ```
   Monitoring → Alerts → + New alert rule
   - Condition: "HTTP 4xx errors > 10"
   - Action: Email do IT
   ```

---

## ❓ FAQ / Troubleshooting

### Q: Strona nie ładuje się po deployment
**A:**
- Sprawdź DNS: `nslookup pracownik.corab.pl`
- Sprawdź czy jesteś podłączony do VPN firmowego
- Spróbuj otworzyć tymczasowy URL Azure

### Q: "403 Forbidden" po wdrożeniu IP restriction
**A:**
- To POPRAWNE zachowanie - oznacza że IP restriction działa
- Połącz się z VPN firmowym i spróbuj ponownie
- Sprawdź czy Twoje IP po VPN to to samo co w konfiguracji:
  ```bash
  curl https://api.ipify.org
  ```

### Q: SSL nie działa
**A:**
- DNS musi być poprawnie skonfigurowany (CNAME)
- Poczekaj 5-30 minut na propagację DNS
- Azure automatycznie wygeneruje certyfikat

### Q: Jak sprawdzić moje IP po VPN?
**A:**
```bash
# W terminalu (przez VPN)
curl https://api.ipify.org

# Lub w przeglądarce
https://whatismyipaddress.com
```

### Q: Jak cofnąć deployment (rollback)?
**A:**
- **Z GitHub:** `git revert HEAD` + `git push`
- **Azure CLI:** Upload poprzedniej wersji

### Q: Ile to kosztuje?
**A:**
- **Azure Web App (B1):** ~$13/miesiąc (zalecane dla IP restriction)
- **Azure Static Web Apps (Free):** $0/miesiąc + Front Door $35/miesiąc dla IP restriction
- **Custom domain + SSL:** darmowe w obu opcjach

---

## 📞 Wsparcie

**W razie problemów skontaktuj się z działem IT.**

**Dokumentacja:**
- Azure Web App: https://learn.microsoft.com/azure/app-service/
- Azure Static Web Apps: https://learn.microsoft.com/azure/static-web-apps/

---

## 📝 Changelog

### v1.0.0 (2026-01-28)
- ✅ Inicial release
- ✅ Dwa przyciski logowania
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ 18 wariantów kolorystycznych do wyboru
- ✅ Theme picker dla testów (do usunięcia po wyborze koloru)
- ✅ Instrukcje wdrożenia z IP restriction (VPN/IPsec)

---

**© 2026 Corab** | Portal Pracownika
