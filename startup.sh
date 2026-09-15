#!/bin/sh
set -eu
cd /workspace
# If Helix Mini still owns the preview port, free it.
if curl -sf --max-time 1 http://127.0.0.1:8080/health 2>/dev/null | grep -q 'helix-mini'; then
  for d in /proc/[0-9]*; do
    cmd=$(tr '\0' ' ' < "$d/cmdline" 2>/dev/null || true)
    case "$cmd" in
      *helix_mini.py*) kill "${d#/proc/}" 2>/dev/null || true ;;
    esac
  done
  sleep 0.4
fi
if curl -sf --max-time 2 http://127.0.0.1:8080/ | grep -q 'ChatCPU'; then
  exit 0
fi
npm run dev > /tmp/chatcpu-dev.log 2>&1 &
i=0
while [ "$i" -lt 80 ]; do
  if curl -sf --max-time 1 http://127.0.0.1:8080/ | grep -q 'ChatCPU'; then
    exit 0
  fi
  i=$((i + 1))
  sleep 0.2
done
echo "dev server failed" >&2
tail -n 50 /tmp/chatcpu-dev.log >&2 || true
exit 1
