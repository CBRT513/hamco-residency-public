/* Hamilton County home-distance lookup. Runs only in the browser. */
(function () {
  "use strict";

  var FT_PER_DEG_LAT = 364567.2;
  var LIMIT_FT = 1000;
  var SITE_PLACEHOLDER = "https://YOUR-SITE.example";
  var GATE_KEY = "hamco-gate-remember";
  var GATE_KEY_OLD = "hamco-gate-ok";
  var gateOkMemory = false;

  var SUFFIX = {
    AVENUE: "AVE", AVE: "AVE",
    ROAD: "RD", RD: "RD",
    STREET: "ST", ST: "ST",
    DRIVE: "DR", DR: "DR",
    LANE: "LN", LN: "LN",
    COURT: "CT", CT: "CT",
    PLACE: "PL", PL: "PL",
    BOULEVARD: "BLVD", BLVD: "BLVD",
    TERRACE: "TER", TER: "TER", PARKWAY: "PKWY", PKWY: "PKWY",
    CIRCLE: "CIR", CIR: "CIR", HIGHWAY: "HWY", HWY: "HWY",
    PIKE: "PIKE", WAY: "WAY", TRAIL: "TRL", TRL: "TRL",
    SQUARE: "SQ", SQ: "SQ"
  };
  var DIR = { NORTH: "N", SOUTH: "S", EAST: "E", WEST: "W" };
  var OUT_CITIES = {
    COVINGTON: 1, NEWPORT: 1, COLUMBUS: 1, "FORT THOMAS": 1, BELLEVUE: 1,
    LUDLOW: 1, ERLANGER: 1, "FORT MITCHELL": 1, LAWRENCEBURG: 1, AURORA: 1,
    HAMILTON: 1, MIDDLETOWN: 1, MASON: 1, LEBANON: 1, BATAVIA: 1,
    "WEST CHESTER": 1, DAYTON: 1
  };
  var OUT_ZIPS = {
    "41011": 1, "41014": 1, "41016": 1, "41017": 1, "41018": 1,
    "41071": 1, "41073": 1, "41074": 1, "41075": 1, "41076": 1,
    "43201": 1, "43215": 1, "43206": 1, "47001": 1, "47025": 1
  };

  var mem = {};
  var boot = { manifest: null, zips: null, cities: null, streets: null };
  var bootReady = null;
  var searchGen = 0;
  var mapObj = null;
  var lastModel = null;
  var CHOICE_CAP = 20;

  function $(id) { return document.getElementById(id); }

  function getJSON(url) {
    if (mem[url]) return mem[url];
    mem[url] = fetch(url).then(function (r) {
      if (!r.ok) throw new Error("missing " + url);
      return r.json();
    });
    return mem[url];
  }

  function fold(s) {
    return String(s || "")
      .toUpperCase()
      .replace(/[.'#,;:()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function canonTokens(parts) {
    var out = [];
    for (var i = 0; i < parts.length; i++) {
      var t = parts[i];
      if (DIR[t]) out.push(DIR[t]);
      else if (SUFFIX[t]) out.push(SUFFIX[t]);
      else out.push(t);
    }
    return out.join(" ");
  }

  function hasSuffix(street) {
    var bits = street.split(" ");
    return !!SUFFIX[bits[bits.length - 1]];
  }

  function parseQuery(raw) {
    var q = fold(raw);
    var state = "";
    var zip = "";
    var city = "";
    var m = q.match(/\b(\d{5})(?:-\d{4})?$/);
    if (m) {
      zip = m[1];
      q = q.slice(0, m.index).replace(/[,\s]+$/, "");
    }
    m = q.match(/\b(OH|KY|IN|OHIO|KENTUCKY|INDIANA)$/);
    if (m) {
      state = m[1];
      if (state === "OHIO") state = "OH";
      if (state === "KENTUCKY") state = "KY";
      if (state === "INDIANA") state = "IN";
      q = q.slice(0, m.index).replace(/[,\s]+$/, "");
    }
    var ham = (boot.cities && boot.cities.hamilton) || [];
    var hamU = {};
    for (var i = 0; i < ham.length; i++) hamU[ham[i]] = 1;
    var cityNames = ham.slice().sort(function (a, b) { return b.length - a.length; });
    var extra = ["COVINGTON", "NEWPORT", "COLUMBUS", "FORT THOMAS", "BELLEVUE",
      "LAWRENCEBURG", "ERLANGER", "HAMILTON", "MASON", "LEBANON"];
    var allCities = cityNames.concat(extra);
    for (var c = 0; c < allCities.length; c++) {
      var name = allCities[c];
      if (q.length >= name.length && q.slice(-name.length) === name) {
        var before = q.slice(0, q.length - name.length);
        if (before === "" || /[,\s]$/.test(before)) {
          var leftover = before.replace(/[,\s]+$/, "");
          var leftoverBits = leftover.split(" ").filter(Boolean);
          var onlyHouseNum = leftoverBits.length === 1 && /^\d+[A-Z]?$/.test(leftoverBits[0]);
          /* House + city-named stem (5282 montgomery) must stay a street, not a city. */
          if (onlyHouseNum) continue;
          city = name;
          q = leftover;
          break;
        }
      }
    }
    var bits = q.split(" ").filter(Boolean);
    var num = "";
    if (bits.length && /^\d+[A-Z]?$/.test(bits[0])) {
      num = bits.shift();
    }
    var street = canonTokens(bits);
    return { num: num, street: street, city: city, zip: zip, state: state, raw: raw };
  }

  function isHamZip(z) {
    var list = (boot.zips && boot.zips.hamilton) || [];
    return list.indexOf(z) !== -1;
  }
  function isHamCity(c) {
    var list = (boot.cities && boot.cities.hamilton) || [];
    return list.indexOf(c) !== -1;
  }

  function outsideHint(p) {
    if (p.state === "KY" || p.state === "IN") return true;
    if (p.zip && (OUT_ZIPS[p.zip] || !isHamZip(p.zip) && /^(410|432|470)/.test(p.zip))) return true;
    if (p.city && (OUT_CITIES[p.city] || (p.city && !isHamCity(p.city) && (p.state === "KY" || p.state === "IN")))) return true;
    if (p.city && OUT_CITIES[p.city]) return true;
    if (p.zip && !isHamZip(p.zip) && p.city && !isHamCity(p.city) && p.city) return true;
    return false;
  }

  function streetIndexKeys(street) {
    var keys = [];
    if (!street || !boot.streets) return keys;
    if (boot.streets[street]) keys.push(street);
    if (!hasSuffix(street)) {
      var tryS = ["ST", "AVE", "RD", "DR", "LN", "CT", "PL", "BLVD", "PKWY", "PIKE",
        "TER", "CIR", "HWY", "WAY", "TRL", "SQ"];
      for (var i = 0; i < tryS.length; i++) {
        var k = street + " " + tryS[i];
        if (boot.streets[k]) keys.push(k);
      }
    }
    if (keys.length === 0) {
      var pref = street + " ";
      for (var sk in boot.streets) {
        if (sk === street || sk.indexOf(pref) === 0) keys.push(sk);
      }
    }
    return keys;
  }

  function shardsFor(p) {
    var set = {};
    function add(id) { if (id) set[id] = 1; }
    if (p.zip) add(p.zip);
    var keys = streetIndexKeys(p.street);
    for (var j = 0; j < keys.length; j++) {
      var ids = boot.streets[keys[j]] || [];
      for (var n = 0; n < ids.length; n++) add(ids[n]);
    }
    return Object.keys(set);
  }

  function streetOf(a) {
    var bits = fold(a).split(" ");
    if (bits.length && /^\d+[A-Z]?$/.test(bits[0])) bits.shift();
    return canonTokens(bits);
  }
  function numOf(a) {
    var bits = fold(a).split(" ");
    return bits.length && /^\d+[A-Z]?$/.test(bits[0]) ? bits[0] : "";
  }

  function scoreRow(p, row) {
    if (p.num && numOf(row.a) !== p.num) return 0;
    var rs = streetOf(row.a);
    var qs = p.street;
    if (!qs) return 0;
    if (p.city && fold(row.c) !== p.city) return 0;
    if (p.zip && String(row.z) !== p.zip) return 0;
    if (!p.city && row.c && !isHamCity(fold(row.c))) return 0;
    if (rs === qs) return 3;
    if (rs.indexOf(qs + " ") === 0) return 2;
    if (qs.indexOf(rs + " ") === 0) return 2;
    return 0;
  }

  function kLon(lat) { return FT_PER_DEG_LAT * Math.cos(lat * Math.PI / 180); }
  function toXY(lon, lat, lat0) { return [lon * kLon(lat0), lat * FT_PER_DEG_LAT]; }
  function fromXY(x, y, lat0) { return [x / kLon(lat0), y / FT_PER_DEG_LAT]; }

  function ringsOf(geom) {
    if (!geom) return [];
    var t = geom.type;
    var c = geom.coordinates;
    if (t === "Polygon") return [c[0]];
    if (t === "MultiPolygon") {
      var out = [];
      for (var i = 0; i < c.length; i++) out.push(c[i][0]);
      return out;
    }
    if (t === "Point") {
      var d = 0.00001;
      var x = c[0], y = c[1];
      return [[[x - d, y - d], [x + d, y - d], [x + d, y + d], [x - d, y + d], [x - d, y - d]]];
    }
    return [];
  }

  function pointInRing(pt, ring) {
    var x = pt[0], y = pt[1], inside = false;
    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      var xi = ring[i][0], yi = ring[i][1];
      var xj = ring[j][0], yj = ring[j][1];
      var hit = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-12) + xi);
      if (hit) inside = !inside;
    }
    return inside;
  }

  function segsCross(a, b, c, d) {
    function ccw(p, q, r) {
      return (r[1] - p[1]) * (q[0] - p[0]) > (q[1] - p[1]) * (r[0] - p[0]);
    }
    return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
  }

  function ringsTouch(A, B) {
    var i, j;
    for (i = 0; i < A.length - 1; i++) if (pointInRing(A[i], B)) return true;
    for (i = 0; i < B.length - 1; i++) if (pointInRing(B[i], A)) return true;
    for (i = 0; i < A.length - 1; i++) {
      for (j = 0; j < B.length - 1; j++) {
        if (segsCross(A[i], A[i + 1], B[j], B[j + 1])) return true;
      }
    }
    return false;
  }

  function closeOnSeg(p, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var len2 = dx * dx + dy * dy;
    var t = 0;
    if (len2 > 0) t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2;
    if (t < 0) t = 0;
    if (t > 1) t = 1;
    var q = [a[0] + t * dx, a[1] + t * dy];
    var d = Math.hypot(p[0] - q[0], p[1] - q[1]);
    return { d: d, q: q };
  }

  function minPair(A, B) {
    var best = { d: Infinity, pa: A[0], pb: B[0] };
    function walk(P, Q) {
      for (var i = 0; i < P.length; i++) {
        for (var j = 0; j < Q.length - 1; j++) {
          var r = closeOnSeg(P[i], Q[j], Q[j + 1]);
          if (r.d < best.d) best = { d: r.d, pa: P[i], pb: r.q };
        }
      }
    }
    walk(A, B);
    walk(B, A);
    return best;
  }

  function geomDist(gA, gB, lat0) {
    var rA = ringsOf(gA), rB = ringsOf(gB);
    var best = { d: Infinity, a: null, b: null };
    for (var i = 0; i < rA.length; i++) {
      for (var j = 0; j < rB.length; j++) {
        var A = rA[i], B = rB[j];
        if (ringsTouch(A, B)) return { d: 0, a: A[0], b: B[0] };
        var xyA = A.map(function (p) { return toXY(p[0], p[1], lat0); });
        var xyB = B.map(function (p) { return toXY(p[0], p[1], lat0); });
        var pair = minPair(xyA, xyB);
        if (pair.d < best.d) {
          best = {
            d: pair.d,
            a: fromXY(pair.pa[0], pair.pa[1], lat0),
            b: fromXY(pair.pb[0], pair.pb[1], lat0)
          };
        }
      }
    }
    return best;
  }

  function bboxOf(geom) {
    var rings = ringsOf(geom);
    var minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
    for (var i = 0; i < rings.length; i++) {
      for (var j = 0; j < rings[i].length; j++) {
        var p = rings[i][j];
        if (p[0] < minx) minx = p[0];
        if (p[1] < miny) miny = p[1];
        if (p[0] > maxx) maxx = p[0];
        if (p[1] > maxy) maxy = p[1];
      }
    }
    return [minx, miny, maxx, maxy];
  }

  function expandBBox(b, ft, lat0) {
    var dx = ft / kLon(lat0);
    var dy = ft / FT_PER_DEG_LAT;
    return [b[0] - dx, b[1] - dy, b[2] + dx, b[3] + dy];
  }

  function bboxHit(a, b) {
    return a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];
  }

  function hull(pts) {
    var p = pts.slice().sort(function (u, v) {
      return u[0] === v[0] ? u[1] - v[1] : u[0] - v[0];
    });
    function cross(o, a, b) {
      return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    }
    var lower = [];
    for (var i = 0; i < p.length; i++) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p[i]) <= 0) lower.pop();
      lower.push(p[i]);
    }
    var upper = [];
    for (var k = p.length - 1; k >= 0; k--) {
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p[k]) <= 0) upper.pop();
      upper.push(p[k]);
    }
    lower.pop();
    upper.pop();
    return lower.concat(upper);
  }

  function bufferRing(ring, ft, lat0) {
    var pts = [];
    var n = 12;
    for (var i = 0; i < ring.length - 1; i++) {
      for (var s = 0; s < n; s++) {
        var ang = (s / n) * Math.PI * 2;
        var east = Math.cos(ang) * ft;
        var north = Math.sin(ang) * ft;
        var xy = toXY(ring[i][0], ring[i][1], lat0);
        pts.push(fromXY(xy[0] + east, xy[1] + north, lat0));
      }
    }
    var h = hull(pts);
    if (h.length) h.push(h[0]);
    return h;
  }

  function standInLot(lon, lat, lat0) {
    var w = 50, h = 140;
    var sw = fromXY(toXY(lon, lat, lat0)[0] - w / 2, toXY(lon, lat, lat0)[1] - h / 2, lat0);
    var se = fromXY(toXY(lon, lat, lat0)[0] + w / 2, toXY(lon, lat, lat0)[1] - h / 2, lat0);
    var ne = fromXY(toXY(lon, lat, lat0)[0] + w / 2, toXY(lon, lat, lat0)[1] + h / 2, lat0);
    var nw = fromXY(toXY(lon, lat, lat0)[0] - w / 2, toXY(lon, lat, lat0)[1] + h / 2, lat0);
    return { type: "Polygon", coordinates: [[sw, se, ne, nw, sw]] };
  }

  function lawFits(law, city) {
    var L = String(law || "").toUpperCase();
    var C = String(city || "").toUpperCase();
    if (L.indexOf("2950.034") !== -1) return true;
    if (L.indexOf("CINCINNATI") !== -1) return C === "CINCINNATI";
    if (L.indexOf("NORWOOD") !== -1) return C === "NORWOOD";
    if (L.indexOf("READING") !== -1) return C === "READING";
    if (L.indexOf("EVENDALE") !== -1) return C === "EVENDALE";
    if (L.indexOf("GOLF MANOR") !== -1) return C === "GOLF MANOR";
    return true;
  }

  function typeCounts(t) {
    var x = String(t || "").toLowerCase();
    if (x.indexOf("school-age") !== -1) return false;
    return true;
  }

  function findParcel(fc, pid) {
    if (!fc || !fc.features) return null;
    for (var i = 0; i < fc.features.length; i++) {
      if (String(fc.features[i].properties.pid) === String(pid)) return fc.features[i];
    }
    return null;
  }

  function etStamp() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
      year: "numeric", month: "2-digit", day: "2-digit"
    }).format(new Date());
  }

  function fmtFt(n) {
    return Math.round(n).toLocaleString("en-US") + " ft";
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function asOf() {
    var rel = (boot.manifest && boot.manifest.release) || "2026-08-25";
    return "Data current as of " + rel;
  }

  function readRemembered() {
    try {
      return window.localStorage.getItem(GATE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function readGate() {
    return gateOkMemory || readRemembered();
  }

  function acceptGate(remember) {
    gateOkMemory = true;
    try {
      if (remember) window.localStorage.setItem(GATE_KEY, "1");
      window.localStorage.removeItem(GATE_KEY_OLD);
    } catch (e) {}
  }

  function resultLineHTML() {
    return (
      '<p class="result-line">Not a legal clearance. Tier, conviction date, and move-in date are not accounted for — some restrictions shown may not apply. <a href="disclaimer.html">What this means</a></p>'
    );
  }

  function resultLinePlain() {
    return "Not a legal clearance. Tier, conviction date, and move-in date are not accounted for — some restrictions shown may not apply.";
  }

  function blockedHeadline() {
    return "Shown as restricted. Some rules may not apply.";
  }

  function blockedCountLine(n) {
    return "This address is within 1,000 feet of " + n +
      " protected location" + (n === 1 ? "" : "s") + ".";
  }

  function missHTML() {
    return '<p class="err">We couldn\'t find that address. Try adding the city or a street suffix (Rd, Ave, St).</p>';
  }

  function shortFormHTML() {
    return (
      '<section class="short-form">' +
        "<p>This map does not account for a person's tier, conviction date, or move-in date. Several restrictions apply only to certain people. Where the law is unsettled, this map uses the stricter reading.</p>" +
        "<p>This map may show an address as restricted when it is not restricted for that person. If an address matters, that is a question for a lawyer — not for this map.</p>" +
      "</section>"
    );
  }

  function limitsHTML() {
    var n = (boot.manifest && boot.manifest.n_untested_r2) || 2180;
    var lease = (boot.manifest && boot.manifest.n_lease_venues) || 12;
    return (
      '<section class="limits">' +
        "<h3>What we could not check</h3>" +
        "<ul>" +
          "<li>" + n.toLocaleString("en-US") + " leftover school-owned lots that might host instruction, sports, or training. We did not fully test them.</li>" +
          "<li>" + lease + " rented school sites. We listed them and did not add them as protected lots.</li>" +
          "<li>School-age child care is not in the main test.</li>" +
          "<li>Child care in Kentucky or Indiana is not on this map.</li>" +
          "<li>A new school or child care can change this answer.</li>" +
          "<li>Cincinnati, Norwood, Reading, Golf Manor, and Evendale enforce extra city rules themselves.</li>" +
        "</ul>" +
      "</section>"
    );
  }

  function hyleHTML() {
    return (
      '<section class="note">' +
        "<h3>Older homes — Hyle v. Porter</h3>" +
        "<p>A 2008 Ohio Supreme Court case says this rule is not retroactive. It does not apply if the person bought the home and the offense happened before July 31, 2003. A court would have to decide if that fits the case.</p>" +
      "</section>"
    );
  }

  function cincyHTML(city) {
    if (fold(city) !== "CINCINNATI") return "";
    return (
      '<section class="note">' +
        "<h3>Cincinnati older-home rule</h3>" +
        "<p>If a person set up a home in a barred area before March 11, 2007, and has not moved, city ordinance 0005-2007 may still cover that person. This page does not decide that.</p>" +
      "</section>"
    );
  }

  function lineHTML() {
    return (
      '<section class="note">' +
        "<h3>How we measure</h3>" +
        "<p>Ohio law treats the whole lot as the home (R.C. 2950.01). Distance is from one lot line to the other, not from door to door. If any part of this lot is inside 1,000 feet of a protected lot, the whole address is treated as inside.</p>" +
      "</section>"
    );
  }

  function notFoundLegalHTML() {
    return (
      '<section class="note">' +
        "<h3>This is not a court sign-off</h3>" +
        "<p>This is not a court sign-off. It is not a promise from the sheriff or a prosecutor. They can still reach a different result. A new school or child care can change this answer. Talk to a lawyer if you need a decision you can rely on.</p>" +
      "</section>"
    );
  }

  function mapHTML(aria) {
    return (
      '<div class="map-note">' +
        "<h3>Why you aren't seeing an actual map:</h3>" +
        "<p>This drawing is the lots and the 1,000-foot zone. Streets are left off so looking up an address does not send that spot to a mapping company.</p>" +
      "</div>" +
      '<div class="map-wrap" id="map" role="img" aria-label="' + esc(aria) + '"></div>'
    );
  }

  function showOut(html) {
    var box = $("out");
    box.hidden = false;
    box.innerHTML = html;
    box.scrollIntoView({ block: "start" });
  }

  function wipeMap() {
    if (mapObj) {
      mapObj.remove();
      mapObj = null;
    }
  }

  function drawMap(model) {
    wipeMap();
    var el = $("map");
    if (!el || typeof L === "undefined") return;
    mapObj = L.map(el, { zoomControl: true, attributionControl: false });

    var layers = [];
    var lat0 = model.lat0;
    var sub = model.subjectGeom;
    function addBuffer(geom) {
      var rr = ringsOf(geom);
      if (!rr[0]) return;
      var buf = bufferRing(rr[0], LIMIT_FT, lat0);
      layers.push(L.polygon(buf.map(function (p) { return [p[1], p[0]]; }), {
        color: "#7a2e22",
        weight: 1,
        dashArray: "5,5",
        fillColor: "#7a2e22",
        fillOpacity: 0.08
      }).addTo(mapObj));
    }
    (model.blockers || []).forEach(function (b) { addBuffer(b.geometry); });
    if (model.nearest && model.nearest.geometry && !(model.blockers && model.blockers.length)) {
      addBuffer(model.nearest.geometry);
    }

    function addPoly(geom, opt) {
      var rr = ringsOf(geom);
      for (var i = 0; i < rr.length; i++) {
        var latlngs = rr[i].map(function (p) { return [p[1], p[0]]; });
        layers.push(L.polygon(latlngs, opt).addTo(mapObj));
      }
    }

    if (model.nearUntested) {
      addPoly(model.nearUntested.geometry, {
        color: "#5a534c", weight: 2, dashArray: "4,3", fill: false
      });
    }
    (model.blockers || []).forEach(function (b) {
      addPoly(b.geometry, { color: "#7a2e22", weight: 2, fillColor: "#c46a4a", fillOpacity: 0.35 });
    });
    if (model.nearest && model.nearest.geometry && !(model.blockers && model.blockers.length)) {
      addPoly(model.nearest.geometry, { color: "#7a2e22", weight: 2, fillColor: "#c46a4a", fillOpacity: 0.25 });
    }
    addPoly(sub, { color: "#1c1410", weight: 2.5, fillColor: "#ffffff", fillOpacity: 0.35 });

    if (model.lineA && model.lineB) {
      L.polyline([[model.lineA[1], model.lineA[0]], [model.lineB[1], model.lineB[0]]], {
        color: "#1c1410", weight: 3
      }).addTo(mapObj);
    }

    var group = L.featureGroup(layers);
    if (layers.length) mapObj.fitBounds(group.getBounds().pad(0.2));
    else mapObj.setView([model.lat, model.lon], 16);
    setTimeout(function () { mapObj.invalidateSize(); }, 50);
  }

  function saveResult() {
    var model = lastModel;
    if (!model) return;
    var html = printHTML(model);
    var day = etStamp();
    var pid = model.pid || "unknown";
    var blob = new Blob([html], { type: "text/html" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "determination-" + day + "-" + pid + ".html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    var w = window.open("", "_blank");
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
      setTimeout(function () { try { w.print(); } catch (e) {} }, 400);
    }
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }

  function printHTML(model) {
    var day = etStamp();
    var commit = (boot.manifest && boot.manifest.sandbox_commit) || "";
    var url = (location && location.origin && location.origin.indexOf("http") === 0)
      ? location.origin + "/"
      : SITE_PLACEHOLDER;
    var rows = "";
    var i;
    if (model.kind === "blocked") {
      for (i = 0; i < model.blockers.length; i++) {
        var b = model.blockers[i];
        rows += "<tr><td>" + esc(b.name) + "</td><td>" + esc(b.type) + "</td><td>" +
          esc(fmtFt(b.dist)) + "</td><td>" + esc(b.law) + "</td></tr>";
      }
    }
    var body = "";
    if (model.kind === "blocked") {
      body += "<h1>" + esc(blockedHeadline()) + "</h1>";
      body += "<p>" + esc(blockedCountLine(model.blockers.length)) + "</p>";
      body += "<p><strong>" + esc(model.label) + "</strong></p>";
      body += "<p>" + asOf() + "</p>";
      body += "<p>" + esc(resultLinePlain()) + "</p>";
      body += "<div class=\"tbl\"><table><thead><tr><th>Location</th><th>Type</th><th>Distance</th><th>Law</th></tr></thead><tbody>" +
        rows + "</tbody></table></div>";
      body += "<p>Ohio law treats the whole lot as the home (R.C. 2950.01). Distance is from one lot line to the other.</p>";
      body += "<p>Hyle v. Porter (2008): this rule is not retroactive if the person bought the home and the offense happened before July 31, 2003.</p>";
      if (fold(model.city) === "CINCINNATI") {
        body += "<p>Cincinnati older-home rule: a home set up in a barred area before March 11, 2007, may still be covered until the person moves (Ord. 0005-2007).</p>";
      }
    } else {
      body += "<h1>We did not find a protected location within 1,000 feet of this property.</h1>";
      body += "<p><strong>" + esc(model.label) + "</strong></p>";
      body += "<p>" + asOf() + "</p>";
      body += "<p>" + esc(resultLinePlain()) + "</p>";
      if (model.nearest) {
        body += "<p>Nearest protected location: " + esc(model.nearest.name) + " — " + fmtFt(model.nearest.dist) + ".</p>";
      }
      body += "<p>This is not a court sign-off. A prosecutor, sheriff, or judge can still reach a different result.</p>";
      if (model.nearUntested) {
        body += "<p>School-district lot we have not fully checked: " +
          esc(model.nearUntested.owner) + " (parcel " + esc(model.nearUntested.parcelid) +
          "), about " + fmtFt(model.nearUntested.dist) + " away.</p>";
      }
    }
    body += "<p>What we could not check: " +
      ((boot.manifest && boot.manifest.n_untested_r2) || 2180) +
      " leftover school-owned lots; " +
      ((boot.manifest && boot.manifest.n_lease_venues) || 12) +
      " rented school sites; Kentucky or Indiana child care; a new license can change this answer.</p>";
    body += "<p>Lot id " + esc(model.pid) + ". Printed " + day + " ET. Source pin " + esc(commit) + ".</p>";
    body += "<p>Site: " + esc(url) + "</p>";
    return "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\">" +
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" +
      "<title>Determination " +
      esc(day) + "</title><style>@page{size:letter;margin:0.6in}html{-webkit-text-size-adjust:100%;text-size-adjust:100%}body{font:11pt Georgia,serif;color:#000;background:#fff;margin:12px}h1{font-size:14pt}.tbl{overflow-x:auto;-webkit-overflow-scrolling:touch}table{width:100%;border-collapse:collapse}th,td{border-bottom:0.7pt solid #000;text-align:left;padding:4pt;overflow-wrap:break-word}svg{max-width:100%}</style></head><body>" +
      body + "</body></html>";
  }

  function renderChoices(rows, note) {
    var html = '<div class="banner plain"><h2>More than one match</h2><p>Pick the right city.</p>' +
      (note ? "<p>" + esc(note) + "</p>" : "") +
      '<p class="asof">' + asOf() + "</p></div><div class=\"choices\">";
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      html += '<button type="button" data-pick="' + i + '"><strong>' +
        esc(r.a) + "</strong>" + esc(r.c) + ", " + esc(r.z) + "</button>";
    }
    html += "</div>";
    showOut(html);
    var btns = $("out").querySelectorAll("[data-pick]");
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener("click", function (ev) {
        var idx = parseInt(ev.currentTarget.getAttribute("data-pick"), 10);
        finishRow(rows[idx]);
      });
    }
  }

  function renderBlocked(model) {
    var n = model.blockers.length;
    var rows = "";
    for (var i = 0; i < n; i++) {
      var b = model.blockers[i];
      rows += "<tr><td>" + esc(b.name) + "</td><td>" + esc(b.type) +
        "</td><td>" + esc(fmtFt(b.dist)) + "</td><td>" + esc(b.law) + "</td></tr>";
    }
    var html =
      '<div class="banner rust">' +
        "<h2>" + esc(blockedHeadline()) + "</h2>" +
        '<p class="count">' + esc(blockedCountLine(n)) + "</p>" +
        '<p class="asof">' + asOf() + "</p>" +
      "</div>" +
      resultLineHTML() +
      '<p class="addr-line">' + esc(model.label) + "</p>" +
      '<div class="hits-wrap"><table class="hits"><thead><tr><th>Location</th><th>Type</th><th>Distance</th><th>Law</th></tr></thead><tbody>' +
      rows + "</tbody></table></div>" +
      lineHTML() + hyleHTML() + cincyHTML(model.city) +
      mapHTML("Lot outlines and the 1,000-foot zone") +
      '<p class="legend"><span><i class="swatch ink"></i>This lot</span>' +
      '<span><i class="swatch rust"></i>Protected lot</span>' +
      '<span><i class="swatch wash"></i>1,000-foot zone</span>' +
      "<span>Black line = measured nearest edges</span></p>" +
      limitsHTML() +
      '<button type="button" class="save" id="save">Save this result</button>';
    showOut(html);
    $("save").addEventListener("click", saveResult);
    drawMap(model);
  }

  function renderOpen(model) {
    var band = "quiet";
    var bandText = "";
    if (model.nearest && model.nearest.dist < 1200) {
      band = "caution";
      bandText = "This is close to the limit.";
    }
    var near = model.nearest
      ? ("Nearest protected location: " + esc(model.nearest.name) + " — " + fmtFt(model.nearest.dist) + ".")
      : "We could not name a nearest protected location in this extract.";
    var un = "";
    if (model.nearUntested) {
      un = '<div class="banner warn"><p>This property is within 1,000 feet of a school-district lot we have not fully checked: <strong>' +
        esc(model.nearUntested.owner) + "</strong> (parcel " + esc(model.nearUntested.parcelid) +
        "), about " + fmtFt(model.nearUntested.dist) + " away. It might host instruction or sports. We did not count it as a protected location.</p></div>";
    }
    var html =
      '<div class="banner ink">' +
        "<h2>We did not find a protected location within 1,000 feet of this property.</h2>" +
        '<p class="asof">' + asOf() + "</p>" +
      "</div>" +
      resultLineHTML() +
      '<p class="addr-line">' + esc(model.label) + "</p>" +
      "<p>" + near + "</p>" +
      (bandText ? '<p class="margin-box ' + band + '">' + bandText + "</p>" : "") +
      un +
      notFoundLegalHTML() +
      mapHTML("This lot and the nearest protected lot") +
      '<p class="legend"><span><i class="swatch ink"></i>This lot</span>' +
      '<span><i class="swatch rust"></i>Nearest protected lot</span>' +
      '<span><i class="swatch wash"></i>1,000-foot zone</span></p>' +
      limitsHTML() +
      '<button type="button" class="save" id="save">Save this result</button>';
    showOut(html);
    $("save").addEventListener("click", saveResult);
    drawMap(model);
  }

  function measure(row, subjectGeom) {
    var lat0 = row.lat;
    return Promise.all([
      getJSON("data/facilities.geojson"),
      getJSON("data/untested_r2.geojson")
    ]).then(function (pair) {
      var fac = pair[0];
      var unt = pair[1];
      var subB = expandBBox(bboxOf(subjectGeom), 4000, lat0);
      var blockers = [];
      var nearest = null;
      var i, f, d, props;
      for (i = 0; i < fac.features.length; i++) {
        f = fac.features[i];
        props = f.properties || {};
        if (!typeCounts(props.type)) continue;
        if (!lawFits(props.law, row.c)) continue;
        var nearby = bboxHit(subB, bboxOf(f.geometry));
        if (!nearby && nearest && nearest.dist <= 4000) continue;
        d = geomDist(subjectGeom, f.geometry, lat0);
        var rec = {
          name: props.name || "Protected place",
          type: props.type || "",
          law: props.law || "",
          parcelid: props.parcelid || "",
          dist: d.d,
          geometry: f.geometry,
          lineA: d.a,
          lineB: d.b
        };
        if (!nearest || rec.dist < nearest.dist) nearest = rec;
        if (rec.dist <= LIMIT_FT) blockers.push(rec);
      }
      blockers.sort(function (a, b) { return a.dist - b.dist; });
      var nearU = null;
      var uB = expandBBox(bboxOf(subjectGeom), 1200, lat0);
      for (i = 0; i < unt.features.length; i++) {
        f = unt.features[i];
        if (!bboxHit(uB, bboxOf(f.geometry))) continue;
        d = geomDist(subjectGeom, f.geometry, lat0);
        if (d.d <= LIMIT_FT) {
          props = f.properties || {};
          var u = {
            owner: props.owner || "School-district owner",
            parcelid: props.parcelid || "",
            address: props.address || "",
            dist: d.d,
            geometry: f.geometry
          };
          if (!nearU || u.dist < nearU.dist) nearU = u;
        }
      }
      var lineA = null, lineB = null;
      if (blockers.length) {
        lineA = blockers[0].lineA;
        lineB = blockers[0].lineB;
      } else if (nearest) {
        lineA = nearest.lineA;
        lineB = nearest.lineB;
      }
      return {
        blockers: blockers,
        nearest: nearest,
        nearUntested: nearU,
        lineA: lineA,
        lineB: lineB,
        lat0: lat0
      };
    });
  }

  function finishRow(row) {
    showOut("<p>Measuring lot lines…</p>");
    var zip = String(row.z || "");
    var parcelUrl = "data/parcels/" + zip + ".geojson";
    getJSON(parcelUrl).catch(function () { return getJSON("data/parcels/_other.geojson"); })
      .then(function (fc) {
        var feat = findParcel(fc, row.pid);
        var geom = feat ? feat.geometry : standInLot(row.lon, row.lat, row.lat);
        var usedStandIn = !feat;
        return measure(row, geom).then(function (m) {
          var model = {
            kind: m.blockers.length ? "blocked" : "open",
            pid: row.pid,
            city: row.c,
            zip: row.z,
            lon: row.lon,
            lat: row.lat,
            lat0: m.lat0,
            label: row.a + ", " + row.c + " " + row.z,
            subjectGeom: geom,
            usedStandIn: usedStandIn,
            blockers: m.blockers,
            nearest: m.nearest,
            nearUntested: m.nearUntested,
            lineA: m.lineA,
            lineB: m.lineB
          };
          lastModel = model;
          if (model.kind === "blocked") renderBlocked(model);
          else renderOpen(model);
        });
      })
      .catch(function () {
        showOut('<p class="err">We could not load the lot map. Try again.</p>');
      });
  }

  function loadBoot() {
    if (bootReady) return bootReady;
    bootReady = Promise.all([
      getJSON("data/manifest.json"),
      getJSON("data/addresses/zips.json"),
      getJSON("data/addresses/cities.json"),
      getJSON("data/addresses/streets.json")
    ]).then(function (xs) {
      boot.manifest = xs[0];
      boot.zips = xs[1];
      boot.cities = xs[2];
      boot.streets = xs[3];
      return boot;
    }).catch(function (err) {
      bootReady = null;
      throw err;
    });
    return bootReady;
  }

  function bootLoaded() {
    return !!(boot.streets && boot.cities && boot.zips);
  }

  function showOutside() {
    showOut(
      '<div class="banner plain"><h2>That address is outside Hamilton County.</h2>' +
      "<p>This map only covers Hamilton County, Ohio. We will not guess across the river or in another county.</p>" +
      '<p class="asof">' + asOf() + "</p></div>"
    );
  }

  function addrKey(row) {
    return fold(row.a) + "|" + fold(row.c) + "|" + String(row.z || "");
  }

  function distinctAddrCount(rows) {
    var seen = {};
    var n = 0;
    for (var i = 0; i < rows.length; i++) {
      var k = addrKey(rows[i]);
      if (!seen[k]) {
        seen[k] = 1;
        n++;
      }
    }
    return n;
  }

  function search(raw) {
    var gen = ++searchGen;
    if (!bootLoaded()) {
      showOut("<p>Looking up…</p>");
      loadBoot().then(function () {
        if (gen !== searchGen) return;
        runSearch(raw, gen);
      }).catch(function () {
        if (gen !== searchGen) return;
        showOut('<p class="err">We could not load the address list. Try again.</p>');
      });
      return;
    }
    runSearch(raw, gen);
  }

  function runSearch(raw, gen) {
    var p = parseQuery(raw);
    if (!p.num && !p.street) {
      showOut('<p class="err">Type an address.</p>');
      return;
    }
    if (outsideHint(p) && (!p.street || !p.num || p.state === "KY" || p.state === "IN" || (p.zip && !isHamZip(p.zip)) || (p.city && !isHamCity(p.city)))) {
      showOutside();
      return;
    }
    var shards = shardsFor(p);
    if (p.zip && isHamZip(p.zip) && shards.indexOf(p.zip) === -1) shards.push(p.zip);
    if (!shards.length) {
      if ((p.city && !isHamCity(p.city)) || (p.zip && !isHamZip(p.zip))) {
        showOutside();
        return;
      }
      showOut(missHTML());
      return;
    }
    showOut("<p>Looking up…</p>");
    Promise.all(shards.map(function (id) {
      return getJSON("data/addresses/" + id + ".json").catch(function () { return []; });
    })).then(function (lists) {
      if (gen !== searchGen) return;
      var rows = [];
      var seen = {};
      for (var i = 0; i < lists.length; i++) {
        var list = lists[i] || [];
        for (var j = 0; j < list.length; j++) {
          var row = list[j];
          var sc = scoreRow(p, row);
          if (sc >= 2) {
            var key = row.pid + "|" + row.a + "|" + row.c;
            if (!seen[key]) {
              seen[key] = 1;
              rows.push(row);
            }
          }
        }
      }
      if (!rows.length) {
        if ((p.city && !isHamCity(p.city)) || (p.zip && !isHamZip(p.zip)) || p.state === "KY" || p.state === "IN") {
          showOutside();
          return;
        }
        showOut(missHTML());
        return;
      }
      if (rows.length === 1 || distinctAddrCount(rows) === 1) {
        finishRow(rows[0]);
        return;
      }
      var note = "";
      if (p.num && !p.city) {
        if (rows.length > CHOICE_CAP) {
          rows = rows.slice(0, CHOICE_CAP);
          note = "Showing the first " + CHOICE_CAP + ".";
        }
      } else if (rows.length > 8) {
        rows = rows.slice(0, 8);
      }
      renderChoices(rows, note);
    }).catch(function () {
      if (gen !== searchGen) return;
      showOut('<p class="err">We could not load the address list. Try again.</p>');
    });
  }

  var gateBound = false;

  function openGate() {
    var dlg = $("gate");
    if (!dlg) return;
    if (typeof dlg.showModal === "function") {
      if (!dlg.open) dlg.showModal();
    } else {
      dlg.setAttribute("open", "");
    }
  }

  function bindGate() {
    var dlg = $("gate");
    var box = $("gate-ok");
    var remember = $("gate-remember");
    var go = $("gate-go");
    if (!dlg || !box || !go) return true;

    function syncGo() {
      go.disabled = !box.checked;
    }

    if (!gateBound) {
      gateBound = true;
      box.addEventListener("change", syncGo);
      if (remember) remember.addEventListener("change", syncGo);
      dlg.addEventListener("cancel", function (ev) {
        ev.preventDefault();
      });
      dlg.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape") ev.preventDefault();
      });
      go.addEventListener("click", function () {
        if (!box.checked) return;
        acceptGate(!!(remember && remember.checked));
        if (typeof dlg.close === "function") dlg.close();
        else dlg.removeAttribute("open");
        var q = $("q");
        if (q) q.focus();
      });
    }

    syncGo();
    if (readGate()) return true;
    openGate();
    return false;
  }

  function start() {
    loadBoot().catch(function () {
      /* page still accepts a search; it waits for boot or fails softly */
    });

    bindGate();

    var form = $("lookup");
    if (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        if (!readGate()) {
          bindGate();
          return;
        }
        search(($("q") && $("q").value) || "");
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
