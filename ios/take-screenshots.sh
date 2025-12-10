#!/bin/bash

# App Store 스크린샷 생성 스크립트
# 이 스크립트는 Xcode 시뮬레이터에서 스크린샷을 자동으로 찍어줍니다.

set -e

echo "📸 App Store 스크린샷 생성 스크립트"
echo "=================================="
echo ""

# 스크린샷 저장 디렉토리
SCREENSHOT_DIR="$HOME/Desktop/AppStore_Screenshots"
mkdir -p "$SCREENSHOT_DIR"

# 필요한 기기 타입들 (iPhone 14 Pro Max / iPhone 15 Pro Max)
DEVICES=(
    "iPhone 15 Pro Max"  # 1284 × 2778px (세로), 2778 × 1284px (가로)
    "iPhone 14 Pro Max"  # 1242 × 2688px (세로), 2688 × 1242px (가로)
)

echo "사용 가능한 시뮬레이터 목록:"
xcrun simctl list devices available | grep "iPhone" | head -10
echo ""

# 시뮬레이터 기기 선택
echo "스크린샷을 찍을 기기를 선택하세요:"
echo "1) iPhone 15 Pro Max (1284 × 2778px)"
echo "2) iPhone 14 Pro Max (1242 × 2688px)"
read -p "선택 (1 또는 2): " choice

case $choice in
    1)
        DEVICE="iPhone 15 Pro Max"
        PORTRAIT_SIZE="1284x2778"
        LANDSCAPE_SIZE="2778x1284"
        ;;
    2)
        DEVICE="iPhone 14 Pro Max"
        PORTRAIT_SIZE="1242x2688"
        LANDSCAPE_SIZE="2688x1242"
        ;;
    *)
        echo "잘못된 선택입니다. iPhone 15 Pro Max를 사용합니다."
        DEVICE="iPhone 15 Pro Max"
        PORTRAIT_SIZE="1284x2778"
        LANDSCAPE_SIZE="2778x1284"
        ;;
esac

echo ""
echo "선택한 기기: $DEVICE"
echo "세로 크기: $PORTRAIT_SIZE"
echo "가로 크기: $LANDSCAPE_SIZE"
echo ""

# 시뮬레이터 부팅
echo "시뮬레이터를 부팅하는 중..."
xcrun simctl boot "$DEVICE" 2>/dev/null || echo "시뮬레이터가 이미 실행 중입니다."

# 시뮬레이터 열기
open -a Simulator

echo ""
echo "⏳ 시뮬레이터가 열릴 때까지 잠시 기다려주세요..."
sleep 5

echo ""
echo "📱 다음 단계를 따라주세요:"
echo "1. 시뮬레이터에서 앱을 실행하세요"
echo "2. 스크린샷을 찍고 싶은 화면으로 이동하세요"
echo "3. 준비가 되면 Enter 키를 누르세요"
read -p "준비되셨나요? (Enter 키를 누르세요) "

# 스크린샷 찍기
echo ""
echo "📸 스크린샷을 찍는 중..."

# 세로 모드 스크린샷
PORTRAIT_FILE="$SCREENSHOT_DIR/screenshot_portrait_$(date +%Y%m%d_%H%M%S).png"
xcrun simctl io booted screenshot "$PORTRAIT_FILE"

# 이미지 크기 조정 (필요한 경우)
if command -v sips &> /dev/null; then
    echo "이미지 크기를 조정하는 중..."
    sips -z 2778 1284 "$PORTRAIT_FILE" --out "$SCREENSHOT_DIR/screenshot_portrait_${PORTRAIT_SIZE}.png" 2>/dev/null || \
    sips -Z 2778 "$PORTRAIT_FILE" --out "$SCREENSHOT_DIR/screenshot_portrait_${PORTRAIT_SIZE}.png"
fi

echo "✅ 세로 스크린샷 저장: $SCREENSHOT_DIR/screenshot_portrait_${PORTRAIT_SIZE}.png"

# 가로 모드 스크린샷
echo ""
echo "🔄 이제 시뮬레이터를 가로 모드로 회전하세요 (Cmd + 좌/우 화살표)"
read -p "가로 모드로 변경 후 Enter 키를 누르세요... "

LANDSCAPE_FILE="$SCREENSHOT_DIR/screenshot_landscape_$(date +%Y%m%d_%H%M%S).png"
xcrun simctl io booted screenshot "$LANDSCAPE_FILE"

if command -v sips &> /dev/null; then
    echo "이미지 크기를 조정하는 중..."
    sips -z 1284 2778 "$LANDSCAPE_FILE" --out "$SCREENSHOT_DIR/screenshot_landscape_${LANDSCAPE_SIZE}.png" 2>/dev/null || \
    sips -Z 2778 "$LANDSCAPE_FILE" --out "$SCREENSHOT_DIR/screenshot_landscape_${LANDSCAPE_SIZE}.png"
fi

echo "✅ 가로 스크린샷 저장: $SCREENSHOT_DIR/screenshot_landscape_${LANDSCAPE_SIZE}.png"

echo ""
echo "✨ 완료!"
echo "스크린샷이 다음 위치에 저장되었습니다:"
echo "$SCREENSHOT_DIR"
echo ""
echo "💡 팁: 여러 화면의 스크린샷을 찍으려면 이 스크립트를 다시 실행하세요."





