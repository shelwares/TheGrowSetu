# Data Breach Notification Plan

**TheGrowSetu | Last Updated: 26 Sept 2026**

## Purpose
This document outlines the procedure for detecting, responding to, and notifying authorities and users in case of a personal data breach, as required by the Digital Personal Data Protection Act, 2023 (DPDP Act).

## 1. Detection

### Monitoring Sources
- Supabase Database Logs (auth events, RLS violations)
- Vercel Runtime Logs (unusual errors, 5xx spikes)
- Upstash Redis (rate limit violations)
- User reports (support@thegrowsetu.com)
- Third-party reports (security researchers, breach databases)

### Detection Triggers
- Unauthorized database access
- RLS policy bypass
- Service role key exposure
- Account takeover attempts
- Unusual login patterns

## 2. Assessment

Within **24 hours** of detection:
1. Identify what data was affected (PII, orders, credentials)
2. Determine number of users affected
3. Assess risk severity (low / medium / high / critical)
4. Document the incident in a private log

## 3. Containment

Immediate actions:
1. Revoke compromised API keys (Supabase anon/service, Upstash token)
2. Rotate database passwords
3. Force logout all users (Supabase Auth)
4. Block suspicious IPs
5. Take affected services offline if necessary

## 4. Notification Timeline

### Data Protection Board of India (DPB)
- **Within 72 hours** of confirmed breach
- Include: nature of breach, affected users count, potential impact, remediation steps

### Affected Users
- **Without undue delay** (typically within 7 days)
- Via email + platform notification
- Include: what happened, what data affected, what we're doing, what they should do

### Public Disclosure
- If breach affects > 10,000 users: public statement on website + social media

## 5. Notification Content

Every user notification must include:
- Date and time of breach discovery
- Type of personal data affected
- Likely consequences
- Measures taken by TheGrowSetu
- Steps users should take (e.g., change password)
- Contact: dpo@thegrowsetu.com

## 6. Post-Incident Review

Within **30 days**:
1. Root cause analysis
2. Update security controls
3. Document lessons learned
4. Update this plan if necessary
5. Report to DPO

## 7. Roles & Responsibilities

| Role | Responsibility |
|------|---------------|
| **Founder/Admin** | Overall incident command |
| **Grievance Officer** | DPB communication |
| **Technical Lead** | Containment & remediation |
| **Support** | User communication |

## 8. Contact Information

- **Grievance Officer:** dpo@thegrowsetu.com
- **Support:** support@thegrowsetu.com
- **Emergency:** [Your Phone Number]

## 9. Review Schedule

This plan must be reviewed:
- **Quarterly** (routine)
- **After any incident**
- **When regulations change**

---

**Last Review:** 26 Sept 2026
**Next Review:** 26 Dec 2026
