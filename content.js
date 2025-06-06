function loginIfNeededAndContinue() {
    chrome.storage.local.get(["username", "password", "realName"], (data) => {
        const { username, password, realName } = data;

        const loginForm = document.querySelector("form#logon");
        const nameInput = document.querySelector('input[name="name"]');

        if (loginForm) {
            // 尚未登入 → 自動登入並 reload
            const userInput = document.querySelector('input[name="username"]');
            const passInput = document.querySelector('input[name="password"]');

            if (userInput && passInput && username && password) {
                userInput.value = username;
                passInput.value = password;

                userInput.dispatchEvent(new Event("input", { bubbles: true }));
                passInput.dispatchEvent(new Event("input", { bubbles: true }));

                setTimeout(() => {
                    loginForm.submit();
                }, 300);
            }
        } else if (nameInput && realName) {
            // 已登入 → 自動填寫姓名
            nameInput.value = realName;
            nameInput.dispatchEvent(new Event("input", { bubbles: true }));
            nameInput.dispatchEvent(new Event("change", { bubbles: true }));

            const submitBtn = document.querySelector(
                'input[name="save_button"]'
            );
            chrome.storage.local.get(["autoSubmit"], (data) => {
                if (submitBtn && data.autoSubmit) {
                    setTimeout(() => {
                        // console.log('強制送出');
                        
                        submitBtn.click();
                    }, 500);
                }
            });
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loginIfNeededAndContinue);
} else {
    loginIfNeededAndContinue();
}
