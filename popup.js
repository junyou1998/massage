const container = document.getElementById("buttonsContainer");

const today = new Date();
// Calculate next month correctly handling year rollover
const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
const targetYear = nextMonthDate.getFullYear();
const targetMonth = nextMonthDate.getMonth();

function getThursdaysOfMonth(year, month) {
    const thursdays = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        if (date.getDay() === 4) {
            thursdays.push(new Date(date));
        }
        date.setDate(date.getDate() + 1);
    }
    return thursdays;
}

const thursdays = getThursdaysOfMonth(targetYear, targetMonth);
chrome.storage.local.get(["defaultTime"], (data) => {
    const [hour, minute] = (data.defaultTime || "10-0").split("-");

    thursdays.forEach((date) => {
        const d = date.getDate();
        const m = date.getMonth() + 1;
        const y = date.getFullYear();

        const url = `https://mrbs.hermes.com.tw/edit_entry.php?area=37&room=1106&hour=${hour}&minute=${minute}&year=${y}&month=${m}&day=${d}`;

        const btn = document.createElement("button");
        btn.textContent = `${m}/${d}（四）`;
        btn.onclick = () => chrome.tabs.create({ url });

        container.appendChild(btn);
    });
});

document.getElementById("openOptions").addEventListener("click", () => {
    console.log("openOptions clicked"); // 確認按鈕被點擊

    chrome.runtime.openOptionsPage(); // 開啟 options.html
});

// 初始化日期與時間欄位
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(
        ["username", "password", "realName", "defaultTime"],
        (data) => {
            const errorMsg = document.getElementById("errorMsg");

            // 檢查是否有缺少任一必要欄位
            if (
                !data.username ||
                !data.password ||
                !data.realName ||
                !data.defaultTime
            ) {
                errorMsg.textContent =
                    "⚠ 請先到設定頁填寫帳號、密碼、姓名與預約時間";
                errorMsg.style.display = "block";
            }
        }
    );

    // 🔸 預設下個月的今天
    const today = new Date();
    const nextMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
    );
    document.getElementById("dateInput").valueAsDate = nextMonth;

    // 🔸 產生時間下拉選單（9:30 ～ 17:00）
    const timeSelect = document.getElementById("timeSelect");
    for (let h = 9; h <= 17; h++) {
        for (let m of [0, 30]) {
            if (h === 9 && m === 0) continue; // 不要 09:00
            if (h === 17 && m === 30) continue; // 不要 17:30

            const label = `${String(h).padStart(2, "0")}:${
                m === 0 ? "00" : "30"
            }`;
            const opt = document.createElement("option");
            opt.value = `${h}-${m}`;
            opt.textContent = label;

            // 🔸 預設選中 17:00
            if (h === 17 && m === 0) opt.selected = true;

            timeSelect.appendChild(opt);
        }
    }
});

document.getElementById("goBtn").addEventListener("click", () => {
    const date = document.getElementById("dateInput").value;
    const [hour, minute] = document
        .getElementById("timeSelect")
        .value.split("-");

    if (!date) {
        alert("請選擇日期");
        return;
    }

    const [year, month, day] = date.split("-").map(Number);

    const url = `https://mrbs.hermes.com.tw/edit_entry.php?area=37&room=1106&hour=${hour}&minute=${minute}&year=${year}&month=${month}&day=${day}`;

    chrome.tabs.create({ url });
});
