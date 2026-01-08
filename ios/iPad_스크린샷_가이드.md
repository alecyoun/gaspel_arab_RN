# iPad App Store 스크린샷 및 앱 미리보기 가이드

## 필요한 크기

### 스크린샷 (최대 10개)
- **세로 (Portrait)**: 
  - 2064 × 2752px (iPad Pro 12.9" 6세대)
  - 2048 × 2732px (iPad Pro 12.9" 5세대 이하)
- **가로 (Landscape)**: 
  - 2752 × 2064px (iPad Pro 12.9" 6세대)
  - 2732 × 2048px (iPad Pro 12.9" 5세대 이하)

### 앱 미리보기 (최대 3개)
- **세로 (Portrait)**: 
  - 2064 × 2752px (iPad Pro 12.9" 6세대)
  - 2048 × 2732px (iPad Pro 12.9" 5세대 이하)
- **가로 (Landscape)**: 
  - 2752 × 2064px (iPad Pro 12.9" 6세대)
  - 2732 × 2048px (iPad Pro 12.9" 5세대 이하)
- **형식**: MP4 또는 MOV
- **길이**: 15-30초
- **크기**: 최대 500MB

## 방법 1: 자동 스크립트 사용 (권장)

### 스크린샷 생성

터미널에서 다음 명령어를 실행하세요:

```bash
cd /Users/dora/Documents/gaspel_arab_RN/ios
./take-ipad-screenshots.sh
```

스크립트가 자동으로:
1. iPad Pro 12.9" 시뮬레이터를 찾아 실행합니다
2. 각 화면으로 이동할 때마다 스크린샷을 찍습니다
3. 올바른 크기로 조정합니다
4. 데스크톱의 `iPad_AppStore_Screenshots` 폴더에 저장합니다

### 추천 스크린샷 순서 (10개)

1. **메인 리스트 화면 (세로)** - 찬송가 목록
2. **메인 리스트 화면 (가로)** - 찬송가 목록 (가로 모드)
3. **악보 화면 (세로)** - 악보 표시
4. **악보 화면 (가로)** - 악보 표시 (가로 모드)
5. **검색 화면 (세로)** - 검색 기능
6. **즐겨찾기 화면 (세로)** - 즐겨찾기 목록
7. **설정 화면 (세로)** - 앱 설정
8. **통계 화면 (세로)** - 사용 통계
9. **최근 본 화면 (세로)** - 최근 본 찬송가
10. **악보 확대 화면 (가로)** - 핀치 줌 기능

## 방법 2: 수동으로 스크린샷 찍기

### 1단계: iPad 시뮬레이터 실행

1. Xcode를 엽니다
2. **Window** → **Devices and Simulators** (Shift + Cmd + 2)
3. **iPad Pro (12.9-inch)** 선택
4. 시뮬레이터를 실행합니다

### 2단계: 앱 실행

1. Xcode에서 프로젝트를 엽니다
2. 시뮬레이터를 선택합니다 (상단 바에서)
3. **Run** 버튼을 클릭하거나 Cmd + R을 누릅니다
4. 앱이 실행될 때까지 기다립니다

### 3단계: 스크린샷 찍기

#### 세로 모드 스크린샷

1. 시뮬레이터에서 원하는 화면으로 이동합니다
2. 터미널에서:
   ```bash
   xcrun simctl io booted screenshot ~/Desktop/ipad_screenshot_portrait.png
   ```
3. 크기 조정:
   ```bash
   # 2048 × 2732px
   sips -z 2732 2048 ~/Desktop/ipad_screenshot_portrait.png --out ~/Desktop/ipad_screenshot_portrait_2048x2732.png
   
   # 또는 2064 × 2752px
   sips -z 2752 2064 ~/Desktop/ipad_screenshot_portrait.png --out ~/Desktop/ipad_screenshot_portrait_2064x2752.png
   ```

#### 가로 모드 스크린샷

1. 시뮬레이터를 가로 모드로 회전합니다 (Cmd + 좌/우 화살표)
2. 원하는 화면으로 이동합니다
3. 터미널에서:
   ```bash
   xcrun simctl io booted screenshot ~/Desktop/ipad_screenshot_landscape.png
   ```
4. 크기 조정:
   ```bash
   # 2732 × 2048px
   sips -z 2048 2732 ~/Desktop/ipad_screenshot_landscape.png --out ~/Desktop/ipad_screenshot_landscape_2732x2048.png
   
   # 또는 2752 × 2064px
   sips -z 2064 2752 ~/Desktop/ipad_screenshot_landscape.png --out ~/Desktop/ipad_screenshot_landscape_2752x2064.png
   ```

## 앱 미리보기 (App Preview) 생성

### 방법 1: QuickTime Player 사용

1. **QuickTime Player**를 엽니다
2. **File** → **New Screen Recording**
3. 시뮬레이터 창을 선택합니다
4. **Record** 버튼을 클릭합니다
5. 앱의 주요 기능을 15-30초 동안 보여줍니다
6. **Stop** 버튼을 클릭합니다
7. 동영상을 저장합니다

### 방법 2: 시뮬레이터 내장 기능 사용

1. 시뮬레이터에서 **File** → **Record Screen**
2. 앱의 주요 기능을 보여줍니다
3. **Stop** 버튼을 클릭합니다
4. 동영상을 저장합니다

### 방법 3: 터미널 명령어 사용

```bash
# 동영상 녹화 시작 (30초)
xcrun simctl io booted recordVideo ~/Desktop/app_preview.mp4 --codec h264 --force

# 30초 후 자동으로 중지되거나, 수동으로 중지하려면:
# Ctrl + C
```

### 앱 미리보기 편집

1. **iMovie** 또는 **Final Cut Pro**를 사용하여 편집합니다
2. 길이를 15-30초로 조정합니다
3. 해상도를 2048 × 2732px (세로) 또는 2732 × 2048px (가로)로 조정합니다
4. MP4 또는 MOV 형식으로 내보냅니다

### 추천 앱 미리보기 시나리오 (3개)

1. **메인 기능 소개 (세로)**
   - 앱 실행 → 메인 리스트 → 찬송가 선택 → 악보 표시
   - 길이: 20-25초

2. **검색 및 즐겨찾기 (세로)**
   - 검색 화면 → 음성 검색 → 검색 결과 → 즐겨찾기 추가
   - 길이: 20-25초

3. **악보 확대 및 가로 모드 (가로)**
   - 악보 화면 → 핀치 줌 → 가로 모드 전환 → 악보 탐색
   - 길이: 20-25초

## App Store Connect 업로드

1. **App Store Connect**에 로그인합니다
2. 앱을 선택합니다
3. **App Store** 탭으로 이동합니다
4. **iPad 12.9" 또는 13" 디스플레이** 섹션을 찾습니다
5. **스크린샷** 섹션에 최대 10개의 스크린샷을 드래그 앤 드롭합니다
6. **앱 미리보기** 섹션에 최대 3개의 동영상을 드래그 앤 드롭합니다

## 팁

- 스크린샷은 앱의 주요 기능을 보여주는 것이 좋습니다
- 앱 미리보기는 첫 3초가 중요합니다 - 즉시 앱의 가치를 보여주세요
- 세로와 가로 모드 모두 포함하는 것이 좋습니다
- 실제 iPad에서 테스트하여 레이아웃이 올바른지 확인하세요

