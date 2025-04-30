#!/bin/bash

# Color detection and configuration
if tput colors &> /dev/null && [ "$(tput colors)" -ge 8 ]; then
  # Terminal with color support
  SUPPORTS_COLOR=true
  BOLD=$(tput bold)
  RESET=$(tput sgr0)
  GREEN=$(tput setaf 2)
  RED=$(tput setaf 1)
  YELLOW=$(tput setaf 3)
  BLUE=$(tput setaf 4)
  CYAN=$(tput setaf 6)
  GRAY=$(tput setaf 8)
else
  # No color support
  SUPPORTS_COLOR=false
  BOLD=""
  RESET=""
  GREEN=""
  RED=""
  YELLOW=""
  BLUE=""
  CYAN=""
  GRAY=""
fi

# Symbol definitions with emojis
SYMBOL_START="🚀"
SYMBOL_SUCCESS="✅"
SYMBOL_ERROR="❌"
SYMBOL_WORKING="🔄"
SYMBOL_DOT="·"
SPINNER_CHARS="|/-\\"

# Step-specific emojis
EMOJI_FORMAT="🎨"  # Format check (Prettier)
EMOJI_LINT="🔍"    # Linting (ESLint)
EMOJI_TYPE="📝"    # TypeScript type check
EMOJI_TEST="🧪"    # Unit and integration tests
EMOJI_E2E="🌐"     # E2E tests
EMOJI_SUCCESS="🎉" # Final success

# --- Global Variables ---
CURRENT_CHILD_PID=""
# Use a consistent prefix for temp files for easier cleanup
TEMP_FILE_PREFIX="/tmp/vpf-validate-"

# --- Trap Handlers ---
# Function to kill the current child process and its children
kill_child_process() {
  if [ -n "$CURRENT_CHILD_PID" ]; then
    local pid_to_kill=$CURRENT_CHILD_PID
    CURRENT_CHILD_PID="" # Clear PID early to prevent potential recursion in cleanup
    # Try killing the process group first
    kill -- -"$pid_to_kill" 2>/dev/null
    # Try killing direct children as well
    pkill -P "$pid_to_kill" 2>/dev/null
    # Try killing the main child process directly
    kill "$pid_to_kill" 2>/dev/null
    # Give it a moment, then force kill if still running
    sleep 0.1
    if kill -0 "$pid_to_kill" 2>/dev/null; then
       kill -9 "$pid_to_kill" 2>/dev/null
       pkill -9 -P "$pid_to_kill" 2>/dev/null
    fi
  fi
}

# Function to handle script interruption (CTRL+C, TERM)
handle_interrupt() {
  echo -e "\n${YELLOW}🛑 Script interrupted. Terminating child process...${RESET}"
  kill_child_process
  # Explicitly exit with the interrupt code
  exit 130
}

# Function to clean up temporary files on ANY exit
cleanup() {
  # Clean up temp files
  rm -f ${TEMP_FILE_PREFIX}*
}

# Set up traps
trap handle_interrupt INT TERM # Catch CTRL+C and TERM signals
trap cleanup EXIT             # Clean up temp files on any exit

# Define all validation steps
VALIDATION_STEPS=(
  "format:check|Checking code formatting (Prettier)"
  "lint|Running static code analysis (ESLint)"
  "type-check|Verifying TypeScript types"
  "unit_tests|Running unit and integration tests"
  "e2e_tests|Running E2E tests"
)

# Calculate total number of steps
TOTAL_STEPS=${#VALIDATION_STEPS[@]}
CURRENT_STEP=0

# Function to clear the current line
clear_line() {
  if $SUPPORTS_COLOR; then
    # Use \e[2K to clear entire line and \r to return cursor
    printf "\r\e[2K"
  else
    printf "\r                                                                               \r"
  fi
}

# Add progress dots
add_progress_dots() {
  local count="$1"
  local color="${2:-$CYAN}"
  local dots=""

  count=$(( count < 50 ? count : 50 ))
  for ((i=0; i<count; i++)); do
    dots="${dots}${color}${SYMBOL_DOT}${RESET}"
  done

  echo "$dots"
}

# Function to run unit tests with progress indicator
run_unit_tests() {
  local step_num="$1"
  local total="$2"

  echo -en "${BLUE}${BOLD}${SYMBOL_WORKING} [${step_num}/${total}] ${EMOJI_TEST} Running unit tests...${RESET}"

  local temp_file_unit=$(mktemp "${TEMP_FILE_PREFIX}unit-XXXXXX")
  local temp_file_integration=$(mktemp "${TEMP_FILE_PREFIX}integration-XXXXXX")

  local unit_tests_count=0
  local integration_tests_count=0
  local passed_tests=0

  # --- Unit Tests ---
  pnpm exec vitest run tests/unit --reporter=verbose > "$temp_file_unit" 2>&1 &
  CURRENT_CHILD_PID=$! # Store child PID

  local i=0
  while kill -0 $CURRENT_CHILD_PID 2>/dev/null; do
    if [ -f "$temp_file_unit" ]; then
      local new_count=$(grep -c "✓" "$temp_file_unit" 2>/dev/null | tr -d '\n' || echo 0)
      if [ "$new_count" -gt "$unit_tests_count" ]; then
        unit_tests_count=$new_count
      fi
    fi
    local char="${SPINNER_CHARS:$i:1}"
    echo -en "\r${BLUE}${BOLD}${SYMBOL_WORKING} [${step_num}/${total}] ${EMOJI_TEST} Running unit tests... ${unit_tests_count} ${char}${RESET}"
    i=$(( (i+1) % 4 ))
    sleep 0.1
  done

  wait $CURRENT_CHILD_PID
  local unit_exit_code=$?
  CURRENT_CHILD_PID="" # Clear child PID

  local unit_passed_tests=$(grep -c "✓" "$temp_file_unit" 2>/dev/null | tr -d '\n' || echo 0)

  if [ $unit_exit_code -ne 0 ]; then
    echo -e "\n${RED}${BOLD}${SYMBOL_ERROR} Unit tests failed${RESET}"
    echo "${RED}--- Error details ---${RESET}"
    [ -f "$temp_file_unit" ] && cat "$temp_file_unit"
    echo "${RED}------------------------${RESET}"
    return 1 # Exit function early
  fi

  # --- Integration Tests ---
  clear_line
  echo -en "${BLUE}${BOLD}${SYMBOL_WORKING} [${step_num}/${total}] ${EMOJI_TEST} Running integration tests...${RESET}"

  pnpm exec vitest run tests/integration --reporter=verbose > "$temp_file_integration" 2>&1 &
  CURRENT_CHILD_PID=$! # Store child PID

  i=0
  while kill -0 $CURRENT_CHILD_PID 2>/dev/null; do
     if [ -f "$temp_file_integration" ]; then
        local new_count=$(grep -c "✓" "$temp_file_integration" 2>/dev/null | tr -d '\n' || echo 0)
        if [ "$new_count" -gt "$integration_tests_count" ]; then
          integration_tests_count=$new_count
        fi
      fi
      local char="${SPINNER_CHARS:$i:1}"
      echo -en "\r${BLUE}${BOLD}${SYMBOL_WORKING} [${step_num}/${total}] ${EMOJI_TEST} Running integration tests... ${integration_tests_count} ${char}${RESET}"
      i=$(( (i+1) % 4 ))
      sleep 0.1
  done

  wait $CURRENT_CHILD_PID
  local integration_exit_code=$?
  CURRENT_CHILD_PID="" # Clear child PID

  local integration_passed_tests=$(grep -c "✓" "$temp_file_integration" 2>/dev/null | tr -d '\n' || echo 0)
  passed_tests=$((unit_passed_tests + integration_passed_tests))

  if [ $integration_exit_code -eq 0 ]; then
    clear_line
    echo -e "${GREEN}${BOLD}${SYMBOL_SUCCESS} [${step_num}/${total}] ${EMOJI_TEST} Unit and integration tests passed (${passed_tests}/${passed_tests})${RESET}"
    return 0
  else
    echo -e "\n${RED}${BOLD}${SYMBOL_ERROR} Integration tests failed${RESET}"
    echo "${RED}--- Error details ---${RESET}"
    [ -f "$temp_file_integration" ] && cat "$temp_file_integration"
    echo "${RED}------------------------${RESET}"
    return 1
  fi
}

# Function to run E2E tests with progress indicator
run_e2e_tests() {
  local step_num="$1"
  local total="$2"

  echo -en "${BLUE}${BOLD}${SYMBOL_WORKING} [${step_num}/${total}] ${EMOJI_E2E} Running E2E tests...${RESET}"

  local temp_file=$(mktemp "${TEMP_FILE_PREFIX}e2e-XXXXXX")

  # Run the E2E tests and capture output
  (
    if [ ! -f "/home/node/.cache/ms-playwright/chromium-*/chrome-linux/chrome" ]; then
      pnpm exec playwright install --with-deps chromium
    fi
    pnpm exec playwright test
  ) > "$temp_file" 2>&1 &
  CURRENT_CHILD_PID=$! # Store child PID

  local completed_tests=0
  local total_tests=0
  local i=0
  while kill -0 $CURRENT_CHILD_PID 2>/dev/null; do
     if [ -f "$temp_file" ]; then
      if [ "$total_tests" -eq 0 ]; then
        local tmp_total=$(grep -o "Running [0-9]* tests" "$temp_file" | grep -o "[0-9]*" 2>/dev/null || echo "")
        if [ -n "$tmp_total" ]; then total_tests=$(echo "$tmp_total" | tr -d '\n'); fi
      fi
      local tmp_count=$(grep -o "·" "$temp_file" | wc -l 2>/dev/null || echo "")
      local current_dots=0
      if [ -n "$tmp_count" ]; then current_dots=$(echo "$tmp_count" | tr -d '\n'); fi
      if [ -n "$current_dots" ] && [ -n "$completed_tests" ] && [ "$current_dots" -gt "$completed_tests" ]; then
        completed_tests=$current_dots
      fi
    fi
    local char="${SPINNER_CHARS:$i:1}"
    if [ -n "$total_tests" ] && [ "$total_tests" -gt 0 ]; then
      echo -en "\r${BLUE}${BOLD}${SYMBOL_WORKING} [${step_num}/${total}] ${EMOJI_E2E} Running E2E tests... ${completed_tests}/${total_tests} ${char}${RESET}"
    else
      echo -en "\r${BLUE}${BOLD}${SYMBOL_WORKING} [${step_num}/${total}] ${EMOJI_E2E} Running E2E tests... ${completed_tests} ${char}${RESET}"
    fi
    i=$(( (i+1) % 4 ))
    sleep 0.1
  done

  wait $CURRENT_CHILD_PID
  local exit_code=$?
  CURRENT_CHILD_PID="" # Clear child PID

  # Simplify and correct final count retrieval for E2E tests
  local display_passed="$completed_tests" # Default to loop count
  local display_total="$total_tests"     # Default to loop count

  # Try to get more accurate final counts from summary if file exists
  if [ -f "$temp_file" ]; then
      local summary_line=$(grep '[0-9]* passed' "$temp_file" | tail -n 1)
      if [ -n "$summary_line" ]; then
          local summary_passed=$(echo "$summary_line" | grep -o '[0-9]*' | head -n 1)
          if [ -n "$summary_passed" ]; then
              display_passed="$summary_passed"
              display_total="$summary_passed" # Assume total=passed on success
          fi
      fi
  fi
  # Fallback for total if it wasn't found in summary but was found during run
  if [ "$display_total" == "0" ] && [ -n "$total_tests" ] && [ "$total_tests" -ne 0 ]; then
      display_total="$total_tests"
  fi
  # Ensure display_passed is not empty if tests ran
  if [ -z "$display_passed" ] && [ "$completed_tests" -ne 0 ]; then
       display_passed="$completed_tests"
  fi

  if [ $exit_code -eq 0 ]; then
    clear_line
    echo -e "${GREEN}${BOLD}${SYMBOL_SUCCESS} [${step_num}/${total}] ${EMOJI_E2E} E2E tests passed (${display_passed}/${display_total})${RESET}"
    return 0
  else
    echo -e "\n${RED}${BOLD}${SYMBOL_ERROR} [${step_num}/${total}] E2E tests failed${RESET}"
    echo "${RED}--- Error details ---${RESET}"
    [ -f "$temp_file" ] && cat "$temp_file"
    echo "${RED}------------------------${RESET}"
    return 1
  fi
}

# Function to display a spinner during command execution
run_with_spinner() {
  local command=$1
  local message=$2
  local step_num=$3
  local total=$4
  local emoji=$5

  local temp_file=$(mktemp "${TEMP_FILE_PREFIX}spinner-XXXXXX")

  echo -en "${BLUE}${BOLD}${SYMBOL_WORKING} [${step_num}/${total}] ${emoji} ${message}...${RESET}"

  eval "$command" > "$temp_file" 2>&1 &
  CURRENT_CHILD_PID=$! # Store child PID

  local i=0
  while kill -0 $CURRENT_CHILD_PID 2>/dev/null; do
    local char="${SPINNER_CHARS:$i:1}"
    echo -en "\r${BLUE}${BOLD}${SYMBOL_WORKING} [${step_num}/${total}] ${emoji} ${message}... ${char}${RESET}"
    i=$(( (i+1) % 4 ))
    sleep 0.2
  done

  wait $CURRENT_CHILD_PID
  local exit_code=$?
  CURRENT_CHILD_PID="" # Clear child PID

  clear_line

  if [ $exit_code -eq 0 ]; then
    echo -e "${GREEN}${BOLD}${SYMBOL_SUCCESS} [${step_num}/${total}] ${emoji} ${message}${RESET}"
    return 0
  else
    echo -e "${RED}${BOLD}${SYMBOL_ERROR} [${step_num}/${total}] ${message} - FAILED${RESET}"
    echo "${RED}--- Error details ---${RESET}"
    [ -f "$temp_file" ] && cat "$temp_file"
    echo "${RED}------------------------${RESET}"
    # Exit the whole script if a spinner step fails
    exit $exit_code
  fi
}

# --- Main Script Logic ---
echo -e "${BLUE}${BOLD}${SYMBOL_START} Code Quality Control"

# Run each validation step
for i in "${!VALIDATION_STEPS[@]}"; do
  CURRENT_STEP=$((i+1))
  IFS='|' read -r cmd desc <<< "${VALIDATION_STEPS[$i]}"

  # Special handling for unit and integration tests
  if [ "$cmd" == "unit_tests" ]; then
    run_unit_tests "${CURRENT_STEP}" "${TOTAL_STEPS}" || exit 1
  # Special handling for E2E tests
  elif [ "$cmd" == "e2e_tests" ]; then
    run_e2e_tests "${CURRENT_STEP}" "${TOTAL_STEPS}" || exit 1
  else
    # Choose emoji based on step
    emoji=""
    case "$cmd" in
      "format:check") emoji="${EMOJI_FORMAT}" ;;
      "lint") emoji="${EMOJI_LINT}" ;;
      "type-check") emoji="${EMOJI_TYPE}" ;;
      *) emoji="" ;;
    esac

    run_with_spinner "pnpm ${cmd}" "${desc}" "${CURRENT_STEP}" "${TOTAL_STEPS}" "${emoji}" || exit 1
  fi
done

echo -e "\n${GREEN}${BOLD}${EMOJI_SUCCESS} All checks passed successfully!${RESET}"

exit 0 # Explicitly exit with success code
