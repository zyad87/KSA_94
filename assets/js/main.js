let selectedAvatar = "";

// التحقق إذا كان المستخدم مسجل بالفعل
window.onload = function () {
    const player = localStorage.getItem('player');
    if (player) {
        window.location.href = './game.html'; // توجيه المستخدم المسجل لصفحة اللعبة
    }
};

// إظهار نموذج التسجيل عند الضغط على "ابدأ اللعب"
document.getElementById("start-game-btn").addEventListener("click", function () {
    document.getElementById("initial-step").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
});

// الانتقال للخطوة الثانية (البريد الإلكتروني)
document.getElementById("next-step-1").addEventListener("click", function () {
    const usernameInput = document.getElementById("username");
    const usernameError = document.getElementById("username-error");

    if (usernameInput.value.length >= 5) {
        document.getElementById("step1").classList.add('animate__flash');
        setTimeout(() => {
            document.getElementById("step1").style.display = "none";
            document.getElementById("step2").style.display = "block";
            document.getElementById("step2").classList.add('animate__fadeIn');
        }, 300);
        usernameError.style.display = "none";
    } else {
        usernameError.style.display = "block";
    }
});

// الانتقال للخطوة الثالثة (كلمة المرور)
document.getElementById("next-step-2").addEventListener("click", function () {
    const emailInput = document.getElementById("femail");
    const emailError = document.getElementById("email-error");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(emailInput.value)) {
        document.getElementById("step2").classList.add('animate__flash');
        setTimeout(() => {
            document.getElementById("step2").style.display = "none";
            document.getElementById("step3").style.display = "block";
            document.getElementById("step3").classList.add('animate__fadeIn');
        }, 300);
        emailError.style.display = "none";
    } else {
        emailError.style.display = "block";
    }
});

// الانتقال لاختيار الشخصيات بعد إدخال كلمة المرور
document.getElementById("next-step-3").addEventListener("click", function () {
    const passwordInput = document.getElementById("fpass");
    const passwordError = document.getElementById("password-error");

    if (passwordInput.value.length >= 8) {
        document.getElementById("step3").classList.add('animate__flash');
        setTimeout(() => {
            document.getElementById("step3").style.display = "none";
            document.getElementById("avatars-step").style.display = "block";
            document.getElementById("avatars-step").classList.add('animate__fadeIn');
        }, 300);
        passwordError.style.display = "none";
    } else {
        passwordError.style.display = "block";
    }
});

// اختيار الصورة الشخصية
function selectAvatar(avatarElement) {
    const avatars = document.querySelectorAll('.avatar-img');
    avatars.forEach(avatar => avatar.classList.remove('selected'));
    avatarElement.classList.add('selected');
    selectedAvatar = avatarElement.src;
    document.getElementById("avatar-error").style.display = "none";
}

// إرسال البيانات إلى API
document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("femail").value;
    const password = document.getElementById("fpass").value;

    if (!selectedAvatar) {
        document.getElementById("avatar-error").style.display = "block";
        return;
    }

    const playerData = {
        username: username,
        email: email,
        password: password,
        avatar: selectedAvatar,
        score: null,
        level: null
    };

    try {
        const response = await fetch('https://66eef15d3ed5bb4d0bf267fd.mockapi.io/Players', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerData),
        });

        if (response.ok) {
            const newPlayer = await response.json();
            localStorage.setItem('player', JSON.stringify(newPlayer));
            window.location.href = './game.html'; // الانتقال إلى صفحة اللعبة بعد النجاح
        } else {
            document.getElementById("error-message").textContent = 'اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل.';
            document.getElementById("error-message").classList.add('active');
        }
    } catch (error) {
        console.error('Error creating player:', error);
    }
});