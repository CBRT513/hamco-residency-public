# hamco public release 2026-10-21

This is a **one-way pinned export** of the Hamilton County residency-restriction map
for a new public site. The public repo must **not write back** into
`cbrt513/hamco-residency-gis`.

Pinned sandbox commit: `915c92b73ed18a6a8362ae29b37850e5a8be3aa9`.

CAGIS extract **2026-08-25**. DCY Ohio_Daycares_view **2026-08-25 08:00:10 ET**.
OEDS **2026-08-25 08:00:21 ET** (generated 8/25/2026 8:00:28 AM).
Buffer **1,000 ft**. Public geometries are **WGS84**.

County headline (habitable addresses): A = 305,868; closed under state = **39.474%**;
closed under state + ordinance = **41.622%**; unique-union best estimate **44.65%**;
overlapping-sum ceiling **71.77%** (bounds method `open_address`). 2,180 leftover (R)(2) owner pins remain untested.

Condo units and PUD pads are measured from the whole development (every unit
pad plus the common area). Each parcel shard holds a development's footprint
once (`devid`, `name`, `n`); member parcels carry `dev`. Source data are still
as of **2026-08-25**.
12 lease venues were reported and not added.

## Files

| path | what |
|---|---|
| `manifest.json` | release pin, dates, headline, file list |
| `CHECK.json` | acceptance counts (n_untested must be 2180) |
| `addresses/` | all CAGIS address points, sharded by ZIP (street first letter if ZIP missing). Compact records `a,c,z,pid,lon,lat`. `index.json`, `streets.json` (street token → shard ids), `cities.json` / `zips.json` for out-of-county detection |
| `parcels/` | simplified parcel polygons (same shard keys). Every parcel in the address index, plus facility hosts and the 2,180 untested pins. Properties `pid` (and `dev` for condo / PUD members), plus one footprint feature per development (`devid`, `name`, `n`) |
| `facilities.geojson` | slim hosts: name, type, parcelid, law. Parcel polygon. WGS84 |
| `untested_r2.geojson` | the 2,180 leftover owner pins (parcelid, owner, address, municipality, score, acres) |
| `county.geojson` | Hamilton County boundary |
| `corps.geojson` | Cincinnati, Norwood, Reading, Golf Manor, Evendale (which city ordinance applies) |
| `docs/headline.json` | frozen headline (copy, not edited) |
| `docs/R2_LEASE_CANDIDATES.md` | the 12 lease venues (copy, not edited) |
| `docs/lease-12.json` | slim machine list of those 12 venues |
| `surfaces/` | frozen snapshot of `restricted_state_simplified.geojson` plus the five `extras_*_simplified.geojson` and `delta_*_habitable.geojson`. Public lookup computes from facilities; these are the versioned snapshot |

## Reconstruction

Leftover 2,180 was rebuilt the same way as sandbox `scripts/r2_error_bound.py`:
CSV activity is stale; post-cut tags come from the Top 150 table in
`R2_RESIDUAL_CUT.md` plus the four priority aerials. Remaining untagged =
score>0 AND reconstructed activity in {unknown, ambiguous}.

## One-way

Scripts live only under `/workspace/hamco-public-release/scripts/`.
Nothing in this export is written back to the sandbox.
