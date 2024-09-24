      // التحقق مما إذا كان اللاعب قد قام بتسجيل الدخول مسبقًا
      document.addEventListener("DOMContentLoaded", function () {
        const player = localStorage.getItem('player');
        if (player) {
            window.location.href = 'game.html'; // تحويل اللاعب إلى صفحة اللعبة إذا كان مسجلًا
        }
    });

    // التحقق من صحة بيانات تسجيل الدخول
    document.getElementById("login-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const emailError = document.getElementById("email-error");
        const passwordError = document.getElementById("password-error");
        const errorMessage = document.getElementById("error-message");

        // التحقق من صحة البريد الإلكتروني وكلمة المرور
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            emailError.style.display = "block";
            return;
        } else {
            emailError.style.display = "none";
        }

        if (password.length < 8) {
            passwordError.style.display = "block";
            return;
        } else {
            passwordError.style.display = "none";
        }

        // محاولة تسجيل الدخول عبر API (MockAPI)
        try {
            const response = await fetch('https://66eef15d3ed5bb4d0bf267fd.mockapi.io/Players');
            const players = await response.json();

            // التحقق مما إذا كان البريد الإلكتروني وكلمة المرور متطابقين
            const player = players.find(p => p.email === email && p.password === password);

            if (player) {
                // حفظ بيانات اللاعب في التخزين المحلي
                localStorage.setItem('player', JSON.stringify(player));
                window.location.href = 'game.html'; // التوجيه إلى صفحة اللعبة بعد تسجيل الدخول
            } else {
                errorMessage.textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    });