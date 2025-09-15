# ROG Ally – Micro SD Card Fix

> ⚠️ **Disclaimer:** By following this guide, you take full responsibility for your own actions.  
> This fix will **void your warranty** and is an advanced mod.  
> Attempt only if comfortable with soldering and disassembling electronics.  

---

## Overview

This guide addresses the common failure of the Asus Micro SD card reader caused by:

- Slightly undersized PTC fuse  
- Insufficient solder on fuse joints  

Unlike some reports, this issue is **not typically caused by heat**. Reflowing the fuse has restored many dead Micro SD card readers successfully.  

> Note: This guide is under construction. Success is not guaranteed, and the reader may fail again over time. RMA your device if possible before attempting this fix.  

---

## Credit

- **ZuwaiiVR** – Original Reddit post  
- **ΜỮŞĦƗΜΔŞŦ€ŘǤƗŇҜØ** – Pictures and testing  
- **YesItsKira** – Teardown Pictures ([Donate Here](#))  
- **Tekgnome** – Original guide creator  

---

## Materials Needed

- Soldering iron  
- Solder  
- Flux  
- Phillips #100 screwdriver  
- Plastic pry tool  

---

## Notes / Warnings

- This is an **advanced mod**; if unsure, do not attempt  
- BY FOLLOWING THIS GUIDE YOU TAKE RESPONSIBILITY FOR YOUR OWN ACTIONS  
- This **will void your warranty**  
- Success is not guaranteed; the issue may reoccur  

---

## Instructions

### Step 1: Disassemble the Ally

1. Remove the **back panel** and unplug the battery  
2. Remove the **6 screws** holding the battery and remove it  
3. Remove both **joystick boards**  
   - Disconnect **3 ribbon cables**  
   - Remove **4 screws**  

### Step 2: Remove the Motherboard

1. Unplug **speaker cable**  
2. Unplug **fan headers** and remove fan screws  
3. Remove **fans**  
4. Unplug **2 cables from wireless card**  
5. Remove **both motherboard ribbon cables**  
6. Remove all **9 motherboard screws**  
7. Tilt and lift the motherboard out of the shell  

### Step 3: Reflow the PTC Fuse

- The fuse is closest to the **Genesys Logic Controller** on the back of the mainboard  
- Fuse part: **Littelfuse 0805L075SL**  

1. Resolder **both sides of the fuse** carefully  
2. Do **not bridge** the solder across the fuse  
3. Compare solder amounts before and after to ensure proper connection  

> Placeholder for before/after images:  
> `![Before reflow](images/fuse_before.jpg)`  
> `![After reflow](images/fuse_after.jpg)`  

---

> ⚠️ Reminder: This mod carries risk. Only attempt if confident in soldering and electronics handling.
