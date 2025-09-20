# Windows 11 Gaming Optimization Guide (Handhelds)

This is a general guide and overview of various ways you can optimize **Windows 11 for gaming on a handheld**.  

⚠️ We don’t recommend using **3rd party optimization tools**. These tools can potentially cause game compatibility issues, reduce system stability, and pose security risks.  

---

## Guide Overview
This guide covers 5 parts:
1. Disabling Core Isolation  
2. Turning off VMP  
3. Turning off BitLocker  
4. Adjusting visuals  
5. Various improvements and tweaks  

---

## Notes
⚠️ While generally safe, you should read over each section and make sure you understand the ramifications and implications of these changes!

---

## Instructions

### 1. Turning off Core Isolation
Core isolation is a Windows security feature that protects important core processes by isolating them in memory. Disabling it can improve performance but reduces security. Skip this step if you’re not comfortable with the trade-off.  

Steps:  
1. Open **Windows Security**.  
2. Click/tap **Device Security** on the left, then **Core isolation details**.  
3. Turn off **Memory integrity**.  
4. If prompted by UAC, approve with **Yes**.  
5. Restart your computer.  

---

### 2. Turning off VMP
Virtual Machine Platform (VMP) provides core VM services. Disabling it may break Android app emulation. Re-enable it if you need Android apps.  

Steps:  
1. Press **Start**, type `Windows features`, and select **Turn Windows features on or off**.  
2. In the Windows Features window, uncheck **Virtual Machine Platform**.  
3. Click **OK** and reboot.  

---

### 3. Turning off BitLocker
If your SSD doesn’t support OPAL, BitLocker relies on software encryption, which can reduce performance slightly.  

Steps:  
1. Open **Control Panel** (`Win + S` → search *Control Panel*).  
2. Navigate to **BitLocker Drive Encryption** (set view to *Large/Small icons*).  
3. Find the drive with BitLocker enabled.  
4. Click **Turn Off BitLocker**.  
5. Confirm to decrypt the drive.  
6. Wait for decryption to complete (can take time depending on drive size).  

---

### 4. Adjusting Visuals (Performance)
Reducing Windows animations and effects can free up resources.  

Steps:  
1. Type **Adjust the appearance and performance of Windows** into search and press **Enter**.  
2. Select **Adjust for best performance**.  
3. Re-enable critical options manually:  
   - ✅ *Show thumbnails instead of icons*  
   - ✅ *Smooth edges of screen fonts*  

---

### 5. Various Improvements & Tweaks

#### Enable Game Mode
1. Press **Win + I** to open Settings.  
2. Search **Turn on Game Mode**.  
3. Toggle it **ON**.  

---

#### Use a Split Keyboard (optional)
Typing on handhelds can be awkward. A split keyboard makes it easier with thumbs.  

1. Tap into an input box to open the touch keyboard.  
2. Tap the **keyboard icon** (upper left).  
3. Select the **split keyboard** option.  

---

#### Disable Edge Running in the Background
1. Open **Microsoft Edge**.  
2. Menu (⋮) → **Settings** → **System and Performance**.  
3. Uncheck:  
   - *Startup boost*  
   - *Continue running background apps when Edge is closed*  

---

#### De-animate Windows (optional)
Helps a little outside exclusive fullscreen apps or at very low TDP.  

1. Search **Adjust the appearance and performance of Windows**.  
2. Select **Adjust for best performance**.  
3. Re-enable important visuals:  
   - ✅ *Show thumbnails instead of icons*  
   - ✅ *Smooth edges of screen fonts*  

---

#### Optional Windows 11 Cleanup
- Uninstall **Office Installer**  
- Remove **Teams**  
- Remove **OneDrive**  

---
