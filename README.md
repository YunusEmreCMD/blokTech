# Matching App - Filter feature

> QuickJob is een app waarbij werkzoekende en werkgevers elkaar kunnen vinden. Werkgevers stellen een project of baan openbaar (met daarin de bijhorende informatie over het project of de baan, eisen/wensen van het bedrijf en de werkzoeker waarnaar ze opzoek zijn.), waarop werkzoekende op kunnen reageren door contact op te nemen (informatie staat in de app), als het iets lijkt voor hen (grote kans van wel, want ze geven in de app de wensen en intresses aan. De app matcht de werkzoeker met de werkgever, op basis van de wensen en eisen van beide partijen.
>
> Beide partijen kunnen hun wensen/intresses aangeven in de app door gebruik te maken van de de filter feature Dit zorgt ervoor dat werkzoekende en werkgevers elkaar gemakkelijk kunnen vinden door specifiek te filteren. Interesses worden aangegeven in de app door een keuze te maken uit verschillende dropdown's en radiobuttons.
>
> Werkzoekende kunnen filter op afstand, dit gaat via een slider. Ook is filteren mogelijk op dienstverband en opleidingsniveau, dit kan gemakkelijk door een keuze te maken uit de dropdowns. En tot slot kan er ook nog gefiltert worden op werkomgeving, deze filter gaat via een radiobutton.
>
> Wanneer een interresante werkgever of werkzoekende is gevonden kan er meer informatie verkregen worden door het kaartje om te draaien door er op te klikken. Indien de kaart past bij gebruiker kan er gelijk contact opgenomen worden, omdat alle contactgegevens in de app staan.

> Er zijn wellicht veel apps of websites die verzorgen voor een connectie tussen een werkzoekende en werkegvers, maar ik heb niet op mijn manier gezien. Daarom heb ik gekzoen voor dit project. Ik wil het proces wat speelser en gemakkelijker maken, en naar mijn mening kan dat door **cards** (design principe) te gebruiken waarop je moet filteren om resultaten te krijgen.

![JobDone-homepagina-en-404](https://github.com/YunusEmreCMD/blokTech/blob/main/images/joddone-home-404.png)

## Inhoudsopagve

* [Introductie](https://github.com/YunusEmreCMD/blokTech/blob/main/README.md#introductie)
* [Hoe te installeren](https://github.com/YunusEmreCMD/blokTech/blob/main/README.md#hoe-te-installeren)
* [Features](https://github.com/YunusEmreCMD/blokTech/blob/main/README.md#features)
* [License](https://github.com/YunusEmreCMD/blokTech/blob/main/README.md#license)
* [Bronnen](https://github.com/YunusEmreCMD/blokTech/blob/main/README.md#bronnen)

## Hoe te installeren en gebruiksklaar maken

### Installatie

Stap 1. Clone deze reposotiry
```js
git clone https://github.com/YunusEmreCMD/blokTech.git
```
Stap 2. Navigeer naar de zojuist geclonde reposotiry *Let op hoofdletters*
```js
cd blokTech/
```
Stap 3. Installeer de npm (Node package manager)
```js
npm install
```

### Database connectie
Stap 1. Installeer MongoDB en MongoDBcompass en zet een database op, [stappenplan](https://docs.atlas.mongodb.com/getting-started/) (*Als je dit als hebt kan je deze stap overslaan*)

Stap 2.
Wijzig de <password> en gebruiksnaam naar jouw gegevens
**code**
  
Stap 3.
verander de .env_example file naar .env
**code**

### Starten maar

Start nu npm (Node package manager)
```js
start npm
```

## Features

De functionaliteit om te **Filteren** is de main feature die is uitgewerkt in de applicatie, bekijk [inhoudelijke features](https://github.com/YunusEmreCMD/blokTech/wiki/Features) voor meer informatie.

![Resultaten](https://github.com/YunusEmreCMD/blokTech/blob/main/images/joddone-resultaten.png)

## In gebruik

Door rechtsboven-in op het filter icoontje te klikken, schuift er een filteroverlay naar boven hierin kun je een keuze maken uit de dropdowns en een keuze maken bij de radiobuttons. Na een keuze te hebben gemaakt klik je op "zoeken".

![Filteren](https://github.com/YunusEmreCMD/blokTech/blob/main/images/joddone-filter.png)
![Meerinfo en geen resultaten](https://github.com/YunusEmreCMD/blokTech/blob/main/images/joddone-meerinfo-geenresultaten.png)

## License

Er wordt in dit project gebruik gemaakt van de [MIT](https://github.com/YunusEmreCMD/blokTech/blob/main/LICENSE) license

## Bronnen

* https://github.com/inessadl/readme
* https://github.com/inessadl/readme/blob/master/_cheatsheet.md
* https://github.com/aimeos/aimeos-typo3/blob/master/README.md#license
