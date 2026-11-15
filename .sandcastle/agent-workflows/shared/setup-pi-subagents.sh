#!/bin/sh
# Enable Pi's bundled subagent example for a factory runner.
set -eu

if [ "${GITHUB_ACTIONS:-}" != "true" ] && [ -z "${PI_CODING_AGENT_DIR:-}" ]; then
  echo "Set PI_CODING_AGENT_DIR to an isolated directory outside GitHub Actions." >&2
  exit 1
fi

pi_package=${1:-$(npm root -g)/@earendil-works/pi-coding-agent}
example="$pi_package/examples/extensions/subagent"
pi_dir=${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}
agent_source=$(CDPATH= cd -- "$(dirname -- "$0")/pi-agents" && pwd)

test -f "$example/index.ts"
test -f "$example/agents.ts"
mkdir -p "$pi_dir/extensions/subagent" "$pi_dir/agents"

for destination in \
  "$pi_dir/extensions/subagent/index.ts" \
  "$pi_dir/extensions/subagent/agents.ts" \
  "$pi_dir/agents/scout.md" \
  "$pi_dir/agents/reviewer.md"; do
  if [ -e "$destination" ] || [ -L "$destination" ]; then
    echo "Refusing to replace an existing Pi file: $destination" >&2
    exit 1
  fi
done

for file in index.ts agents.ts; do
  ln -s "$example/$file" "$pi_dir/extensions/subagent/$file"
done
for agent in scout reviewer; do
  cp "$agent_source/$agent.pi-agent" "$pi_dir/agents/$agent.md"
done
