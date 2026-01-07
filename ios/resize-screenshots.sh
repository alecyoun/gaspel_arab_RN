#!/bin/bash

# 스크린샷 크기 조정 스크립트
# App Store 요구사항에 맞는 크기로 자동 조정

set -e

echo "📐 스크린샷 크기 조정 스크립트"
echo "=============================="
echo ""

DESKTOP_DIR="$HOME/Desktop"
OUTPUT_DIR="$DESKTOP_DIR/AppStore_Screenshots_Resized"
mkdir -p "$OUTPUT_DIR"

# 필요한 크기들
SIZES=(
    "1242x2688"  # iPhone 14 Pro Max 세로
    "2688x1242"  # iPhone 14 Pro Max 가로
    "1284x2778"  # iPhone 15 Pro Max 세로
    "2778x1284"  # iPhone 15 Pro Max 가로
)

echo "데스크톱에서 스크린샷 파일을 찾는 중..."
SCREENSHOTS=($(find "$DESKTOP_DIR" -name "Simulator Screenshot*.png" -type f -mtime -1 | sort -r))

if [ ${#SCREENSHOTS[@]} -eq 0 ]; then
    echo "❌ 최근 스크린샷을 찾을 수 없습니다."
    echo "데스크톱에 'Simulator Screenshot'으로 시작하는 PNG 파일이 있는지 확인하세요."
    exit 1
fi

echo ""
echo "발견된 스크린샷:"
for i in "${!SCREENSHOTS[@]}"; do
    echo "$((i+1)). ${SCREENSHOTS[$i]}"
done

echo ""
read -p "모든 스크린샷을 조정하시겠습니까? (y/n): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "취소되었습니다."
    exit 0
fi

echo ""
echo "스크린샷 크기를 조정하는 중..."

for screenshot in "${SCREENSHOTS[@]}"; do
    filename=$(basename "$screenshot")
    name_without_ext="${filename%.png}"
    
    # 현재 크기 확인
    current_width=$(sips -g pixelWidth "$screenshot" | grep pixelWidth | awk '{print $2}')
    current_height=$(sips -g pixelHeight "$screenshot" | grep pixelHeight | awk '{print $2}')
    
    echo ""
    echo "처리 중: $filename"
    echo "  현재 크기: ${current_width}x${current_height}"
    
    # 세로 모드인지 가로 모드인지 판단
    if [ "$current_height" -gt "$current_width" ]; then
        # 세로 모드
        echo "  → 세로 모드로 감지됨"
        
        # 1242x2688 또는 1284x2778로 조정
        for size in "1242x2688" "1284x2778"; do
            width=$(echo $size | cut -d'x' -f1)
            height=$(echo $size | cut -d'x' -f2)
            output_file="$OUTPUT_DIR/${name_without_ext}_${size}.png"
            
            echo "  → ${size} 크기로 조정 중..."
            sips -z "$height" "$width" "$screenshot" --out "$output_file" 2>/dev/null || \
            sips -Z "$height" "$screenshot" --out "$output_file"
            
            # 결과 확인
            new_width=$(sips -g pixelWidth "$output_file" | grep pixelWidth | awk '{print $2}')
            new_height=$(sips -g pixelHeight "$output_file" | grep pixelHeight | awk '{print $2}')
            echo "    ✅ 저장됨: ${new_width}x${new_height}"
        done
    else
        # 가로 모드
        echo "  → 가로 모드로 감지됨"
        
        # 2688x1242 또는 2778x1284로 조정
        for size in "2688x1242" "2778x1284"; do
            width=$(echo $size | cut -d'x' -f1)
            height=$(echo $size | cut -d'x' -f2)
            output_file="$OUTPUT_DIR/${name_without_ext}_${size}.png"
            
            echo "  → ${size} 크기로 조정 중..."
            sips -z "$height" "$width" "$screenshot" --out "$output_file" 2>/dev/null || \
            sips -Z "$width" "$screenshot" --out "$output_file"
            
            # 결과 확인
            new_width=$(sips -g pixelWidth "$output_file" | grep pixelWidth | awk '{print $2}')
            new_height=$(sips -g pixelHeight "$output_file" | grep pixelHeight | awk '{print $2}')
            echo "    ✅ 저장됨: ${new_width}x${new_height}"
        done
    fi
done

echo ""
echo "✨ 완료!"
echo ""
echo "조정된 스크린샷이 다음 위치에 저장되었습니다:"
echo "$OUTPUT_DIR"
echo ""
echo "📋 생성된 파일:"
ls -lh "$OUTPUT_DIR"/*.png 2>/dev/null | awk '{print "  - " $9 " (" $5 ")"}'
echo ""
echo "💡 이제 App Store Connect에 업로드할 수 있습니다!"










