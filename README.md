# 樟湖社區小型茶博覽會

樟湖社區小型茶博覽會的網站：樟湖茶廠介紹與茶廠地圖。
純 HTML／CSS／JavaScript，不需要安裝或編譯，可以直接放上 GitHub Pages。

策畫設計｜國立雲林科技大學 梁佳美研究室團隊

## 換照片
照片都在 `images/茶廠照片/`，一間茶廠一個資料夾，資料夾名稱就是茶廠名稱。

- 五間主力茶廠：`主圖`、`人物`、`製茶`、`招牌茶`、`其他`，一類可以一張（`招牌茶.jpg`）或多張（`招牌茶1.jpg`、`招牌茶2.jpg`…最多 8 張）
- 其他茶廠：`主圖.jpg`（放在「認識樟湖茶廠」專欄）
- 換照片：用一樣的檔名蓋掉舊的就好，不用改程式。沒放的照片會顯示「照片拍攝中」。
- 每個資料夾裡都有一份「放照片說明.txt」。

## 資料夾

```
index.html              頁面骨架
css/style.css           樣式
js/main.js              互動（選單、照片帶、地圖、茶廠頁）
data/site.js            ← 所有文字都在這裡（照片在 images/茶廠照片）
images/map.png          茶山地圖
```

## 輪替內容（只改 data/site.js）

- **換茶廠或文字**：改 `factories` 裡的 `name`、`line`、`story`、`signature`、`info`。
- **購買連結**：填 `buy.url`，按鈕就會連到茶廠的官網或 LINE；留 `""` 會顯示「連結待補」。
- **地圖與「認識樟湖茶廠」專欄**：都改 `spots`，一間茶廠一筆，新增一筆就會同時出現在地圖和專欄。`lat`、`lng` 直接從 Google 地圖複製（在地點上按右鍵就會看到經緯度），網站會自己算位置；`lx`、`ly` 是名稱標籤要放在地圖的哪裡（百分比），會用細線連回真正的位置。`factory` 填茶廠編號 0–4（不是五間之一就填 `-1`）；專欄照片是該茶廠資料夾裡的 `主圖.jpg`，所以 `name` 要跟資料夾名稱一樣；`note` 是一段介紹；`rows` 是地址、電話等資訊。
- **看茶廠地圖（Google 地圖清單）**：改 `mapListUrl`。在 Google 地圖的「已儲存」清單按分享，複製連結貼上就好。
- **照片帶順序**：改 `marquee`，格式是 `[茶廠編號, 照片欄位]`，茶廠編號從 0 開始。

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

## 改完網站卻沒變？
瀏覽器會記住舊檔案。改完 `site.js`、`main.js` 或 `style.css` 後，把 `index.html` 裡對應的 `?v=2` 加 1（例如改成 `?v=3`），一起上傳，大家打開就會是新版。
