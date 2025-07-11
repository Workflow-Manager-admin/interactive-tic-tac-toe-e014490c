#!/bin/bash
cd /home/kavia/workspace/code-generation/interactive-tic-tac-toe-e014490c/react_js_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

