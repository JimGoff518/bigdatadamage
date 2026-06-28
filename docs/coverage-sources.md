# Local coverage — official source channels

The allowlist of **official** YouTube channels we search when sourcing local-news
clips for `/locations/[slug]` hubs (see `src/content/coverage.ts`).

## IP rule (non-negotiable)

We never host, download, or re-cut footage. For every clip we:

1. Embed the **station's own official YouTube upload** via the privacy-enhanced
   `nocookie` player, and
2. Link out to the original.

Captions are BigDataDamage's **own words** — never transcript text. Only include a
video if `yt-dlp` metadata confirms it was uploaded by one of the official
channels below (channel name must match).

## Discovery

```
yt-dlp "ytsearch40:<query>" --flat-playlist --print "%(channel)s | %(title)s | %(id)s | %(upload_date)s"
```

Then keep only rows whose `channel` matches an allowlisted station, and verify
each is genuinely about the target county before adding to `coverage.ts`.

## Allowlist

### DFW / North Texas (Hood County · Granbury)

| Station | Channel handle | Notes |
|---|---|---|
| WFAA (ABC 8) | — | In use |
| CBS Texas (KTVT 11) | — | In use |
| NBC 5 / KXAS | [@nbcdfw](https://www.youtube.com/@nbcdfw) | Added 2026-06-28 |
| FOX 4 / KDFW | [@fox4news](https://www.youtube.com/@fox4news) | Added 2026-06-28 |
| Fort Worth Star-Telegram | [@startelegramvideo](https://www.youtube.com/@startelegramvideo) | Print outlet's video channel. Added 2026-06-28 |

### Amarillo / Panhandle (Potter County)

| Station | Channel handle | Notes |
|---|---|---|
| ABC 7 Amarillo (KVII) | — | In use |
| KFDA NewsChannel 10 | — | In use |
| KAMR Local 4 News | — | In use |

### Austin / Central Texas (Hays County · San Marcos)

| Station | Channel handle | Notes |
|---|---|---|
| KVUE (ABC) | — | In use |
| KXAN (NBC) | — | In use |
| KSAT 12 (San Antonio, ABC) | — | In use |
| CBS Austin / KEYE | [@CBSAustin](https://www.youtube.com/@CBSAustin) | In use; formalized 2026-06-28 |

### Houston / Gulf Coast

| Station | Channel handle | Notes |
|---|---|---|
| KHOU 11 (CBS) | [@KHOU](https://www.youtube.com/@KHOU) | Added 2026-06-28; no hub yet |

### Statewide

| Station | Channel handle | Notes |
|---|---|---|
| The Texas Tribune | [@texastribune](https://www.youtube.com/@texastribune) | Nonprofit newsroom. Text is CC BY-NC-ND, but our embed+link-out rule is unchanged. Added 2026-06-28 |

## Out of market — do NOT add

| Proposed | Why excluded |
|---|---|
| KGW NewsChannel 8 ([user/KGWNewschannel8](https://www.youtube.com/user/KGWNewschannel8)) | Portland, Oregon (NBC/Tegna) — not Texas |
