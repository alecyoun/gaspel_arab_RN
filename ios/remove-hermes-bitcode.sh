#!/bin/bash

# hermes.framework의 bitcode 제거 및 dSYM 처리 스크립트
# 이 스크립트는 Xcode 빌드 단계에서 실행되어야 합니다.

# Archive 빌드 시 경로 확인
if [ -n "${ARCHIVE_PRODUCTS_PATH}" ]; then
  # Archive 빌드인 경우
  HERMES_FRAMEWORK="${ARCHIVE_PRODUCTS_PATH}${INSTALL_PATH}/HosannaHymnbook.app/Frameworks/hermes.framework/hermes"
  HERMES_FRAMEWORK_DIR="${ARCHIVE_PRODUCTS_PATH}${INSTALL_PATH}/HosannaHymnbook.app/Frameworks/hermes.framework"
  DSYM_DIR="${ARCHIVE_PRODUCTS_PATH}${INSTALL_PATH}/../dSYMs"
else
  # 일반 빌드인 경우
  HERMES_FRAMEWORK="${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/hermes.framework/hermes"
  HERMES_FRAMEWORK_DIR="${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/hermes.framework"
  DSYM_DIR="${DWARF_DSYM_FOLDER_PATH}"
fi

# Archive 빌드 시 dSYM 폴더 경로들
ARCHIVE_DSYM_DIRS=()
if [ -n "${ARCHIVE_PRODUCTS_PATH}" ]; then
  ARCHIVE_DSYM_DIRS+=("${ARCHIVE_PRODUCTS_PATH}${INSTALL_PATH}/../dSYMs")
fi
if [ -n "${ARCHIVE_PATH}" ]; then
  ARCHIVE_DSYM_DIRS+=("${ARCHIVE_PATH}/dSYMs")
fi
# Archive의 일반적인 dSYM 경로
if [ -n "${ARCHIVE_DSYM_FOLDER_PATH}" ]; then
  ARCHIVE_DSYM_DIRS+=("${ARCHIVE_DSYM_FOLDER_PATH}")
fi

# 여러 가능한 경로에서 hermes.framework 찾기
HERMES_PATHS=(
  "$HERMES_FRAMEWORK"
  "${ARCHIVE_PRODUCTS_PATH}${INSTALL_PATH}/HosannaHymnbook.app/Frameworks/hermes.framework/hermes"
  "${ARCHIVE_PRODUCTS_PATH}/Applications/HosannaHymnbook.app/Frameworks/hermes.framework/hermes"
  "${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/hermes.framework/hermes"
  "${BUILT_PRODUCTS_DIR}/HosannaHymnbook.app/Frameworks/hermes.framework/hermes"
)

FOUND_HERMES=""
for HERMES_PATH in "${HERMES_PATHS[@]}"; do
  if [ -f "$HERMES_PATH" ]; then
    FOUND_HERMES="$HERMES_PATH"
    echo "Found hermes.framework at: $FOUND_HERMES"
    break
  fi
done

if [ -n "$FOUND_HERMES" ]; then
  echo "Processing hermes.framework at: $FOUND_HERMES"
  
  # 1. Bitcode 제거 (반드시 실행)
  echo "Removing bitcode from hermes.framework..."
  if xcrun bitcode_strip -r "$FOUND_HERMES" -o "$FOUND_HERMES" 2>&1; then
    echo "Successfully removed bitcode from hermes.framework"
  else
    echo "Warning: Failed to remove bitcode from hermes.framework, but continuing..."
  fi
  
  # 2. hermes 실행 파일의 UUID 추출 (대문자로 정규화)
  HERMES_UUID_RAW=$(dwarfdump --uuid "$FOUND_HERMES" 2>/dev/null | head -n 1 | awk '{print $2}')
  if [ -n "$HERMES_UUID_RAW" ]; then
    HERMES_UUID=$(echo "$HERMES_UUID_RAW" | tr '[:lower:]' '[:upper:]' | tr -d '-')
    echo "Hermes UUID: $HERMES_UUID_RAW (normalized: $HERMES_UUID)"
  else
    echo "Warning: Could not extract UUID from hermes.framework"
    HERMES_UUID=""
  fi
  
  # 3. dSYM 찾기 및 복사
  # 여러 경로에서 hermes dSYM 찾기
  HERMES_DSYM_SOURCES=(
    "${PODS_ROOT}/hermes-engine/destroot/Library/Frameworks/universal/hermes.xcframework/ios-arm64/hermes.framework.dSYM"
    "${PODS_ROOT}/hermes-engine/destroot/Library/Frameworks/universal/hermes.xcframework/ios-arm64_x86_64-simulator/hermes.framework.dSYM"
    "${PODS_ROOT}/hermes-engine/destroot/dSYM/hermes.framework.dSYM"
    "${PODS_ROOT}/hermes-engine/destroot/Library/Frameworks/macosx/hermes.framework.dSYM"
    "${BUILT_PRODUCTS_DIR}/hermes.framework.dSYM"
    "${CONFIGURATION_BUILD_DIR}/hermes.framework.dSYM"
    "${SRCROOT}/../node_modules/react-native/sdks/hermes/build_release/hermes.framework.dSYM"
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
          fi
        else
          # UUID를 추출할 수 없으면 일단 사용 (나중에 확인)
          FOUND_DSYM="$HERMES_DSYM_SOURCE"
        fi
      else
        # UUID가 없으면 첫 번째 발견한 dSYM 사용
        FOUND_DSYM="$HERMES_DSYM_SOURCE"
        break
      fi
    fi
  done
  
  if [ -n "$FOUND_DSYM" ]; then
    echo "Using hermes.framework.dSYM at: $FOUND_DSYM"
    
    # 일반 빌드 시 dSYM 복사
    if [ -n "$DSYM_DIR" ] && [ -d "$DSYM_DIR" ]; then
      echo "Copying hermes.framework.dSYM to $DSYM_DIR..."
      cp -R "$FOUND_DSYM" "$DSYM_DIR/" 2>&1 || {
        echo "Warning: Failed to copy hermes.framework.dSYM to $DSYM_DIR"
      }
    fi
    
    # Archive 빌드 시 dSYM 복사 (모든 가능한 경로에)
    for ARCHIVE_DSYM_DIR in "${ARCHIVE_DSYM_DIRS[@]}"; do
      if [ -n "$ARCHIVE_DSYM_DIR" ] && [ -d "$ARCHIVE_DSYM_DIR" ]; then
        echo "Copying hermes.framework.dSYM to $ARCHIVE_DSYM_DIR..."
        cp -R "$FOUND_DSYM" "$ARCHIVE_DSYM_DIR/" 2>&1 || {
          echo "Warning: Failed to copy hermes.framework.dSYM to $ARCHIVE_DSYM_DIR"
        }
      fi
    done
  else
    echo "Warning: Could not find hermes.framework.dSYM in any of the expected locations"
    echo "Searched paths:"
    for path in "${HERMES_DSYM_SOURCES[@]}"; do
      echo "  - $path"
    done
    echo ""
    echo "Note: You may need to build hermes with dSYM generation enabled."
  fi
else
  echo "Warning: hermes.framework not found in any of the expected locations"
  echo "Searched paths:"
  for path in "${HERMES_PATHS[@]}"; do
    echo "  - $path"
  done
  echo ""
  echo "Current build settings:"
  echo "  ARCHIVE_PRODUCTS_PATH: ${ARCHIVE_PRODUCTS_PATH:-not set}"
  echo "  BUILT_PRODUCTS_DIR: ${BUILT_PRODUCTS_DIR:-not set}"
  echo "  FRAMEWORKS_FOLDER_PATH: ${FRAMEWORKS_FOLDER_PATH:-not set}"
fi

