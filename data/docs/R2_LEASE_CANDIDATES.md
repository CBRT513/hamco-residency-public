# R2_LEASE_CANDIDATES — non-board-owned K-12 home venues (R.C. 2925.01(R)(2))

Generated **2026-08-26 14:40 ET**. Research only. State floor **not** rebuilt. Facilities **not** added. Nothing pushed or cloned.

Machine dump: `data/analytics/R2_LEASE_CANDIDATES.json`.

CAGIS extract `data/cagis/hamilton_county_parcels_2026-08-25.parquet` (OWNER / CLASS / acres). CAGIS has **OWNER only**. A lease was not invented. A one-off rental (Paycor, a single banquet hall, a one-game move) is not treated as leased premises. The bounded proxy is a **home venue listed by the athletics department** (district athletics, conference venue/directions page, or school "home of"). MaxPreps was not used as official.

## Legal filter

R.C. 2925.01(R)(2) = any *other* parcel **owned or leased** by a board of education / 3314 community-school governing authority / 3301.07 nonpublic governing body **on which** instruction, extracurriculars, or training of the school is conducted.

Board-owned / Archbishop / school-corporation pins are already in the OWNER inventory (`R2_SCHOOL_PARCELS.md`). This pass is the complement: **home venues whose CAGIS OWNER is city, township, village, park district, or private**.

## Counts

| item | n |
|---|---:|
| public districts / leftover BOEs checked | **23** |
| major 3301.07 nonpublics checked | **8** |
| **districts / governing bodies checked** | **31** |
| named home venues found (campus + off-campus) | **78** |
| **not board-owned (lease candidates below)** | **12** |
| Reading Memorial Stadium included | **yes** |

## Candidates (not board-owned)

| district | venue | sport(s) | address | parcelid(s) | CAGIS owner | why home | confidence |
|---|---|---|---|---|---|---|---|
| Reading | Veterans Memorial Stadium / Bemmes Field | football, soccer, track | 1600 West St | 067100220005 / 006 / 007 | READING CITY OF THE | CHL + district news + §666.17(B)(9) | home listed |
| Three Rivers (Taylor) | Miami Twp West Community Park | baseball, tennis | 4063 E Miami River Rd | 057001900016 | MIAMI TOWNSHIP TR BOARD OF THE | township parks page + CHL | home listed |
| Madeira | Sellman Park | baseball | 6700 Marvin Ave | 052500060086, 052500060193 | MADEIRA CITY OF THE | CHL + city parks | home listed |
| Madeira | Madeira Swim & Tennis Club | tennis | 6580 Miami Ave | 052500060050 | MADEIRA SWIM CLUB INC | CHL tennis listing | home listed |
| Mariemont | Stanton Field | HS softball, JH soccer | Elm & Stanton, Terrace Park | 052100080029, 052100070031, 052100080018 | TERRACE PARK VILLAGE OF / REC COMM INC | CHL | home listed |
| SBEP; Roger Bacon | Ross Park | baseball, softball, soccer; RB tennis | Tower / Bank / Ross, St. Bernard | 058200070002 et al. | ST BERNARD CITY OF THE | MVC venue pages | home listed |
| Roger Bacon | Vine Street / Church Street Park | softball | 4700 Vine St | 058200120009 | ST BERNARD CITY OF THE | MVC | home listed |
| Mt. Healthy | Adams Road fields | baseball, softball | 2046 Adams Rd | 059300010099 | MT HEALTHY CITY OF THE | official athletics directions | home listed |
| Norwood | Upper Millcrest Park | baseball | 1700/1702 Mills Ave | 065100490336 / 335 / 337 | NORWOOD CITY OF THE | official Fields & Directions | home listed |
| Reading | Blue Ash YMCA | tennis | 5000 YMCA Dr | 061200300381 / 382 / 182 | YOUNG MENS CHRISTIAN ASSOCIATION | CHL tennis listing | home listed |
| Princeton | Evendale Rec Center Field 5 | JV softball only | 10500 Reading Rd | 061100300156 / 045 / 091 | EVENDALE OHIO VILLAGE OF THE | GMC (JV) | home listed |
| McNicholas | Lunken Playfield tennis center | tennis | 4750 Playfield Ln | 001500030059 / 001500030060 | CINCINNATI CITY OF | school facilities page + GCL | home listed |

### 1. Reading — Veterans Memorial Stadium / Bemmes Field

**Home listed.** Football, soccer, track.

- CHL: https://www.chlsports.com/school.aspx?schoolid=78
- District: https://www.readingschools.org/apps/news/article/1797227
- CAGIS owner `READING CITY OF THE`, CLASS 640. Pins `067100220005` (1600 WEST ST; deed 11.386 ac / geom 0.30 ac) + `006` (geom 2.09 ac) + `007` (geom 5.01 ac).
- City still owns it (2026 city–district repair / land-swap coverage). Ordinance §666.17(B)(9) already labels it school premises. Lease is the (R)(2) question CAGIS cannot answer.

### 2. Three Rivers (Taylor) — Miami Township West Community Park

**Home listed.** Baseball and tennis.

- https://www.miamitownship.org/parks — "home field for … Taylor High School baseball" and home tennis matches.
- https://chlsports.com/school.aspx?schoolid=79
- `057001900016`, 4063 E MIAMI RIVER RD, `MIAMI TOWNSHIP TR BOARD OF THE`, CLASS 630, 33.73 ac.

### 3. Madeira — Sellman Park

**Home listed.** Baseball.

- https://www.chlsports.com/school.aspx?schoolid=76
- City-owned park behind the middle school. `052500060086` MARVIN AVE REAR, `MADEIRA CITY OF THE`, CLASS 640, 6.00 ac (+ leftover `052500060193`).

### 4. Madeira — Swim & Tennis Club

**Home listed.** Tennis.

- Same CHL page. `052500060050` 6580 MIAMI AVE, `MADEIRA SWIM CLUB INC`, CLASS 499. Private. Lease vs club-use not in CAGIS.

### 5. Mariemont — Stanton Field

**Home listed.** HS softball, JH soccer.

- https://www.chlsports.com/school.aspx?schoolid=77
- Village / rec-commission land at 428 Elm (not the Terrace Park BOE elementary at 716 Myrtle).

### 6. St. Bernard-Elmwood Place and Roger Bacon — Ross Park

**Home listed.** SBEP baseball / softball / soccer; Roger Bacon baseball / tennis.

- https://miamivalleyconference.com/school.aspx?schoolid=92
- https://miamivalleyconference.com/school.aspx?schoolid=19
- City pin `058200070002` Bank Ave 17.39 ac plus Ross Ave leftovers.

### 7. Roger Bacon — Vine Street / Church Street Park

**Home listed.** Softball.

- MVC Roger Bacon page. `058200120009` 4700 VINE ST, legal CHURCH ST, `ST BERNARD CITY OF THE`. Deed 5.80 ac; geom on this pin is a sliver.

### 8. Mt. Healthy — 2046 Adams Road

**Home listed.** Baseball and softball.

- https://mhowlssports.com/school.aspx?schoolid=71
- `059300010099`, `MT HEALTHY CITY OF THE`, CLASS 650 ED, 12.51 ac. City-owned educational pin, not a BOE string.

### 9. Norwood — Upper Millcrest Park

**Home listed.** Baseball.

- https://www.norwoodindians.org/main/fields
- Official address 1702 Mills is a house. Park point hits city pins `065100490336` (geom 6.65 ac) / `335` (2.48 ac) / `337` 4210 Mills.

### 10. Reading — Blue Ash YMCA

**Home listed.** Tennis.

- CHL Reading tennis block. YMCA-owned, not city or board. Not a proven parcel lease.

### 11. Princeton — Evendale Rec Center Field 5

**Home listed (JV softball only).**

- https://gmcsports.com/school.aspx?schoolid=9
- Village of Evendale pins at 10500 Reading Rd. Varsity softball is on the Chester campus (board-owned).

### 12. McNicholas — Lunken Playfield tennis

**Home listed.** Tennis.

- https://www.mcnhs.org/athletics/facilties
- `001500030059` / `001500030060`, `CINCINNATI CITY OF`, CLASS 640.

## District inventory (home venues found)

Official source preference: conference venue/directions page, district athletics "fields & directions," school "home of." Campus complexes are board-owned / school-corporation-owned unless noted.

### Public (territory in Hamilton County)

| district | official source | named home venues | owner class |
|---|---|---|---|
| Cincinnati Public | CPS/school facilities + Stargel/Woodward/Withrow coverage | Stargel Stadium (Taft / Aiken / Hughes / Riverview / Shroder / Gamble); Withrow stadium/track; Walnut Hills stadium; Woodward Bulldog Stadium 7005 Reading; Western Hills / Dater campus field and baseball | **board** (CPS). No city-park varsity home found. |
| Northwest Local (Colerain) | GMC Colerain https://gmcsports.com/school.aspx?schoolid=1 | 8801 Cheviot Rd campus (football, soccer, baseball, softball, tennis, track implied on site) | **board** |
| Oak Hills Local | GMC + https://www.oakhillssports.com/locations/ | Highlanders stadium / tennis / baseball at 3200 Ebenezer (board); varsity softball + freshman soccer at Rapid Run MS (board) | **board** |
| Three Rivers (Taylor) | CHL https://chlsports.com/school.aspx?schoolid=79 | McMillan Field, Cordrey soccer, softball complex at 56 Cooper (**board**); **West Park baseball/tennis (township — candidate)** | mixed |
| Southwest Local (Harrison) | SWOC + harrisonwildcats.net facilities | Wildcat Stadium / Kuntz Field / Law Track; baseball (also soccer outfield); softball; tennis — all 9860 West Rd campus | **board** |
| Finneytown Local | finneytown.org + tandem facilities list | McNulty Stadium 8916 Fontainebleau; Cook baseball, Brent softball/soccer/tennis at 8791 Brent | **board** (new diamonds planned 2027, still district) |
| Forest Hills (Anderson) | ECC https://www.eccsports.com/school.aspx?schoolid=22 + andersonraptors.org | Charles L. Brown Stadium / campus baseball-softball-tennis 7560 Forest (**board**). Riverside Park / Clear Creek / Veterans Park appear as rec or freshman only — **not treated as varsity home** | board (varsity) |
| Forest Hills (Turpin) | ECC https://www.eccsports.com/school.aspx?schoolid=33 | 2650 Bartels campus; freshman baseball at Nagel | **board** |
| Princeton | GMC https://gmcsports.com/school.aspx?schoolid=9 | Jake Sweeney / Mancuso + tennis + varsity softball + baseball at 11080 Chester (**board**); **Evendale Rec Field 5 JV softball (village — candidate)** | mixed |
| Winton Woods | ECC https://www.eccsports.com/school.aspx?schoolid=36 | Charles Frederick Stadium, baseball, tennis at 1231 W Kemper (**board**). Softball "park across from the stadium" — Waycross Intermediate / old Greenhills-Forest Park pin 059100050273 is leftover **board** name. Helwig Park is district-owned, leased *to* the township | **board** |
| Lockland | ohiostadiums + prior R2 aerial | Greer Field / Roettger Stadium (Lockland BOE). No 2026 Lockland football team (low numbers) | **board** |
| St. Bernard-Elmwood Place | MVC https://miamivalleyconference.com/school.aspx?schoolid=92 | 4615 Tower campus (**board**); **Ross Park baseball/softball/soccer (city — candidate)**; football "typically" Roger Bacon Stadium (nonpublic-owned, already covered) | mixed |
| Reading | CHL https://www.chlsports.com/school.aspx?schoolid=78 | **Memorial Stadium (city — candidate)**; Hilltop baseball/softball on BOE Bolser `067100260165` (**board**); **YMCA tennis (private — candidate)**; gym at 810 Columbia | mixed |
| Madeira | CHL https://www.chlsports.com/school.aspx?schoolid=76 | Loannes campus football/soccer/softball/track (**board**); **Sellman baseball (city — candidate)**; **Swim & Tennis Club (private — candidate)** | mixed |
| Mariemont | CHL https://www.chlsports.com/school.aspx?schoolid=77 | 1 Warrior Way stadium/track/soccer (**board**); Fairfax Field baseball 3847 Southern (**board**); Plainville tennis/stadium lot `052700400243` Village **BOE**; **Stanton Field (village — candidate)** | mixed |
| Indian Hill | CHL https://chlsports.com/school.aspx?schoolid=75 | 6865 Drake football/baseball/softball/tennis/track (**board**); Shawnee soccer at 6100 Drake `052901000018` INDIAN HILL EXEMPTED (**board**) | **board** |
| Sycamore | GMC https://gmcsports.com/school.aspx?schoolid=10 | 7400 Cornell stadium + campus fields (football stadium sits on the (R)(1) host) | **board** |
| Deer Park | CHL school page has no venue block; courts listed at 8351 Plainfield | Campus football/baseball/softball/tennis inferred at 8351 Plainfield. **No off-campus home found.** CHL did not publish directions | campus inferred |
| North College Hill | nchcityschools.org athletics; ohiostadiums | Baarendse Stadium 1620 W Galbraith (**board**). Baseball home not on an official fields page — **cannot tell home vs park** | board (stadium); baseball unknown |
| Mt. Healthy | https://mhowlssports.com/school.aspx?schoolid=71 | 8101 Hamilton stadium/track (**board**); **2046 Adams baseball/softball (city — candidate)** | mixed |
| Norwood | https://www.norwoodindians.org/main/fields | Shea Stadium 2603 Harris football/soccer/tennis/track (**board**); Sherman campus gym/pool/softball (**board**); **Upper Millcrest baseball (city — candidate)** | mixed |
| Wyoming | CHL https://www.chlsports.com/school.aspx?schoolid=80 | Bob Lewis Stadium, baseball, softball, tennis at 106 Pendery (**board**). Golf Wyoming CC / swim Powell-Crosley YMCA / bowl Stones Lanes = commercial rentals, omitted | **board** (field sports) |
| Loveland (Hamilton portion) | ECC https://www.eccsports.com/school.aspx?schoolid=28 | 1 Tiger Trail / Rich–Fallis campus (board-owned Fallis field already tagged YES in R2_ACTIVITY). No city-park varsity home listed | **board** |
| Greenhills EV | CAGIS leftover only | Merged into Winton Woods. `GREENHILLS BD OF EDUCATION` still on 825 Lakeridge / 147 Farragut. No separate athletics program | leftover **board** ownership; not a current home-venue list |

### Major 3301.07 nonpublics

| school | official source | named home venues | owner class |
|---|---|---|---|
| Moeller | moellerathletics facilities | Grein Field at Roettger (Lockland **BOE** — already covered); campus; Kremchek baseball in **Clermont** (out of CAGIS) | no Hamilton city/park home |
| St. Xavier | campus / prior R2 | North Bend campus stadium and fields (ST XAVIER HIGH SCHOOL INC) | **governing body** |
| Elder | The Pit coverage | The Pit on campus (Elder / Archbishop) | **governing body** |
| La Salle | https://www.golancers.net/about-us/athletic-facilities-5/ | Lancer Stadium, tennis, baseball on 3091 North Bend campus | **governing body** |
| McNicholas | https://www.mcnhs.org/athletics/facilties | Paradise / Penn Station / baseball / softball on campus; **Lunken tennis (city — candidate)** | mixed |
| Summit Country Day | prior R2 + district directories | 5580 Ehrling Sports Complex (SUMMIT COUNTRY DAY SCHOOL INC) | **governing body** |
| CHCA | chcaeagles.com / chca-oh.org | Lindner stadium, Gardner baseball, Conn tennis at 11300/11525 Snider | **governing body** |
| Roger Bacon | MVC https://miamivalleyconference.com/school.aspx?schoolid=19 | Stadium on Mitchell (**governing body**); **Ross Park baseball/tennis (city)**; **Vine St Park softball (city)**; swim at SBEP pool (board-owned, already covered) | mixed |

## Already board-owned (do not treat as lease candidates)

Named complexes confirmed on BOE / 3314 / 3301.07 pins include: CPS Stargel / Withrow / Walnut Hills / Woodward / Western Hills; Colerain Cheviot campus; Oak Hills Ebenezer + Rapid Run; Taylor Cooper Ave (McMillan / Cordrey / softball); Harrison West Rd complex; Finneytown McNulty + Brent; Anderson Brown Stadium; Turpin Bartels; Princeton Chester / Mancuso; Winton Woods Kemper / Frederick; Lockland Roettger / Greer; SBEP Tower campus; Reading Hilltop/Bolser; Madeira Loannes; Mariemont Warrior Way / Fairfax / Plainville BOE lot; Indian Hill Drake + Shawnee; Sycamore Cornell; Deer Park Plainfield; NCH Galbraith stadium; Mt. Healthy Hamilton Ave stadium; Norwood Shea + Sherman; Wyoming Pendery; Loveland Tiger Trail / Fallis; Elder Pit; St. X North Bend; La Salle Lancer Stadium; McNick Paradise; Summit Ehrling; CHCA Snider; Roger Bacon Stadium.

## What we did not do

- Did not add any pin to the state floor or `facilities.geojson`.
- Did not invent a lease. City/township/private **use** as a listed home is the proxy; CAGIS cannot show the lease instrument.
- Did not treat Paycor, banquet halls, bowling alleys, or country-club golf as leased premises.
- Did not use MaxPreps as official.
- Did not push. Did not clone.

## Files

- `data/analytics/R2_LEASE_CANDIDATES.md`
- `data/analytics/R2_LEASE_CANDIDATES.json`
