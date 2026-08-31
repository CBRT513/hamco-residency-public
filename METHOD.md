# How we measured

Extract date: 2026-08-25. Distances use local feet. The zone is 1,000 feet from the lot line.

This page answers where a covered person may newly set up a home. It does not say who is in violation today. It is a map overlay, not a court finding.

Every calculation on this map is deliberately over-inclusive. The map has no individual information about the person who would live at the address. It applies the broadest version of each restriction. Where two readings are defensible, it restricts more.

## What we did not do

- Did not send an address to a third-party geocoder.
- Did not keep a server-side search log.
- Did not invent Kentucky or Indiana child care.
- Did not invent missing parks.
- Did not treat CRC sports complexes as Cincinnati rec centers. Schmidt Recreation Complex is the East End example.
- Did not treat school-age child care as decided.
- Did not add the 12 rented school sites as protected lots.
- Did not map official Ohio eSORN or sheriff registrant homes.

## What this map does not account for

Specifically the map does NOT account for:

### A person's tier

The map does not account for a person's tier.

None of Hamilton County's five ordinances are tier-limited. Norwood covers Tiers I–III. Reading and Evendale cover all R.C. 2950.04 registrants. Tier can matter elsewhere in Ohio; it does not change any of the five Hamilton County ordinances.

### The conviction date, and when the person began living there

The map does not account for the conviction date or when the person began living at the address.

Cincinnati § 2 (Ord. No. 0005-2007) covers a person who set up a home in a barred area before March 11, 2007, until that person moves. Reading and Golf Manor both protect pre-existing leases of more than 30 days.

### Retroactivity

Hyle v. Porter (2008) is statewide and applies here. The state residency rule is not retroactive if the person bought the home and the offense happened before July 31, 2003.

### Pre-2008 classification

The map does not account for how a person was classified before 2008. *State v. Williams* (2011) addressed pre-2008 classification. This map does not apply that case to any person.

## What the law covers

R.C. 2950.034 bars occupying a home within 1,000 feet of school premises, preschool or child-care-center premises, children crisis-care facilities, and residential infant-care centers.

The premises include the real lot the place sits on. Zones start at that lot, not a geocoded point and not a building footprint.

We treat the home as the whole lot. That is a choice, not a settled-law claim; see Where we chose the stricter reading. R.C. 2950.01(T) is the current code cite for that definition; in the 2006 code it was 2950.01(W).

School premises follow R.C. 2950.01 via the OEDS school-building directory joined to CAGIS lots. A school here is Ohio-limited.

Ohio also counts a school-owned or leased lot if instruction, sports, or training actually happen there. Confirmed athletic lots are already inside the published 38.58 percent state-closed figure (117,997 of 305,868). Leftover untagged owner lots are frozen: 38.58 percent confirmed, ceiling 88.29 percent, best estimate 44.61 percent. The 12 rented school sites stay reported, not added.

Inclusion is by license type, never zoning. Licensed child care center and preschool: yes. School-age child care: flagged only; not in the main surface. Type A/B family child care, in-home aide, day camp: no. Church- or school-attached centers are not dropped. Crisis and residential infant care: 0 in Hamilton County on the 4/22/2025 list.

## Condo lots and apartment lots

R.C. 5311.11 makes each condo unit a separate parcel. That is the narrower argument: buffer from the unit lot. An apartment complex is one parcel. A rental-to-condo conversion would shrink a unit-parcel buffer without any physical change to the building.

We do not use the inner unit parcel. We buffer from the whole development parcel because that is the stricter, over-inclusive reading. No Ohio court has decided which is right.

## Where we chose the stricter reading

- Distance is property line to property line, not building to building. No Ohio court has decided. The statute uses parcel language for schools and building-and-grounds language for residences. We use the broader one.
- For condominiums, we buffer from the whole development parcel, not the individual unit parcel — even though R.C. 5311.11 makes each unit its own parcel and is a real argument for the narrower rule.
- We assume every licensed preschool and child care center displays the signage R.C. 2950.034(C)(5) requires. Unsigned facilities may not create a restriction at all.
- Where an ordinance does not define “residential premises,” we apply the broader parcel-based reading rather than the narrower building-based one.

## Why the bias runs this way

An address wrongly shown as restricted costs a housing option. An address wrongly shown as open can lead to a court order to vacate it. R.C. 2950.034(B) lets any property owner within 1,000 feet bring that action.

So the map errs toward restricted. If it shows restricted and an exception may apply, that is worth taking to a lawyer. Several of them are strong.

## How we found each place

Order: lot id or normalized street match onto CAGIS address points, then the lot polygon; then a known point joined in space; then a counted 1,000-foot point-zone fallback. Empty lot shapes skipped: 225. Unmatched facilities: 4 (Butler County sites far outside the line).

### Child care

Main surface uses Open only. Hamilton rows 1224. Dropped Inactive 105. Dropped Enforcement 6. Open included (center + preschool) 551. Open school-age (flagged, not in main) 9.

### Schools

Inventory is OEDS (387 Hamilton rows, 310 unique IRNs). CAGIS Schools (304 points) is a location aid. Border schools in Butler, Warren, and Clermont: 255 mailing addresses checked; 0 fall within 1,000 feet of the county line. Kentucky and Indiana school lists were not on disk and were not invented.

School zones are larger than perfect 1,000-foot circles because they start from the lot, not a point.

## Housing counts

Headline is housing units (address points on housing lots). County universe A = 305,868.

- State law: 38.58 percent inside 1,000 feet (117,997 homes).
- State law plus city rules: 40.71 percent (124,511 homes).
- Leftover school-owned lots: 38.58 percent confirmed, 88.29 percent ceiling, 44.61 percent best estimate.

## City rules

Cincinnati, Norwood, Reading, Golf Manor, and Evendale add parks, pools, libraries, or rec centers. Those zones stop at that city line. State-law places are not grown a second time.

Cincinnati Ch. 763-5 extras came from the CRC Recreation Center directory (22 centers) and the aquatics list (24 public swimming pools; spraygrounds out), plus in-city YMCA and Boys and Girls Club sites. Not every park, and not the broader CRC Playground, Sports Field, or Boat Ramp lists. A sports complex is not a recreation center under Ch. 763-5. Schmidt Recreation Complex is unshaded for that reason. CRC files it as a playground (Schmidt Sports Complex, 250 St. Peters), football (SCHIMDT Sports Complex, 3020 Humbert), soccer, and boat ramp. It is not on the 22 rec-center slugs and is not a pool. Live CRC labels do not contain "Recreation"; that name is vernacular. This is not LeBlond Rec Center/Pool at 2335 Riverside, which is already mapped. 2501 Riverside is St. Rose Rec Area / church and is also not a 763 extra. About 153 other CRC broader-directory sites are out the same way; 89 of those CRC labels say Recreation Area or Recreation Complex. The site is city-owned and CRC-operated. No district home or practice listing was found, and CRC's "CPS Free" permit fee class is not a Schmidt school lease, so it was not added to the state floor.

Norwood 533.14 maps libraries, city parks, city pools, and the community / rec centers. Schools and state-licensed day cares stay on the state floor.

## Sources and dates

- CAGIS extract: 2026-08-25
- DCY child care pull: 2026-08-25 08:00:10 ET
- OEDS pull: 2026-08-25 08:00:21 ET (generated 8/25/2026 8:00:28 AM)
- Commit: e9e4a415be90c5b4e2426d1655d28cc338b31afd

On this public site, a lookup measures lot line to lot line in the browser from data/facilities.geojson and the lot shard for that ZIP.
