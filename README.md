# 樟湖社區小型茶博覽會

樟湖社區小型茶博覽會的網站：樟湖茶廠介紹、探索茶廠遊程與茶廠地圖。
純 HTML／CSS／JavaScript，不需要安裝或編譯，可以直接放上 GitHub Pages。

策畫設計｜國立雲林科技大學 梁佳美研究室團隊

## 資料夾

```
index.html              頁面骨架
css/style.css           樣式
js/main.js              互動（選單、照片帶、地圖、茶廠頁）
data/site.js            ← 所有文字與照片檔名都在這裡
images/map.png          茶山地圖
images/factories/       茶廠照片
```

## 輪替內容（只改 data/site.js）

- **換照片**：把新照片放進 `images/factories/`，再到 `site.js` 改 `photos` 裡的檔名。留 `""` 會顯示「照片拍攝中」。
- **換茶廠或文字**：改 `factories` 裡的 `name`、`line`、`story`、`signature`、`info`。
- **購買連結**：填 `buy.url`，按鈕就會連到茶廠的官網或 LINE；留 `""` 會顯示「連結待補」。
- **地圖與「認識樟湖茶廠」專欄**：都改 `spots`，一間茶廠一筆，新增一筆就會同時出現在地圖和專欄。`lat`、`lng` 直接從 Google 地圖複製（在地點上按右鍵就會看到經緯度），網站會自己算位置；`lx`、`ly` 是名稱標籤要放在地圖的哪裡（百分比），會用細線連回真正的位置。`factory` 填茶廠編號 0–4（不是五間之一就填 `-1`）；`photo` 是專欄照片；`note` 是一段介紹；`rows` 是地址、電話等資訊。
- **看茶廠地圖（Google 地圖清單）**：改 `mapListUrl`。在 Google 地圖的「已儲存」清單按分享，複製連結貼上就好。
- **照片帶順序**：改 `marquee`，格式是 `[茶廠編號, 照片欄位]`，茶廠編號從 0 開始。
- **遊程**：改 `tours`；`photo` 填 `images/factories/` 裡的照片檔名，留空字串會顯示「照片拍攝中」；`stops` 裡第二個數字是要連到的茶廠編號，不連就填 `-1`。

## 本機預覽

直接用瀏覽器打開 `index.html` 即可。

## 上傳到 GitHub Pages

1. 在 GitHub 建一個新的 repository，例如 `zhanghu-tea-expo`。
2. 把這個資料夾裡的所有檔案上傳（或用 GitHub Desktop 選這個資料夾再 Publish）。
3. 到 repository 的 Settings → Pages，Source 選 `Deploy from a branch`，Branch 選 `main`、資料夾 `/ (root)`，按 Save。
4. 約一分鐘後網址會出現在同一頁，格式是 `https://你的帳號.github.io/zhanghu-tea-expo/`。

## 茶廠頁網址

每間茶廠都有自己的網址，可以做成 QR code 印在摺頁上：
`…/#factory-1`（張師傅紅茶園）到 `…/#factory-5`（謝義源）。

## 照片來源

照片來自研究室 2026 年 5、9、10 月的田野拍攝。公開前請先確認茶廠與拍攝者同意使用。
