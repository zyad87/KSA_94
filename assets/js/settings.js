if (!localStorage.getItem("player")) {
  window.location.href = "./index.html"; // توجيه المستخدم لصفحة تسجيل الدخول إذا لم يكن مسجلًا
}
// جلب بيانات المستخدم من التخزين المحلي
function loadProfile() {
  let playerData = localStorage.getItem("player");
  if (playerData) {
    let player = JSON.parse(playerData);

    // عرض البيانات في النصوص
    document.getElementById("username").value = player.username;
    document.getElementById("email").value = player.email;
    document.getElementById("steps").innerText = player.level;
    document.getElementById("time").innerText = player.score;

    // نص ترحيبي باسم المستخدم
    document.getElementById(
      "welcomeText"
    ).innerText = `مرحباً، ${player.username}!`;

    // إضافة صورة اللاعب إلى الشريط العلوي
    document.getElementById("navAvatar").src = player.avatar;

    // إظهار حقل إدخال رابط الصورة الخارجية إذا كانت الخطوات أقل من 100
    if (player.level < 100) {
      document.getElementById("externalImageField").style.display = "block";
      document.getElementById("txtqwe1").style.display = "none";
      document.getElementById("txtqwe2").style.display = "block";
    } else {
      document.getElementById("externalImageField").style.display = "none";
      document.getElementById("txtqwe1").style.display = "block";
      document.getElementById("txtqwe2").style.display = "none";
    }
  } else {
    document.getElementById("welcomeText").innerText = "مرحباً، مستخدم!";
  }
}
// جلب بيانات المستخدم من التخزين المحلي
function loadProfile() {
  let playerData = localStorage.getItem("player");
  if (playerData) {
    let player = JSON.parse(playerData);

    // عرض البيانات في النصوص
    document.getElementById("username").value = player.username;
    document.getElementById("email").value = player.email;
    document.getElementById("steps").innerText = player.level;
    document.getElementById("time").innerText = player.score;

    // نص ترحيبي باسم المستخدم
    document.getElementById(
      "welcomeText"
    ).innerText = `مرحباً، ${player.username}!`;

    // إضافة صورة اللاعب إلى الشريط العلوي
    document.getElementById("navAvatar").src = player.avatar;

    // إظهار حقل إدخال رابط الصورة الخارجية إذا كانت الخطوات أقل من 100
    if (player.level < 100) {
      document.getElementById("externalImageField").style.display = "block";
      document.getElementById("txtqwe1").style.display = "none";
      document.getElementById("txtqwe2").style.display = "block";
    } else {
      document.getElementById("externalImageField").style.display = "none";
      document.getElementById("txtqwe1").style.display = "block";
      document.getElementById("txtqwe2").style.display = "none";
    }
  } else {
    document.getElementById("welcomeText").innerText = "مرحباً، مستخدم!";
  }
}

window.onload = function () {
  loadProfile();

  let currentPlayerData = localStorage.getItem("player");
  let currentPlayer = currentPlayerData
    ? JSON.parse(currentPlayerData)
    : { level: 0, score: "00:00" };

  // جلب بيانات اللاعبين الآخرين
  fetch("https://66eef15d3ed5bb4d0bf267fd.mockapi.io/Players")
    .then((response) => response.json())
    .then((players) => {
      let otherPlayers = players.slice(0, 4); // عرض 4 لاعبين آخرين

      // تحويل الوقت إلى عدد الثواني مع التحقق من وجود الوقت
      function convertTimeToSeconds(time) {
        if (!time || time === "") {
          return 0; // إذا كان الوقت غير موجود، يتم تعيينه إلى 0
        }
        let parts = time.split(":");
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }

      let stepsData = otherPlayers.map((player) => player.level);
      let timeData = otherPlayers.map((player) =>
        convertTimeToSeconds(player.score)
      );

      stepsData.push(currentPlayer.level);
      timeData.push(convertTimeToSeconds(currentPlayer.score));

      let labels = otherPlayers
        .map((player) => player.username)
        .concat([currentPlayer.username]);

      let ctx = document
        .getElementById("playerComparisonChart")
        .getContext("2d");

      if (!ctx) {
        console.error("Error: Canvas element not found.");
        return;
      }

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "عدد الخطوات",
              data: stepsData,
              backgroundColor: "rgba(40, 167, 69, 0.6)",
              borderColor: "rgba(40, 167, 69, 1)",
              borderWidth: 1,
            },
            {
              label: "الوقت (ثواني)",
              data: timeData,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
};

// وظيفة لتغيير الصورة الشخصية
function selectAvatar(imgElement) {
  document.querySelectorAll(".avatar-img").forEach((img) => {
    img.classList.remove("selected");
  });
  imgElement.classList.add("selected");
}

// حفظ التعديلات
document
  .getElementById("profileForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    let updatedPlayer = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      avatar: document.querySelector(".avatar-img.selected").src,
    };

    // تحديث الصورة الشخصية من رابط خارجي إذا كانت الخطوات أقل من 100
    if (document.getElementById("externalImageUrl").value) {
      updatedPlayer.avatar = document.getElementById("externalImageUrl").value;
    }

    let playerData = localStorage.getItem("player");
    if (playerData) {
      let player = JSON.parse(playerData);
      const playerId = player.id;

      // تحديث البيانات في API
      const response = await fetch(
        `https://66eef15d3ed5bb4d0bf267fd.mockapi.io/Players/${playerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPlayer),
        }
      );

      if (response.ok) {
        const updatedPlayerData = await response.json();
        localStorage.setItem("player", JSON.stringify(updatedPlayerData));
        document.getElementById("alirterr5").innerHTML =
          "تم حفظ التعديلات بنجاح";
        setInterval(() => {
          window.location.reload();
        }, 5000);
      } else {
        document.getElementById("alirterr5").style.color = "red";
        document.getElementById("alirterr5").innerHTML =
          "حدث خطأ أثناء حفظ التعديلات";
      }
    }
  });

// وظيفة تسجيل الخروج
function logout() {
  localStorage.removeItem("player");
  window.location.href = "login.html";
}
