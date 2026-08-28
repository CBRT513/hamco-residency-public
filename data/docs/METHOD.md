# METHOD — Hamilton County R.C. 2950.034 restricted surface

Extract date: **2026-08-25**. CRS: **EPSG:3735** (NAD83 / Ohio South, US survey feet). Buffer: **1000 feet** from the **parcel boundary**. Built `2026-08-25 08:57 ET`.

This map answers where a covered person may newly establish a residence. It does **not** show who is enforceable today. It is a geographic overlay, **not** a determination that any person is in violation of R.C. 2950.034 or a local ordinance.

*Hyle v. Porter*, 117 Ohio St.3d 165, 2008-Ohio-542: the residency restriction is not retroactive. It does not apply if the offender bought the home **and** committed the offense before July 31, 2003.

Cincinnati grandfather: Section 2 of Ord. No. 0005-2007 exempts any sexual offender who established a residential premises in a prohibited area before 3-11-2007, until they change location. Shown on any Cincinnati search result. **Not drawn as geometry.**

Cincinnati §763-3(1) defines “sexual offender” by cross-reference to R.C. 2950.031. The ordinance borrowed the state’s covered class, so *Hyle* flows through. S.B. 10 renumbered the residency restriction to 2950.034 effective July 1, 2007 and reassigned 2950.031 to the Attorney General’s tier-reclassification provision — the ordinance has cited the wrong section since four months after enactment. Recorded here; **not modeled as geometry**.

## Legal geometry (not improvised)

- R.C. 2950.034 bars occupying residential premises within 1,000 feet of school premises, preschool/child-care-center premises, children's crisis-care facilities, and residential infant-care centers.
- R.C. 2950.034(C) premises include the **real property / parcel** the facility sits on. Buffers start at that parcel polygon, not a geocoded point and not a building footprint.
- School premises follow **R.C. 2950.01(S)** (same meanings as in R.C. 2925.01) via the ODEW OEDS school-building directory joined to CAGIS parcels. 2925.01(Q) "school" is Ohio-limited (board of education, Ch. 3314 community school, or 3301.07 nonpublic school).
- R.C. 2925.01(R)(2) covers other parcels the school owns or leases **on which instruction, extracurriculars, or training actually occur**. Confirmed (R)(2) athletic pins already on the floor are inside the published **38.58%** state-closed figure (117,997 of 305,868). Leftover untagged owner pins are frozen: state-closed is 38.58% confirmed, ceiling **88.29%**, best estimate **44.61%**. Do not ship 54.18% — that figure scaled the overlapping residual-score sum (qualify-rate × leftover mass) and double-counted shared leftover addresses. Best estimate 44.61% is the unique-address union of 1,000-ft buffers around the top 685 leftover pins (16/51 rank cutoff), clipped to county, minus the current state floor (18,437 unique habitable addresses, +6.028 pp). The 51 tagged pins were the ones adjudicable from aerials, and the 102 unknowns are the ambiguous residue, which skews toward no; 31.4% is an upper estimate of the true rate. Top 685 = that upper rate applied as a rank cutoff, then unioned. The ceiling is not a unique-address union (Guido St cluster and similar overlapping buffers). No further (R)(2) parcels are being added. Lease-gap list (12 non-board home venues) stays reported-not-added. See `data/analytics/R2_ERROR_BOUND.md` and `data/analytics/R2_UNIQUE_ESTIMATE.md`.
- Inclusion is by **license type**, never zoning:
  - Licensed Child Care Center / Child Care Center: **yes**
  - Licensed School-Based Preschool / Pre School: **yes**
  - School Age Child Care: **flag only** (`flag_school_age`); excluded from the main surface; a sensitivity surface includes them
  - Type A/B FCC, In-Home Aide, Day Camp: **no**
- Church- or school-attached centers are **not** dropped.
- Crisis / residential infant care: 0 in Hamilton County on the 4/22/2025 Agency Master List; the three statewide facilities (Lorain, Cuyahoga, Montgomery) are far from the county line.

## Stage 1 — locate, then join the parcel

Order: PARCELID / normalized street match onto CAGIS address points → `PARCELID` → parcel polygon; then spatial join of a known point (CAGIS school `X_COORD`/`Y_COORD`, or DCY geocode reprojected to 3735); then a counted **1000-ft point-buffer fallback**.

Empty parcel geoms skipped for joins: **225** (mostly CAGIS `<New parcel>` placeholders).

| match method | count |
|---|---:|
| address_to_parcelid | 870 |
| spatial_join | 56 |
| unmatched | 12 |
| cagis_geocode_spatial_join | 7 |
| point_buffer_fallback | 3 |

Unmatched facilities (no parcel and no usable point): **4** (Fairfield / Butler County Right At School sites, 8,500–35,000 ft outside the line; excluded).
Point-buffer fallbacks: **11** (3 original + 8 in-county centers recovered by world-geocode after address/spatial join failed).


### Childcare status

Main surface uses **Open** only.

- Hamilton rows: 1224
- Dropped Inactive: 105
- Dropped Enforcement: 6
- Open included (center + preschool): 551
- Open School Age Child Care (flagged, not in main): 9
- Open excluded types: {'FCC - Type B Home': 426, 'FCC - Type A Home': 96, 'Day Camp': 31}
- Out-of-county open centers/preschools within 1000 ft of the county line: 1

### Schools — OEDS vs CAGIS (do not silently pick one)

Inventory is **OEDS** (387 Hamilton **rows**, **310 unique IRNs**). The extra 77 rows are duplicate extract lines (same IRN + name + mailing address, often community schools). CAGIS Schools (304 points / 301 unique IRNs) is a location aid and a count cross-check.

| | n |
|---|---:|
| OEDS Hamilton | 387 |
| CAGIS Schools | 304 |
| IRN in both | 296 |
| OEDS only | 14 |
| CAGIS only | 5 |

CAGIS is short especially on community schools (OEDS 80 vs CAGIS FUND Community School 22). CAGIS-only names (first 30): ['Doherty School', 'Immaculate Conception Academy', 'Rabbinical Yeshiva of Cincinnati', 'Skyward Academy', 'Assumption School']

Border schools: OEDS pull for Butler / Warren / Clermont = 255 rows. All 255 mailing addresses were world-geocoded; **0** fall within 1,000 ft of the Hamilton County line (so none were added as point-buffer premises). 

Kentucky / Indiana school directories were not on disk and were not invented. The Ohio River is generally wider than 1,000 feet; a KY school would have to sit on the bank.

School buffers are **larger than perfect 1,000-ft circles** because they start from the parcel, not a point.

## Stage 2–3 — buffer, union, clip

Each protected parcel is buffered 1000 ft in EPSG:3735, then `unary_union`. The union is intersected with the Hamilton County boundary so the published surface and stats are in-county. Out-of-county premises still contribute wherever that buffer crosses the line.

## Stage 4 — stats

Headline is **housing units**.

{
  "extract_date": "2026-08-25",
  "crs": "EPSG:3735",
  "buffer_feet": 1000.0,
  "headline_housing_units": {
    "restricted": 102812,
    "universe": 305868,
    "percent": 33.61319261903828,
    "definition": "CAGIS address points whose PARCELID has Auditor CLASS 500\u2013599 or commercial-coded housing (401\u2013403, 404, 415, 419, 508, 555). Point-in-polygon against the clipped state surface."
  },
  "land": {
    "restricted_sqft": 2152681874.1352954,
    "county_sqft": 11505915607.219576,
    "restricted_sqmi": 77.2168371978053,
    "county_sqmi": 412.7179324215011,
    "percent": 18.7093487178418
  },
  "residential_parcels": {
    "restricted": 108909,
    "universe": 327019,
    "percent": 33.30356951736749,
    "class_filter": "Auditor CLASS 500\u2013599 (OAC 5703-25-10 residential) plus 401\u2013403 apartments, 404 retail/apartment, 415 mobile-home park, 419 other commercial housing, 451/469/472 apartments, 555 PUD/landominium. CLASS 507 (forestry) and 508 (street) in the 500s are excluded.",
    "centroid_inside": true
  },
  "unmatched_facilities": 12,
  "point_buffer_fallbacks": 3,
  "school_age_sensitivity": {
    "open_sacc_hamilton": 9,
    "housing_unit_delta": 34,
    "housing_unit_delta_pp": 0.011115906207905368,
    "land_delta_sqft": 423214.4989209175,
    "land_delta_pp": 0.0036782339916987105,
    "legal_question": "not decided \u2014 excluded from main surface, included in sensitivity"
  },
  "signage_unverified_share_of_restricted_surface": 0.04260862254149464,
  "childcare_status_filter": {
    "prefer": "Open",
    "dropped_inactive": 105,
    "dropped_enforcement": 6
  },
  "schools_oeds_vs_cagis": {
    "oeds": 387,
    "cagis": 304,
    "irn_both": 296,
    "oeds_only": 14,
    "cagis_only": 5
  },
  "empty_parcel_geoms_skipped": 225
}

### CLASS filter

Residential parcels = Auditor CLASS 500–599 (OAC 5703-25-10) plus commercial-coded housing 401–403 / 404 / 415 / 419 and Hamilton-observed 508 / 555. Test is **centroid inside** the clipped surface.

Housing units = CAGIS address points whose `PARCELID` is in that residential set; test is **point inside** the surface.

`RENT_REG_FLAG` lives on the **parcel** layer, not the address-point layer. Parcel-level counts are in `stats.json` when the flag is populated.

### School-age sensitivity

Excluded from the main surface. Sensitivity housing-unit delta: **34** ( 0.011115906207905368 percentage points ). Land delta: 423214.4989209175 sq ft (0.0036782339916987105 pp). Legal question not decided.

### Signage assumption

Zoning / EXLUCODE is used **only** for the signage tag, not for inclusion.

- EXLUCODE in C / O / MU / LI / HI / ED / IN → `assume_signage`
- EXLUCODE in SF / TF / MF / MH / CH (or residential CLASS with vacant/NA) → `signage_unverified` (still counted)

Share of the **restricted surface area that depends on the unverified group** (area of full surface minus area of verified-only union): **0.04260862254149464**

## Local ordinances (second surface)

Extras are buffered 1,000 ft and **clipped to that city's corporation**. State floor is not re-buffered. The map publishes **separate per-city extra layers** (`extras_cincinnati.geojson`, `extras_norwood.geojson`, `extras_reading.geojson`, `extras_golf_manor.geojson`, `extras_evendale.geojson`) plus a combined `restricted_local` for stats. `index.html` has independent checkboxes (state default ON; cities default OFF).

Rerun extras only (does not rebuild the state floor): `.venv/bin/python scripts/rebuild_local_layers.py`

### Cincinnati Ch. 763 — official-list completeness (re-audited 2026-08-25)

Sources: CRC recreation-center directory and aquatics-facility directory on cincinnati-oh.gov; myy.org / ymca.org association list; bgcgc.org club list; ywcacincinnati.org; Park Board find-a-park.

| class | official count | mapped | missing names |
|---|---:|---:|---|
| CRC recreation centers | 22 | 22 | none |
| CRC public swimming pools | 24 | 24 | none (spraygrounds excluded — not swimming pools) |
| YMCA recreational facilities inside Cincinnati corporation | 3 | 3 | none |
| BGC of Greater Cincinnati club facilities inside Cincinnati | 4 | 4 | none |
| YWCA recreational facilities | 0 current | 0 | class **stopped** |

CRC rec centers mapped: Bond Hill, Bush, Clifton, College Hill, Corryville, Dunham, Eastside, Evanston (pool-campus street address), Hartwell, Hirsch, LeBlond, Lincoln, Madisonville, McKie, Millvale, Mt. Washington, **North Avondale** (617 Clinton Springs; omitted from the prior extras table and restored this rebuild), Pleasant Ridge, Price Hill, Sayler Park, Westwood Town Hall, Winton Hills.

CRC pools mapped: Bond Hill, Bush, Camp Washington, Dempsey, Dickman, Dunham Otto Armleder, Evanston, Hanna Otto Armleder, Hartwell, Hirsch Otto Armleder, LeBlond, Lincoln, Madisonville, Millvale, Mt. Adams, Filson, Mt. Auburn Indoor (year-round listing kept even though CRC did not open it for the 2026 outdoor season), Mt. Washington, McKie, Oakley, Pleasant Ridge, Spring Grove Village, Ryan, Winton Hills.

Spraygrounds on the aquatics page and **not** mapped: Caldwell, College Hill, Oyler, North Fairmount, South Fairmount Park, Dyer.

YMCA of Greater Cincinnati association branches (membership location list + Lindner Family YMCA still listed on ymca.org with gym / aquatics programs): in-city extras are Central Parkway (1105 Elm), Gamble-Nippert (3159 Montana), Carl H. Lindner (1425 Linn). Outside Cincinnati corporation and not mapped as Ch. 763 extras: Blue Ash, Clippard/Colerain, Powel Crosley/Springfield Twp, M.E. Lyons/Anderson, Clermont, Highland, Campbell KY, R.C. Durr KY.

BGC in-city: Sheakley / Price Hill, Taft / Avondale (temporarily closed for renovation; still a club facility), Farmer / East Westwood, Western & Southern Workforce Development Center. Jeff Wyler (Eastgate / Clermont) and the Newport / Covington KY clubs are outside Cincinnati corporation.

YWCA: ywcacincinnati.org re-fetched 2026-08-25 still lists domestic-violence, racial-justice, and women's-empowerment programs only. No current recreational / fitness facility. Class remains **stopped**.

Park Board: Ch. 763 is rec centers and public swimming pools owned/operated by the City, Park Board, or CRC — **not all parks**. No separate Park Board rec-center / pool directory distinct from CRC. Ziegler Park lists a sprayground, not a swimming pool. Westwood Town Hall (joint Parks + CRC) is already the CRC rec center.

#### Columbia-Tusculum / East End completeness check (screenshot)

- **Schmidt Recreation Complex / Schmidt Sports Complex** (250 St. Peters St / 3020 Humbert St, 45226): **excluded**. Official CRC Recreation Center directory does not name Schmidt. CRC lists it under Playground and Sports Field or Court (cincyrec.org also has Schmidt Boat Ramps). No CRC/Park Board swimming pool is listed there. Ch. 763 does not buffer sports complexes. This is **not** CRC LeBlond Rec Center/Pool (2335 Riverside Dr, parcel `003200050056`), which is already mapped.
- **Alms Park**: **excluded**. Park Board park. No CRC/Park Board rec center or public swimming pool at Alms. Not a park-wide buffer.
- **Cross on Riverside near Babb Alley**: **St. Rose Church** (St. Rose of Lima), 2501 Riverside Drive. Churches are not a Ch. 763 extra. No OEDS school or DCY licensed center at that address. Riverside Academy (OEDS IRN 133678) is a different site at 3280 River Rd and is already in the state floor.

### Reading, Golf Manor, Evendale

CAGIS `Parks and Green Spaces` (`COUNTYWIDE/CagisCoreLayers/MapServer/2`), `PARKTYPE` in City or Village / Ball Field, `OWNER` READNG / GOLFMN / EVENDL. Schools in that layer are not re-added (state floor). Cemeteries, HOA, private commercial, and members-only clubs are not treated as public parks.

- Reading parks/fields: 18
- Golf Manor parks: 2
- Evendale parks: 9
- Reading library: 8740 Reading Rd
- Golf Manor library: none found in Golf Manor (CHPL has no village branch)
- Evendale library: none found in Evendale (CHPL has no village branch)
- Golf Manor churches: 6 via Auditor CLASS 685 parcels with centroid inside Golf Manor corporation (no CAGIS church point layer)

#### Reading § 666.17 display-piece (2026-08-25)

The map default is a **Reading exhibit** of the ordinance increment. State floor and extras_reading were **not rebuilt**. New display layers only.

- **Outside mask** (`reading_outside_mask.geojson`): large bbox with the official Reading MultiPolygon as holes. Greys the basemap and buffer fills *outside* the corporation. Does **not** clip any restriction geometry. Buffers that originate in Lockland / Arlington Heights and reach into Reading stay visible *inside* the line; buffers sitting entirely over those neighbors are dimmed by the wash.
- **Delta** (`delta_reading.geojson`): `extras_reading minus restricted_state`, computed in EPSG:3735, written WGS84. Purple fill `#6a51a3` / stroke `#4a148c`. Display-only — **not** in `CHECK_LAYERS` (eligibility stays state + city extras). Topology-preserved 25-ft simplified copy published for the map.
- **Facility labels** (`reading_facility_labels.geojson`): one point per Reading extra host (CAGIS park polygon or CHPL library parcel). Properties: `name`, `ordinance_class`, `enumerated`, `attackable`, `ordinance_item`, `ordinance_name`, `note`. Attackable labels are the unenumerated CAGIS leftovers (generic City of Reading Site / Park, I-75 open space). Baxter Park is Evendale and is not treated as Reading.
- **Callouts** (`reading_callouts.geojson`): labels only for two pockets that are open under the state floor and closed under § 666.17 — (a) 3rd/4th/5th Street grid west of Reading Road; (b) Kathwood / Mapletree eastern lobe. No housing-unit counts. Not legal geometry.

Ordinance cite: [amlegal § 666.17](https://codelibrary.amlegal.com/codes/reading/latest/reading_oh/0-0-0-58103). Recovered (B) list in `docs/ordinances/reading-666.17.md` (full-page fetch was Cloudflare-blocked; numbered premises from that official page's indexed snippets). Names matched CAGIS ↔ ordinance (Koening/Koenig, Vorhees/Voorhees, Carnevale/Hilltop, Quiet/Schmidt Quiet). **Not invented:** Reisenberg VYO athletic fields (B)(5) and Morton Athletic Fields (B)(12) have no matching CAGIS host in the extras; they were not added as new facilities. Library is enumerated as the CHPL Reading branch (mapped 8740 Reading Rd; ordinance lists 9001 Reading Road).

### Norwood 533.14 (mapped 2026-08-25)

Official code: `docs/norwood-533.md`. Extras are libraries + City-owned parks/playgrounds + City owned/operated swimming pools + the Norwood Community Center / public recreational center. Schools and state-licensed day cares stay on the state floor (not double-counted). **533.17 rec-facility membership ban is not a residency buffer and is not mapped.**

Buffers start at the CAGIS **parcel** (or CAGIS park polygon when that is the premises), 1,000 ft in EPSG:3735, then clipped to the Norwood corporation.

Inventory (`data/local_extras/norwood_533_14.csv`):

| type | n | names |
|---|---:|---|
| library | 1 | Norwood Branch Library (CHPL), 4325 Montgomery Rd |
| park | 12 mapped | Burwood; Hunter; Victory Memorial; Dorl Field; Marsh Avenue; Northwoods; Waterworks; Upper Millcrest; Lower Millcrest; Watertower / Water Tower / Tower; Fenwick; Norwood Mound (CAGIS OWNER=NOR city park; historic mound — not separately named on CivicEngage but city-owned) |
| pool | 1 | Waterworks Pool, 2701 Harris Ave (J.B. Wirth). Rec Center indoor pool is the same Sherman Ave campus as the rec center (not a second host). |
| community_center / public rec center | 2 | Norwood Community Center, 1810 Courtland Ave (named in 533.14(b)(7); Senior Center is the same building); Norwood Recreation Center, 2039 Sherman Ave |

**Not mapped / stopped**

- **Lindner Park** (ADA list: 2726 Cypress Way): official city document names it. CAGIS has no NOR-owned Lindner park. The CAGIS “Lindner Park/McCullough Estate Nature Preserve” is OWNER=CINC (Cincinnati Park Board) and was **not** used. 2726 Cypress Way is not a CAGIS address; Cypress Way parcels inside Norwood are private residential. No city-owned parcel verified. **Excluded — not invented.**
- Closed historic neighborhood pools named only in secondary/wiki lists (Burwood, Fenwick, Millcrest, Northwoods, Victory) are not current city swimming pools; the **parks** at those sites are mapped.
- School playgrounds / Norwood High School pool: state floor.
- City Hall, Police, Health, Safety Lane, Police Training Center: not parks, pools, libraries, or rec centers.
- 533.17 membership ban: not a residency surface.

Hunter Park used a CAGIS park polygon (no parcelid on the intersecting join). All other mapped Norwood extras have a parcel id or a park polygon.

## Corporation lines (display only)

CAGIS MuniTwps (`CINC_PLANNING/Munitwps_Neighborhoods/MapServer/0`; committed extract `data/cagis/hamilton_county_municipalities_2026-08-25.parquet`, 2026-08-25, EPSG:3735). Filter is the official corporation, not a township and not a neighborhood:

| BND_NAME | JURISTYPE | COPORATE | name |
|---|---|---|---|
| CINCINNATI | CTY | CITY | Cincinnati |
| NORWOOD | CTY | CITY | Norwood |
| READING | CTY | CITY | Reading |
| GOLF MANOR | CTY | VILLAGE | Golf Manor |
| EVENDALE | VIL | VILLAGE | Evendale |

Published as WGS84 `corp_boundaries.geojson` (properties: `name`, `juris_type`, `source=CAGIS MuniTwps 2026-08-25`). Leaflet draws them as **lines only** (`fillOpacity` 0, weight 2.5), one layer per city, independent checkboxes. Colors: Cincinnati `#08519c`, Norwood `#006d2c`, Reading `#f16913`, Golf Manor `#4a148c`, Evendale `#17becf`. Popup is the city name. **Not used in eligibility search.**

Default exhibit (2026-08-25 Reading display-piece): **Reading corporation ON**; other city lines available but **OFF**. An inverted outside-Reading mask (`reading_outside_mask.geojson`) is ON by default (grey wash, pointer-events none, above buffer fills, below the Reading line and labels). The mask does not clip buffers.

## Outputs

- `restricted_state.geojson` + topology-preserved simplified copy (25 ft) — **not rebuilt** this pass
- `restricted_local.geojson` + simplified (state ∪ all city extras)
- `extras_{cincinnati,norwood,reading,golf_manor,evendale}.geojson` + simplified
- `delta_reading.geojson` + simplified — extras_reading minus state floor (display-only)
- `reading_outside_mask.geojson` — inverted wash (bbox minus official Reading MultiPolygon)
- `reading_facility_labels.geojson` — per-host labels with § 666.17(B) attribution
- `reading_callouts.geojson` — two neighborhood pocket labels (not legal geometry)
- `facilities.geojson` — state hosts plus local-extra parcels (cream on the map = premises, not buffers)
- `stats.json` + this file
- `housing_open_state_simplified.geojson` — dissolved Auditor residential parcels whose centroid is NOT in restricted_state (2.85 MB; 7,590 parts)
- `housing_restricted_state_simplified.geojson` — dissolved Auditor residential parcels whose centroid IS in restricted_state (1.46 MB; 6,409 parts)
- `housing_restricted_local_only_simplified.geojson` — residential parcels in (state ∪ city extras) but not state (0.10 MB; 498 parts)
- `nonresidential_mask_simplified.geojson` — inverted wash (bbox minus residential dissolve; 2.56 MB). Display only; does not clip buffers
- `delta_{cincinnati,norwood,golf_manor,evendale}.geojson` + simplified — extras minus state (display-only). Reading delta not rebuilt
- `{cincinnati,norwood,golf_manor,evendale}_outside_mask.geojson` — inverted wash (bbox minus that corporation)
- `{cincinnati,norwood,golf_manor,evendale}_facility_labels.geojson` — host labels from mapped extras
- `{cincinnati,norwood,golf_manor,evendale}_callouts.geojson` — empty FeatureCollections (no invented neighborhood narratives)
- `restricted_state_habitable.geojson` — display clip: restricted_state ∩ Auditor-residential union (1.88 MB). Eligibility still uses `restricted_state_simplified`.
- `delta_{city}_habitable.geojson` — extras minus state, intersect habitable. Reading copy is also clipped to the Reading corporation (leftover slivers < 100 sq ft warned).
- `data/analytics/muni_housing.json` — habitable-address A–E for Cincinnati, Norwood, Reading, Golf Manor, Evendale.
- `index.html` — no green “can live here” fill. Restriction shading is habitable-clipped / parcel-extended state floor + ordinance delta only. County row: state floor, Buffer edge, non-habitable white wash, facilities, address points. Each city row: extras, line, delta, outside mask. Presets: Base / State floor / State + Ordinance / Ordinance only / Housing / Address view / Audit. Export pair writes `{muni}_state.png` and `{muni}_state_plus_local.png` at the same bounds. Eligibility search is unclipped `buffer_edge_state` + city extras. Headline panel loads repo-root `headline.json` (same payload also under `data/analytics/headline.json`).
- `corp_boundaries.geojson` — WGS84 polygons for Cincinnati, Norwood, Reading, Golf Manor, Evendale (CAGIS MuniTwps 2026-08-25); drawn as outlines only
- `headline.json` — A and percent-closed for the county and every municipality (recomputed on current search files). Copy also at `data/analytics/headline.json`.
- `docs/ordinances/reading-666.17.md` — recovered § 666.17(B) premises list
- `data/local_extras/norwood_533_14.csv`
- Checkpoints under `data/checkpoints/`
- Rerun state+local: `.venv/bin/python scripts/build_surfaces.py`
- Rerun local layers only: `.venv/bin/python scripts/rebuild_local_layers.py`
- Rerun Reading display layers: `.venv/bin/python scripts/build_reading_display.py`
- Rerun housing display layers: `.venv/bin/python scripts/build_housing_display.py`
- Rerun per-city display layers (does not overwrite Reading): `.venv/bin/python scripts/build_city_display.py`
- Rerun habitable display clips: `.venv/bin/python scripts/clip_display_habitable.py`
- Rerun address analytics (A–F + point layers): `.venv/bin/python scripts/build_muni_analytics.py`
- Rerun headline A / percent-closed only: `.venv/bin/python scripts/build_headline.py`

## What we did not do

- Did not copy CBRT files.
- Did not commit the 150 MB probe or the 379 MB parcel GeoPackage.
- Did not buffer from points except as a counted fallback.
- Did not invent YWCA recreational premises.
- Did not invent Norwood Lindner Park or Cincinnati park-wide buffers (Schmidt sports complex, Alms Park).
- Did not map 533.17 as a residency surface.
- Did not decide the school-age legal question.
- Did not rebuild the state floor this pass.
- Did not map official Ohio eSORN or county sheriff registrant locations (City-Data scrape removed).
- Did not use corporation lines in eligibility search.
- Did not clip restriction buffers to the Reading corporation (mask only).
- Did not add the Reading delta to eligibility `CHECK_LAYERS`.
- Did not invent Reisenberg VYO (B)(5) or Morton Athletic Fields (B)(12) hosts when CAGIS had no matching extra polygon.
- Did not treat generic CAGIS 'City of Reading Site' / I-75 open space as enumerated § 666.17(B) premises.
- Did not publish housing-unit counts for the two neighborhood pockets.
- Did not rebuild the state floor or extras_reading for this display-piece.
- Did not invent a new CLASS filter; housing layers use `build_surfaces.is_residential_class` (500–599 except 507/508, plus 401–403/404/415/419/451/469/472/555).
- Did not treat housing layers as a legal definition of habitable premises.
- Did not add housing layers to eligibility `CHECK_LAYERS`.
- Did not clip restriction buffers.
- Did not invent neighborhood callouts for Cincinnati, Norwood, Golf Manor, or Evendale.
- Did not commit a new raw parcel extract.
- Did not draw the green “can live here” housing-open fill (file kept on disk for analytics).
- Did not render housingRestricted as a separate red housing fill.
- Did not hatch non-residential land; white wash only. Did not apply a global grayscale that would grey habitable land.
- Did not clip state-floor buffers to any corporation (habitable clip only).
- Did not put habitable clips into eligibility `CHECK_LAYERS`.
- Did not invent Reisenberg VYO (B)(5) or Morton Athletic Fields (B)(12).

## Housing display layers (2026-08-25)

Display only. Auditor residential/housing parcels, not a new legal definition of habitable. Centroid test against the existing clipped surfaces. Restriction buffers were not clipped.

CLASS filter (same as `residential_parcels.class_filter` / `is_residential_class`): Auditor CLASS 500–599 except 507 (forestry) and 508 (street), plus commercial-coded housing 401–403, 404, 415, 419, 451/469/472, 555.

| layer | n parcels | dissolve | parts | published |
|---|---:|---|---:|---|
| open (centroid not in state) | 217,773 | yes | 7,590 | 2.85 MB |
| restricted state (centroid in state) | 109,246 | yes | 6,409 | 1.46 MB |
| local-only increment (in state∪extras, not state) | 7,732 | yes | 498 | 0.10 MB |
| non-residential wash | 327,019 holes | yes (75 ft wash) | — | 2.56 MB |

Residential universe 327,019 (empty geoms skipped: 225). Local union 116,978. 25 ft topology-preserved simplify on housing; coordinate precision reduced to 6 decimals for Pages size. Mask uses 75 ft simplify so it stays under 5 MB.

## Local surface stats (state ∪ city extras)

| measure | state | local |
|---|---:|---:|
| housing units | 33.71% (103,111 / 305,868) | **36.01%** (110,147 / 305,868) |
| land | 18.76% (77.41 / 412.72 sq mi) | 19.99% (82.51 / 412.72 sq mi) |
| residential parcels | 33.41% (109,246 / 327,025) | 35.77% (116,978 / 327,019) |

Local minus state: **+2.30 pp** housing units (+7,036 units). Previous published local was 35.39% (108,256); Norwood extras added **+1,891** units (+0.62 pp vs that 35.39%).

Per-city extra housing-unit delta (units added by that city overlay vs state-only, **inside that corporation**):

| city | units added by overlay | HU in corp |
|---|---:|---:|
| Cincinnati Ch. 763 | 3,094 | 106,606 |
| Norwood 533.14 | 1,891 | 6,352 |
| Reading | 1,333 | — |
| Golf Manor | 252 | — |
| Evendale | 466 | — |

## Registrant locations — not mapped

City-data.com scrape / `registrants.geojson` removed (third-party aggregator, not official eSORN). Official Ohio eSORN or county sheriff locations only if wanted later. Not used in eligibility search.

## Habitable-clip display (2026-08-25, 3:30 PM ET)

Green “can live here” fill removed from the map, legend, and checkboxes. `housing_open_state_simplified.geojson` stays on disk for analytics. Eligible land is the absence of fill.

Restriction shading for DISPLAY is only:

- **State floor** (`restricted_state_habitable.geojson`): `restricted_state` intersect the union of Auditor-residential parcels (same `is_residential_class` filter). Not clipped to any corporation, so Evendale / Amberley / Sycamore buffers that reach into Reading stay visible inside the line.
- **Ordinance increment** (`delta_*_habitable.geojson`): extras minus state, then habitable. Reading delta verified against `corp_boundaries` name=Reading and clipped; leftover pieces < 100 sq ft (EPSG:3735) warned.

Non-habitable is a white overlay (`#FFFFFF` 0.45) on `nonresidential_mask_simplified.geojson`, not a hatch. State/delta are clipped out of non-residential parcels so cemetery / Mill Creek industry / I-75 / Cross County ROW are not painted orange or purple.

### Colors and z-order (bottom → top)

| pane | z | style |
|---|---:|---|
| Basemap tiles | default | OSM |
| Outside-corporation mask | 210 | `#FFFFFF` 0.55; does not clip buffers |
| Non-habitable wash | 220 | `#FFFFFF` 0.45 |
| Ordinance increment | 350 | fill `#6D4C9F` 0.22; stroke `#4A2F78` 0.95 width 1.75 dash `6,3` |
| State floor | 400 | fill `#E4572E` 0.38; stroke `#A8341A` 0.90 width 1 |
| Facility parcels | 460 | fill `#F2C14E` 0.55; stroke `#9C7A16` 0.90 width 1 |
| Corporation lines | 470 | Reading `#E8590C` width 2.5; other cities keep their distinct colors |

`COLORS` in `index.html` drives both layer styles and legend swatches.

### Presets

Each preset sets every toggle. Focused municipality (default Reading) is used by presets, analytics, and export.

- Base — basemap + all corporation lines
- State floor — habitable state + focused corp line + non-habitable wash
- State + Ordinance — state + focused delta + corp line + wash
- Ordinance only — focused delta + corp line + wash
- Housing — state + focused delta + wash + outside-corp mask

Export pair hides the panel, locks the focused-city bounds, and writes `{muni}_state.png` then `{muni}_state_plus_local.png` (html2canvas / leaflet-simple-map-screenshoter). `#export-note` is in the export. Pins stay off.

### Address analytics

`data/analytics/muni_housing.json`. Habitable addresses = CAGIS address points on residential CLASS parcels, point-in-polygon inside that corporation. Restriction tests use the full legal surfaces.

| city | A | B | C | D | D pp | E addresses |
|---|---:|---:|---:|---:|---:|---:|
| Cincinnati | 106,606 | 58,424 | 55,330 | 3,094 | 2.902 | 1,051 |
| Norwood | 6,352 | 3,827 | 1,936 | 1,891 | 29.770 | 49 |
| Reading | 3,596 | 2,343 | 1,010 | 1,333 | 37.069 | 197 |
| Golf Manor | 1,300 | 1,015 | 763 | 252 | 19.385 | 45 |
| Evendale | 1,103 | 818 | 352 | 466 | 42.248 | 61 |

Reading E is the northern district that survives under state+ordinance (adjacent residential parcels): Genoma, Breezy Vista, Eagleview, Keith, Crest, plus Aljoy / Bunker Hill / Calico / Gahl / Heile / Hunt / North / Rainbow Ridge. Krylon, Trillium, and Siebenthaler are partly C-open but split off the largest cluster by ordinance gaps. CAGIS spelling is EAGLEVIEW (not Eaglesview); East Crest is stored as CREST.



## Checkpoint — search vs render vs address points (2026-08-26, 8:15 AM ET)

Three tests, still distinct:

| test | geometry | files |
|---|---|---|
| **UI search** (unchanged) | parcel polygon ∩ layer (fallback: point-in-polygon) | unclipped `restricted_state_simplified.geojson` + `extras_{city}_simplified.geojson` for cincinnati / norwood / reading / golf_manor / evendale |
| **Address-point layers** | same classification as search, drawn as dots | `addresses_ineligible.geojson` / `addresses_eligible.geojson` — **not** classified from habitable-clip render polygons |
| **Map shading** | address point ∈ habitable clip | `restricted_state_habitable.geojson` + `delta_{city}_habitable.geojson` |

Point layers sit on `ineligPane` 462 (`#B02711` 0.85, white 0.5 px stroke) and `eligPane` 465 (`#1B7F5A` 0.90, same stroke), above state floor (400) and facility parcels (460), below corporation lines (470). Default off. Radius scales 1.5–4 px from zoom 12–18 (2.5 px at zoom 15).

New presets **Address view** (corp line + mask + both point layers; parcel shading off) and **Audit** (corp line + state floor + delta + both point layers). The five existing presets are unchanged and explicitly turn the new point toggles off. Export pair is still State floor + State + Ordinance.

### A–F (search-classified points, 150-ft single-linkage)

`data/analytics/muni_housing.json` now covers every municipality plus a county rollup. A–D use SEARCH eligibility (parcel ∩ unclipped simplified), not point-in-polygon against the full legal surfaces. E is the largest 150-ft single-linkage cluster among C-open **address points** (EPSG:3735), plus ranks 2–5, cluster count, and median size. F is fragmentation of those C-open points (eligible count, clusters, median, count sitting in clusters of fewer than 10).

Previous E used parcel-adjacency among point-in-full-unclipped C-open addresses (Reading 197 / 13 streets; Norwood 49 / Carter, Hopkins, Ivanhoe, Williams). Those previous E values were **too low** as cluster sizes under 150-ft point linkage, even though search C is smaller than the old point-in-unclipped C:

| city | A | B | C | D | D pp | E (new) | prev parcel E | Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Cincinnati | 106,606 | 54,990 | 52,027 | 2,963 | 2.779 | 1,988 | 1,051 | +937 |
| Norwood | 6,352 | 3,654 | 1,746 | 1,908 | 30.038 | 415 | 49 | +366 |
| Reading | 3,596 | 2,254 | 921 | 1,333 | 37.069 | 282 | 197 | +85 |
| Golf Manor | 1,300 | 1,002 | 737 | 265 | 20.385 | 316 | 45 | +271 |
| Evendale | 1,103 | 791 | 281 | 510 | 46.238 | 20 | 61 | −41 |
| Hamilton County | 305,868 | 193,120 | 186,118 | 7,002 | 2.289 | 1,988 | — | — |

Norwood Carter / Hopkins / Ivanhoe / Williams **survived** as search-C cluster rank 3 (265 addresses). 1900 Hopkins / parcel 065100520058 is search-ineligible and is **not** in C (it was C-open under the old point-in-unclipped test). Other Hopkins addresses remain C-open. The new Norwood largest cluster (415) is a different knot (Buxton / Carthage / Globe / …).

Rerun: `.venv/bin/python scripts/build_address_points.py` (also invoked by `scripts/build_muni_analytics.py`).


## Parcel-extended render — 2026-08-26 9:55 AM ET

Search was already the legal test (parcel ∩ unclipped 1000-ft buffer). Render was a housing-clip / point view: the buffer was painted only where it overlapped habitable land, so a parcel that merely *touched* a buffer stayed mostly unshaded. **R.C. 2950.01(T)** residential premises extends to the property line. If any part of a habitable residential parcel intersects a buffer, the whole parcel is restricted.

### Formula (EPSG:3735)

```
restricted_state = union(state 1000-ft buffers,
                         every habitable residential parcel that intersects one)
                   ∩ county

delta_city       = union(that city's extra buffers,
                         every habitable residential parcel that intersects one)
                   − restricted_state
```

Habitable residential = `build_surfaces.is_residential_class` (CLASS 500–599 except 507/508, plus 401–403, 404, 415, 419, 451/469/472, 555).

State buffers start at facility **parcel polygons**. The recovered eight use those parcels. HumbleBee (Butler PIN `M5620255000018`, 77.2 ft out) uses the **Butler Auditor parcel** (`butler_auditor_parcel`) — do not substitute CAGIS 72 W Crescentville / `BP1000600019` / Butler `M5610006000019`. Loving Babies is dropped. KCE @ St. Columban is omitted (4,576 ft out). Cincinnati Ch. 763 extras were not rebuilt.

Out-of-state hosts. R.C. 2950.034(C)(1) incorporates the *definition* in R.C. 5104.01, not the Ch. 5104 license obligation. 5104.01(L) is functional on its face — "any place that is not the permanent residence of the licensee or administrator in which child care or publicly funded child care is provided for seven or more children at one time" — so a Kentucky or Indiana center could fit the words alone. Stronger ground for not buffering those facilities: Ohio statutes are presumed to have no extraterritorial reach unless the General Assembly clearly says so. 5104.01's definitions sit inside Chapter 5104, which regulates Ohio licensure (ODJFS/DCY). Reading those definitions as creating a 2950.034 buffer around a Kentucky or Indiana facility would give Ohio criminal-adjacent residency law extraterritorial effect the chapter does not claim. Schools are cleaner: 2950.01(S) points to 2925.01, and 2925.01(Q) is Ohio-limited (board of education, Ch. 3314 community school, or 3301.07 nonpublic school). Preschool under 2950.034(C)(4) remains the gap — functional, no Ohio-license cite. Two targeted lookups are **closed** (see `data/analytics/PART1_FOLLOWUPS.md`). West Harrison IN HITs exist and were **not added** under the same extraterritoriality presumption: All 4 Kids 535 S State (99.7 ft) and 607 S State (172.9 ft) are Indiana-licensed centers → 2950.034(C)(1) + no extraterritorial reach; Harrison Co-Op 515 S State (84.4 ft) is the (C)(4) case (last 990 seen 2014, open status unconfirmed; user declined to add). Nearest Ohio housing is Harrison CLASS 550 condos at 530–560 S State. St. Leon empty (~39k ft). KY riverfront empty (Learning Grove River Center 2,800–3,300 ft to Mehring Way). This is not a full KY/IN directory ingest.

A thin **Buffer edge** layer (`buffer_edge_state.geojson` + `buffer_edge_extras.geojson`) is the raw 1000-ft buffer *before* parcel extension, default OFF, `#A8341A` weight 1 no fill. Left unsimplified (1.20 MB) so UI search (`stateLegal`) matches the legal buffer; a 25-ft shrink was dropping legally-touching parcels. Audit turns the toggle ON.

### 948 identity (checkpoint unchanged in count)

`934 main (420 parcel CCC + 2 point CCC + 125 preschool + 387 schools) + 9 SACC + 1 border + 4 unmatched = 948`.

The two remaining point CCC are KCE @ St. Columban (non-contributing) and Loving Babies (dropped, still inventoried). HumbleBee is no longer a point host (`butler_auditor_parcel`). Contributing point host: **none**.

### HumbleBee Butler parcel (2026-08-26 10:14 AM ET)

Targeted state-floor swap. `cc-border-9115` geometry is Butler Auditor PIN `M5620255000018` (TCBC ENTERPRISES LLC, 4800 BUSINESS CENTER WAY / 72 EAST CRESCENTVILLE RD site address). Old in-county point buffer **1,375,424 sq ft**; new in-county parcel buffer **1,865,293 sq ft**; delta **+489,870 sq ft** (+0.0176 sq mi). Still intersects Springdale only (Sharonville 3,583 ft, Glendale 7,632 ft from the in-county buffer). Habitable address delta: 0 closed / 0 opened (the extra land is commercial / ROW; a 7,279 sq ft released pocket on the south edge freed no habitable parcel). Details: `data/analytics/HUMBLEBEE_APPLIED.md`.

### Signage

Schools have no R.C. 2950.034(C)(5) condition. 26 school `signage_unverified` tags cleared. Only preschool / CCC on residential EXLU stay unverified (38 including recovered Tillers).

### Display vs search

- `ly_state` loads `restricted_state_habitable.geojson` (union of whole touching habitable parcels).
- `stateLegal` / search loads `buffer_edge_state.geojson` (raw buffer). City extras search files unchanged.
- After this rebuild, any parcel search flags is in the rendered state/delta, so class A collapsed from 10,817 to 43. 1900 Hopkins needs no disagreement notice. Ineligible search results also report distance from the pin to the nearest raw buffer edge (7150 Ragland: 2,013–2,843 ft).

Address search can export a one-page dated determination HTML (`determination-YYYY-MM-DD-<parcelid-or-slug>.html`) from the current result. The record lists geocode label and query, parcel id, municipality (corporation intersect, else geocode locality or unincorporated), query date ET, CAGIS extract 2026-08-25, and DCY / OEDS source dates from `data/facilities/pull_run.json`; the CHECK_LAYERS verdict with HIT marks (state floor plus all city extras, never silently dropped); and distance from the **parcel boundary** (not the geocode point) to the 1,000-ft restriction edge — min polygon-to-polygon distance to facility parcels in local feet, 0 if any host is ≤ 1,000 ft, eligible margin = min host distance − 1,000. Closing hosts, and the nearest almost-closing host when eligible, are named (including extras-only local facilities). Known-limits boilerplate is printed at the bottom: 2,180 leftover (R)(2) pins frozen (ceiling 88.29%, unique-union 44.61%), 12 lease venues reported-not-added, and that a new day care or school changes the answer. Parcel-lookup failure is labeled as a point fallback. This is not official eSORN and not a legal finding.

## Headline percent-closed + legal annotations (2026-08-26)

City-Data registrant pins removed from the map, legend, presets, and repo (`registrants.geojson`, `scripts/parse_citydata_registrants.py`, `data/local_extras/citydata_registrants_unmatched.csv`). Official Ohio eSORN / county sheriff only if wanted later.

`headline.json` recomputes A / B / C / D on the **current** search files (`buffer_edge_state.geojson` + `extras_{city}_simplified.geojson`), same CLASS filter and parcel ∩ search test as `build_address_points.py` / UI `CHECK_LAYERS`. Percent closed under state floor = (A − B) / A. Percent closed under state + ordinance = (A − C) / A. Ordinance increment = D as pp of A. After the HumbleBee Butler-parcel apply, county C = **185,110**.

Eligible ≠ available or affordable. These are habitable addresses legally open under the mapped surfaces, not vacant, listed, or affordable units. Rental listing / asking-price data is not on disk (no MLS, Zillow, or HUD listing feed). CAGIS `RENT_REG_FLAG` is a parcel registration flag, not a listing or price.

`muni_housing.json` A–F was recomputed **2026-08-26** from the same current search files as `headline.json` (`buffer_edge_state.geojson` + `extras_{city}_simplified.geojson`). Both panels share one A/B/C/D vintage. E/F are the 150-ft values for continuity only; E was tested at 100/150/200 ft and is **not** a quoteable metric (county 369/1,843/7,035; Norwood 114/412/566; Reading 53/277/487). See `data/analytics/ITEM_E_THRESHOLDS.md`.

Class A after parcel-extend is **43** (was 10,817). Residual is geocode offset / extras clip, not a builder miss.

(R)(2) leftover error bound (frozen, no new parcels): state-closed is 38.58% confirmed, ceiling 88.29%, best estimate 44.61%. Do not ship 54.18% (overlapping-sum scale, withdrawn). See `data/analytics/R2_ERROR_BOUND.md`, `data/analytics/R2_UNIQUE_ESTIMATE.md`, and `data/analytics/ACCEPTANCE_FREEZE.md`.

Cincinnati extras already match Ch. 763 (53 hosts). CSV source-list notes only: official Sayler Park Rec is 6720 Home City Ave vs mapped host 6607 Hillside Ave (parcel `016600040008`; Dickman Pool is 6720 Home City / `016600040130`). Lindner YMCA (1425 Linn) and Western & Southern BGC (1205 Dewey) added to the CSV; they were already mapped. No extras rebuild.

Rerun headlines: `.venv/bin/python scripts/build_headline.py`

