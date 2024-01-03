# Virgil-Installer 🥙 | Last docs update: 03/01/2024 (d/m/y)

An Electron application with React created for allow a simple installation of [VirgilAI](https://github.com/ProjecVirgil/VirgilAI)

## Showcase

   <img src="docs/img/img_1.png" alt="Descrizione Immagine 4" style="width:100%;">       |  <img src="docs/img/img_2.png" alt="Descrizione Immagine 4" style="width:100%;">
:-------------------------:|:-------------------------:
 <img src="docs/img/img_3.png" alt="Descrizione Immagine 4" style="width:100%;"> |  <img src="docs/img/img_4.png" alt="Descrizione Immagine 4" style="width:100%;">

## Use and Installation

1. The first step is to **download the executable file** of the latest version.
2. **This file will take care of preparing the actual installer (strange that it is an installer for an installer).
3. Now the actual installer will **start itself**.
4. If you don't want to read the introductory file, type **[this page](https://github.com/ProjecVirgil/VirgilAI)**, go ahead.
5. **Accept the "license"**.
6. OK, now the important part: all options have their own explanation, just click **these buttons:** ![img](/docs/img/img_button.png) once the options have been chosen, go ahead.
7. If the installation takes more than 10/15 minutes, contact support (via github or otherwise).
8. Now go ahead and **save the key**.
9. You can **now run VirgilAI** by simply searching for it in the search bar.

## Modify the installation

> Simple re-run the installer and you can modify the config of installation

## Environment installation | In details

### So the installer install python version 3.11.7

- If you have the same version of python should not overwrite the current

- If you have a different version of python it will not overwrite the current one in the path, and when the installer uses python, it will use the installation path directly.

### Python library

VirgilAI use the venv environment so the libraries **will not overwrote**

## Manual installation modification

For modify the installation manually go on the path of installation generally `C:\Users\username\AppData\Local\Programs\Virgil-Installer` and search `config.json`

The basic config can appear like this, simple modify and save the file

```json
{
  "first_start": true,
  "startup": false,
  "specify_interface": false,
  "type_interface": "N",
  "installation_path": "C:\\Users\\deadr\\AppData\\Local\\Programs",
  "icon_on_desktop": true,
  "display_console": true,
  "key": ""
}
```

## Possible problem

If the installation is too long close the installer and try to run manually this command

`winget install ffmpeg -h --accept-package-agreements --accept-source-agreements`

### If you get an error like this

![error](/docs/img/imgERROR.png)

Open the powershell and copy past this: 

```ps1
function Install-WinGet {
  $tempFolderName = 'WinGetInstall'
  $tempFolder = Join-Path -Path ([System.IO.Path]::GetTempPath()) -ChildPath $tempFolderName
  New-Item $tempFolder -ItemType Directory -ErrorAction SilentlyContinue | Out-Null

  $apiLatestUrl = if ($Prerelease) { 'https://api.github.com/repos/microsoft/winget-cli/releases?per_page=1' } else { 'https://api.github.com/repos/microsoft/winget-cli/releases/latest' }
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  $WebClient = New-Object System.Net.WebClient

  function Get-LatestUrl	{
		((Invoke-WebRequest $apiLatestUrl -UseBasicParsing | ConvertFrom-Json).assets | Where-Object { $_.name -match '^Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle$' }).browser_download_url
  }

  function Get-LatestHash {
    $shaUrl = ((Invoke-WebRequest $apiLatestUrl -UseBasicParsing | ConvertFrom-Json).assets | Where-Object { $_.name -match '^Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.txt$' }).browser_download_url
    $shaFile = Join-Path -Path $tempFolder -ChildPath 'Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.txt'
    $WebClient.DownloadFile($shaUrl, $shaFile)
    Get-Content $shaFile
  }
  $desktopAppInstaller = @{
    fileName = 'Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle'
    url      = $(Get-LatestUrl)
    hash     = $(Get-LatestHash)
  }
  $vcLibsUwp = @{
    fileName = 'Microsoft.VCLibs.x64.14.00.Desktop.appx'
    url      = 'https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx'
    hash     = '9BFDE6CFCC530EF073AB4BC9C4817575F63BE1251DD75AAA58CB89299697A569'
  }
  $uiLibsUwp = @{
    fileName = 'Microsoft.UI.Xaml.2.7.zip'
    url      = 'https://www.nuget.org/api/v2/package/Microsoft.UI.Xaml/2.7.0'
    hash     = '422FD24B231E87A842C4DAEABC6A335112E0D35B86FAC91F5CE7CF327E36A591'
  }
  $dependencies = @($desktopAppInstaller, $vcLibsUwp, $uiLibsUwp)
  Write-Host '--> Checking dependencies'
  foreach ($dependency in $dependencies) {
    $dependency.file = Join-Path -Path $tempFolder -ChildPath $dependency.fileName
    if (-Not ((Test-Path -Path $dependency.file -PathType Leaf) -And $dependency.hash -eq $(Get-FileHash $dependency.file).Hash)) {
      Write-Host @"
    - Downloading:
      $($dependency.url)
"@
      try {
        $WebClient.DownloadFile($dependency.url, $dependency.file)
      }
      catch {
        #Pass the exception as an inner exception
        throw [System.Net.WebException]::new("Error downloading $($dependency.url).", $_.Exception)
      }
      if (-not ($dependency.hash -eq $(Get-FileHash $dependency.file).Hash)) {
        throw [System.Activities.VersionMismatchException]::new('Dependency hash does not match the downloaded file')
      }
    }
  }

  if (-Not (Test-Path (Join-Path -Path $tempFolder -ChildPath \Microsoft.UI.Xaml.2.7\tools\AppX\x64\Release\Microsoft.UI.Xaml.2.7.appx)))	{
    Expand-Archive -Path $uiLibsUwp.file -DestinationPath ($tempFolder + '\Microsoft.UI.Xaml.2.7') -Force
  }
  $uiLibsUwp.file = (Join-Path -Path $tempFolder -ChildPath \Microsoft.UI.Xaml.2.7\tools\AppX\x64\Release\Microsoft.UI.Xaml.2.7.appx)
  Add-AppxPackage -Path $($desktopAppInstaller.file) -DependencyPath $($vcLibsUwp.file), $($uiLibsUwp.file)
  Remove-Item $tempFolder -recurse -force
}
Write-Host -ForegroundColor Green "--> Updating Winget`n"
Install-Winget
```
## Other

As mentioned above, VirgililAI is part of a larger project that includes an app, a website and others, the links of which are at Project:

### [Website](https://projectvirgil.net)

### [Mobile APP](https://github.com/Retr0100/VirgilApp)

### [Analysis of ML](https://github.com/Retr0100/VirgilML)

## Credits

The project is made by one person and is still in development, I'm looking for someone to give me advice and a hand to continue the project, which I believe is an excellent open source and free alternative to devices like Alexa or Google Home.

### Contact me

For code related issues you can use github directly for other collaborations or alerts write to this email <projectvirgilai@gmail.com>

If you want to support a small developer take a [**special link**](https://www.paypal.me/Retr0jk)

<a href="https://www.paypal.com/paypalme/Retr0jk">
  <img width = 200 align="center" src="https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" />
</a>
</div>

### Licence

- AGPL-3.0 licence
- [LICENSE FILE](https://github.com/Retr0100/VirgilAI/blob/master/LICENSE)
