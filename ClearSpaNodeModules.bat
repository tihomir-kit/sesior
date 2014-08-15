REM This is used to delete SPA node_modules directory on Windows
REM Some node_modules files have too long names and can't be deleted normally

cd SESIOR.SPA
mkdir empty_dir
robocopy empty_dir node_modules /s /mir
rmdir empty_dir
pause