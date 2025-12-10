#!/bin/bash

# Archive 빌드 후 hermes.framework dSYM 복사 스크립트
# 이 스크립트는 Archive 빌드 후에 실행하여 hermes.framework의 dSYM을 Archive에 복사합니다.
# 사용법: ./fix-archive-dsym.sh [ARCHIVE_PATH]

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
      echo "Usage: ./fix-archive-dsym.sh [ARCHIVE_PATH]"
      echo "Example: ./fix-archive-dsym.sh ~/Library/Developer/Xcode/Archives/2024-01-01/YourApp.xcarchive"
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

# TARGET_NAME이 없으면 Archive 경로에서 추출
if [ -z "${TARGET_NAME}" ]; then
  TARGET_NAME=$(basename "$ARCHIVE_PATH" .xcarchive)
fi

# 여러 가능한 경로에서 hermes.framework 찾기
HERMES_PATHS=(
  "${ARCHIVE_PATH}/Products/Applications/${TARGET_NAME}.app/Frameworks/hermes.framework/hermes"
  "${ARCHIVE_PATH}/Products/Applications/HosannaHymnbook.app/Frameworks/hermes.framework/hermes"
  "${ARCHIVE_PATH}/Products/Applications/ImageMusicApp2.app/Frameworks/hermes.framework/hermes"
)

FOUND_HERMES=""
for HERMES_PATH in "${HERMES_PATHS[@]}"; do
  if [ -f "$HERMES_PATH" ]; then
    FOUND_HERMES="$HERMES_PATH"
    echo "Found hermes.framework at: $FOUND_HERMES"
    break
  fi
done

if [ -z "$FOUND_HERMES" ]; then
  echo "Error: hermes.framework not found in archive"
  echo "Searched paths:"
  for path in "${HERMES_PATHS[@]}"; do
    echo "  - $path"
  done
  exit 1
fi

# hermes 실행 파일의 UUID 추출 (대문자로 정규화)
echo "Extracting UUID from hermes.framework..."
HERMES_UUID_RAW=$(dwarfdump --uuid "$FOUND_HERMES" 2>/dev/null | head -n 1 | awk '{print $2}')
if [ -n "$HERMES_UUID_RAW" ]; then
  HERMES_UUID=$(echo "$HERMES_UUID_RAW" | tr '[:lower:]' '[:upper:]' | tr -d '-')
  echo "Hermes UUID: $HERMES_UUID_RAW (normalized: $HERMES_UUID)"
else
  echo "Error: Could not extract UUID from hermes.framework"
  exit 1
fi

# Archive dSYM 디렉토리
ARCHIVE_DSYM_DIR="${ARCHIVE_PATH}/dSYMs"
mkdir -p "$ARCHIVE_DSYM_DIR"

# PODS_ROOT 자동 찾기
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PODS_ROOT="${SCRIPT_DIR}/Pods"
if [ ! -d "$PODS_ROOT" ]; then
  PODS_ROOT="${SCRIPT_DIR}/../Pods"
fi

# dSYM 찾기 - 더 많은 경로 검색
HERMES_DSYM_SOURCES=(
  "${PODS_ROOT}/hermes-engine/destroot/Library/Frameworks/universal/hermes.xcframework/ios-arm64/hermes.framework.dSYM"
  "${PODS_ROOT}/hermes-engine/destroot/Library/Frameworks/universal/hermes.xcframework/ios-arm64_x86_64-simulator/hermes.framework.dSYM"
  "${PODS_ROOT}/hermes-engine/destroot/dSYM/hermes.framework.dSYM"
  "${PODS_ROOT}/hermes-engine/destroot/Library/Frameworks/macosx/hermes.framework.dSYM"
  "${SCRIPT_DIR}/../node_modules/react-native/sdks/hermes/build_release/hermes.framework.dSYM"
  "${SCRIPT_DIR}/../node_modules/react-native/sdks/hermes/build/hermes.framework.dSYM"
)

# 모든 가능한 dSYM 찾기
ALL_DSYMS=()
if [ -d "$PODS_ROOT/hermes-engine" ]; then
  while IFS= read -r -d '' dSYM; do
    ALL_DSYMS+=("$dSYM")
  done < <(find "$PODS_ROOT/hermes-engine" -name "hermes.framework.dSYM" -type d -print0 2>/dev/null)
fi

# node_modules에서도 찾기
if [ -d "${SCRIPT_DIR}/../node_modules" ]; then
  while IFS= read -r -d '' dSYM; do
    ALL_DSYMS+=("$dSYM")
  done < <(find "${SCRIPT_DIR}/../node_modules" -name "hermes.framework.dSYM" -type d -print0 2>/dev/null)
fi

# 명시된 경로도 추가
ALL_DSYMS+=("${HERMES_DSYM_SOURCES[@]}")

FOUND_DSYM=""
echo ""
echo "Searching for matching dSYM with UUID: $HERMES_UUID_RAW"
echo ""

for HERMES_DSYM_SOURCE in "${ALL_DSYMS[@]}"; do
  if [ -d "$HERMES_DSYM_SOURCE" ]; then
    # UUID 확인
    DSYM_UUID_RAW=$(dwarfdump --uuid "$HERMES_DSYM_SOURCE" 2>/dev/null | head -n 1 | awk '{print $2}')
    if [ -n "$DSYM_UUID_RAW" ]; then
      DSYM_UUID=$(echo "$DSYM_UUID_RAW" | tr '[:lower:]' '[:upper:]' | tr -d '-')
      echo "Checking: $HERMES_DSYM_SOURCE"
      echo "  UUID: $DSYM_UUID_RAW"
      if [ "$DSYM_UUID" = "$HERMES_UUID" ]; then
        echo "  ✓ MATCH FOUND!"
        FOUND_DSYM="$HERMES_DSYM_SOURCE"
        break
      else
        echo "  ✗ UUID mismatch"
      fi
    else
      echo "Checking: $HERMES_DSYM_SOURCE"
      echo "  ⚠ Could not extract UUID"
    fi
    echo ""
  fi
done

if [ -n "$FOUND_DSYM" ]; then
  echo "Found matching dSYM: $FOUND_DSYM"
  echo "Copying to: $ARCHIVE_DSYM_DIR"
  cp -R "$FOUND_DSYM" "$ARCHIVE_DSYM_DIR/" 2>&1 || {
    echo "Error: Failed to copy hermes.framework.dSYM"
    exit 1
  }
  echo "Successfully copied hermes.framework.dSYM to archive"
  
  # 복사된 dSYM의 UUID 확인
  COPIED_DSYM="${ARCHIVE_DSYM_DIR}/hermes.framework.dSYM"
  if [ -d "$COPIED_DSYM" ]; then
    COPIED_UUID=$(dwarfdump --uuid "$COPIED_DSYM" 2>/dev/null | head -n 1 | awk '{print $2}')
    echo "Verified copied dSYM UUID: $COPIED_UUID"
  fi
else
  echo "Warning: Could not find hermes.framework.dSYM with matching UUID: $HERMES_UUID_RAW"
  echo ""
  echo "Attempting to generate dSYM from hermes.framework in archive..."
  
  # Archive의 hermes.framework에서 dSYM 생성 시도
  HERMES_FRAMEWORK_DIR=$(dirname "$FOUND_HERMES")
  HERMES_FRAMEWORK_BASE=$(dirname "$HERMES_FRAMEWORK_DIR")
  
  # dsymutil을 사용하여 dSYM 생성
  if command -v dsymutil &> /dev/null; then
    echo "Generating dSYM using dsymutil..."
    GENERATED_DSYM="${ARCHIVE_DSYM_DIR}/hermes.framework.dSYM"
    
    # 기존 dSYM이 있으면 삭제
    if [ -d "$GENERATED_DSYM" ]; then
      rm -rf "$GENERATED_DSYM"
    fi
    
    # dSYM 생성
    if dsymutil "$FOUND_HERMES" -o "$GENERATED_DSYM" 2>&1; then
      echo "Successfully generated dSYM from hermes.framework"
      
      # 생성된 dSYM의 UUID 확인
      GENERATED_UUID=$(dwarfdump --uuid "$GENERATED_DSYM" 2>/dev/null | head -n 1 | awk '{print $2}')
      if [ -n "$GENERATED_UUID" ]; then
        echo "Generated dSYM UUID: $GENERATED_UUID"
        if [ "$GENERATED_UUID" = "$HERMES_UUID_RAW" ]; then
          echo "✓ UUID matches!"
        else
          echo "⚠ Warning: Generated dSYM UUID does not match hermes.framework UUID"
          echo "  Expected: $HERMES_UUID_RAW"
          echo "  Got: $GENERATED_UUID"
        fi
      fi
    else
      echo "Error: Failed to generate dSYM using dsymutil"
      echo ""
      echo "Searched locations:"
      for path in "${ALL_DSYMS[@]}"; do
        if [ -d "$path" ]; then
          echo "  ✓ $path"
        else
          echo "  ✗ $path (not found)"
        fi
      done
      echo ""
      echo "Possible solutions:"
      echo "1. Rebuild hermes-engine with dSYM generation enabled"
      echo "2. Check if hermes-engine was built with the correct configuration"
      echo "3. Try running: cd ios && pod install --repo-update"
      exit 1
    fi
  else
    echo "Error: dsymutil not found. Cannot generate dSYM."
    echo ""
    echo "Searched locations:"
    for path in "${ALL_DSYMS[@]}"; do
      if [ -d "$path" ]; then
        echo "  ✓ $path"
      else
        echo "  ✗ $path (not found)"
      fi
    done
    echo ""
    echo "Possible solutions:"
    echo "1. Install Xcode Command Line Tools: xcode-select --install"
    echo "2. Rebuild hermes-engine with dSYM generation enabled"
    echo "3. Try running: cd ios && pod install --repo-update"
    exit 1
  fi
fi

echo ""
echo "dSYM copy completed successfully!"
echo "You can now validate and upload the archive from Xcode Organizer."

