### Server Setup

#### For Windows

```markdown
# For start server
```

```markdown
# npm Install

npm i
```

```
# npm Start

npm start
```

### IN Windows

Edit env file:

- `ROOT_DIR = D:\` (set your root directory to the SD card)
- `DOWNLOAD_DIR = D:\C data\downloads` (set download directory to the SD card's Download folder)

### Android Using Termux

Edit env file:

- `ROOT_DIR = /sdcard` (set your root directory to the SD card)
- `DOWNLOAD_DIR = /sdcard/Download` (set download directory to the SD card's Download folder)

Note: If you want to use Android using Termux, you need to install Node.js first.

```
pkg install nodejs
```

### Use Cases

#### File Share

Share files between devices:

- Users can access and share their files with others by linking them in the `file` app on Android.

#### File Download

Download files from the internet using a browser or file manager:

- Users can download files from the web by accessing the link provided by another user.

#### File Upload

Upload files to the server using a browser or file manager

#### File Explore

Explore and manage files on the device:

- Users can view and manage their files on Android using the file manager app.

#### Play Music

Play music locally from the device's storage:

- Users can play music locally from their device by storing it in the `music` folder on the SD card. You can do this by downloading and installing the desired music player on your system, and then adding the downloaded files to the `music` folder on the Android device.
