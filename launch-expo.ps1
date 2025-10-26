# ------------------------------
# launch-expo.ps1
# ------------------------------

# Full path to emulator.exe
$emulatorPath = "C:\Users\vkalp\AppData\Local\Android\Sdk\emulator\emulator.exe"

# Names of your AVDs
$emulatorNames = @("phone1", "phone2")

# Your Expo URL
$expoURL = "exp://10.0.0.23:8081"

# Launch all emulators
foreach ($name in $emulatorNames) {
    Write-Host "Starting emulator: $name"
    Start-Process -FilePath $emulatorPath -ArgumentList "-avd $name" -NoNewWindow
}

# Wait for emulators to boot (increase if needed)
Write-Host "Waiting for emulators to boot..."
Start-Sleep -Seconds 120

# Detect running emulators
$emulators = adb devices | ForEach-Object {
    if ($_ -match "emulator-\d+\s+device") {
        ($_ -split "\s+")[0]
    }
}

# Open Expo Go with your app on all running emulators
foreach ($emu in $emulators) {
    Write-Host "Launching Expo app on $emu"
    adb -s $emu shell am start -a android.intent.action.VIEW -d $expoURL
}

Write-Host "Done! Expo app should be running on all emulators."
