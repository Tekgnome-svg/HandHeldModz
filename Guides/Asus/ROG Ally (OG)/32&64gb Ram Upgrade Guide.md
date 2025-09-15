# ASUS ROG Ally RAM Upgrade Guide

> ⚠️ **Disclaimer:** By following this guide, you take full responsibility for your own actions.  
> This is a very advanced mod with significant risks. Warranty will be voided, and improper handling may permanently damage your motherboard.  

---

## Credits

- **Beardymcgee** – 32GB Spearhead, photos, DIY steps  
- **Sinister-Dom** – 64GB Spearhead, parts, & testing  
- **95Jake** – APCB block modifications  
- **e1000** – BIOS dumps, testing, pictures, & 64GB APCB  

---

## DIY Notes / Warnings

- Remove **BitLocker** from your SSD and **disable Secure Boot** before starting.  
- BIOS modifications are required for anything above 16GB to be usable.  
- The Ally uses **4 x 315 FPGA pin memory modules**; you need 4 modules.  
- Check with your seller before ordering **7500MT RAM** to ensure the correct part.  
- Successful upgrades so far: Samsung MGCP → Samsung K9 MGCT.  
- **Warranty will be voided.**  
- May require **BGA reballing** if RAM fails first time.  
- Could **permanently damage motherboard** if handled incorrectly.  
- Micron straps require moving a strap resistor for different APCB.  
- This is **very advanced**; if overwhelmed, consider a professional service.  

---

## Materials Needed

**Memory Modules (choose one):**

- 32GB 7500MT Samsung: `K3KL3L30CM-MGCT` or `K3KL9L90CM-MGCT`  
- 32GB 7500MT Micron: `MT62F2G32D4DS-023 WT:B`  
- 64GB 7500MT Samsung: `K3KLALA0CM-MGCT`  
- 64GB 7500MT Micron: `MT62F4G32D8DV-026 WT`  

**Tools & Equipment:**

- BIOS flash tool (CH341A USB programmer)  
- WSON8 flash tool cable ([Aliexpress Link](https://www.aliexpress.com/item/4000971113716.html))  
- #10 Phillips screwdriver  
- Plastic pry tool  
- Access to soldering station / reball station (if needed)  
- Reball stencil for 70x70mm, T=0.15mm ([Aliexpress Link](https://a.aliexpress.com/_m00rF6I))  

**APCB Files:**

- 32GB APCB 7500: `334apcb_32_7500_checksumfixed` [Download]  
- 64GB APCB 7500: `337_APCB_64_7500_v2_checksumfixed` [Download]  

**Software Needed:**

- NeoProgrammer (to dump BIOS)  
- imhex (Windows/Linux/Mac – to modify APCB for BIOS recognition)  

---

## Upgrade Instructions

### Step 1: Prepare the Ally

- Remove BitLocker and disable Secure Boot.  
- Disassemble the Ally down to the **mainboard**.  
- Disconnect the battery and plug in a **USB-C cable**.  

---

### Step 2: Remove Old RAM

- Remove the existing RAM modules carefully.  
- Ensure all four module slots are clean and ready.  

> ⚠️ Chips are pre-balled, but mishandling may damage them.

---

### Step 3: Install New RAM

- Insert new memory modules into the four slots.  
- Confirm proper orientation and alignment.  
- Reassemble the mainboard temporarily for BIOS flashing.  

---

### Step 4: BIOS Dump & Backup

- Connect the **CH341A programmer** with WSON8 cable to the BIOS chip.  
- Use **NeoProgrammer** to dump BIOS.  
- **Backup your BIOS**; do not share (contains keys & serial numbers).  

---

### Step 5: Modify BIOS

- Make a **copy** of the BIOS dump.  
- Use **imhex** to insert the correct APCB bin file for your upgrade.  
- Flash modified BIOS with CH341A:  
  - Ensure a **steady hand** and quiet environment.  
  - Run `detect` before flashing.  
  - Flashing may take ~3 minutes.  

> ⚠️ This is the most critical step. Mistakes may brick your Ally.

---

### Step 6: Reassemble & Test

- Reassemble the Ally completely.  
- Power on and check BIOS for RAM recognition.  
- Secure Boot warning or CPU error may appear; ensure Secure Boot is disabled.  
- If RAM is not recognized, reballing may be required.  

---

### Step 7: Optional Professional Upgrade

- If DIY is too risky, take modules to a **professional laptop/console repair service** (~$60–80 USD / 110 AUD).  
- Pre-balled chips are ready to go.  

---

## References & Files

- [CH341A USB Programmer Cable](https://www.aliexpress.com/item/4000971113716.html)  
- [Reball Stencil 70x70mm T=0.15mm](https://a.aliexpress.com/_m00rF6I)  
- [How to Edit BIOS PDF](how_to_bios_edit_Download)  
- APCB files as listed above  

---

## Tips & Warnings

- Double-check part numbers before ordering.  
- Take your time; this is a **high-risk modification**.  
- Always backup original BIOS.  
- Ensure Secure Boot is off before flashing.
