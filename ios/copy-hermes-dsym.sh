#!/bin/bash

# Archive 후 처리: hermes.framework dSYM 복사 스크립트
# 이 스크립트는 Archive 후에 실행되어야 합니다.
# 사용법: ./copy-hermes-dsym.sh [ARCHIVE_PATH]

set -e

# Archive 경로 확인
if [ -z "${ARCHIVE_PATH}" ]; then
  # 명령줄 인자로 Archive 경로 제공
  if [ -n "$1" ]; then
    ARCHIVE_PATH="$1"
  else
    # 최근 Archive 자동 찾기
    ARCHIVE_PATH=$(find ~/Library/Developer/Xcode/Archives -type d -name "*.xcarchive" -maxdepth 2 -print0 2>/dev/null | xargs -0 ls -dt | head -n 1)
    if [ -z "$ARCHIVE_PATH" ]; then
      echo "Error: ARCHIVE_PATH is not set and could not find recent archive"
      echo "Usage: ./copy-hermes-dsym.sh [ARCHIVE_PATH]"
      echo "Example: ./copy-hermes-dsym.sh ~/Library/Developer/Xcode/Archives/2024-01-01/YourApp.xcarchive"
      exit 1
    fi
    echo "Using most recent archive: $ARCHIVE_PATH"
  fi
fi

# .xcarchive 확장자 확인
if [[ ! "$ARCHIVE_PATH" == *.xcarchive ]]; then
  echo "Error: ARCHIVE_PATH must be a .xcarchive path"
  exit 1
fi

ARCHIVE_DSYM_DIR="${ARCHIVE_PATH}/dSYMs"

# TARGET_NAME이 없으면 Archive 경로에서 추출
if [ -z "${TARGET_NAME}" ]; then
  TARGET_NAME=$(basename "$ARCHIVE_PATH" .xcarchive)
fi

HERMES_FRAMEWORK="${ARCHIVE_PATH}/Products/Applications/${TARGET_NAME}.app/Frameworks/hermes.framework/hermes"

if [ ! -f "$HERMES_FRAMEWORK" ]; then
  echo "Warning: hermes.framework not found at $HERMES_FRAMEWORK"
  exit 0
fi

# hermes 실행 파일의 UUID 추출 (대문자로 정규화)
HERMES_UUID_RAW=$(dwarfdump --uuid "$HERMES_FRAMEWORK" 2>/dev/null | head -n 1 | awk '{print $2}')
if [ -n "$HERMES_UUID_RAW" ]; then
  HERMES_UUID=$(echo "$HERMES_UUID_RAW" | tr '[:lower:]' '[:upper:]' | tr -d '-')
  echo "Hermes UUID: $HERMES_UUID_RAW (normalized: $HERMES_UUID)"
else
  echo "Warning: Could not extract UUID from hermes.framework"
  HERMES_UUID=""
fi

# PODS_ROOT 자동 찾기
if [ -z "${PODS_ROOT}" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  PODS_ROOT="${SCRIPT_DIR}/Pods"
  if [ ! -d "$PODS_ROOT" ]; then
    PODS_ROOT="${SCRIPT_DIR}/../Pods"
  fi
  if [ ! -d "$PODS_ROOT" ]; then
    echo "Warning: Could not find Pods directory. Trying to locate hermes dSYM..."
  fi
fi

# dSYM 찾기
HERMES_DSYM_SOURCES=(
  "${PODS_ROOT}/hermes-engine/destroot/Library/Frameworks/universal/hermes.xcframework/ios-arm64/hermes.framework.dSYM"
  "${PODS_ROOT}/hermes-engine/destroot/Library/Frameworks/universal/hermes.xcframework/ios-arm64_x86_64-simulator/hermes.framework.dSYM"
  "${PODS_ROOT}/hermes-engine/destroot/Library/Frameworks/universal/hermes.xcframework/ios-arm64/hermes.framework.dSYM"
)

FOUND_DSYM=""
for HERMES_DSYM_SOURCE in "${HERMES_DSYM_SOURCES[@]}"; do
  if [ -d "$HERMES_DSYM_SOURCE" ]; then
    # UUID 확인 (가능한 경우)
    if [ -n "$HERMES_UUID" ]; then
      DSYM_UUID_RAW=$(dwarfdump --uuid "$HERMES_DSYM_SOURCE" 2>/dev/null | head -n 1 | awk '{print $2}')
      if [ -n "$DSYM_UUID_RAW" ]; then
        DSYM_UUID=$(echo "$DSYM_UUID_RAW" | tr '[:lower:]' '[:upper:]' | tr -d '-')
        if [ "$DSYM_UUID" = "$HERMES_UUID" ]; then
          echo "Found matching dSYM: $HERMES_DSYM_SOURCE (UUID: $DSYM_UUID_RAW)"
          FOUND_DSYM="$HERMES_DSYM_SOURCE"
          break
        else
          echo "Checking dSYM: $HERMES_DSYM_SOURCE (UUID: $DSYM_UUID_RAW, expected: $HERMES_UUID_RAW)"
        fi
      else
        # UUID를 추출할 수 없으면 일단 사용 (나중에 확인)
        echo "Found dSYM without UUID: $HERMES_DSYM_SOURCE"
        if [ -z "$FOUND_DSYM" ]; then
          FOUND_DSYM="$HERMES_DSYM_SOURCE"
        fi
      fi
    else
      # UUID가 없으면 첫 번째 발견한 dSYM 사용
      echo "Found dSYM: $HERMES_DSYM_SOURCE"
      FOUND_DSYM="$HERMES_DSYM_SOURCE"
      break
    fi
  fi
done

if [ -n "$FOUND_DSYM" ]; then
  echo "Found hermes.framework.dSYM at: $FOUND_DSYM"
  echo "Copying to: $ARCHIVE_DSYM_DIR"
  
  mkdir -p "$ARCHIVE_DSYM_DIR"
  cp -R "$FOUND_DSYM" "$ARCHIVE_DSYM_DIR/" || {
    echo "Error: Failed to copy hermes.framework.dSYM"
    exit 1
  }
  
  echo "Successfully copied hermes.framework.dSYM to archive"
else
  echo "Warning: Could not find hermes.framework.dSYM"
  exit 0
fi

