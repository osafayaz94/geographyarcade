@echo off
rem Run by Windows Task Scheduler every evening: posts today's approved Geography Arcade post.
cd /d "D:\claude code\2nd website geography quiz"
echo ==== %date% %time% >> social\daily\log.txt
"C:\Program Files\nodejs\node.exe" scripts\social-daily.mjs post >> social\daily\log.txt 2>&1
