#!/bin/sh
/var/www/html/bin/console scheduled-task:run --time-limit=295 --memory-limit=512M
