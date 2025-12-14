# =====================================================
# Supabase CLI Installation Script for Windows
# =====================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "IoTLinker - Supabase CLI Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  Warning: Not running as Administrator" -ForegroundColor Yellow
    Write-Host "Some installation methods may require admin privileges." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Choose installation method:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Scoop (Recommended for Windows)" -ForegroundColor White
Write-Host "2. Direct Download (Manual installation)" -ForegroundColor White
Write-Host "3. npx (Use without global install)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1, 2, or 3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Installing via Scoop..." -ForegroundColor Cyan

        # Check if Scoop is installed
        if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
            Write-Host ""
            Write-Host "Scoop is not installed. Installing Scoop first..." -ForegroundColor Yellow
            Write-Host ""

            # Install Scoop
            try {
                Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
                Invoke-RestMethod get.scoop.sh | Invoke-Expression
                Write-Host "✅ Scoop installed successfully!" -ForegroundColor Green
            } catch {
                Write-Host "❌ Failed to install Scoop: $_" -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Host "✅ Scoop is already installed" -ForegroundColor Green
        }

        Write-Host ""
        Write-Host "Adding Supabase bucket..." -ForegroundColor Cyan
        scoop bucket add supabase https://github.com/supabase/scoop-bucket.git

        Write-Host ""
        Write-Host "Installing Supabase CLI..." -ForegroundColor Cyan
        scoop install supabase

        Write-Host ""
        Write-Host "✅ Supabase CLI installed successfully!" -ForegroundColor Green
    }

    "2" {
        Write-Host ""
        Write-Host "Opening download page..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Please download the Windows installer from:" -ForegroundColor Yellow
        Write-Host "https://github.com/supabase/cli/releases" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "1. Download the .zip file for Windows" -ForegroundColor White
        Write-Host "2. Extract to a permanent location (e.g., C:\Program Files\Supabase)" -ForegroundColor White
        Write-Host "3. Add the extracted folder to your PATH" -ForegroundColor White

        Start-Process "https://github.com/supabase/cli/releases"
    }

    "3" {
        Write-Host ""
        Write-Host "You can use Supabase CLI via npx (no global install needed):" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  npx supabase start" -ForegroundColor Yellow
        Write-Host "  npx supabase status" -ForegroundColor Yellow
        Write-Host "  npx supabase db reset" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Note: This requires Docker Desktop to be running." -ForegroundColor White
    }

    default {
        Write-Host ""
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verifying installation..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verify installation
try {
    $version = & supabase --version 2>&1
    Write-Host "✅ Supabase CLI is installed!" -ForegroundColor Green
    Write-Host "Version: $version" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Green
    Write-Host "1. Make sure Docker Desktop is running" -ForegroundColor White
    Write-Host "2. Run: supabase start" -ForegroundColor Yellow
    Write-Host "3. Run: supabase db reset" -ForegroundColor Yellow
} catch {
    if ($choice -eq "3") {
        Write-Host "ℹ️  Using npx mode - no global command available" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Green
        Write-Host "1. Make sure Docker Desktop is running" -ForegroundColor White
        Write-Host "2. Run: npx supabase start" -ForegroundColor Yellow
        Write-Host "3. Run: npx supabase db reset" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  Supabase CLI not found in PATH" -ForegroundColor Yellow
        Write-Host "You may need to restart your terminal or add it to PATH manually" -ForegroundColor Yellow
    }
}

Write-Host ""
