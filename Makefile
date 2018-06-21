update:
	@echo "[waiting] Updating toctoc scraper..."
	@git pull origin master

start:
	@echo "[wisebot script] Starting..."
	@sudo node index.js

.PHONY: update start
