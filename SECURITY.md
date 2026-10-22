# Security

beutler.nl is a static site (Astro, GitHub Pages): no server, no database, no logins, no cookies.

## Reporting a problem

Please use **[Report a vulnerability](https://github.com/biacz/beutler.nl/security/advisories/new)**
(private, only visible to me) or email the address in the [Impressum](https://www.beutler.nl/impressum/).
Please don't open a public issue for security problems.

## What runs automatically

- **CodeQL** (SAST) on every push and pull request, and weekly
- **zizmor**: checks the GitHub Actions workflows themselves
- **OpenSSF Scorecard**: supply-chain practices
- **Dependabot**: security alerts and weekly update pull requests; **dependency review** on pull requests
- **Secret scanning** with push protection
- **ZAP baseline scan** (DAST): on every pull request against the built site, weekly against the live site
- **Content Security Policy** on every page: only this domain may load scripts, styles, fonts and images
