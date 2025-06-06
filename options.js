const notyf = new Notyf({position: { x: 'center', y: 'top' }});

// 載入舊資料
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(["username", "password", "realName", "autoSubmit", "defaultTime"], (data) => {
    document.getElementById('username').value = data.username || '';
    document.getElementById('password').value = data.password || '';
    document.getElementById('realName').value = data.realName || '';
    document.getElementById('autoSubmit').checked = data.autoSubmit || false;
    document.getElementById("defaultTime").value = data.defaultTime || "10-00";
  });
});

// 儲存新資料
document.getElementById('saveBtn').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const realName = document.getElementById('realName').value;
  const autoSubmit = document.getElementById('autoSubmit').checked;
  const defaultTime = document.getElementById("defaultTime").value;

  chrome.storage.local.set({ username, password, realName, autoSubmit, defaultTime }, () => {
    notyf.success('設定已儲存!');
  });
});


document.getElementById('clearSettings').addEventListener('click', () => {
  chrome.storage.local.remove(["username", "password", "realName","autoSubmit","defaultTime"], () => {
    notyf.success('設定已清除!');
    // 清空欄位
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('realName').value = '';
    document.getElementById('defaultTime').selectedIndex = 0;
    document.getElementById('autoSubmit').checked = false;
  });
});


const defaultTimeSelect = document.getElementById("defaultTime");
for (let h = 9; h <= 17; h++) {
  for (let m of [0, 30]) {
    if (h === 9 && m === 0) continue;
    if (h === 17 && m === 30) continue;
    const label = `${String(h).padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
    const opt = document.createElement("option");
    opt.value = `${h}-${m}`;
    opt.textContent = label;
    defaultTimeSelect.appendChild(opt);
  }
}
