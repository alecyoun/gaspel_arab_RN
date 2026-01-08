#!/bin/bash

# iPad App Store 스크린샷 생성 스크립트
# iPad 12.9" 또는 13" 디스플레이용

set -e

echo "📸 iPad App Store 스크린샷 생성 스크립트"
echo "=========================================="
echo ""

# 스크린샷 저장 디렉토리
SCREENSHOT_DIR="$HOME/Desktop/iPad_AppStore_Screenshots"
mkdir -p "$SCREENSHOT_DIR"

# iPad Pro 12.9" 또는 13" 시뮬레이터 찾기
echo "사용 가능한 iPad 시뮬레이터 목록:"
xcrun simctl list devices available | grep -i "iPad Pro" | grep -E "12.9|13" | head -5
echo ""

# iPad Pro 12.9" 또는 13" 시뮬레이터 선택
IPAD_DEVICES=(
    "iPad Pro (12.9-inch) (6th generation)"
    "iPad Pro (12.9-inch) (5th generation)"
    "iPad Pro (12.9-inch) (4th generation)"
    "iPad Pro (13-inch)"
)

echo "iPad Pro 시뮬레이터를 찾는 중..."
BOOTED_DEVICE=""

for device in "${IPAD_DEVICES[@]}"; do
    if xcrun simctl list devices available | grep -q "$device"; then
        BOOTED_DEVICE="$device"
        echo "✅ 발견: $device"
        break
    fi
done

if [ -z "$BOOTED_DEVICE" ]; then
    echo "❌ iPad Pro 12.9\" 또는 13\" 시뮬레이터를 찾을 수 없습니다."
    echo "Xcode에서 시뮬레이터를 설치해주세요:"
    echo "Xcode > Settings > Platforms > iOS > Download Simulator"
    exit 1
fi

echo ""
echo "선택한 기기: $BOOTED_DEVICE"
echo "필요한 크기:"
echo "  - 세로: 2064 × 2752px 또는 2048 × 2732px"
echo "  - 가로: 2752 × 2064px 또는 2732 × 2048px"
echo ""

# 시뮬레이터 부팅
echo "시뮬레이터를 부팅하는 중..."
xcrun simctl boot "$BOOTED_DEVICE" 2>/dev/null || echo "시뮬레이터가 이미 실행 중입니다."

# 시뮬레이터 열기
open -a Simulator

echo ""
echo "⏳ 시뮬레이터가 열릴 때까지 잠시 기다려주세요..."
sleep 5

# 시뮬레이터 크기 조정 (전체 화면)
echo "시뮬레이터 창 크기를 조정하는 중..."
osascript -e 'tell application "Simulator" to activate' 2>/dev/null || true
sleep 2

echo ""
echo "📱 다음 단계를 따라주세요:"
echo "1. Xcode에서 앱을 iPad 시뮬레이터로 실행하세요"
echo "2. 각 화면으로 이동하여 스크린샷을 찍습니다"
echo ""

# 스크린샷 찍기 함수
take_screenshot() {
    local screen_name=$1
    local orientation=$2  # portrait or landscape
    local width=$3
    local height=$4
    
    echo ""
    echo "📸 $screen_name 스크린샷 찍기 ($orientation)"
    echo "   화면으로 이동한 후 Enter 키를 누르세요..."
    read -p "   준비되셨나요? (Enter) "
    
    # 원본 스크린샷
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    ORIGINAL_FILE="$SCREENSHOT_DIR/${screen_name}_${orientation}_${TIMESTAMP}_original.png"
    xcrun simctl io booted screenshot "$ORIGINAL_FILE"
    
    # 크기 조정
    OUTPUT_FILE="$SCREENSHOT_DIR/${screen_name}_${orientation}_${width}x${height}.png"
    
    if command -v sips &> /dev/null; then
        echo "   이미지 크기를 ${width}x${height}로 조정하는 중..."
        sips -z $height $width "$ORIGINAL_FILE" --out "$OUTPUT_FILE" 2>/dev/null || \
        sips -Z $height "$ORIGINAL_FILE" --out "$OUTPUT_FILE"
        
        # 원본 파일 삭제
        rm -f "$ORIGINAL_FILE"
        
        echo "   ✅ 저장: $OUTPUT_FILE"
    else
        echo "   ⚠️  sips 명령어를 찾을 수 없습니다. 원본 파일을 사용합니다: $ORIGINAL_FILE"
    fi
}

# 주요 화면 스크린샷 찍기
echo "=========================================="
echo "주요 화면 스크린샷 찍기 시작"
echo "=========================================="

# 1. 메인 리스트 화면 (세로)
take_screenshot "01_MainList" "portrait" 2048 2732

# 2. 메인 리스트 화면 (가로)
echo ""
echo "🔄 시뮬레이터를 가로 모드로 회전하세요 (Cmd + 좌/우 화살표)"
read -p "가로 모드로 변경 후 Enter 키를 누르세요... "
take_screenshot "02_MainList" "landscape" 2732 2048

# 3. 악보 화면 (세로)
echo ""
echo "🔄 시뮬레이터를 세로 모드로 회전하세요"
read -p "세로 모드로 변경 후 악보 화면으로 이동한 다음 Enter 키를 누르세요... "
take_screenshot "03_SheetMusic" "portrait" 2048 2732

# 4. 악보 화면 (가로)
echo ""
echo "🔄 시뮬레이터를 가로 모드로 회전하세요"
read -p "가로 모드로 변경 후 Enter 키를 누르세요... "
take_screenshot "04_SheetMusic" "landscape" 2732 2048

# 5. 검색 화면 (세로)
echo ""
echo "🔄 시뮬레이터를 세로 모드로 회전하세요"
read -p "세로 모드로 변경 후 검색 화면으로 이동한 다음 Enter 키를 누르세요... "
take_screenshot "05_Search" "portrait" 2048 2732

# 6. 즐겨찾기 화면 (세로)
echo ""
read -p "즐겨찾기 화면으로 이동한 다음 Enter 키를 누르세요... "
take_screenshot "06_Favorites" "portrait" 2048 2732

# 7. 설정 화면 (세로)
echo ""
read -p "설정 화면으로 이동한 다음 Enter 키를 누르세요... "
take_screenshot "07_Settings" "portrait" 2048 2732

# 8. 통계 화면 (세로)
echo ""
read -p "통계 화면으로 이동한 다음 Enter 키를 누르세요... "
take_screenshot "08_Statistics" "portrait" 2048 2732

# 9. 최근 본 화면 (세로)
echo ""
read -p "최근 본 화면으로 이동한 다음 Enter 키를 누르세요... "
take_screenshot "09_RecentViewed" "portrait" 2048 2732

# 10. 악보 확대 화면 (가로) - 핀치 줌 기능 보여주기
echo ""
echo "🔄 시뮬레이터를 가로 모드로 회전하세요"
read -p "가로 모드로 변경 후 악보를 확대한 다음 Enter 키를 누르세요... "
take_screenshot "10_SheetMusicZoomed" "landscape" 2732 2048

echo ""
echo "=========================================="
echo "✨ 모든 스크린샷 생성 완료!"
echo "=========================================="
echo ""
echo "📁 스크린샷 저장 위치:"
echo "$SCREENSHOT_DIR"
echo ""
echo "📋 생성된 파일 목록:"
ls -lh "$SCREENSHOT_DIR"/*.png 2>/dev/null | awk '{print "  - " $9 " (" $5 ")"}'
echo ""
echo "💡 App Store Connect에 업로드할 때:"
echo "  - 세로 모드: 2048 × 2732px 또는 2064 × 2752px"
echo "  - 가로 모드: 2732 × 2048px 또는 2752 × 2064px"
echo "  - 최대 10개의 스크린샷 업로드 가능"
echo ""

